import $ from "js_libs/jquery/dist/jquery";
import PageController from "properjs-pagecontroller";
import * as core from "./core";
import animate from "./animate";


const _pageDuration = core.util.getTransitionDuration( core.dom.page[ 0 ] );


/**
 *
 * @public
 * @module router
 * @description Handles async web app routing for nice transitions.
 *
 */
const router = {
    /**
     *
     * @public
     * @method init
     * @memberof router
     * @description Initialize the router module.
     *
     */
    init () {
        this.bindCaptureLinks();
        this.createPageController();

        core.log( "router initialized" );
    },


    /**
     *
     * @public
     * @method createPageController
     * @memberof router
     * @description Create the PageController instance.
     *
     */
    createPageController () {
        this.controller = new PageController({
            transitionTime: _pageDuration
        });

        this.controller.setConfig([
            "*"
        ]);

        this.controller.setModules([
            core.preload,
            animate
        ]);

        this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
        this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
        this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
        this.controller.on( "page-controller-initialized-page", ( html ) => {
            this.cachePage( core.dom.html, $( html ).filter( ".js-page" )[ 0 ].innerHTML );
            this.cacheStaticContext( window.Static.SQUARESPACE_CONTEXT );
        });

        this.controller.initPage();
    },


    /**
     *
     * @public
     * @method cachePage
     * @param {jQuery} $object The node for use
     * @param {string} response The XHR responseText
     * @memberof router
     * @description Cache the DOM content for a page once its parsed out.
     *
     */
    cachePage ( $object, response ) {
        core.cache.set( this.getPageKey(), {
            $object,
            response
        });
    },


    /**
     *
     * @public
     * @method cacheStaticContext
     * @param {object} json The Static.SQUARESPACE_CONTEXT ref
     * @memberof router
     * @description Cache the sqs context once its been parsed out.
     *
     */
    cacheStaticContext ( json ) {
        core.cache.set( `${this.getPageKey()}-context`, json );
    },


    /**
     *
     * @public
     * @method getPageKey
     * @memberof router
     * @description Determine the key for local page cache storage.
     * @returns {string}
     *
     */
    getPageKey () {
        return ((window.location.pathname === "/" ? "homepage" : window.location.pathname) + window.location.search);
    },

    /**
     *
     * @public
     * @method bindCaptureLinks
     * @memberof router
     * @description Suppress #hash links.
     *
     */
    bindCaptureLinks () {
        core.dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
    },


    /**
     *
     * @public
     * @method route
     * @param {string} path The uri to route to
     * @memberof router
     * @description Trigger app to route a specific page. [Reference]{@link https://github.com/ProperJS/Router/blob/master/Router.js#L222}
     *
     */
    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    /**
     *
     * @public
     * @method push
     * @param {string} path The uri to route to
     * @param {function} cb Optional callback to fire
     * @memberof router
     * @description Trigger a silent route with a supplied callback.
     *
     */
    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
    },


    /**
     *
     * @public
     * @method track
     * @param {string} type The object type, item or collection
     * @param {object} data The data context to track with
     * @memberof router
     * @description Track Squarespace Metrics since we are ajax-routing.
     *
     */
    track ( type, data ) {
        core.log( "router:track:View", type, data );

        Y.Squarespace.Analytics.view( type, data );
    },


    /**
     *
     * @public
     * @method pushTrack
     * @param {string} html The full responseText from an XHR request
     * @param {jQuery} $doc Optional document node to receive and work with
     * @memberof router
     * @description Parse static context from responseText and track it.
     *
     */
    pushTrack ( html, $doc ) {
        let ctx = null;

        $doc = ($doc || $( html ));

        ctx = this.getStaticContext( html );

        if ( ctx ) {
            this.track( (ctx.item ? "item" : "collection"), (ctx.item || ctx.collection) );
        }

        this.setDocumentTitle( $doc.filter( "title" ).text() );
    },


    /**
     *
     * @public
     * @method onPreloadDone
     * @memberof router
     * @description Finish routing sequence when image pre-loading is done.
     *
     */
    onPreloadDone () {
        core.util.disableMouseWheel( false );
        core.util.disableTouchMove( false );

        core.dom.html.removeClass( "is-routing" );
        core.dom.page.removeClass( "is-reactive is-inactive" );

        core.scrolls.topout( 0 );
        core.scrolls.clearStates();

        setTimeout( () => {
            core.util.emitter.fire( "app--intro-art" );

        }, _pageDuration );

        core.util.emitter.off( "app--preload-done", this.onPreloadDone );
    },


    /**
     *
     * @public
     * @method getStaticContext
     * @param {string} resHTML The responseText HTML string from router
     * @memberof router
     * @description Attempt to parse the Squarespace data context from responseText.
     * @returns {object}
     *
     */
    getStaticContext ( resHTML ) {
        // Match the { data } in Static.SQUARESPACE_CONTEXT
        let ctx = core.cache.get( `${this.getPageKey()}-context` );

        if ( !ctx ) {
            ctx = resHTML.match( /Static\.SQUARESPACE_CONTEXT\s=\s(.*?)\};/ );

            if ( ctx && ctx[ 1 ] ) {
                ctx = ctx[ 1 ];

                // Put the ending {object} bracket back in there :-(
                ctx = `${ctx}}`;

                // Parse the string as a valid piece of JSON content
                try {
                    ctx = JSON.parse( ctx );

                } catch ( error ) {
                    throw error;
                }

                // Cache context locally
                this.cacheStaticContext( ctx );

            } else {
                ctx = false;
            }
        }

        return ctx;
    },


    /**
     *
     * @public
     * @method changePageOut
     * @memberof router
     * @description Trigger transition-out animation.
     *
     */
    changePageOut () {
        core.util.disableMouseWheel( true );
        core.util.disableTouchMove( true );

        core.dom.html.addClass( "is-routing" );
        core.dom.page.removeClass( "is-reactive" ).addClass( "is-inactive" );

        core.util.emitter.on( "app--preload-done", this.onPreloadDone );
    },


    /**
     *
     * @public
     * @method changeContent
     * @param {string} html The responseText as an HTML string
     * @memberof router
     * @description Swap the new content into the DOM.
     *
     */
    changeContent ( html ) {
        let $object = null;
        let response = null;
        const cached = core.cache.get( this.getPageKey() );

        if ( cached ) {
            $object = cached.$object;
            response = cached.response;

        } else {
            $object = $( html ).filter( "title, div, main, section, header, footer, span" );
            response = $object.filter( ".js-page" )[ 0 ].innerHTML;

            this.cachePage( $object, response );
        }

        core.dom.page[ 0 ].innerHTML = response;

        this.pushTrack( html, $object );

        core.util.emitter.fire( "app--cleanup" );
    },


    /**
     *
     * @public
     * @method changePageIn
     * @param {object} data The data object supplied by PageController from PushState
     * @memberof router
     * @description Trigger transition-in animation.
     *
     */
    changePageIn ( /* data */ ) {
        //const collection = data.request.uri.split( "/" )[ 0 ];

        core.dom.page.addClass( "is-reactive" );
    },


    /**
     *
     * @public
     * @method setDocumentTitle
     * @param {string} title The new title for the document
     * @memberof router
     * @description Update the documents title.
     *
     */
    setDocumentTitle ( title ) {
        document.title = title;
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
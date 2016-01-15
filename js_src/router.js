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

        this.controller.initPage();
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
        let ctx = resHTML.match( /Static\.SQUARESPACE_CONTEXT\s=\s(.*?)\};/ );

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

            // We now have the new pages context for Metrics
            //core.log( "router:getStaticContext", ctx );

        } else {
            ctx = false;
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
        const $doc = $( html );
        const res = $doc.filter( ".js-page" )[ 0 ].innerHTML;

        core.dom.page[ 0 ].innerHTML = res;

        this.pushTrack( html, $doc );

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
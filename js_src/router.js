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
     * @param {App} app Instance of the main application
     * @memberof router
     * @description Initialize the router module.
     *
     */
    init ( app ) {
        this.app = app;
        this.bindCaptureLinks();
        this.initPageController();

        core.log( "router initialized" );
    },


    /**
     *
     * @public
     * @method initPageController
     * @memberof router
     * @description Create the PageController instance.
     *
     */
    initPageController () {
        this.controller = new PageController({
            transitionTime: _pageDuration
        });

        this.controller.setConfig([
            "*"
        ]);

        this.controller.setModules([
            core.images,
            animate
        ]);

        this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
        this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
        this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
        this.controller.on( "page-controller-initialized-page", ( html ) => {
            this.cachePage( core.dom.html, $( html ).filter( ".js-page" )[ 0 ].innerHTML );
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
     * @method changePageOut
     * @param {object} data The data object supplied by PageController from PushState
     * @memberof router
     * @description Trigger transition-out animation.
     *
     */
    changePageOut ( /* data */ ) {
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

        core.util.emitter.fire( "app--analytics-push", html, $object );

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
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
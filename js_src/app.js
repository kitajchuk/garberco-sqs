import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import router from "./router";
import overlay from "./overlay";
import Project from "./Project";


let _app = null;


/**
 *
 * @public
 * @class App
 * @classdesc Load the App application Class to handle it ALL.
 *
 */
class App {
    constructor () {
        if ( !_app ) {
            _app = this;
        }

        this.loadType = core.dom.page.data( "pageLoadType" );
        this.project = null;
        this.isProjectTileClicked = false;
        this.timeoutId = null;
        this.timeoutDelay = 300;
        this.core = core;
        this.router = router;
        this.overlay = overlay;
        this.analytics = new core.Analytics();

        this.bindEvents();
        this.initModules();
        this.initProject();

        core.log( "App", this );

        return _app;
    }


    destroy () {
        this.core.dom.body.off( "click", this._onTileClick );
        this.core.dom.page.off( "mouseenter", this._onMouseEnter );
        this.core.dom.page.off( "mouseleave", this._onMouseLeave );
    }


    initProject () {
        if ( this.loadType !== "collection" ) {
            this.core.dom.project.element.detach();

        } else {
            this.project = new Project( this, {
                url: window.location.pathname,
                onLoad: false
            });
        }
    }


    initModules () {
        this.core.detect.init( this );
        this.core.resizes.init( this );
        this.core.scrolls.init( this );
        this.router.init( this );
        this.overlay.init( this );
    }


    loadHomepage () {
        const dataType = { dataType: "html" };
        const format = { format: "full", nocache: true };

        this.core.api.collection(
            "/",
            format,
            dataType

        ).done( this.onLoadHomepage.bind( this ) );
    }


    bindEvents () {
        this._onTileClick = this.onTileClick.bind( this );
        this._onPreloadDone = this.onPreloadDone.bind( this );
        this._onMouseEnter = this.onMouseEnter.bind( this );
        this._onMouseLeave = this.onMouseLeave.bind( this );
        this._onLogoClick = this.onLogoClick.bind( this );
        this._onProjectEnded = this.onProjectEnded.bind( this );

        this.core.util.emitter.on( "app--project-ended", this._onProjectEnded );
        this.core.util.emitter.on( "app--preload-done", this._onPreloadDone );
        this.core.dom.body.on( "click", ".js-project-tile", this._onTileClick );
        this.core.dom.page.on( "mouseenter", ".js-project-tile", this._onMouseEnter );
        this.core.dom.page.on( "mouseleave", ".js-project-tile", this._onMouseLeave );
        this.core.dom.logo.on( "click", this._onLogoClick );
    }


    enableDocument () {
        this.core.dom.html.removeClass( "is-clipped" );
        this.core.dom.body.removeClass( "is-clipped" );
    }


    isProjectActive () {
        return (this.project !== null);
    }


    destroyProject () {
        if ( this.project ) {
            this.enableDocument();
            this.project.destroy();
            this.project = null;
        }
    }


    clearTimeoutById ( timeoutId ) {
        try {
            clearTimeout( timeoutId );

        } catch ( error ) {
            throw error;
        }
    }


    onLoadHomepage ( response ) {
        const $node = $( response );
        let $grid = null;

        if ( typeof response === "object" ) {
            $grid = $( response.response ).find( ".js-homepage" ).children();

        } else {
            $grid = $node.filter( ".js-page" ).find( ".js-homepage" ).children();
        }

        this.core.dom.homepage.html( $grid );

        core.util.loadImages( $grid.find( ".js-lazy-image" ), this.core.util.noop ).on( "done", () => {
            this.core.util.emitter.fire( "app--update-animate", $grid.find( ".js-animate" ) );
        });
    }


    onPreloadDone () {
        this.core.util.emitter.off( "app--preload-done", this._onPreloadDone );

        this.overlay.close();

        if ( this.loadType === "collection" ) {
            this.loadHomepage();

        } else {
            this.enableDocument();
        }
    }


    onProjectEnded () {
        this.router.push( "/", () => {} );

        if ( this.project ) {
            this.destroyProject();
        }
    }


    onLogoClick ( e ) {
        e.preventDefault();

        this.router.push( "/", () => {} );

        if ( this.project ) {
            this.destroyProject();
        }
    }


    onTileClick ( e ) {
        e.preventDefault();

        this.project = new Project( this, {
            url: e.currentTarget.pathname,
            onLoad () {}
        });
    }


    onMouseEnter ( e ) {
        this.clearTimeoutById( this.timeoutId );

        const $tile = $( e.currentTarget );

        this.overlay.setTitle( $tile.data( "title" ) );

        if ( !this.overlay.isActive() ) {
            this.overlay.open();
        }
    }


    onMouseLeave () {
        this.timeoutId = setTimeout(() => {
            if ( !this.project ) {
                this.overlay.close();
            }

        }, this.timeoutDelay );
    }
}



/******************************************************************************
 * Bootstrap
*******************************************************************************/
window.onload = function () {
    window.app = new App();
};
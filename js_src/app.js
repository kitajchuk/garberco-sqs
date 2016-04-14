import $ from "js_libs/hobo/dist/hobo.build";
import * as core from "./core";
import router from "./router";
import overlay from "./overlay";
import gallery from "./gallery";
import intro from "./intro";


/**
 *
 * @public
 * @class App
 * @classdesc Load the App application Class to handle it ALL.
 *
 */
class App {
    constructor () {
        this.core = core;
        this.router = router;
        this.overlay = overlay;
        this.gallery = gallery;
        this.intro = intro;
        this.analytics = new core.Analytics();
        this.$mainPanels = this.core.dom.header.find( ".js-main-panel" );

        this.initModules();
        this.bindEvents();

        core.log( "App", this );
    }


    /**
     *
     * @public
     * @instance
     * @method initModules
     * @memberof App
     * @description Initialize modules.
     *
     */
    initModules () {
        this.core.detect.init( this );
        this.core.resizes.init( this );
        this.core.scrolls.init( this );
        this.router.init( this );
        this.overlay.init( this );
        this.gallery.init( this );
    }


    /**
     *
     * @public
     * @instance
     * @method bindEvents
     * @memberof App
     * @description Bind top-level app events.
     *
     */
    bindEvents () {
        this._onPreloadDone = this.onPreloadDone.bind( this );

        this.core.emitter.on( "app--preload-done", this._onPreloadDone );
        this.core.dom.header.on( "click", ".js-controller", this.onController.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method onPreloadDone
     * @memberof App
     * @description Handle intro teardown.
     *
     */
    onPreloadDone () {
        this.core.emitter.off( "app--preload-done", this._onPreloadDone );

        this.intro.teardown();
    }


    /**
     *
     * @public
     * @instance
     * @method onController
     * @param {object} e The Event object
     * @memberof App
     * @description Handle controller links for main app.
     *
     */
    onController ( e ) {
        e.preventDefault();

        let i = e.path.length;
        let $controller = null;
        let data = null;
        let $target = null;

        for ( i; i--; ) {
            if ( e.path[ i ].tagName === "A" ) {
                $controller = $( e.path[ i ] );
                data = $controller.data();
                $target = this.core.dom.main.find( `.js-main--${data.target}` );
                break;
            }
        }

        this.$mainPanels.removeClass( "is-active" );
        $target.addClass( "is-active" );

        this.core.dom.main[ 0 ].id = `is-main--${data.target}`;
    }
}



/******************************************************************************
 * Bootstrap
*******************************************************************************/
window.Squarespace.onInitialize( window.Y, () => {
    window.app = new App();
});
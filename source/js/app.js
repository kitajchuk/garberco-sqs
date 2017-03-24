require( "../sass/screen.scss" );


import * as core from "./core";
import router from "./router";
import overlay from "./overlay";
import gallery from "./gallery";
import intro from "./intro";
import main from "./main";


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
        this.main = main;
        this.router = router;
        this.overlay = overlay;
        this.gallery = gallery;
        this.intro = intro;
        this.analytics = new core.Analytics();

        if ( !this.core.dom.page.length ) {
            //this.router.redirect();

        } else {
            this.bindEvents();
            this.initModules();
        }

        if ( core.env.isConfig() ) {
            core.dom.html.addClass( "is-config" );
        }

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
        //this.core.scrolls.init( this );
        this.main.init( this );
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
}



/******************************************************************************
 * Bootstrap
*******************************************************************************/
// window.Squarespace.onInitialize( window.Y, () => {
//     window.app = new App();
// });



/******************************************************************************
 * Expose
*******************************************************************************/
window.app = new App();


/******************************************************************************
 * Export
*******************************************************************************/
export default window.app;

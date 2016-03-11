import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import router from "./router";
import overlay from "./overlay";


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
        this.analytics = new core.Analytics();

        this.initModules();
        this.bindEvents();

        core.log( "App", this );
    }


    initModules () {
        this.core.detect.init( this );
        this.core.resizes.init( this );
        this.core.scrolls.init( this );
        this.router.init( this );
        this.overlay.init( this );
    }


    bindEvents () {
        this.core.dom.header.on( "click", ".js-controller", ( e ) => {
            e.preventDefault();

            const $target = $( e.target );
            const data = $target.data();

            this.core.dom.main[ 0 ].id = data.target ? `is-main--${data.target}` : "";

            core.log( "controller", data.target );
        });
    }
}



/******************************************************************************
 * Bootstrap
*******************************************************************************/
window.onload = function () {
    window.app = new App();
};
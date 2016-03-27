import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import router from "./router";
import overlay from "./overlay";
import gallery from "./gallery";


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
        this.analytics = new core.Analytics();
        this.$mainPanels = this.core.dom.header.find( ".js-main-panel" );

        this.initModules();
        this.bindEvents();

        // @note:
        // Remove cart until it has a use ?
        $( ".absolute-cart-box" ).remove();

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
        this.core.dom.header.on( "click", ".js-controller", ( e ) => {
            e.preventDefault();

            const $controller = $( e.currentTarget );
            const data = $controller.data();
            const $target = this.core.dom.main.find( `.js-main--${data.target}` );

            this.$mainPanels.removeClass( "is-active" );
            $target.addClass( "is-active" );

            this.core.dom.main[ 0 ].id = data.target ? `is-main--${data.target}` : "";
        });
    }
}



/******************************************************************************
 * Bootstrap
*******************************************************************************/
window.Squarespace.onInitialize( window.Y, () => {
    window.app = new App();
});
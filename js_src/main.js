import $ from "js_libs/hobo/dist/hobo.build";
import * as core from "./core";


/**
 *
 * @public
 * @module main
 * @description Performs the branded load-in screen sequence.
 *
 */
const main = {
    /**
     *
     * @public
     * @method init
     * @memberof main
     * @description Initialize the main element.
     *
     */
    init () {
        this.$mainPanels = core.dom.main.find( ".js-main-panel" );
        this.mainDuration = core.util.getTransitionDuration( this.$mainPanels[ 0 ] );

        this.bindEvents();
    },


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
        core.dom.header.on( "click", ".js-controller", this.onController.bind( this ) );
    },


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

        const $target = $( e.target );
        const $controller = $target.is( ".js-controller" ) ? $target : $target.closest( ".js-controller" );
        const data = $controller.data();
        const $panel = core.dom.main.find( `.js-main--${data.target}` );

        this.$mainPanels.removeClass( "is-hidden is-active" );
        $panel.addClass( "is-active" );

        setTimeout( () => {
            core.dom.main[ 0 ].id = `is-main--${data.target}`;

        }, 10 );

        setTimeout( () => {
            this.$mainPanels.not( $panel ).addClass( "is-hidden" );

        }, this.mainDuration + 10 );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default main;
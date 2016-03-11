import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";


let $_jsElement = null;


/**
 *
 * @public
 * @namespace menu
 * @description A nice description of what this module does...
 *
 */
const menu = {
    /**
     *
     * @public
     * @method init
     * @memberof menu
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.log( "menu initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof menu
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive () {
        return (this.getElements() > 0);
    },


    /**
     *
     * @public
     * @method onload
     * @memberof menu
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        const target = $_jsElement.data( "target" );
        const $target = $( `.js-main--${target}` );

        //$target.addClass( "is-active" );
        //$target.siblings().removeClass( "is-active" );

        if ( $target[ 0 ].innerHTML === "" ) {
            $target.html( $_jsElement ).find( ".js-animate--intro-art" ).addClass( "is-active" );
        }

        if ( core.dom.main[ 0 ].id === "" ) {
            core.dom.main[ 0 ].id = `is-main--${target}`;
        }
    },


    /**
     *
     * @public
     * @method unload
     * @memberof menu
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        this.teardown();
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof menu
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsElement = null;
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof menu
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsElement = core.dom.page.find( ".js-menu" );

        return ( $_jsElement.length );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default menu;
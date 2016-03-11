//import $ from "js_libs/jquery/dist/jquery";
import * as core from "../core";
import Menu from "./Menu";


let $_jsElement = null;
let instance = null;


/**
 *
 * @public
 * @namespace menus
 * @description A nice description of what this module does...
 *
 */
const menus = {
    /**
     *
     * @public
     * @method init
     * @memberof menus
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.log( "menus initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof menus
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
     * @memberof menus
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        const data = $_jsElement.data();

        instance = new Menu( $_jsElement, data );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof menus
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        this.teardown();

        if ( instance ) {
            instance.destroy();
            instance = null;
        }
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof menus
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
     * @memberof menus
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
export default menus;
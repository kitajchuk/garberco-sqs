//import $ from "js_libs/jquery/dist/jquery";
import * as core from "../core";
import About from "./About";


let $_jsElement = null;
let instance = null;


/**
 *
 * @public
 * @namespace about
 * @description A nice description of what this module does...
 *
 */
const about = {
    /**
     *
     * @public
     * @method init
     * @memberof about
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.emitter.on( "app--root", () => {
            core.dom.html.removeClass( "is-offcanvas" );
        });

        core.log( "about initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof about
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
     * @memberof about
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        if ( !instance ) {
            const data = $_jsElement.data();

            instance = new About( $_jsElement, data );
        }
    },


    /**
     *
     * @public
     * @method unload
     * @memberof about
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {},


    /**
     *
     * @public
     * @method teardown
     * @memberof about
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {},


    /**
     *
     * @public
     * @method getElements
     * @memberof about
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsElement = core.dom.page.find( ".js-about" );

        return ( $_jsElement.length );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default about;
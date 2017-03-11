import $ from "properjs-hobo";
import * as core from "../core";
import IndexRoot from "./IndexRoot";


let $_jsElement = null;
let instance = null;


/**
 *
 * @public
 * @namespace indexes
 * @description A nice description of what this module does...
 *
 */
const indexes = {
    /**
     *
     * @public
     * @method init
     * @memberof indexes
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.emitter.on( "app--offcanvas", () => {
            if ( instance ) {
                instance.teardown();
            }
        });

        core.emitter.on( "app--load-root", ( root ) => {
            $_jsElement = $( root );

            this.onload();
        });

        core.log( "indexes initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof indexes
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
     * @memberof indexes
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        if ( !instance ) {
            const data = $_jsElement.data();

            instance = new IndexRoot( $_jsElement, data );

        } else {
            instance.cycleAnimation();
        }
    },


    /**
     *
     * @public
     * @method unload
     * @memberof indexes
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {},


    /**
     *
     * @public
     * @method getElements
     * @memberof indexes
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsElement = core.dom.page.find( ".js-index" );

        return ( $_jsElement.length );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default indexes;
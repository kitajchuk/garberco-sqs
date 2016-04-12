import * as core from "../core";
import IndexFull from "./IndexFull";


let $_jsElement = null;
let instance = null;


/**
 *
 * @public
 * @namespace listing
 * @description A nice description of what this module does...
 *
 */
const listing = {
    /**
     *
     * @public
     * @method init
     * @memberof listing
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.emitter.on( "app--root", () => {
            core.dom.html.removeClass( "is-offcanvas" );

            if ( instance ) {
                instance.teardown();
            }
        });

        core.log( "listing initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof listing
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
     * @memberof listing
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        core.emitter.fire( "app--offcanvas" );

        core.dom.html.addClass( "is-offcanvas" );

        if ( !instance ) {
            const data = $_jsElement.data();

            instance = new IndexFull( $_jsElement, data );

        } else {
            instance.cycleAnimation();
        }

        core.log( "listing onload" );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof listing
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        core.log( "listing unload" );
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof listing
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {},


    /**
     *
     * @public
     * @method getElements
     * @memberof listing
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsElement = core.dom.page.find( ".js-listing" );

        return ( $_jsElement.length );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default listing;
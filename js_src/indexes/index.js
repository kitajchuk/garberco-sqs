import $ from "js_libs/hobo/dist/hobo.build";
import * as core from "../core";
import IndexRoot from "./IndexRoot";
import Project from "../projects/Project";
import overlay from "../overlay";


let $_jsElement = null;
let instance = null;
let timeoutId = null;
const timeoutDelay = core.util.getTransitionDuration( core.dom.overlay.element[ 0 ] );


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
        core.emitter.on( "app--load-root", this.onLoadRootIndex.bind( this ) );

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
        const data = $_jsElement.data();

        instance = new IndexRoot( $_jsElement, data );

        core.dom.body.on( "click", ".js-index-tile", onTileClick );
        core.dom.body.on( "mouseenter", ".js-index-tile img", onMouseEnter );
        core.dom.body.on( "mousemove", ".js-index-tile img", onMouseEnter );
        core.dom.body.on( "mouseleave", ".js-index-tile img", onMouseLeave );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof indexes
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
     * @memberof indexes
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsElement = null;

        if ( instance ) {
            instance.destroy();
            instance = null;
        }

        core.dom.body.off( "click", onTileClick );
        core.dom.body.off( "mouseenter", onMouseEnter );
        core.dom.body.off( "mousemove", onMouseEnter );
        core.dom.body.off( "mouseleave", onMouseLeave );
    },


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
    },


    onLoadRootIndex ( root ) {
        $_jsElement = $( root );

        this.onload();
    }
};


const clearTimeoutById = function ( id ) {
    try {
        clearTimeout( id );

    } catch ( error ) {
        core.log( "warn", error );
    }
};


const onTileClick = function ( e ) {
    e.preventDefault();

    const $tile = $( this ).closest( ".js-index-tile" );

    overlay.setTitle( $tile.data( "title" ) );

    overlay.open();

    Project.open();
};


const onMouseEnter = function ( /* e */ ) {
    clearTimeoutById( timeoutId );

    if ( Project.isActive() ) {
        return;
    }

    const $tile = $( this ).closest( ".js-index-tile" );

    overlay.setTitle( $tile.data( "title" ) );

    overlay.open();
};


const onMouseLeave = function () {
    if ( Project.isActive() ) {
        return;
    }

    timeoutId = setTimeout(() => {
        if ( !Project.isActive() ) {
            overlay.close();
        }

    }, timeoutDelay );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default indexes;
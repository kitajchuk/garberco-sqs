import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import overlay from "./overlay";
import Project from "./Project";


let $_jsElement = null;
let timeoutId = null;
const timeoutDelay = core.util.getTransitionDuration( core.dom.overlay.element[ 0 ] );


/**
 *
 * @public
 * @namespace index
 * @description A nice description of what this module does...
 *
 */
const index = {
    /**
     *
     * @public
     * @method init
     * @memberof index
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.log( "index initialized" );

        core.util.emitter.on( "app--load-root-index", this.onLoadRootIndex.bind( this ) );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof index
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
     * @memberof index
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        const target = $_jsElement.data( "target" );
        const $target = $( `.js-main--${target}` );

        //$target.addClass( "is-active" );
        //$target.siblings().removeClass( "is-active" );

        if ( $target[ 0 ].innerHTML === "" ) {
            $target.html( $_jsElement );

            core.images.handleImages( $_jsElement.find( ".js-lazy-image" ), onPreload );
        }

        this.bind();
    },


    /**
     *
     * @public
     * @method unload
     * @memberof index
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
     * @memberof index
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsElement = null;

        this.unbind();
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof index
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsElement = core.dom.page.find( ".js-index" );

        return ( $_jsElement.length );
    },


    bind () {
        core.dom.body.on( "click", ".js-project-tile", onTileClick );
        core.dom.body.on( "mouseenter", ".js-project-tile", onMouseEnter );
        core.dom.body.on( "mousemove", ".js-project-tile", onMouseEnter );
        core.dom.body.on( "mouseleave", ".js-project-tile", onMouseLeave );
    },


    unbind () {
        core.dom.body.off( "click", onTileClick );
        core.dom.body.off( "mouseenter", onMouseEnter );
        core.dom.body.off( "mousemove", onMouseEnter );
        core.dom.body.off( "mouseleave", onMouseLeave );
    },


    onLoadRootIndex ( root ) {
        $_jsElement = root;

        this.onload();
    }
};


const onPreload = function () {
    core.util.emitter.fire( "app--update-animate" );
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

    Project.open();
};


const onMouseEnter = function () {
    clearTimeoutById( timeoutId );

    if ( Project.isOpen() ) {
        return;
    }

    const $tile = $( this );

    overlay.setTitle( $tile.data( "title" ) );

    if ( !overlay.isActive() ) {
        overlay.open();
    }
};


const onMouseLeave = function () {
    if ( Project.isOpen() ) {
        return;
    }

    timeoutId = setTimeout(() => {
        if ( !Project.isOpen() ) {
            overlay.close();
        }

    }, timeoutDelay );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default index;
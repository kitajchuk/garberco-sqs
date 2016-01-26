import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";


let $_jsPlates = null;
let _isActive = false;
const _transTime = core.util.getTransitionDuration( core.dom.shim[ 0 ] );


/**
 *
 * @public
 * @module projects
 * @description Handle interactions associated with project grids / details
 *
 */
const projects = {
    /**
     *
     * @public
     * @method init
     * @memberof projects
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.dom.shim.detach();

        core.dom.page.on( "click", onPageClick );
        core.dom.body.on( "click", ".js-project-tile", onTileClick );

        core.log( "projects initialized" );
    },


    openShim () {
        _isActive = true;

        core.dom.html.addClass( "is-neverflow is-shim-active" );
        core.dom.body.append( core.dom.shim );

        setTimeout( () => core.dom.shim.addClass( "is-active" ), 10 );
    },


    closeShim () {
        core.util.emitter.stop();

        core.dom.shim.removeClass( "is-active" );
        core.dom.html.removeClass( "is-neverflow" );

        setTimeout( () => {
            $_jsPlates = null;

            core.dom.html.removeClass( "is-shim-active" );
            core.dom.shim.detach().empty();

            setTimeout( () => _isActive = false, 10 );

        }, _transTime );
    }
};


const onUpdateEmitter = function () {
    let $plate = null;
    let i = $_jsPlates.length;

    for ( i; i--; ) {
        $plate = $_jsPlates.eq( i );

        if ( core.util.isElementInViewport( $plate[ 0 ] ) ) {
            $plate.addClass( "is-active" );

        } else {
            $plate.removeClass( "is-active" );
        }
    }
};


const onPageClick = function ( e ) {
    e.preventDefault();

    if ( !$( e.target ).closest( ".js-project-tile" ).length ) {
        projects.closeShim();
    }
};


const onTileClick = function ( e ) {
    e.preventDefault();

    if ( _isActive ) {
        return false;
    }

    projects.openShim();

    const fullUrl = this.pathname;
    const dataType = { dataType: "html" };
    const format = { format: "full" };
    const cached = core.cache.get( this.pathname );
    const handler = function ( response ) {
        const $node = $( response );
        const $project = $node.filter( ".js-page" ).find( ".js-project" );

        $_jsPlates = $project.find( ".js-project-plate" );

        core.dom.shim.html( $project );

        core.util.loadImages( $project.find( ".js-lazy-image" ), core.util.noop ).on( "done", () => {
            onUpdateEmitter();

            core.util.emitter.go( onUpdateEmitter );
        });

        core.cache.set( fullUrl, response );
    };

    if ( cached ) {
        handler( cached );

    } else {
        core.api.collection( fullUrl, format, dataType ).done( handler );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default projects;
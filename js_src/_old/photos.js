//import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import Project from "./Project";
import ImageLoader from "properjs-imageloader";


let $_jsElement = null;
let project = null;


/**
 *
 * @public
 * @namespace photos
 * @description A nice description of what this module does...
 *
 */
const photos = {
    /**
     *
     * @public
     * @method init
     * @memberof photos
     * @description Method runs once when window loads.
     *
     */
    init () {
        core.log( "photos initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof photos
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
     * @memberof photos
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        core.dom.project.element.html( $_jsElement );

        core.images.handleImages( $_jsElement.find( ".js-lazy-image" ), onPreload );

        core.util.emitter.on( "app--root", onRoot );
        core.util.emitter.on( "app--menu", onMenu );
        core.util.emitter.on( "app--project-ended", onEnded );

        if ( !Project.isOpen() ) {
            Project.open();
        }
    },


    /**
     *
     * @public
     * @method unload
     * @memberof photos
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
     * @memberof photos
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsElement = null;

        if ( project ) {
            project.destroy();
            project = null;
        }

        core.util.emitter.off( "app--root", onRoot );
        core.util.emitter.off( "app--menu", onMenu );
        core.util.emitter.off( "app--project-ended", onEnded );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof photos
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsElement = core.dom.page.find( ".js-photos" );

        return ( $_jsElement.length );
    }
};


const killProject = function () {
    if ( project ) {
        project.destroy();
        project = null;
    }

    ImageLoader.killInstances();
};


const onRoot = function () {
    killProject();
};


const onMenu = function () {
    killProject();
};


const onEnded = function () {
    killProject();
};


const onPreload = function () {
    project = new Project( $_jsElement );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default photos;
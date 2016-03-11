//import $ from "js_libs/jquery/dist/jquery";
import * as core from "../core";
import Project from "./Project";
import ImageLoader from "properjs-imageloader";


let $_jsElement = null;
let instance = null;


/**
 *
 * @public
 * @namespace projects
 * @description A nice description of what this module does...
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
        if ( !core.dom.project.element.is( ".is-active" ) ) {
            core.dom.project.element.detach();
        }

        core.log( "projects initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof projects
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
     * @memberof projects
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        const data = $_jsElement.data();

        instance = new Project( $_jsElement, data );

        core.util.emitter.on( "app--root", killProject );
        core.util.emitter.on( "app--project-ended", killProject );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof projects
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
     * @memberof projects
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsElement = null;

        if ( instance ) {
            instance.destroy();
            instance = null;
        }

        core.util.emitter.off( "app--root", killProject );
        core.util.emitter.off( "app--project-ended", killProject );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof projects
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsElement = core.dom.page.find( ".js-project" );

        return ( $_jsElement.length );
    }
};


const killProject = function () {
    if ( instance ) {
        instance.destroy();
        instance = null;
    }

    ImageLoader.killInstances();
};



/******************************************************************************
 * Export
*******************************************************************************/
export default projects;
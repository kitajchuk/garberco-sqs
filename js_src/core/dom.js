import $ from "js_libs/jquery/dist/jquery";
import * as util from "./util";


const $_jsOverlay = $( ".js-overlay" );
const $_jsProject = $( ".js-project-view" );


/**
 *
 * @public
 * @module dom
 * @description Holds high-level cached Nodes.
 *
 */
const dom = {
    /**
     *
     * @public
     * @member doc
     * @memberof dom
     * @description The cached document node.
     *
     */
    doc: $( document ),


    /**
     *
     * @public
     * @member html
     * @memberof dom
     * @description The cached documentElement node.
     *
     */
    html: $( document.documentElement ),


    /**
     *
     * @public
     * @member body
     * @memberof dom
     * @description The cached body node.
     *
     */
    body: $( document.body ),


    /**
     *
     * @public
     * @member header
     * @memberof dom
     * @description The cached header node.
     *
     */
    header: $( ".js-header" ),


    /**
     *
     * @public
     * @member nav
     * @memberof dom
     * @description The cached nav node.
     *
     */
    nav: $( ".js-nav" ),


    /**
     *
     * @public
     * @member intro
     * @memberof dom
     * @description The cached brand moment node.
     *
     */
    overlay: {
        element: $_jsOverlay,
        elementTitle: $_jsOverlay.find( ".js-overlay-title" )
    },


    /**
     *
     * @public
     * @member page
     * @memberof dom
     * @description The cached page container node.
     *
     */
    page: $( ".js-page" ),


    /**
     *
     * @public
     * @member project
     * @memberof dom
     * @description The project view node.
     *
     */
    project: {
        element: $_jsProject,
        elementTransitionDuration: util.getTransitionDuration( $_jsProject[ 0 ] )
    },


    /**
     *
     * @public
     * @member root
     * @memberof dom
     * @description The cached root node.
     *
     */
    root: $( ".js-root" ),


    /**
     *
     * @public
     * @member main
     * @memberof dom
     * @description The cached main node.
     *
     */
    main: $( ".js-main" )
};



/******************************************************************************
 * Export
*******************************************************************************/
export default dom;
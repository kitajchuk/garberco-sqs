import $ from "js_libs/jquery/dist/jquery";


const $_jsHeader = $( ".js-header" );


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
     * @member win
     * @memberof dom
     * @description The cached window node.
     *
     */
    win: $( window ),


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
     * @member page
     * @memberof dom
     * @description The cached page container node.
     *
     */
    page: $( ".js-page" ),


    /**
     *
     * @public
     * @member shim
     * @memberof dom
     * @description The project shim node.
     *
     */
    shim: $( ".js-project-shim" ),


    /**
     *
     * @public
     * @member header
     * @memberof dom
     * @description The cached header node.
     *
     */
    header: $_jsHeader.data( "$util", $_jsHeader.find( ".js-header-util" ) ),


    /**
     *
     * @public
     * @member intro
     * @memberof dom
     * @description The cached brand moment node.
     *
     */
    intro: $( ".js-intro" )
};



/******************************************************************************
 * Export
*******************************************************************************/
export default dom;
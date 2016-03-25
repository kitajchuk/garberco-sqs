import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import Menu from "./Menu";



/**
 *
 * @public
 * @module gallery
 * @description Performs the branded load-in screen sequence.
 *
 */
const gallery = {
    /**
     *
     * @public
     * @method init
     * @memberof gallery
     * @description Initialize the gallery element.
     *
     */
    init () {
        this.menu = new Menu( core.dom.gallery.element );
    },


    open () {
        if ( !this.menu.isActive() ) {
            this.menu.open();
        }
    },


    close () {
        if ( this.menu.isActive() ) {
            this.menu.close();
        }
    },


    empty () {
        core.dom.gallery.elementNode.empty();
    },


    setImage ( $image ) {
        const data = $image.data();

        this.empty();
        this.open();
        this.$image = $( new Image() );
        this.$image
            .attr({
                "data-img-src": data.imgSrc,
                "data-variants": data.variants,
                "data-original-size": data.originalSize
            })
            .addClass( "gallery__image figure__image image" );

        core.dom.gallery.elementNode.html( this.$image );

        core.util.loadImages( this.$image, core.util.noop ).on( "done", () => {
            setTimeout(() => {
                this.$image.addClass( "is-active" );

            }, 10 );
        });
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default gallery;
import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import Menu from "./Menu";



/**
 *
 * @public
 * @module gallery
 * @description Handles single view images.
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


    /**
     *
     * @public
     * @method open
     * @memberof gallery
     * @description Open the gallery.
     *
     */
    open () {
        if ( !this.menu.isActive() ) {
            this.menu.open();
        }
    },


    /**
     *
     * @public
     * @method close
     * @memberof gallery
     * @description Close the gallery.
     *
     */
    close () {
        if ( this.menu.isActive() ) {
            this.menu.close();
        }
    },


    /**
     *
     * @public
     * @method empty
     * @memberof gallery
     * @description Empty the gallery.
     *
     */
    empty () {
        core.dom.gallery.elementNode[ 0 ].innerHTML = "";
    },


    /**
     *
     * @public
     * @method setImage
     * @param {jQuery} $image The image to create a full view of.
     * @memberof gallery
     * @description Apply an image to the gallery view.
     *
     */
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

        core.dom.gallery.elementNode.append( this.$image );

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
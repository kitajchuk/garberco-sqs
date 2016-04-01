import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import Menu from "./Menu";
import debounce from "properjs-debounce";
import overlay from "./overlay";



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

        core.dom.gallery.element.on( "click", debounce( this.onClick.bind( this ), 200, true ) );
    },


    onClick ( e ) {
        if ( e.target === this.$image[ 0 ] || !this.isLoaded || overlay.isActive() ) {
            core.emitter.fire( "app--gallery-image" );

        } else {
            core.emitter.fire( "app--gallery-background" );
        }
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

        this.isLoaded = false;
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
            this.isLoaded = true;
            this.$image.addClass( "is-active" );
        });
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default gallery;
import $ from "js_libs/hobo/dist/hobo.build";
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
        this.klasa = "gallery__image figure__image image";
        this.$image = $( new Image() );
        this.$image[ 0 ].className = this.klasa;

        core.dom.gallery.elementNode.append( this.$image );

        core.dom.gallery.element.on( "click", debounce( this.onClick.bind( this ), 200, true ) );
    },


    /**
     *
     * @public
     * @method init
     * @memberof onClick
     * @param {object} e The Event object
     * @description Handle gallery click event.
     *
     */
    onClick ( e ) {
        if ( e.target === core.dom.gallery.elementNode[ 0 ] || overlay.isActive() ) {
            this.handleClick( e );

        } else {
            core.emitter.fire( "app--gallery-background" );
        }
    },


    /**
     *
     * @public
     * @method init
     * @memberof handleClick
     * @param {object} e The Event object
     * @description Handle gallery click, move forward/backward.
     *
     */
    handleClick ( e ) {
        const rect = this.$image[ 0 ].getBoundingClientRect();
        let direction = null;

        if ( e.clientX <= (rect.width / 2 + rect.left) && !overlay.isActive() ) {
            direction = "left";

        } else {
            direction = "right";
        }

        core.emitter.fire( "app--gallery-image", direction );
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
        this.$image[ 0 ].src = "";
    },


    /**
     *
     * @public
     * @method setImage
     * @param {Hobo} $image The image to create a full view of.
     * @memberof gallery
     * @description Apply an image to the gallery view.
     *
     */
    setImage ( $image ) {
        const data = $image.data();

        this.open();
        this.$image.removeAttr( core.config.imageLoaderAttr ).attr({
            "data-img-src": data.imgSrc,
            "data-variants": data.variants,
            "data-original-size": data.originalSize
        });

        core.util.loadImages( this.$image, core.util.noop, true, window.innerWidth );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default gallery;
import dom from "./dom";
import config from "./config";
import emitter from "./emitter";
import ImageController from "./ImageController";


/**
 *
 * @public
 * @namespace images
 * @memberof core
 * @description Handles separation of image pre-loading and image lazy-loading.
 *
 */
const images = {
    /**
     *
     * @public
     * @method handlePreload
     * @memberof core.images
     * @param {function} callback The passed callback from `handleImages`
     * @description Method handles the `done` preloading event cycle.
     *
     */
    handlePreload ( callback ) {
        if ( typeof callback === "function" ) {
            callback();
        }

        emitter.fire( "app--preload-done" );
    },


    /**
     *
     * @public
     * @method handleLazyload
     * @memberof core.images
     * @description Method handles the `done` lazyloading event cycle.
     *
     */
    handleLazyload () {
        emitter.fire( "app--lazyload-done" );
    },


    /**
     *
     * @public
     * @method handleImages
     * @memberof core.images
     * @param {object} $images Optionally, the image collection to load
     * @param {function} callback Optionally, a callback to fire when loading is done
     * @description Method handles separation of pre-load and lazy-load.
     *
     */
    handleImages ( $images, callback ) {
        $images = ($images || dom.page.find( config.lazyImageSelector ));

        if ( $images.length ) {
            const imageController = new ImageController( $images );

            imageController.on( "preload", this.handlePreload.bind( this, callback ) );
            imageController.on( "lazyload", this.handleLazyload.bind( this ) );

        } else {
            this.handlePreload( callback );
        }
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default images;
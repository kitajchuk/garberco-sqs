import dom from "./dom";
import * as util from "./util";
import log from "./log";
import config from "./config";
import ImageLoader from "properjs-imageloader";
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
     * @method init
     * @memberof core.images
     * @description Method runs once when window loads.
     *
     */
    init () {
        log( "preload initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof core.images
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive: util.noop,


    /**
     *
     * @public
     * @method onload
     * @memberof core.images
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        this.handleImages();
    },


    /**
     *
     * @public
     * @method unload
     * @memberof core.images
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        ImageLoader.killInstances();
    },


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

        util.emitter.fire( "app--preload-done" );
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

            imageController.on( "lazyload", () => {
                util.emitter.fire( "app--lazyload-done" );
            });

        } else {
            this.handlePreload( callback );
        }
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default images;
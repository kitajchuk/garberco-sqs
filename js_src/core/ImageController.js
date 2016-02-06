import * as util from "./util";
import log from "./log";
import Controller from "properjs-controller";


/**
 *
 * @public
 * @class ImageController
 * @param {jQuery} $images The image collection to load
 * @classdesc Handles breaking out the preload vs lazyload batches
 * @memberof core
 *
 */
class ImageController extends Controller {
    constructor ( $images ) {
        super();

        this.$preload = util.getElementsInView( $images );
        this.$lazyload = $images.not( this.$preload );

        if ( this.$preload.length ) {
            this.handlePreload();

        } else {
            this.fire( "preload" );
        }

        if ( this.$lazyload.length ) {
            this.handleLazyload();
        }
    }


    /**
     *
     * @public
     * @method handlePreload
     * @memberof core.ImageController
     * @description ImageLoader instance for preload batch.
     *
     */
    handlePreload () {
        log( "ImageController preload queue:", this.$preload.length );

        this.preLoader = util.loadImages( this.$preload, util.noop );
        this.preLoader.on( "done", () => {
            log( "ImageController preloaded:", this.$preload.length );

            this.fire( "preload" );
        });
    }


    /**
     *
     * @public
     * @method handleLazyload
     * @memberof core.ImageController
     * @description ImageLoader instance for lazyload batch.
     *
     */
    handleLazyload () {
        log( "ImageController lazyload queue:", this.$lazyload.length );

        this.lazyLoader = util.loadImages( this.$lazyload, util.isElementLoadable );
        this.lazyLoader.on( "done", () => {
            log( "ImageController lazyloaded:", this.$lazyload.length );

            this.fire( "lazyload" );
        });
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default ImageController;
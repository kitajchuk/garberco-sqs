import * as core from "../core";
import mediabox from "./mediabox";


/**
 *
 * @public
 * @class AutoplayHandler
 * @classdesc Handle starting / stopping autoplay videos.
 * @param {Hobo} $node The element to work with
 * @param {string} id The MediaBox ID to work with
 * @memberof video
 *
 */
class AutoplayHandler {
    constructor ( $node, id ) {
        this.$node = $node;
        this.id = id;

        this.bindEvents();
    }


    /**
     *
     * @public
     * @instance
     * @method bindEvents
     * @memberof AutoplayHandler
     * @description Bind the scroll event for toggling playback.
     *
     */
    bindEvents () {
        this._onScroll = this.onScroll.bind( this );

        if ( mediabox.getMedia( this.id ) ) {
            this._onScroll();
        }

        core.emitter.on( "app--project-scroll", this._onScroll );
    }


    /**
     *
     * @public
     * @instance
     * @method onScroll
     * @memberof AutoplayHandler
     * @description Scroll handler for toggling video playback.
     *
     */
    onScroll () {
        if ( core.util.isElementInViewport( this.$node[ 0 ] ) ) {
            if ( !mediabox.isPlaying( this.id ) ) {
                mediabox.playMedia( this.id );
            }

        } else if ( mediabox.isPlaying( this.id ) ) {
            mediabox.stopMedia( this.id );
        }
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof AutoplayHandler
     * @description Remove the scroll handler.
     *
     */
    destroy () {
        core.emitter.off( "app--project-scroll", this._onScroll );
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default AutoplayHandler;

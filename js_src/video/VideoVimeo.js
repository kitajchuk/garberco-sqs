import * as core from "../core";
import mediabox from "./mediabox";
import AutoplayHandler from "./AutoplayHandler";


/**
 *
 * @public
 * @class VideoVimeo
 * @memberof video
 * @classdesc Video default for third-party service embeds.
 * @param {Hobo} $node The element to inject the video module into
 * @param {object} data The video data to work with
 *
 */
class VideoVimeo {
    constructor ( $node, data ) {
        this.$node = $node;
        this.$video = this.$node.find( ".js-video-element" );
        this.$poster = this.$node.find( ".js-video-poster" );
        this.$playback = this.$node.find( ".js-video-playback" );
        this.data = data;
        this._files = {};
        this._video = null;

        this.loadVimeoData();
    }


    /**
     *
     * @public
     * @instance
     * @method loadVimeoData
     * @memberof VideoVimeo
     * @description Attempt to utilize the Vimeo JS API for source files.
     *
     */
    loadVimeoData () {
        const vimeoId = this.data.vimeoUrl.split( "/" ).pop();

        core.api.vimeo( vimeoId ).then( ( vData ) => {
            this.handleVimeoData( vData );
        });
    }


    /**
     *
     * @public
     * @instance
     * @method logVideoFiles
     * @param {object} vData The api response from Vimeo
     * @memberof VideoVimeo
     * @description Organize the files array into something easier to use.
     *
     */
    logVideoFiles ( vData ) {
        let i = vData.files.length;

        for ( i; i--; ) {
            if ( !this._files[ vData.files[ i ].quality ] || (this._files[ vData.files[ i ].quality ] && vData.files[ i ].size > this._files[ vData.files[ i ].quality ].size) ) {
                this._files[ vData.files[ i ].quality ] = vData.files[ i ];
            }
        }
    }


    /**
     *
     * @public
     * @instance
     * @method handleVimeoData
     * @param {object} vData The response data from Vimeo's API
     * @memberof VideoVimeo
     * @description Process Vimeo API data and find an HD version to use.
     *
     */
    handleVimeoData ( vData ) {
        this.vData = vData;

        // Organize video files
        this.logVideoFiles( vData );

        // Assign source file to data
        this.data.sourceUrl = (core.detect.isDevice() ? (this._files.mobile || this._files.sd) : (this._files.hd || this._files.sd)).link;

        // Assign poster thumbnail
        this.data.posterUrl = this.vData.pictures.sizes[ this.vData.pictures.sizes.length - 1 ].link;

        if ( core.detect.isDevice() ) {
            this.initMobile();

        } else {
            this.initVideo();
        }

        this.applyAspect();
        this.createMediaNode( this.data.id, this.data.sourceUrl, this.$video[ 0 ] );
    }


    /**
     *
     * @public
     * @instance
     * @method initMobile
     * @memberof VideoVimeo
     * @description Initialize videos for modile devices.
     *
     */
    initMobile () {
        this.$video[ 0 ].setAttribute( "controls", true );
        this.$video[ 0 ].setAttribute( "loop", false );
        this.$video[ 0 ].setAttribute( "poster", this.data.posterUrl );
        this.$poster.remove();
        this.$playback.remove();
    }


    /**
     *
     * @public
     * @instance
     * @method initVideo
     * @memberof VideoVimeo
     * @description Initialize videos for browsers.
     *
     */
    initVideo () {
        this.$video.on( "loadedmetadata", () => {
            if ( this.data.autoplayLoop ) {
                this.bindAutoplayLoop();

            } else if ( this.data.clickToPlay ) {
                this.loadThumbFile();
                this.bindClickToPlay();
            }
        });
    }


    /**
     *
     * @public
     * @instance
     * @method loadThumbFile
     * @memberof VideoVimeo
     * @description Load poster image from vimeo.
     *
     */
    loadThumbFile () {
        this.$poster.attr( "data-img-src", this.data.posterUrl );

        core.util.loadImages( this.$poster );
    }


    /**
     *
     * @public
     * @instance
     * @method bindAutoplayLoop
     * @memberof VideoVimeo
     * @description Handle autoplay loop video option.
     *
     */
    bindAutoplayLoop () {
        this._autoplayHandler = new AutoplayHandler( this.$node, this.data.id );
    }


    /**
     *
     * @public
     * @instance
     * @method bindClickToPlay
     * @memberof VideoVimeo
     * @description Handle click-to-play video option.
     *
     */
    bindClickToPlay () {
        this.$video.on( "click", () => {
            if ( mediabox.isPlaying( this.data.id ) ) {
                this.$node.removeClass( "is-playing" );
                mediabox.stopMedia( this.data.id );

            } else {
                this.$node.addClass( "is-playing" );
                mediabox.playMedia( this.data.id );
            }
        });

        mediabox.addMediaEvent( this.data.id, "play", () => {
            this.$node.addClass( "is-active" );
        });

        mediabox.addMediaEvent( this.data.id, "ended", () => {
            mediabox.stopMedia( this.data.id ).setMediaProp( this.data.id, "currentTime", 0 );

            this.$node.removeClass( "is-active is-playing" );
        });
    }


    /**
     *
     * @public
     * @instance
     * @method createMediaNode
     * @param {string} id The media id
     * @param {string} url The media source url
     * @param {element} node The <video /> element
     * @memberof VideoVimeo
     * @description Execute the MediaBox implementation adding this video to the `library`.
     *
     */
    createMediaNode ( id, url, node ) {
        mediabox.addVideo({
            id: id,
            src: url.split( "," ),
            element: node,
            channel: "vid"
        });
    }


    /**
     *
     * @public
     * @instance
     * @method applyAspect
     * @memberof VideoVimeo
     * @description Apply the video's aspect ratio.
     *
     */
    applyAspect () {
        this.$node[ 0 ].style.paddingBottom = `${((this.vData.height / this.vData.width) * 100)}%`;
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof VideoVimeo
     * @description Removes events and media for the video instance.
     *
     */
    destroy () {
        this.$video.off( "click loadedmetadata" );

        if ( this._autoplayHandler ) {
            this._autoplayHandler.destroy();
        }

        if ( mediabox.getMedia( this.data.id ) ) {
            mediabox.destroyMedia( this.data.id );
        }
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default VideoVimeo;

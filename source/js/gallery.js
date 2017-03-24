import $ from "properjs-hobo";
import * as core from "./core";
import Menu from "./Menu";
import debounce from "properjs-debounce";
import overlay from "./overlay";
import bar from "./bar";
import Hammer from "hammerjs";
import Easing from "properjs-easing";
import Tween from "properjs-tween";
import VideoVimeo from "./video/VideoVimeo";



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
        this.tween = null;
        this.menu = new Menu( core.dom.gallery.element, true );

        // Image
        this.$image = $( new Image() );
        this.$image[ 0 ].className = "gallery__image figure__image image";

        // Video
        this.videoData = null;
        this.$videoWrap = $( document.createElement( "div" ) );
        this.$videoWrap[ 0 ].className = "_video gallery__video";
        this.$video = $( document.createElement( "video" ) );
        this.$video[ 0 ].className = "_video__element";
        this.$videoWrap.append( this.$video );

        core.dom.gallery.elementNode.append( this.$image );
        core.dom.gallery.elementNode.append( this.$videoWrap );

        if ( core.detect.isDevice() ) {
            this.bindSwipe();

        } else {
            this.bindClick();
        }
    },


    /**
     *
     * @public
     * @method bindSwipe
     * @memberof gallery
     * @description Bind Hammerjs touch events.
     *
     */
    bindSwipe () {
        this._onTap = this.onTap.bind( this );
        this._onSwipe = this.onSwipe.bind( this );
        this._onPanmove = this.onPanmove.bind( this );
        this._onPanend = this.onPanend.bind( this );

        this.tap = new Hammer( core.dom.gallery.element[ 0 ], core.util.getDefaultHammerOptions() );
        this.tap.on( "tap", this._onTap );

        this.swipe = new Hammer( core.dom.gallery.elementNode[ 0 ], core.util.getDefaultHammerOptions() );
        this.swipe.on( "panmove", this._onPanmove );
        this.swipe.on( "panend", this._onPanend );
        this.swipe.on( "swipe", this._onSwipe );
    },


    /**
     *
     * @public
     * @method bindClick
     * @memberof gallery
     * @description Bind Mouse events.
     *
     */
    bindClick () {
        core.dom.gallery.element.on( "click", debounce( this.onClick.bind( this ), 200, true ) );
    },


    /**
     *
     * @public
     * @method onTap
     * @param {object} e The Event object
     * @memberof gallery
     * @description Handle tap event.
     *
     */
    onTap ( e ) {
        if ( e.target !== this.$video[ 0 ] ) {
            core.emitter.fire( "app--gallery-background" );
        }
    },


    /**
     *
     * @public
     * @method onPanmove
     * @param {object} e The Event object
     * @memberof gallery
     * @description Handle panning event.
     *
     */
    onPanmove ( e ) {
        e.preventDefault();

        if ( !this.tween ) {
            core.util.translate3d(
                core.dom.gallery.elementNode[ 0 ],
                core.util.px( (e.deltaX / 3) ),
                0,
                0
            );
        }
    },


    /**
     *
     * @public
     * @method onPanend
     * @param {object} e The Event object
     * @memberof gallery
     * @description Handle end of pan event.
     *
     */
    onPanend () {
        if ( !this.tween ) {
            const transform = core.util.getTransformValues( core.dom.gallery.elementNode[ 0 ] );
            const isLeft = (transform.x < 0);

            this.tween = new Tween({
                to: 0,
                from: Math.abs( transform.x ),
                ease: Easing.easeInOutCubic,
                update: ( x ) => {
                    core.util.translate3d(
                        core.dom.gallery.elementNode[ 0 ],
                        core.util.px( (isLeft ? -x : x) ),
                        0,
                        0
                    );
                },
                complete: () => {
                    this.tween = null;
                },
                duration: 200
            });
        }
    },


    /**
     *
     * @public
     * @method onSwipe
     * @param {object} e The Event object
     * @memberof gallery
     * @description Handle `swipe` event.
     *
     */
    onSwipe ( e ) {
        e.preventDefault();

        const transform = core.util.getTransformValues( core.dom.gallery.elementNode[ 0 ] );
        const isLeft = (e.direction === Hammer.DIRECTION_LEFT);

        if ( !this.tween ) {
            this.tween = new Tween({
                to: window.innerWidth,
                from: Math.abs( transform.x ),
                ease: Easing.easeInOutCubic,
                update: ( x ) => {
                    core.util.translate3d(
                        core.dom.gallery.elementNode[ 0 ],
                        core.util.px( (isLeft ? -x : x) ),
                        0,
                        0
                    );
                },
                complete: () => {
                    this.empty();

                    core.emitter.fire( "app--gallery-image", (isLeft ? Hammer.DIRECTION_RIGHT : Hammer.DIRECTION_LEFT) );

                    setTimeout( () => {
                        this.tween = null;

                        core.util.translate3d(
                            core.dom.gallery.elementNode[ 0 ],
                            0,
                            0,
                            0
                        );

                    }, (overlay.isActive() ? core.dom.overlay.elementTransitionDuration : 10) );
                },
                duration: 200
            });
        }
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
        const rect = (this.videoData ? this.$video[ 0 ] : this.$image[ 0 ]).getBoundingClientRect();
        let direction = null;

        if ( e.clientX <= (rect.width / 2 + rect.left) && !overlay.isActive() ) {
            direction = Hammer.DIRECTION_LEFT;

        } else {
            direction = Hammer.DIRECTION_RIGHT;
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

            this.empty();
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

        if ( this.videoData ) {
            this.$video[ 0 ].innerHTML = "";
            this.videoData = null;
        }
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
        this.empty();

        const data = $image.data();

        core.dom.gallery.element.removeClass( "is-video" );

        bar.load();
        this.open();
        this.$image.removeAttr( core.config.imageLoaderAttr ).attr({
            "data-img-src": data.imgSrc,
            "data-variants": data.variants,
            "data-original-size": data.originalSize
        });

        core.util.loadImages( this.$image, core.util.noop, true, window.innerWidth ).on( "done", () => {
            bar.stop();
        });
    },


    /**
     *
     * @public
     * @method setVideo
     * @param {object} vData The vimeo api data.
     * @memberof gallery
     * @description Apply a video to the gallery view.
     *
     */
    setVideo ( vData ) {
        this.empty();
        this.videoData = vData;

        const files = VideoVimeo.logVideoFiles( this.videoData );
        const file = VideoVimeo.getVideoFile( files );

        core.dom.gallery.element.addClass( "is-video" );

        this.open();
        this.$videoWrap[ 0 ].style.paddingBottom = `${((this.videoData.height / this.videoData.width) * 100)}%`;

        // Avoid always playing the first video loaded each time
        if ( core.detect.isDevice() ) {
            this.$video[ 0 ].setAttribute( "poster", this.videoData.pictures.sizes[ this.videoData.pictures.sizes.length - 1 ].link );
            this.$video[ 0 ].setAttribute( "controls", true );
        }

        this.$video[ 0 ].src = file;
        this.$video[ 0 ].load();
        this.$video[ 0 ].play();
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default gallery;

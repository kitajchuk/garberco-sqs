import * as core from "../core";
import $ from "properjs-hobo";
import router from "../router";
import gallery from "../gallery";
import overlay from "../overlay";
import template from "properjs-template";
import Controller from "properjs-controller";
import bar from "../bar";
import Hammer from "hammerjs";


let instance = null;
const animator = new Controller();
const _gridTitleTpl = `<div class="listing__title js-listing-title" data-title="{title}"><h3 class="listing__title__text h3">{text}</h3></div>`;
const _gridWrapTpl = `<div class="listing__grid js-listing-project grid grid--index"></div>`;
const _gridItemTpl = `
<div class="listing__tile grid__item__small js-listing-tile">
    <div class="grid__photo grid__photo--small animate animate--fade js-animate">
        <figure class="figure">
            <img class="figure__image image js-lazy-image" data-img-src="{assetUrl}" data-variants="{systemDataVariants}" data-original-size="{originalSize}" />
        </figure>
    </div>
</div>
`;

// @vimeoVideoUrl
const _gridVideoTpl = `
<div class="listing__tile grid__item__small js-listing-tile">
    <div class="grid__photo grid__photo--small animate animate--fade js-animate">
        <figure class="figure">
            <img class="figure__image image image--wide js-vimeo-image" />
            <span class="icon icon--svg icon--playback _video__playback">
                <svg class="icon__svg" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="-188 216.1 261.3 209.9" xml:space="preserve"><polygon points="35.8 296.4 -86.3 216.1 -86.3 426 73.3 321.1 "/><rect x="-188" y="216.1" class="st0" width="59.2" height="209.9"/></svg>
            </span>
        </figure>
    </div>
</div>
`;


/**
 *
 * @public
 * @class IndexFull
 * @param {Hobo} $node The element
 * @param {object} data The datas
 * @classdesc Handle an index as a Singleton(ish).
 * @memberof indexes
 *
 */
class IndexFull {
    constructor ( $node, data ) {
        if ( !instance ) {
            this.initialize( $node, data );
        }

        return instance;
    }


    /**
     *
     * @public
     * @instance
     * @method initialize
     * @param {Hobo} $node The element
     * @param {object} data The datas
     * @memberof indexes.IndexFull
     * @description Perform instance bootstrap actions.
     *
     */
    initialize ( $node, data ) {
        this.data = data;
        this.$node = $node;
        this.$tile = null;
        this.$image = null;
        this.$target = core.dom.main.find( `.js-main--${this.data.target}` );
        this.$anims = null;
        this.vimeos = {};

        this.bindEvents();
        this.loadIndex();

        instance = this;
    }


    /**
     *
     * @public
     * @instance
     * @method cycleAnimation
     * @memberof indexes.IndexFull
     * @description Start the animation cycle for the listing.
     *
     */
    cycleAnimation () {
        // Fresh query for js- animatable elements each time
        this.$anims = this.$node.find( ".js-animate" );

        animator.stop();
        animator.go( this.updateAnimate.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method updateAnimate
     * @memberof indexes.IndexFull
     * @description Update active photos for index.
     *
     */
    updateAnimate () {
        let $anim = null;
        let i = this.$anims.length;

        for ( i; i--; ) {
            $anim = this.$anims.eq( i );

            if ( core.util.isElementInViewport( $anim[ 0 ] ) ) {
                $anim.addClass( "is-active" );

            } else {
                $anim.removeClass( "is-active" );
            }
        }
    }



    /**
     *
     * @public
     * @instance
     * @method bindEvents
     * @memberof indexes.IndexFull
     * @description Bind instance events.
     *
     */
    bindEvents () {
        this.$node.on( "click", ".js-listing-tile", ( e ) => {
            if ( !gallery.menu.isActive() ) {
                const $target = $( e.target );
                const $tile = $target.is( ".js-listing-tile" ) ? $target : $target.closest( ".js-listing-tile" );

                this.bindGallery( $tile );
            }
        });
    }


    /**
     *
     * @public
     * @instance
     * @method bindGallery
     * @param {Hobo} $elem The tile image that was clicked
     * @memberof indexes.IndexFull
     * @description Bind active gallery view.
     *
     */
    bindGallery ( $elem ) {
        const data = $elem.data();

        this.$tile = $elem;
        this.$image = this.$tile.find( core.config.lazyImageSelector );

        // @vimeoVideoUrl
        if ( data.vimeoId ) {
            gallery.setVideo( this.vimeos[ data.vimeoId ] );

        } else {
            gallery.setImage( this.$image );
        }

        this._onKeyDown = this.onKeyDown.bind( this );
        this._onGalleryImage = this.onGalleryImage.bind( this );
        this._onGalleryBack = this.onGalleryBack.bind( this );

        core.emitter.on( "app--gallery-image", this._onGalleryImage );
        core.emitter.on( "app--gallery-background", this._onGalleryBack );

        core.dom.doc.on( "keydown", this._onKeyDown );
    }


    /**
     *
     * @public
     * @instance
     * @method nextTile
     * @param {Hobo} $tile The tile element
     * @memberof indexes.IndexFull
     * @description Transition to the next tile in a project.
     *
     */
    nextTile ( $tile ) {
        const data = $tile.data();

        this.$tile = $tile;
        this.$image = this.$tile.find( core.config.lazyImageSelector );

        // @vimeoVideoUrl
        if ( data.vimeoId ) {
            gallery.setVideo( this.vimeos[ data.vimeoId ] );

        } else {
            gallery.setImage( this.$image );
        }
    }


    /**
     *
     * @public
     * @instance
     * @method unbindGallery
     * @memberof indexes.IndexFull
     * @description Un-bind active gallery view.
     *
     */
    unbindGallery () {
        this.$tile = null;
        this.$image = null;

        overlay.close();
        gallery.close();

        core.dom.doc.off( "keydown", this._onKeyDown );
        core.emitter.off( "app--gallery-image", this._onGalleryImage );
        core.emitter.off( "app--gallery-background", this._onGalleryBack );
    }


    /**
     *
     * @public
     * @instance
     * @method nextProject
     * @param {Hobo} $project The project grid
     * @param {Hobo} $tile The tile image to load in gallery
     * @memberof indexes.IndexFull
     * @description Transition to a tile in a new project scope.
     *
     */
    nextProject ( $project, $tile ) {
        if ( $project.length ) {
            // Tile?
            this.$tile = $tile;

            // Image?
            this.$image = this.$tile.find( core.config.lazyImageSelector );

            gallery.setImage( this.$image );

            overlay.close();
        }
    }


    /**
     *
     * @public
     * @instance
     * @method nextTitle
     * @param {Hobo} $title The title element
     * @param {string} text The optional text for the title to display
     * @memberof indexes.IndexFull
     * @description Transition to the title of the next project.
     *
     */
    nextTitle ( $title, text ) {
        gallery.empty();

        if ( $title.length ) {
            overlay.setTitle( (text || $title.data( "title" )) );

            overlay.open();

            core.dom.gallery.element.addClass( "is-title" );

            this.$tile = $title;
        }
    }


    /**
     *
     * @public
     * @instance
     * @method loadIndex
     * @memberof indexes.IndexFull
     * @description Load the full Index JSON to build the UI.
     *
     */
    loadIndex () {
        bar.load();

        router.loadFullIndex( this.onLoadFullIndex.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method loadVideo
     * @param {string} url The vimeo embed url
     * @param {Hobo} $node The grid node in the index
     * @memberof indexes.IndexFull
     * @description Load the vimeo api data for a video injection.
     *
     */
    loadVideo ( url, $node ) {
        const vimeoId = url.split( "/" ).pop();

        core.api.vimeo( vimeoId ).then(( vData ) => {
            this.vimeos[ vimeoId ] = vData;

            $node.data( "vimeoId", vimeoId ).find( ".js-vimeo-image" )
                .removeAttr( "data-img-src" )
                .removeAttr( "data-variants" )
                .removeAttr( "data-original-size" )
                .attr( "src", vData.pictures.sizes[ vData.pictures.sizes.length - 1 ].link );
        });
    }


    /**
     *
     * @public
     * @method onLoadFullIndex
     * @param {object} json The collection json
     * @memberof indexes.IndexFull
     * @description Receive full collections data for an index.
     *
     */
    onLoadFullIndex ( json ) {
        json.collection.collections.forEach(( collection ) => {
            const $title = $( template( _gridTitleTpl.replace( /\n/g, "" ), { text: collection.title, title: (collection.description || collection.title) } ) );
            const $grid = $( _gridWrapTpl.replace( /\n/g, "" ) );
            let $node = null;

            collection.items.forEach(( item ) => {

                if ( item.recordTypeLabel === "text" ) {
                    // Ignore text posts
                } else if ( item.customContent.vimeoVideoUrl ) {
                    // @vimeoVideoUrl
                    $node = $( _gridVideoTpl );

                    $grid.append( $node );

                    this.loadVideo( item.customContent.vimeoVideoUrl, $node );

                } else {
                    $grid.append( template( _gridItemTpl.replace( /\n/g, "" ), item ) );

                    if ( item.customContent && item.customContent.diptychImage && item.customContent.diptychImage.systemDataVariants ) {
                        $grid.append( template( _gridItemTpl.replace( /\n/g, "" ), item.customContent.diptychImage ) );
                    }
                }
            });

            this.$node.append( $title );
            this.$node.append( $grid );
        });

        // Node must be in DOM for image size to work
        this.$target.append( this.$node );

        core.images.handleImages( this.$node.find( ".js-lazy-image" ), () => {
            bar.stop();

            this.cycleAnimation();
        });
    }


    /**
     *
     * @public
     * @instance
     * @method onGalleryImage
     * @param {string} direction The direction to move
     * @memberof indexes.IndexFull
     * @description Trigger gallery arrow key right.
     *
     */
    onGalleryImage ( direction ) {
        if ( direction === Hammer.DIRECTION_LEFT ) {
            this.onKeyDown({
                keyCode: 37
            });

        } else {
            this.onKeyDown({
                keyCode: 39
            });
        }
    }


    /**
     *
     * @public
     * @instance
     * @method onGalleryBack
     * @memberof indexes.IndexFull
     * @description Trigger gallery unbinding.
     *
     */
    onGalleryBack () {
        gallery.empty();

        this.unbindGallery();
    }


    /**
     *
     * @public
     * @instance
     * @method onKeyDown
     * @param {object} e The Event object
     * @memberof indexes.IndexFull
     * @description Handle key events when gallery is open.
     * @returns {boolean}
     *
     */
    onKeyDown ( e ) {
        let text = null;
        let $title = null;
        let $parent = null;
        let $project = null;
        const $next = this.$tile.next();
        const $prev = this.$tile.prev();

        // Escape key
        if ( e.keyCode === 27 ) {
            this.unbindGallery();
            return false;
        }

        // Currently on a Title screen
        // Title screen is using overlay module
        if ( this.$tile.is( ".js-listing-title" ) ) {
            // Arrow right
            if ( e.keyCode === 39 ) {
                $project = this.$tile.next();

                this.nextProject( $project, $project.find( ".js-listing-tile" ).first() );

            // Arrow left
            } else if ( e.keyCode === 37 ) {
                $project = this.$tile.prev();

                if ( $project.length ) {
                    this.nextProject( $project, $project.find( ".js-listing-tile" ).last() );
                }
            }

            core.dom.gallery.element.removeClass( "is-title" );

        // Arrow right, has next tile
        } else if ( e.keyCode === 39 && $next.length ) {
            this.nextTile( $next );

        // Arrow right, has no next tile
        } else if ( e.keyCode === 39 && !$next.length ) {
            this.nextTitle( this.$tile.parent().next() );

        // Arrow left, has prev tile
        } else if ( e.keyCode === 37 && $prev.length ) {
            this.nextTile( $prev );

        // Arrow left, has not prev tile
        } else if ( e.keyCode === 37 && !$prev.length ) {
            text = null;
            $parent = this.$tile.parent();
            $title = $parent.prev().prev().prev();

            // Previous project has a title
            if ( $title.length ) {
                text = $title.data( "title" );
            }

            $title = $parent.prev();

            this.nextTitle( $title, text );
        }
    }


    /**
     *
     * @public
     * @instance
     * @method teardown
     * @memberof indexes.IndexFull
     * @description Undo event bindings for this instance.
     *
     */
    teardown () {
        animator.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default IndexFull;

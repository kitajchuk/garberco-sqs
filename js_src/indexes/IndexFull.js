import * as core from "../core";
import $ from "js_libs/jquery/dist/jquery";
import router from "../router";
import gallery from "../gallery";
import overlay from "../overlay";
import template from "properjs-template";


let instance = null;
const _gridTitleTpl = `<div class="listing__title js-listing-title grid" data-title="{title}"><h4 class="listing__title__text h4">{text}</h4></div>`;
const _gridWrapTpl = `
<div class="listing__grid js-listing-project grid grid--index"></div>
`;
const _gridItemTpl = `
<div class="listing__tile grid__item__small js-listing-tile">
    <div class="grid__photo grid__photo--small animate animate--fade js-animate">
        <figure class="figure">
            <img class="figure__image image js-lazy-image" data-img-src="{assetUrl}" data-variants="{systemDataVariants}" data-original-size="{originalSize}" />
        </figure>
    </div>
</div>
`;


/**
 *
 * @public
 * @class IndexFull
 * @param {jQuery} $node The element
 * @param {object} data The datas
 * @classdesc Handle an index as a Singleton(ish).
 * @memberof indexes
 *
 */
class IndexFull {
    constructor ( $node, data ) {
        if ( !instance || instance && instance.data.id !== data.id ) {
            this.initialize( $node, data );
        }

        return instance;
    }


    /**
     *
     * @public
     * @instance
     * @method initialize
     * @param {jQuery} $node The element
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

        this.bindEvents();
        this.loadIndex();

        instance = this;
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
            this.bindGallery( $( e.currentTarget ) );
        });
    }


    /**
     *
     * @public
     * @instance
     * @method bindGallery
     * @param {jQuery} $elem The tile image that was clicked
     * @memberof indexes.IndexFull
     * @description Bind active gallery view.
     *
     */
    bindGallery ( $elem ) {
        this.$tile = $elem;
        this.$image = this.$tile.find( core.config.lazyImageSelector );

        gallery.setImage( this.$image );

        core.dom.doc.on( "keydown", ( e ) => {
            //e.preventDefault();

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

                    this.nextProject( $project, $project.find( ".js-listing-tile" ).last() );
                }

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
        });
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

        core.dom.doc.off( "keydown" );
    }


    /**
     *
     * @public
     * @instance
     * @method nextProject
     * @param {jQuery} $project The project grid
     * @param {jQuery} $tile The tile image to load in gallery
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
     * @param {jQuery} $title The title element
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

            this.$tile = $title;
        }
    }


    /**
     *
     * @public
     * @instance
     * @method nextTile
     * @param {jQuery} $tile The tile element
     * @memberof indexes.IndexFull
     * @description Transition to the next tile in a project.
     *
     */
    nextTile ( $tile ) {
        // Tile?
        this.$tile = $tile;

        // Image?
        this.$image = this.$tile.find( core.config.lazyImageSelector );

        gallery.setImage( this.$image );
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
        router.loadFullIndex( this.onLoadFullIndex.bind( this ) );
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

            collection.items.forEach(( item ) => {
                $grid.append( template( _gridItemTpl.replace( /\n/g, "" ), item ) );

                // @note:
                // @todo: Keep this `systemDataVariants` condition in until we re-upload these 3 images
                // /a-girl-named-georges/           diaplayIndex: 1
                // /woolrich-made-in-usa/           displayIndex: 1
                // /nike-running-free-designers/    displayIndex: 5
                if ( item.customContent && item.customContent.diptychImage && item.customContent.diptychImage.systemDataVariants ) {
                    $grid.append( template( _gridItemTpl.replace( /\n/g, "" ), item.customContent.diptychImage ) );
                }
            });

            this.$node.append( $title );
            this.$node.append( $grid );
        });

        // Node must be in DOM for image size to work
        this.$target.append( this.$node );

        core.images.handleImages( this.$node.find( ".js-lazy-image" ), () => {
            core.emitter.fire( "app--update-animate" );
        });
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof indexes.IndexFull
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {
        core.dom.doc.off( "keydown" );
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default IndexFull;
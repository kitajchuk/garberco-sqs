import * as core from "../core";
import $ from "js_libs/jquery/dist/jquery";
import router from "../router";
import gallery from "../gallery";
import template from "properjs-template";


let instance = null;
const _gridTitleTpl = `<div class="listing__title grid"><h4 class="listing__title__text h4">{title}</h4></div>`;
const _gridWrapTpl = `
<div class="listing__grid grid grid--index"></div>
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
 *
 */
class IndexFull {
    constructor ( $node, data ) {
        if ( !instance || instance && instance.data.id !== data.id ) {
            this.initialize( $node, data );
        }

        console.log( "IndexFull", this );

        return instance;
    }


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


    bindEvents () {
        this.$node.on( "click", ".js-listing-tile", ( e ) => {
            this.bindGallery( $( e.currentTarget ) );
        });
    }


    bindGallery ( $elem ) {
        this.$tile = $elem;
        this.$image = this.$tile.find( core.config.lazyImageSelector );

        gallery.setImage( this.$image );

        core.dom.doc.on( "keydown", ( e ) => {
            let $tile = null;
            let $image = null;

            // Arrow right
            if ( e.keyCode === 39 ) {
                $tile = this.$tile.next();

            // Arrow left
            } else if ( e.keyCode === 37 ) {
                $tile = this.$tile.prev();

            // ESC key
            } else if ( e.keyCode === 27 ) {
                this.unbindGallery();
                return false;
            }

            // Hook into projects here
            // Need to know if we are going from one project to another either way
            // Need to show project title if we are switching to a new project

            // Tile is not null ?
            if ( $tile ) {
                e.preventDefault();

                // Tile has an element
                if ( $tile.length ) {
                    $image = $tile.find( core.config.lazyImageSelector );

                    this.$tile = $tile;
                    this.$image = $image;

                    gallery.setImage( $image );
                }
            }
        });
    }


    unbindGallery () {
        this.$tile = null;
        this.$image = null;

        gallery.close();

        core.dom.doc.off( "keydown" );
    }


    loadIndex () {
        router.loadFullIndex( this.onLoadFullIndex.bind( this ) );
    }


    /**
     *
     * @public
     * @method onLoadFullIndex
     * @param {object} json The collection json
     * @memberof menus
     * @description Receive full collections data for an index.
     *
     */
    onLoadFullIndex ( json ) {
        json.collection.collections.forEach(( collection ) => {
            const $title = $( template( _gridTitleTpl.replace( /\n/g, "" ), collection ) );
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
     * @memberof IndexFull
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default IndexFull;
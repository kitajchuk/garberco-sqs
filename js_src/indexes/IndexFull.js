import * as core from "../core";
import $ from "js_libs/jquery/dist/jquery";
import router from "../router";
import template from "properjs-template";


let instance = null;
const _gridTitleTpl = `<h4 class="h4">{title}</h4>`;
const _gridWrapTpl = `
<div class="grid grid--index"></div>
`;
const _gridItemTpl = `
<div class="grid__item__small">
    <div class="grid__photo grid__photo--small js-listing-tile animate js-animate">
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

        return instance;
    }


    initialize ( $node, data ) {
        this.$node = $node;
        this.data = data;
        this.$target = core.dom.main.find( `.js-main--${this.data.target}` );

        router.loadFullIndex( this.onLoadFullIndex.bind( this ) );

        instance = this;
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
            });

            this.$node.append( $title );
            this.$node.append( $grid );
        });

        this.$target.append( this.$node );

        core.images.handleImages( this.$node.find( ".js-lazy-image" ), () => {
            core.util.emitter.fire( "app--update-animate" );
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
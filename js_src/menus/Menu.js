import * as core from "../core";


const instances = {};


/**
 *
 * @public
 * @class Menu
 * @param {jQuery} $node The element
 * @param {object} data The datas
 * @classdesc Handle an index.
 *
 */
class Menu {
    constructor ( $node, data ) {
        if ( !instances[ data.id ] ) {
            this.initialize( $node, data );
        }

        console.log( "Menu", this );

        return instances[ data.id ];
    }


    initialize ( $node, data ) {
        this.$node = $node;
        this.data = data;
        this.transTime = 400;
        this.$target = core.dom.main.find( `.js-main--${this.data.target}` );
        this.$anim = this.$node.find( ".js-animate-in" );
        this.$images = this.$node.find( ".js-lazy-image" );

        instances[ data.id ] = this;

        core.images.handleImages( this.$images, this.onPreload.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method onPreload
     * @memberof IndexClass
     * @description Handle loaded index grid.
     *
     */
    onPreload () {
        this.$target.html( this.$node );

        setTimeout(() => {
            this.$anim.addClass( "is-active" );

        }, this.transTime );
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof Menu
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Menu;
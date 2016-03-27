import * as core from "../core";


const instances = {};


/**
 *
 * @public
 * @class Menu
 * @param {jQuery} $node The element
 * @param {object} data The datas
 * @classdesc Handle a menu view.
 * @memberof menus
 *
 */
class Menu {
    constructor ( $node, data ) {
        if ( !instances[ data.id ] ) {
            this.initialize( $node, data );
        }

        return instances[ data.id ];
    }


    /**
     *
     * @public
     * @instance
     * @method initialize
     * @param {jQuery} $node The element
     * @param {object} data The datas
     * @memberof menus.Menu
     * @description Perform instance bootstrap actions.
     *
     */
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
     * @memberof menus.Menu
     * @description Handle preloaded images.
     *
     */
    onPreload () {
        this.$target.append( this.$node );

        setTimeout(() => {
            this.$anim.addClass( "is-active" );

        }, this.transTime );
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof menus.Menu
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Menu;
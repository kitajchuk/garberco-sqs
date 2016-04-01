import * as core from "../core";


let instance = null;


/**
 *
 * @public
 * @class About
 * @param {jQuery} $node The element
 * @param {object} data The datas
 * @classdesc Handle a menu view.
 * @memberof menus
 *
 */
class About {
    constructor ( $node, data ) {
        if ( !instance ) {
            this.initialize( $node, data );
        }

        core.dom.html.addClass( "is-offcanvas" );

        return instance;
    }


    /**
     *
     * @public
     * @instance
     * @method initialize
     * @param {jQuery} $node The element
     * @param {object} data The datas
     * @memberof menus.About
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

        instance = this;

        core.images.handleImages( this.$images, this.onPreload.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method onPreload
     * @memberof menus.About
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
     * @memberof menus.About
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default About;
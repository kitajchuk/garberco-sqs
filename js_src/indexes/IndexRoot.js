import * as core from "../core";


let instance = null;


/**
 *
 * @public
 * @class IndexRoot
 * @param {jQuery} $node The element
 * @param {object} data The datas
 * @classdesc Handle an index as a Singleton(ish).
 *
 */
class IndexRoot {
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
        this.$images = this.$node.find( ".js-lazy-image" );

        // Node must be in DOM for image size to work
        this.$target.html( this.$node );

        core.images.handleImages( this.$images, () => {
            core.emitter.fire( "app--update-animate" );
        });

        instance = this;
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof IndexRoot
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default IndexRoot;
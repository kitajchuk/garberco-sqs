import * as core from "../core";


let instance = null;


/**
 *
 * @public
 * @class IndexClass
 * @param {jQuery} $node The element
 * @param {object} data The datas
 * @classdesc Handle an index.
 *
 */
class IndexClass {
    constructor ( $node, data ) {
        if ( instance && instance.data.id === data.id ) {
            return instance;
        }

        this.$node = $node;
        this.data = data;
        this.$target = core.dom.main.find( `.js-main--${this.data.target}` );
        this.$images = this.$node.find( ".js-lazy-image" );

        core.images.handleImages( this.$images, this.onPreload.bind( this ) );

        instance = this;
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

        core.util.emitter.fire( "app--update-animate" );
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof IndexClass
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {
        //instance = null;
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default IndexClass;
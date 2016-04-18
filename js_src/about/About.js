import * as core from "../core";


let instance = null;


/**
 *
 * @public
 * @class About
 * @param {Hobo} $node The element
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

        return instance;
    }


    /**
     *
     * @public
     * @instance
     * @method initialize
     * @param {Hobo} $node The element
     * @param {object} data The datas
     * @memberof about.About
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

        this.loadContent();

        instance = this;
    }


    /**
     *
     * @public
     * @instance
     * @method loadContent
     * @memberof about.About
     * @description Handle content.
     *
     */
    loadContent () {
        this.$target.append( this.$node );

        setTimeout(() => {
            this.$anim.addClass( "is-active" );

        }, 10 );

        core.emitter.fire( "app--preload-done" );
    }


    /**
     *
     * @public
     * @instance
     * @method teardown
     * @memberof about.About
     * @description Undo event bindings for this instance.
     *
     */
    teardown () {}
}



/******************************************************************************
 * Export
*******************************************************************************/
export default About;
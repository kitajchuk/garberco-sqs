import $ from "js_libs/hobo/dist/hobo.build";
import * as core from "../core";
import router from "../router";
import Project from "../projects/Project";
import overlay from "../overlay";
import Controller from "properjs-controller";


let instance = null;
const animator = new Controller();


/**
 *
 * @public
 * @class IndexRoot
 * @param {Hobo} $node The element
 * @param {object} data The datas
 * @classdesc Handle an index as a Singleton(ish).
 * @memberof indexes
 *
 */
class IndexRoot {
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
     * @param {Hobo} $node The element
     * @param {object} data The datas
     * @memberof indexes.IndexRoot
     * @description Perform instance bootstrap actions.
     *
     */
    initialize ( $node, data ) {
        this.$node = $node;
        this.data = data;
        this.$target = core.dom.main.find( `.js-main--${this.data.target}` );
        this.$images = this.$node.find( ".js-lazy-image" );
        this.timeoutId = null;
        this.timeoutDelay = core.dom.overlay.elementTransitionDuration;

        this.bindEvents();
        this.loadIndex();

        instance = this;
    }


    /**
     *
     * @public
     * @instance
     * @method cycleAnimation
     * @memberof indexes.IndexRoot
     * @description Start the animation cycle for the listing.
     *
     */
    cycleAnimation () {
        // Fresh query for js- animatable elements each time
        this.$anims = this.$node.find( ".js-animate" );

        // If pathname is not the `root` we shant not start raf cycle
        if ( window.location.pathname === router.root ) {
            animator.stop();
            animator.go( this.updateAnimate.bind( this ) );

        } else {
            this.updateAnimate();
        }
    }


    /**
     *
     * @public
     * @instance
     * @method updateAnimate
     * @memberof indexes.IndexRoot
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
     * @memberof indexes.IndexRoot
     * @description Bind event handlers for this instance.
     *
     */
    bindEvents () {
        core.dom.body.on( "click", ".js-index-tile", this.onTileClick.bind( this ) );

        if ( !core.detect.isDevice() ) {
            core.dom.body.on( "mouseenter", ".js-index-tile img", this.onMouseEnter.bind( this ) );
            core.dom.body.on( "mousemove", ".js-index-tile img", this.onMouseEnter.bind( this ) );
            core.dom.body.on( "mouseleave", ".js-index-tile img", this.onMouseLeave.bind( this ) );
        }
    }


    /**
     *
     * @public
     * @instance
     * @method loadIndex
     * @memberof indexes.IndexRoot
     * @description Handle loading process for this instance.
     *
     */
    loadIndex () {
        // Node must be in DOM for image size to work
        this.$target.append( this.$node );

        core.images.handleImages( this.$images, () => {
            this.cycleAnimation();
        });
    }


    /**
     *
     * @public
     * @instance
     * @method onTileClick
     * @param {object} e The Event object
     * @memberof indexes.IndexRoot
     * @description Handle project grid tile clicks - loads a new Project.
     *
     */
    onTileClick ( e ) {
        e.preventDefault();

        const $tile = $( e.target ).closest( ".js-index-tile" );

        overlay.setTitle( $tile.data( "title" ) );

        overlay.open();

        Project.open();
    }


    /**
     *
     * @public
     * @instance
     * @method onMouseEnter
     * @param {object} e The Event object
     * @memberof indexes.IndexRoot
     * @description Handle showing title on mouse enter grid tile.
     *
     */
    onMouseEnter ( e ) {
        try {
            clearTimeout( this.timeoutId );

        } catch ( error ) {
            core.log( "warn", error );
        }

        if ( Project.isActive() ) {
            return;
        }

        const $tile = $( e.target ).closest( ".js-index-tile" );

        overlay.setTitle( $tile.data( "title" ) );

        overlay.open();
    }


    /**
     *
     * @public
     * @instance
     * @method onMouseLeave
     * @memberof indexes.IndexRoot
     * @description Handle removing title on mouse leave grid tile.
     *
     */
    onMouseLeave () {
        if ( Project.isActive() ) {
            return;
        }

        this.timeoutId = setTimeout(() => {
            if ( !Project.isActive() ) {
                overlay.close();
            }

        }, this.timeoutDelay );
    }


    /**
     *
     * @public
     * @instance
     * @method teardown
     * @memberof indexes.IndexRoot
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
export default IndexRoot;
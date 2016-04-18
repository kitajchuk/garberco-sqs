import * as core from "./core";
import Tween from "properjs-tween";
import Easing from "properjs-easing";
import $ from "js_libs/hobo/dist/hobo.build";


let _instance = null;
const $_jsBar = $( '<div class="bar"><div class="bar__inner"></div></div>' );
const $_jsInner = $_jsBar.find( ".bar__inner" );


/**
 *
 * @private
 * @class Bar
 * @classdesc Shimmed load bars set a high initial animation duration
 *            that can be stopped and completed upon request.
 * @memberof loading
 *
 */
class Bar {
    constructor () {
        this.tween = null;
        this.timeout = 5000;
    }


    /**
     *
     * @instance
     * @method append
     * @memberof loading.Bar
     * @description Append the element to the DOM.
     *
     */
    append () {
        core.dom.body.append( $_jsBar );
    }


    /**
     *
     * @instance
     * @method load
     * @memberof loading.Bar
     * @description Initialize the load bar ui for progress shim.
     *
     */
    load () {
        this.append();

        this.tween = new Tween({
            from: 0,
            to: window.innerWidth,
            update: this.update.bind( this ),
            complete: this.update.bind( this ),
            ease: Easing.easeInOutCubic,
            duration: this.timeout
        });
    }


    /**
     *
     * @instance
     * @method stop
     * @param {function} callback The function to call when Tween is complete
     * @memberof loading.Bar
     * @description Terminate the load bar animation.
     *
     */
    stop ( callback ) {
        this.tween.stop();
        this.tween = new Tween({
            from: this.getFrom(),
            to: window.innerWidth,
            update: this.update.bind( this ),
            complete: this.complete.bind( this, callback ),
            ease: Easing.easeInOutCubic,
            duration: 50
        });
    }


    /**
     *
     * @instance
     * @method update
     * @param {number} value The new value to tween to
     * @memberof loading.Bar
     * @description Animate/Tween the load bar ui.
     *
     */
    update ( value ) {
        $_jsInner[ 0 ].style.width = core.util.px( value );
    }


    /**
     *
     * @instance
     * @method complete
     * @param {function} callback The function to call when transition is complete
     * @memberof loading.Bar
     * @description Complete the load bar ui sequence and detach the node.
     *
     */
    complete ( callback ) {
        $_jsBar.addClass( "is-done" );

        setTimeout( () => {
            $_jsBar
                .detach()
                .removeClass( "is-done" );
            $_jsInner.attr( "style", "" );

            callback();

        }, core.util.getTransitionDuration( $_jsBar[ 0 ] ) );
    }


    /**
     *
     * @instance
     * @method getFrom
     * @memberof loading.Bar
     * @description Get the current value to tween from.\
     * @returns {number}
     *
     */
    getFrom () {
        return $_jsInner[ 0 ].clientWidth;
    }
}


/**
 *
 * @public
 * @namespace bar
 * @description Performs a loader bar interaction.
 * @memberof loading
 *
 */
const bar = {
    /**
     *
     * @public
     * @method load
     * @param {string} position The placement position for the load bar.
     * @param {string} color The optional color tone for the load bar.
     * @memberof loading.bar
     * @description Shims a "loading" progress bar based on... nothing!
     *
     */
    load ( position, color ) {
        _instance = new Bar( position, color );
        _instance.load();
    },


    /**
     *
     * @public
     * @method stop
     * @memberof loading.bar
     * @description Stops load bar animation and removes the bar instance.
     *
     */
    stop () {
        if ( _instance ) {
            _instance.stop(() => {
                _instance = null;
            });
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default bar;
import throttle from "properjs-throttle";
import debounce from "properjs-debounce";
import * as util from "./util";
import log from "./log";


const _throttled = 50;
const _debounced = 300;


/**
 *
 * @public
 * @module resizes
 * @description Handles app-wide emission of various resize detection events.
 *
 */
const resizes = {
    /**
     *
     * @public
     * @method init
     * @memberof resizes
     * @description Method binds event listeners for resize controller.
     *
     */
    init () {
        util.resizer.on( "resize", throttle( onThrottle, _throttled ) );

        // Hook into resize of `width` only for this handler
        // @bug: iOS window size changes when Safari's chrome switches between full and minimal-ui.
        util.resizer.on( "resizewidth", debounce( onDebounce, _debounced ) );

        log( "resizes initialized" );
    }
};


/**
 *
 * @private
 * @method onDebounce
 * @memberof resizes
 * @description Debounced resize events.
 *
 */
const onDebounce = function () {
    util.emitter.fire( "app--resize-debounced" );

    util.updateImages();
};


/**
 *
 * @private
 * @method onThrottle
 * @memberof resizes
 * @description Method handles the window resize event via [ResizeController]{@link https://github.com/ProperJS/ResizeController}.
 *
 */
const onThrottle = function () {
    util.emitter.fire( "app--resize" );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default resizes;
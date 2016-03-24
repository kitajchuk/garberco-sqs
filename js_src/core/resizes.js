import log from "./log";
import * as util from "./util";
import emitter from "./emitter";
import resizer from "./resizer";
import throttle from "properjs-throttle";
import debounce from "properjs-debounce";


const _throttled = 50;
const _debounced = 300;


/**
 *
 * @public
 * @namespace resizes
 * @memberof core
 * @description Handles app-wide emission of various resize detection events.
 *
 */
const resizes = {
    /**
     *
     * @public
     * @method init
     * @memberof core.resizes
     * @description Method binds event listeners for resize controller.
     *
     */
    init () {
        resizer.on( "resize", throttle( onThrottle, _throttled ) );

        // Hook into resize of `width` only for this handler
        // @bug: iOS window size changes when Safari's chrome switches between full and minimal-ui.
        resizer.on( "resizewidth", debounce( onDebounce, _debounced ) );

        log( "resizes initialized" );
    }
};


/**
 *
 * @private
 * @method onDebounce
 * @memberof core.resizes
 * @description Debounced resize events.
 *
 */
const onDebounce = function () {
    emitter.fire( "app--resize-debounced" );

    util.updateImages();
};


/**
 *
 * @private
 * @method onThrottle
 * @memberof core.resizes
 * @description Method handles the window resize event via [ResizeController]{@link https://github.com/ProperJS/ResizeController}.
 *
 */
const onThrottle = function () {
    emitter.fire( "app--resize" );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default resizes;
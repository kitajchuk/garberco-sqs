import dom from "./dom";
import log from "./log";


/**
 *
 * @public
 * @module detect
 * @description Handles basic detection of touch devices.
 *
 */
const detect = {
    /**
     *
     * @public
     * @method init
     * @memberof detect
     * @description Initializes the detect module.
     *
     */
    init () {
        this._isTouch = ("ontouchstart" in window) || (window.DocumentTouch && document instanceof window.DocumentTouch);
        this._isMobile = (/Android|BlackBerry|iPhone|iPad|iPod|IEMobile|Opera Mini/gi.test( window.navigator.userAgent ));

        if ( this._isTouch ) {
            dom.html.addClass( "is-touchable" );

        } else {
            dom.html.addClass( "is-hoverable" );
        }

        log( "detect initialized" );
    },


    /**
     *
     * @public
     * @method isMobile
     * @memberof detect
     * @description Check for high-end mobile device user agents.
     * @returns {boolean}
     *
     */
    isMobile () {
        return this._isMobile;
    },


    /**
     *
     * @public
     * @method isTouch
     * @memberof detect
     * @description Check whether this is a touch device or not.
     * [See Modernizr]{@link https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js}
     * @returns {boolean}
     *
     */
    isTouch () {
        return this._isTouch;
    },


    /**
     *
     * @public
     * @method isDevice
     * @memberof detect
     * @description Must be `isMobile` and `isTouch`.
     * @returns {boolean}
     *
     */
    isDevice () {
        return (this.isTouch() && this.isMobile());
    },


    /**
     *
     * @public
     * @method isStandalone
     * @memberof detect
     * @description Must be window.standalone.
     * @returns {boolean}
     *
     */
    isStandalone () {
        return ("standalone" in window);
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default detect;
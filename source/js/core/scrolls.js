import dom from "./dom";
import log from "./log";
import detect from "./detect";
import emitter from "./emitter";
import scroller from "./scroller";


let _timeout = null;
let _isSuppressed = false;
let _isSuppressedEvents = false;
const _idleout = 300;


/**
 *
 * @public
 * @namespace scrolls
 * @memberof core
 * @description Handles app-wide emission of various scroll detection events.
 *
 */
const scrolls = {
    /**
     *
     * @public
     * @method init
     * @memberof core.scrolls
     * @description Method runs once when window loads.
     *
     */
    init () {
        scroller.on( "scroll", onScroller );
        scroller.on( "scrollup", onScrollerUp );
        scroller.on( "scrolldown", onScrollerDown );

        onScroller();

        this.topout();

        log( "scrolls initialized" );
    },


    /**
     *
     * @public
     * @method topout
     * @param {number} top Optionally, the scroll position to apply
     * @memberof core.scrolls
     * @description Method set scroll position to argument value or zero.
     *
     */
    topout ( top ) {
        top = top || 0;

        window.scrollTo( 0, top );
    },


    /**
     *
     * @public
     * @method suppress
     * @param {boolean} bool Whether or not to suppress
     * @memberof core.scrolls
     * @description Method will suppress scroll position broadcasting.
     *
     */
    suppress ( bool ) {
        _isSuppressed = bool;
    },


    /**
     *
     * @public
     * @method clearStates
     * @memberof core.scrolls
     * @description Method removes all applied classNames from this module
     *
     */
    clearStates () {
        dom.html.removeClass( "is-scrolling-up is-scrolling-down is-scrolling" );
    },


    /**
     *
     * @public
     * @method isScrollInRange
     * @memberof core.scrolls
     * @description Method determines if scroll is within range
     * @returns {boolean}
     *
     */
    isScrollInRange () {
        const scrollPos = scroller.getScrollY();

        return (scrollPos > 0 || scrollPos < scroller.getScrollMax());
    },


    /**
     *
     * @public
     * @method isScrollOutOfRange
     * @memberof core.scrolls
     * @description Method determines if scroll is out of range
     * @returns {boolean}
     *
     */
    isScrollOutOfRange () {
        const scrollPos = scroller.getScrollY();

        return (scrollPos <= 0 || scrollPos >= scroller.getScrollMax());
    }
};


/**
 *
 * @private
 * @method broadcast
 * @param {string} event The scroll event to emit
 * @param {number} position The current scroll position
 * @memberof core.scrolls
 * @description Method will emit scroll position information.
 *
 */
const broadcast = function ( event, position ) {
    if ( _isSuppressed ) {
        return;
    }

    emitter.fire( event, position );
};


/**
 *
 * @private
 * @method suppressEvents
 * @param {number} scrollPos The current scrollY position
 * @memberof core.scrolls
 * @description Method applies className to disable events while scrolling
 *
 */
const suppressEvents = function ( scrollPos ) {
    if ( detect.isStandalone() ) {
        return;
    }

    try {
        clearTimeout( _timeout );

    } catch ( error ) {
        log( error );
    }

    if ( !_isSuppressedEvents ) {
        _isSuppressedEvents = true;

        dom.html.addClass( "is-scrolling" );

        broadcast( "app--scroll-start", scrollPos );
    }

    _timeout = setTimeout( () => {
        if ( scrollPos === scroller.getScrollY() ) {
            _isSuppressedEvents = false;

            dom.html.removeClass( "is-scrolling" );

            broadcast( "app--scroll-end", scrollPos );
        }

    }, _idleout );
};


/**
 *
 * @private
 * @method onScrollerUp
 * @memberof core.scrolls
 * @description Method handles upward scroll event
 *
 */
const onScrollerUp = function () {
    if ( !scrolls.isScrollInRange() || detect.isStandalone() ) {
        return;
    }

    const scrollPos = scroller.getScrollY();

    broadcast( "app--scroll-up", scrollPos );

    dom.html.removeClass( "is-scrolling-down" ).addClass( "is-scrolling-up" );
};


/**
 *
 * @private
 * @method onScrollerDown
 * @memberof core.scrolls
 * @description Method handles downward scroll event
 *
 */
const onScrollerDown = function () {
    if ( !scrolls.isScrollInRange() || detect.isStandalone() ) {
        return;
    }

    const scrollPos = scroller.getScrollY();

    broadcast( "app--scroll-down", scrollPos );

    dom.html.removeClass( "is-scrolling-up" ).addClass( "is-scrolling-down" );
};


/**
 *
 * @private
 * @method onScroller
 * @memberof core.scrolls
 * @description Method handles regular scroll event via [ScrollController]{@link https://github.com/ProperJS/ScrollController}
 *
 */
const onScroller = function () {
    if ( !scrolls.isScrollInRange() || detect.isStandalone() ) {
        return;
    }

    const scrollPos = scroller.getScrollY();

    suppressEvents( scrollPos );

    broadcast( "app--scroll", scrollPos );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default scrolls;
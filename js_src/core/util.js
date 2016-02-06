/**
 *
 * @public
 * @module util
 * @description Houses app-wide utility methods.
 *
 */


import $ from "js_libs/jquery/dist/jquery";
import Hammer from "hammerjs";
import Controller from "properjs-controller";
import ScrollController from "properjs-scrollcontroller";
import ResizeController from "properjs-resizecontroller";
import ImageLoader from "properjs-imageloader";
import MediaBox from "properjs-mediabox";
import loadCSS from "fg-loadcss";
import loadJS from "fg-loadjs";
import dom from "./dom";
import config from "./config";
import detect from "./detect";


/**
 *
 * @description Don't prevent default for <a /> nodes with Hammer...
 * @method safePreventDefault
 * @param {object} e The event object
 *
 */
const safePreventDefault = function ( e ) {
    if ( e.target.nodeName !== "A" ) {
        e.preventDefault();
    }
};


/**
 *
 * @description Noop a preventDefault() for event handlers
 * @method preNoop
 * @param {object} e The event object
 * @returns {boolean}
 *
 */
const preNoop = function ( e ) {
    e.preventDefault();
    return false;
};


/**
 *
 * @description Add pixel units when inline styling
 * @method px
 * @param {string} str The value to pixel-ify
 * @memberof util
 * @returns {string}
 *
 */
const px = function ( str ) {
    return `${str}px`;
};


/**
 *
 * @description Apply a translate3d transform
 * @method translate3d
 * @param {object} el The element to transform
 * @param {string|number} x The x value
 * @param {string|number} y The y value
 * @param {string|number} z The z value
 * @memberof util
 *
 */
const translate3d = function ( el, x, y, z ) {
    el.style[ Hammer.prefixed( el.style, "transform" ) ] = `translate3d( ${x}, ${y}, ${z} )`;
};


/**
 *
 * @description Single app instanceof [MediaBox]{@link https://github.com/ProperJS/MediaBox} for custom audio/video
 * @member mediabox
 * @memberof util
 *
 */
const mediabox = new MediaBox();


/**
 *
 * @description Single app instanceof [Controller]{@link https://github.com/ProperJS/Controller} for arbitrary event emitting
 * @member emitter
 * @memberof util
 *
 */
const emitter = new Controller();


/**
 *
 * @description Single app instanceof [ScrollController]{@link https://github.com/ProperJS/ScrollController}
 * @member scroller
 * @memberof util
 *
 */
const scroller = new ScrollController();


/**
 *
 * @description Single app instanceof [ResizeController]{@link https://github.com/ProperJS/ResizeController}
 * @member resizer
 * @memberof util
 *
 */
const resizer = new ResizeController();


/**
 *
 * @description Module onImageLoadHander method, handles event
 * @method isElementLoadable
 * @param {object} el The DOMElement to check the offset of
 * @memberof util
 * @returns {boolean}
 *
 */
const isElementLoadable = function ( el ) {
    if ( el ) {
        const bounds = el.getBoundingClientRect();

        return ( bounds.top < (window.innerHeight * 2) );
    }
};


/**
 *
 * @description Module isElementInViewport method, handles element boundaries
 * @method isElementInViewport
 * @param {object} el The DOMElement to check the offsets of
 * @memberof util
 * @returns {boolean}
 *
 */
const isElementInViewport = function ( el ) {
    if ( el ) {
        const bounds = el.getBoundingClientRect();

        return ( bounds.top < window.innerHeight && bounds.bottom > 0 );
    }
};


/**
 *
 * @method getClosestValue
 * @memberof util
 * @param {array} arr The array to process
 * @param {number} closestTo The number to get close to
 * @description Get closest number value without going under
 * @returns {number}
 *
 */
const getClosestValue = function ( arr, closestTo ) {
    // Get the highest number in arr in case it matches nothing.
    let close = Math.max.apply( null, arr );
    let i = arr.length;

    for ( i; i--; ) {
        // Check if it's higher than your number, but lower than your closest value
        if ( arr[ i ] >= closestTo && arr[ i ] < close ) {
            close = arr[ i ];
        }
    }

    return close;
};


const getElementsInView = function ( $nodes ) {
    let i = $nodes.length;
    const $ret = $( [] );

    for ( i; i--; ) {
        if ( isElementLoadable( $nodes[ i ] ) ) {
            $ret.push( $nodes[ i ] );
        }
    }

    return $ret;
};


/**
 *
 * @description Update images that have already been loaded
 * @method updateImages
 * @param {jQuery} images The optional argument passed collection to reload
 * @memberof util
 *
 */
const updateImages = function ( images ) {
    images = (images || $( `[${config.imageLoaderAttr}]` ));

    if ( images.length ) {
        images.removeAttr( config.imageLoaderAttr );

        loadImages( images, noop );
    }
};


/**
 *
 * @description Fresh query to lazyload images on page
 * @method loadImages
 * @param {object} images Optional collection of images to load
 * @param {function} handler Optional handler for load conditions
 * @param {boolean} useVariant Optional flag to skip loading size variants
 * @memberof util
 * @returns {instance}
 *
 */
const loadImages = function ( images, handler, useVariant ) {
    const map = function ( vnt ) {
        return parseInt( vnt, 10 );
    };
    let $img = null;
    let data = null;
    let vars = null;
    let width = null;
    let variant = null;
    let i = null;

    // Normalize the handler
    handler = (handler || isElementLoadable);

    // Normalize the images
    images = (images || $( config.lazyImageSelector ));

    // Normalize the `useVariant` flag
    if ( !useVariant && useVariant !== false ) {
        useVariant = true;
    }

    // Get the right size image from Squarespace
    // http://developers.squarespace.com/using-the-imageloader/
    // Depending on the original upload size, we have these variants
    // {original, 1500w, 1000w, 750w, 500w, 300w, 100w}
    i = images.length;

    for ( i; i--; ) {
        $img = images.eq( i );
        data = $img.data();
        width = ($img.parent()[ 0 ].clientWidth || window.innerWidth || config.sqsMaxImgWidth);

        data.imgSrc = data.imgSrc.replace( /\?(.*)$/, "" );

        if ( useVariant && data.variants ) {
            vars = data.variants.split( "," ).map( map );
            variant = getClosestValue( vars, width );

            // If the pixel density is higher, use a larger image ?
            if ( window.devicePixelRatio > 1 ) {
                // Splice off the variant that was matched
                vars.splice( vars.indexOf( variant, 1 ) );

                // Apply the new, larger variant as the format
                variant = getClosestValue( vars, variant );
            }

            $img.attr( config.lazyImageAttr, `${data.imgSrc}?format=${variant}w` );

        } else {
            $img.attr( config.lazyImageAttr, `${data.imgSrc}?format=original` );
        }
    }

    return new ImageLoader({
        elements: images,
        property: config.lazyImageAttr,
        transitionDelay: 0

    }).on( "data", handler );
};


/**
 *
 * @description Load all deps for a module
 * @method loadDependencies
 * @param {object} data The dependency data
 * @param {function} callback Function to call when all deps are loaded
 * @memberof util
 *
 */
const loadDependencies = function ( data, callback ) {
    let i = 0;
    const total = data.sources.length;
    const onload = function () {
        i++;

        if ( i === total ) {
            console.log( "dependencies loaded", data );

            if ( typeof data.callback === "function" ) {
                data.callback();
            }

            if ( typeof callback === "function" ) {
                callback();
            }
        }
    };

    data.sources.forEach(( source ) => {
        if ( source.type === "script" ) {
            loadJS( (config.asyncScriptPath + source.file), onload );

        } else if ( source.type === "style" ) {
            loadCSS( (config.asyncStylePath + source.file) ).onloadcssdefined( onload );
        }
    });
};


/**
 *
 * @description Toggle on/off scrollability
 * @method disableMouseWheel
 * @param {boolean} enable Flag to enable/disable
 * @memberof util
 *
 */
const disableMouseWheel = function ( enable ) {
    if ( enable ) {
        dom.doc.on( "DOMMouseScroll mousewheel", preNoop );

    } else {
        dom.doc.off( "DOMMouseScroll mousewheel" );
    }
};


/**
 *
 * @description Toggle on/off touch movement
 * @method disableTouchMove
 * @param {boolean} enable Flag to enable/disable
 * @memberof util
 *
 */
const disableTouchMove = function ( enable ) {
    if ( enable ) {
        dom.doc.on( "touchmove", preNoop );

    } else {
        dom.doc.off( "touchmove" );
    }
};


/**
 *
 * @description Get the applied transition duration from CSS
 * @method getTransitionDuration
 * @param {object} el The DOMElement
 * @memberof util
 * @returns {number}
 *
 */
const getTransitionDuration = function ( el ) {
    let ret = 0;
    let duration = null;
    let isSeconds = false;
    let multiplyBy = 1000;

    if ( el ) {
        duration = getComputedStyle( el )[ Hammer.prefixed( el.style, "transition-duration" ) ];
        isSeconds = duration.indexOf( "ms" ) === -1;
        multiplyBy = isSeconds ? 1000 : 1;

        ret = parseFloat( duration ) * multiplyBy;
    }

    return ret;
};


/**
 *
 * @description All true all the time
 * @method noop
 * @memberof util
 * @returns {boolean}
 *
 */
const noop = function () {
    return true;
};


/**
 *
 * @description Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 * @method shuffle
 * @param {object} arr The array to shuffle
 * @memberof util
 * @returns {array}
 *
 */
const shuffle = function ( arr ) {
    let i = arr.length - 1;
    let j = 0;
    let temp = arr[ i ];

    for ( i; i > 0; i-- ) {
        j = Math.floor( Math.random() * (i + 1) );
        temp = arr[ i ];

        arr[ i ] = arr[ j ];
        arr[ j ] = temp;
    }

    return arr;
};


/**
 *
 * @description Parse a floating point time value into a distinguished time representation
 * @method parseTime
 * @param {float} time The floating point time value
 * @memberof util
 * @returns {string}
 *
 */
const parseTime = function ( time ) {
    time *= 1000;

    const minutes = parseInt( time / (1000 * 60), 10 );
    let seconds = parseInt( time / 1000, 10) % 60;

    if ( seconds < 10 ) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
};


/**
 *
 * @method getDefaultHammerOptions
 * @memberof util
 * @description The default options for Hammer JS.
 *              Disables cssProps for non-touch experiences.
 * @returns {object}
 *
 */
const getDefaultHammerOptions = function () {
    return detect.isDevice() ? {} : {
        cssProps: {
            contentZoomingString: false,
            tapHighlightColorString: false,
            touchCalloutString: false,
            touchSelectString: false,
            userDragString: false,
            userSelectString: false
        }
    };
};


const getPageKey = function () {
    return `${window.location.pathname}${window.location.search}`;
};



/******************************************************************************
 * Export
*******************************************************************************/
export default {
    // Classes
    mediabox,
    emitter,
    scroller,
    resizer,

    // Loading
    loadImages,
    loadDependencies,
    updateImages,
    isElementLoadable,
    isElementInViewport,
    getElementsInView,

    // Disabling
    disableMouseWheel,
    disableTouchMove,

    // Random
    px,
    noop,
    shuffle,
    parseTime,
    translate3d,
    getTransitionDuration,
    safePreventDefault,
    getDefaultHammerOptions,
    getPageKey
};
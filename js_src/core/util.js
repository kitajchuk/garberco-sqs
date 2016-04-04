/**
 *
 * @public
 * @module util
 * @description Houses app-wide utility methods.
 *
 */


import $ from "js_libs/hobo/dist/hobo.build";
import Hammer from "hammerjs";
import ImageLoader from "properjs-imageloader";
import dom from "./dom";
import config from "./config";
import detect from "./detect";


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
    const rQuery = /\?(.*)$/;
    const map = function ( vnt ) {
        return parseInt( vnt, 10 );
    };
    let $img = null;
    let data = null;
    let dims = null;
    let vars = null;
    let width = null;
    let variant = null;
    let source = null;
    let i = null;

    // Normalize the handler
    handler = (handler || isElementLoadable);

    // Normalize the images
    images = (images || dom.page.find( config.lazyImageSelector ));

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
        width = ($img[ 0 ].clientWidth || $img[ 0 ].parentNode.clientWidth || window.innerWidth);
        source = data.imgSrc.replace( rQuery, "" );

        // Pre-process portrait vs landscape using originalSize
        if ( data.originalSize ) {
            dims = getOriginalDims( data.originalSize );

            if ( dims.width > dims.height ) {
                $img.addClass( "image--wide" );

            } else {
                $img.addClass( "image--tall" );
            }
        }

        if ( useVariant && data.variants ) {
            vars = data.variants.split( "," ).map( map );
            variant = getClosestValue( vars, width );

            // If the pixel density is higher, use a larger image ?
            if ( window.devicePixelRatio > 1 ) {
                // Splice off the variant that was matched
                vars.splice( vars.indexOf( variant ), 1 );

                // Apply the new, larger variant as the format
                variant = getClosestValue( vars, variant );
            }

            $img[ 0 ].setAttribute( config.lazyImageAttr, `${source}?format=${variant}w` );
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


/**
 *
 * @public
 * @method getOriginalDims
 * @memberof util
 * @param {string} original The original image dims
 * @description Get an object reference to original dims.
 *              Format: "1600x1600"
 * @returns {object}
 *
 */
const getOriginalDims = function ( original ) {
    const dims = original.split( "x" );

    return {
        width: parseInt( dims[ 0 ], 10 ),
        height: parseInt( dims[ 1 ], 10 )
    };
};


const getPageKey = function () {
    let ret = null;

    if ( window.location.pathname === config.appRoot ) {
        ret = config.homepageKey;

    } else {
        ret = `${window.location.pathname}${window.location.search}`;
    }

    return ret;
};


/**
 *
 * @public
 * @method extendObject
 * @memberof util
 * @param {object} target The target object/array
 * @param {object} arrow The incoming object/array
 * @description Merge or clone objects and arrays
 * @returns {object}
 *
 */
const extendObject = function ( target, arrow ) {
    let i = null;
    const ret = target;

    // Normalize arrow
    arrow = (arrow || {});

    // Merge Arrays
    // This is really just used as a `cloning` mechanism
    if ( Array.isArray( arrow ) ) {
        i = arrow.length;

        for ( i; i--; ) {
            ret[ i ] = arrow[ i ];
        }

    // Merge Objects
    // This could `clone` as well, but is better for merging 2 objects
    } else {
        for ( i in arrow ) {
            if ( arrow.hasOwnProperty( i ) ) {
                ret[ i ] = arrow[ i ];
            }
        }
    }

    return ret;
};


/**
 *
 * @public
 * @method slugify
 * @memberof util
 * @param {string} str The string to slug
 * @description Slugify a string
 * @returns {string}
 *
 */
const slugify = function ( str ) {
    str = str.toString().toLowerCase().trim()
        // Replace & with "and"
        .replace( /&/g, "-and-" )

        // Replace spaces, non-word characters and dashes with a single dash (-)
        .replace( /[\s\W-]+/g, "-" )

        // Replace leading trailing slashes with an empty string - nothing
        .replace( /^[-]+|[-]+$/g, "" );

    return (str ? config.homepageKey : str);
};



/******************************************************************************
 * Export
*******************************************************************************/
export default {
    // Loading
    loadImages,
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
    slugify,
    translate3d,
    extendObject,
    getTransitionDuration,
    getDefaultHammerOptions,
    getPageKey
};
/**
 *
 * @public
 * @module util
 * @description Houses app-wide utility methods.
 *
 */


import $ from "js_libs/hobo/dist/hobo.build";
import ImageLoader from "properjs-imageloader";
import dom from "./dom";
import config from "./config";
import detect from "./detect";
import Hammer from "hammerjs";


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
 * @memberof core.util
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
 * @memberof core.util
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


/**
 *
 * @public
 * @method getElementsInView
 * @param {Hobo} $nodes The elements to check
 * @memberof util
 * @description Get only visible elements
 * @returns {Hobo}
 *
 */
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
 * @param {Hobo} images The optional argument passed collection to reload
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
 * @param {number} useWidth Optional manual width to determine variant against
 * @memberof util
 * @returns {instance}
 *
 */
const loadImages = function ( images, handler, useVariant, useWidth ) {
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
    handler = (handler || isElementInViewport);

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
        width = (useWidth || $img[ 0 ].clientWidth || $img[ 0 ].parentNode.clientWidth || window.innerWidth);
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
            //if ( window.devicePixelRatio > 1 ) {
                // Splice off the variant that was matched
            //    vars.splice( vars.indexOf( variant ), 1 );

                // Apply the new, larger variant as the format
            //    variant = getClosestValue( vars, variant );
            //}

            $img[ 0 ].setAttribute( config.lazyImageAttr, `${source}?format=${variant}w` );
        }
    }

    return new ImageLoader({
        elements: images,
        property: config.lazyImageAttr,
        executor: handler
    });
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
        duration = getComputedStyle( el )[ "transition-duration" ];
        isSeconds = String( duration ).indexOf( "ms" ) === -1;
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


/**
 *
 * @public
 * @method getPageKey
 * @memberof util
 * @description Get the unique page key for cache and such
 * @returns {object}
 *
 */
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
 * @description Merge objects and arrays by cloning - non-mutable
 * @returns {object}
 *
 */
const extendObject = function ( target, arrow ) {
    let i = null;

    // Never mutate the target
    const ret = Array.isArray( target ) ? [] : {};

    // Merge Arrays
    if ( Array.isArray( arrow ) ) {
        i = target.length;

        for ( i; i--; ) {
            ret[ i ] = target[ i ];
        }

        i = arrow.length;

        for ( i; i--; ) {
            ret[ i ] = arrow[ i ];
        }

    // Merge Objects
    } else {
        for ( i in target ) {
            if ( target.hasOwnProperty( i ) ) {
                ret[ i ] = target[ i ];
            }
        }

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


/**
 *
 * @method getDefaultHammerOptions
 * @memberof core.util
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
 * Get the applied transform values from CSS
 * @method getTransformValues
 * @param {object} el The DOMElement
 * @memberof util
 * @returns {object}
 *
 */
const getTransformValues = function ( el ) {
    if ( !el ) {
        return null;
    }

    const transform = window.getComputedStyle( el )[ Hammer.prefixed( el.style, "transform" ) ];
    const values = transform.replace( /matrix|3d|\(|\)|\s/g, "" ).split( "," );
    const ret = {};

    // No Transform
    if ( values[ 0 ] === "none" ) {
        ret.x = 0;
        ret.y = 0;
        ret.z = 0;

    // Matrix 3D
    } else if ( values.length === 16 ) {
        ret.x = parseFloat( values[ 12 ] );
        ret.y = parseFloat( values[ 13 ] );
        ret.z = parseFloat( values[ 14 ] );

    } else {
        ret.x = parseFloat( values[ 4 ] );
        ret.y = parseFloat( values[ 5 ] );
        ret.z = 0;
    }

    return ret;
};



/******************************************************************************
 * Export
*******************************************************************************/
export default {
    px,
    noop,
    slugify,
    getPageKey,
    loadImages,
    translate3d,
    extendObject,
    updateImages,
    isElementLoadable,
    getElementsInView,
    getTransformValues,
    isElementInViewport,
    getTransitionDuration,
    getDefaultHammerOptions
};
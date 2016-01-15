import $ from "js_libs/jquery/dist/jquery";
import log from "./log";


let _cache = null;
let _timestamp = null;
let _cacheLocal = {}; // In-Memory {object} cache
let _initialized = false;
const _cacheAccess = "instrument-cache";
const _timeAccess = "instrument-timestamp";
const _duration = 604800000; // 1 Week in milliseconds
const _allocated = 5242880; // (1024 * 1024 * 5) - 5MB


/**
 *
 * @public
 * @module cache
 * @description Provide some data CASH!!!.
 *              Local Storage is synchronous - so we don't want to set
 *              every time cache is modified. Ideally we can use an app event
 *              hook to set the cache to device when we have a free moment.
 *              Ideally, we're just looking at NOT BLOCKING REQUESTS just to
 *              set some data to the device storage.
 *
 *              There are 2 places where XHR requests happen in `OUR` app:
 *              The api module and PageController.
 *              This excludes media content requests - audio and video.
 *              But that's fine I think.
 *
 *              Some stuff I was reading:
 *              http://www.sitepoint.com/html5-local-storage-revisited/
 *              http://www.html5rocks.com/en/tutorials/offline/quota-research/
 *
 */
const cache = {
    /**
     *
     * @public
     * @method init
     * @param {boolean} enableStorage Should we load from LocalStorage initially ?
     * @memberof cache
     * @description Initialize the cache - looks at Local Storage
     * @returns {object} if already initialized
     *
     */
    init ( enableStorage ) {
        if ( _initialized ) {
            return this.get();
        }

        _initialized = true;
        _cache = window.localStorage.getItem( _cacheAccess );
        _timestamp = window.localStorage.getItem( _timeAccess );

        // Cache exists - Timestamp exists
        if ( _cache && _timestamp ) {
            _cache = JSON.parse( _cache );
            _timestamp = parseInt( _timestamp, 10 );

        // Neither exist - setup the cache and timestamp
        // Timestamp remains null for this case
        } else {
            _cache = {};
            _timestamp = Date.now();
        }

        log( "cache initialized", _cache, _timestamp );

        if ( enableStorage ) {
            this.tryFlush();

        // Storage disabled, flush it clean...
        } else {
            this.flush();
        }
    },


    /**
     *
     * @public
     * @method tryFlush
     * @memberof cache
     * @description Flush the cache if necessary
     *
     */
    tryFlush () {
        // Timestamp so check how long data has been stored
        // This condition establishes a 1 week duration before data flush
        // This condition also checks the size stored vs what is allocated - 5MB
        if ( ((Date.now() - _timestamp) >= _duration) || (_allocated - JSON.stringify( window.localStorage ).length <= 0) ) {
            this.flush();
        }
    },


    /**
     *
     * @public
     * @method flush
     * @memberof cache
     * @description Manually flush the Local Storage cache
     *
     */
    flush () {
        // New empty cache
        _cache = {};

        // New empty local cache
        _cacheLocal = {};

        // New Timestamp for NOW
        _timestamp = Date.now();

        // Store the new cache object
        this.save();
    },


    /**
     *
     * @public
     * @method save
     * @memberof cache
     * @description Perform the actual synchronous write to Local Storage
     *
     */
    save () {
        window.localStorage.setItem( _timeAccess, _timestamp );
        window.localStorage.setItem( _cacheAccess, JSON.stringify( _cache ) );
    },


    /**
     *
     * @public
     * @method slug
     * @param {string} uri The string to slugify
     * @memberof cache
     * @description Slug a uri string
     * @returns {string}
     *
     */
    slug ( uri ) {
        return uri.replace( /^\/|\/$/g, "" ).replace( /\/|\?|\&|=|\s/g, "-" ).toLowerCase();
    },


    /**
     *
     * @public
     * @method set
     * @param {string} id The index key
     * @param {mixed} val The value to store
     * @memberof cache
     * @description Set a key's value in the cache
     *
     */
    set ( id, val ) {
        id = this.slug( id );

        _cache[ id ] = val;

        // Maybe don't do this EVERY time
        // @see module notes above about this
        this.save();
    },


    /**
     *
     * @public
     * @method get
     * @param {string} id The index key
     * @memberof cache
     * @description Get a key's value from the cache
     * @returns {mixed}
     *
     */
    get ( id ) {
        id = (id && this.slug( id ));

        return (id ? this.getValue( _cache[ id ] ) : _cache);
    },


    /**
     *
     * @public
     * @method getValue
     * @param {mixed} val The accessed value
     * @memberof cache
     * @description Get a value so cache is non-mutable from outside
     * @returns {mixed}
     *
     */
    getValue ( val ) {
        return (typeof val === "string" ? String( val ) : val ? $.extend( $.isArray( val ) ? [] : {}, val ) : null);
    },


    /**
     *
     * @public
     * @method setLocal
     * @param {string} id The index key
     * @param {mixed} val The value to store
     * @memberof cache
     * @description Set a key's value in the local cache
     *
     */
    setLocal ( id, val ) {
        id = this.slug( id );

        _cacheLocal[ id ] = val;
    },


    /**
     *
     * @public
     * @method getLocal
     * @param {string} id The index key
     * @memberof cache
     * @description Get a key's value from the local cache
     * @returns {mixed}
     *
     */
    getLocal ( id ) {
        id = (id && this.slug( id ));

        return (id ? this.getValue( _cacheLocal[ id ] ) : _cacheLocal);
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default cache;
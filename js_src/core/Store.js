import $ from "js_libs/jquery/dist/jquery";
import log from "./log";


// Singleton
let _instance = null;
let _initialized = false;

// In-Memory {object} cache
let _cache = {};
let _timestamp = null;
const _cacheAccess = "instrument-cache";
const _timeAccess = "instrument-timestamp";

// 1 Week in milliseconds
const _duration = 604800000;

// (1024 * 1024 * 5) - 5MB
const _allocated = 5242880;


/**
 *
 * @public
 * @class Store
 * @param {object} options The Store settings
 * @classdesc Handles how data / content is cached and stored for webapp.
 *
 *            Local Storage is synchronous - so we don't want to set
 *            every time cache is modified. Ideally we can use an app event
 *            hook to set the cache to device when we have a free moment.
 *            Ideally, we're just looking at NOT BLOCKING REQUESTS just to
 *            set some data to the device storage.
 *
 *            There are 2 places where XHR requests happen in `OUR` app:
 *            The api module and PageController.
 *            This excludes media content requests - audio and video.
 *            But that's fine I think.
 *
 *            Some stuff I was reading:
 *            http://www.sitepoint.com/html5-local-storage-revisited/
 *            http://www.html5rocks.com/en/tutorials/offline/quota-research/
 *
 */
class Store {
    constructor ( options ) {
        if ( !_instance ) {
            _instance = this;

            this._opts = options;
            this._init();
        }

        return _instance;
    }


    /**
     *
     * @public
     * @instance
     * @method _init
     * @memberof Store
     * @description One time Store initialization
     *
     */
    _init () {
        if ( _initialized ) {
            return;
        }

        _initialized = true;

        if ( this._opts.enableStorage ) {
            this.tryFlush();

        } else {
            this.tryClean();
        }

        log( "Singleton Store initialized", this );
    }


    /**
     *
     * @public
     * @instance
     * @method tryClean
     * @memberof Store
     * @description If initialized with storage disabled, attempt to remove old storage if it exists
     *
     */
    tryClean () {
        window.localStorage.removeItem( _timeAccess );
        window.localStorage.removeItem( _cacheAccess );
    }


    /**
     *
     * @public
     * @instance
     * @method tryFlush
     * @memberof Store
     * @description Flush the cache if necessary
     *
     */
    tryFlush () {
        _cache = window.localStorage.getItem( _cacheAccess );
        _timestamp = window.localStorage.getItem( _timeAccess );

        // Store exists - Timestamp exists
        if ( _cache && _timestamp ) {
            _cache = JSON.parse( _cache );
            _timestamp = parseInt( _timestamp, 10 );

        // Neither exist - setup the cache and timestamp
        // Timestamp remains null for this case
        } else {
            _cache = {};
            _timestamp = Date.now();
        }

        // Timestamp so check how long data has been stored
        // This condition establishes a 1 week duration before data flush
        // This condition also checks the size stored vs what is allocated - 5MB
        if ( ((Date.now() - _timestamp) >= _duration) || (_allocated - JSON.stringify( window.localStorage ).length <= 0) ) {
            this.flush();
        }
    }


    /**
     *
     * @public
     * @instance
     * @method flush
     * @memberof Store
     * @description Manually flush the Local Storage cache
     *
     */
    flush () {
        // New empty cache
        _cache = {};

        // New Timestamp for NOW
        _timestamp = Date.now();

        // Store the new cache object
        this.save();
    }


    /**
     *
     * @public
     * @instance
     * @method save
     * @memberof Store
     * @description Perform the actual synchronous write to Local Storage
     *
     */
    save () {
        if ( !this._opts.enableStorage ) {
            log( "Cache Storage disabled - Not writing to LocalStorage" );
            return;
        }

        window.localStorage.setItem( _timeAccess, _timestamp );
        window.localStorage.setItem( _cacheAccess, JSON.stringify( _cache ) );
    }


    /**
     *
     * @public
     * @instance
     * @method slug
     * @param {string} uri The string to slugify
     * @memberof Store
     * @description Slug a uri string
     * @returns {string}
     *
     */
    slug ( uri ) {
        return uri.replace( /^\/|\/$/g, "" ).replace( /\/|\?|\&|=|\s/g, "-" ).toLowerCase();
    }


    /**
     *
     * @public
     * @instance
     * @method set
     * @param {string} id The index key
     * @param {mixed} val The value to store
     * @memberof Store
     * @description Set a key's value in the cache
     *
     */
    set ( id, val ) {
        id = this.slug( id );

        _cache[ id ] = val;

        this.save();
    }


    /**
     *
     * @public
     * @instance
     * @method get
     * @param {string} id The index key
     * @memberof Store
     * @description Get a key's value from the cache
     * @returns {mixed}
     *
     */
    get ( id ) {
        id = (id && this.slug( id ));

        return (id ? this.getValue( _cache[ id ] ) : _cache);
    }


    /**
     *
     * @public
     * @instance
     * @method getValue
     * @param {mixed} val The accessed value
     * @memberof Store
     * @description Get a value so cache is non-mutable from outside
     * @returns {mixed}
     *
     */
    getValue ( val ) {
        return (typeof val === "string" ? String( val ) : val ? $.extend( $.isArray( val ) ? [] : {}, val ) : null);
    }


    /**
     *
     * @public
     * @instance
     * @method remove
     * @param {string} id The index key
     * @memberof Store
     * @description Remove a key/val pair from the cache
     *
     */
    remove ( id ) {
        delete _cache[ id ];
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Store;
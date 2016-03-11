import $ from "js_libs/jquery/dist/jquery";
import paramalama from "paramalama";
//import config from "./config";


const _rSlash = /^\/|\/$/g;


/**
 *
 * @public
 * @module api
 * @description Provide some api methods for accessing content via JS.
 *
 */
const api = {
    /**
     *
     * @public
     * @member data
     * @memberof api
     * @description URLs this little api needs to use.
     *
     */
    data: {
        squarespace: {
            url: location.origin,
            api: [location.origin, "api"].join( "/" )
        }
    },


    /**
     *
     * @public
     * @member dataType
     * @memberof api
     * @description Default dataType for the `request` api method.
     *
     */
    dataType: "json",


    /**
     *
     * @public
     * @member format
     * @memberof api
     * @description Default format for the `request` api method.
     *
     */
    format: "json",


    /**
     *
     * @public
     * @member method
     * @memberof api
     * @description Default method for the `request` api method.
     *
     */
    method: "GET",


    /**
     *
     * @public
     * @method urify
     * @param {string} uri The collection uri
     * @memberof api
     * @description Ensures a leading/trailing slash.
     * @returns {string}
     *
     */
    urify ( uri ) {
        return ["/", uri.replace( _rSlash, "" ), "/"].join( "" );
    },


    /**
     *
     * @public
     * @method endpoint
     * @param {string} uri The collection uri
     * @memberof api
     * @description Creates the fullUrl from a collection uri.
     * @returns {string}
     *
     */
    endpoint ( uri ) {
        return [this.data.squarespace.url, uri.replace( _rSlash, "" )].join( "/" );
    },


    /**
     *
     * @public
     * @method apipoint
     * @param {string} uri The API uri
     * @memberof api
     * @description Creates the fullUrl from an API uri.
     * @returns {string}
     *
     */
    apipoint ( uri ) {
        return [this.data.squarespace.api, uri.replace( _rSlash, "" )].join( "/" );
    },


    /**
     *
     * @public
     * @method request
     * @param {string} url The API URL
     * @param {object} params Merge params to send
     * @param {object} options Merge config to pass to $.ajax()
     * @memberof api
     * @description Creates the fullUrl from an API uri.
     * @returns {object}
     *
     */
    request ( url, params, options ) {
        const data = $.extend(
            {
                format: this.format,
                nocache: true
            },
            params
        );
        const opts = $.extend(
            {
                url,
                data,
                dataType: this.dataType,
                method: this.method
            },
            options
        );

        return $.ajax( opts );
    },


    /**
     *
     * @public
     * @method index
     * @param {string} uri The index uri
     * @param {object} params Merge params to send
     * @param {object} options Merge options to send
     * @memberof api
     * @description Retrieves collections from a given index.
     * @returns {object}
     *
     */
    index ( uri, params, options ) {
        let i = 0;
        const def = new $.Deferred();
        const colls = [];
        const handle = function ( data ) {
            for ( i = data.collections.length; i--; ) {
                colls.push( data.collections[ i ].urlId );
            }

            api.collections( colls, params, options ).done( ( items ) => def.resolve( items ) );
        };

        this.request( this.endpoint( uri ) )
            .done( ( data ) => {
                handle( data.collection );

            })
            .fail( ( xhr, status, error ) => def.reject( error ) );

        return def;
    },


    /**
     *
     * @public
     * @method collection
     * @param {string} uri The collection uri
     * @param {object} params Merge params to send
     * @param {object} options Merge options to send
     * @memberof api
     * @description Retrieves items from a given collection.
     * @returns {object}
     *
     */
    collection ( uri, params, options ) {
        let collection = {};
        const def = new $.Deferred();
        const seg = uri.split( "?" )[ 0 ];

        params = $.extend( (params || {}), paramalama( uri ) );

        this.request( this.endpoint( seg ), params, options )
            .done( ( data ) => {
                // Resolve with `responseText`
                if ( typeof data === "string" ) {
                    def.resolve( data );

                } else {
                    // Collection?
                    collection = {
                        collection: data.collection,
                        item: (data.item || null),
                        items: (data.items || null),
                        pagination: (data.pagination || null)
                    };

                    def.resolve( (data.items || data.item) ? collection : null );
                }

            })
            .fail( ( xhr, status, error ) => {
                def.reject( error );
            });

        return def;
    },


    /**
     *
     * @public
     * @method collections
     * @param {array} uris The collection uris to query for
     * @param {object} params Merge params to send
     * @param {object} options Merge options to send
     * @memberof api
     * @description Retrieves items from a given set of collection.
     * @returns {object}
     *
     */
    collections ( uris, params, options ) {
        let curr = 0;
        let i = uris.length;
        const items = {};
        const def = new $.Deferred();
        const func = function ( uri, data ) {
            curr++;

            if ( data ) {
                items[ uri ] = data;
            }

            if ( curr === uris.length ) {
                def.resolve( items );
            }
        };

        for ( i; i--; ) {
            this.collection( uris[ i ], params, options ).done( func.bind( null, uris[ i ] ) );
        }

        return def;
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default api;
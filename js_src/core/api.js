import $ from "js_libs/hobo/dist/hobo.build";
import paramalama from "paramalama";
import * as util from "./util";


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
     * @memberof core.api
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
     * @memberof core.api
     * @description Default dataType for the `request` api method.
     *
     */
    dataType: "json",


    /**
     *
     * @public
     * @member format
     * @memberof core.api
     * @description Default format for the `request` api method.
     *
     */
    format: "json",


    /**
     *
     * @public
     * @member method
     * @memberof core.api
     * @description Default method for the `request` api method.
     *
     */
    method: "GET",


    /**
     *
     * @public
     * @method endpoint
     * @param {string} uri The collection uri
     * @memberof core.api
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
     * @memberof core.api
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
     * @memberof core.api
     * @description Creates the fullUrl from an API uri.
     * @returns {object}
     *
     */
    request ( url, params, options ) {
        const data = util.extendObject(
            {
                format: this.format,
                nocache: true
            },
            params
        );
        const opts = util.extendObject(
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
     * @method collection
     * @param {string} uri The collection uri
     * @param {object} params Merge params to send
     * @param {object} options Merge options to send
     * @memberof core.api
     * @description Retrieves items from a given collection.
     *              Returned Promise resolves with a data {object}
     * @returns {Promise}
     *
     */
    collection ( uri, params, options ) {
        return new Promise(( resolve, reject ) => {
            let collection = {};
            const seg = uri.split( "?" )[ 0 ];

            // This clones for us - non-mutable
            params = util.extendObject( {}, params );

            // Merges any query string params from URI
            params = util.extendObject( params, paramalama( uri ) );

            // Tackle the `+` issue with taxonomies
            if ( params.tag ) {
                params.tag = params.tag.replace( /\+/g, " " );
            }

            if ( params.category ) {
                params.category = params.category.replace( /\+/g, " " );
            }

            this.request( this.endpoint( seg ), params, options )
                .then( ( data ) => {
                    // Resolve with `responseText`
                    if ( typeof data === "string" ) {
                        resolve( data );

                    } else {
                        // Collection?
                        collection = {
                            collection: data.collection,
                            item: (data.item || null),
                            items: (data.items || null),
                            pagination: (data.pagination || null)
                        };

                        resolve( collection );
                    }

                })
                .catch( ( error ) => {
                    reject( error );
                });
        });
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default api;
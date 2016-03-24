//import $ from "js_libs/jquery/dist/jquery";
import log from "./log";
import * as util from "./util";
import cache from "./cache";
import emitter from "./emitter";


// Singleton
let _instance = null;


/**
 *
 * @public
 * @class Analytics
 * @classdesc Handles Squarespace Metrics and Google Analytics.
 *            @see {@link https://developers.google.com/analytics/devguides/collection/analyticsjs/}
 * @memberof core
 *
 */
class Analytics {
    constructor () {
        if ( !_instance ) {
            this.initSQSMetrics();

            emitter.on( "app--analytics-push", this.pushTrack.bind( this ) );

            log( "Analytics initialized" );

            _instance = this;
        }

        return _instance;
    }


    /**
     *
     * @public
     * @method initSQSMetrics
     * @memberof core.Analytics
     * @description Cache the initial static context object.
     *
     */
    initSQSMetrics () {
        if ( _instance ) {
            return;
        }

        this.cacheStaticContext( window.Static.SQUARESPACE_CONTEXT );
    }


    /**
     *
     * @public
     * @method track
     * @param {string} type The object type, item or collection
     * @param {object} data The data context to track with
     * @memberof core.Analytics
     * @description Track Squarespace Metrics since we are ajax-routing.
     *
     */
    track ( type, data ) {
        log( "Analytics track", type, data );

        // Squarespace Metrics
        window.Y.Squarespace.Analytics.view( type, data );
    }


    /**
     *
     * @public
     * @method pushTrack
     * @param {Hobo} $doc <html> node to receive and work with
     * @memberof core.Analytics
     * @description Parse static context from responseText and track it.
     *
     */
    pushTrack ( $doc ) {
        const $title = $doc.find( "title" );
        const ctx = this.getStaticContext( $doc.find( "head" )[ 0 ].innerHTML );

        if ( ctx ) {
            this.track( (ctx.item ? "item" : "collection"), (ctx.item || ctx.collection) );
        }

        this.setDocumentTitle( $title[ 0 ].innerText );
    }


    /**
     *
     * @public
     * @method setDocumentTitle
     * @param {string} title The new title for the document
     * @memberof core.Analytics
     * @description Update the documents title.
     *
     */
    setDocumentTitle ( title ) {
        document.title = title;
    }


    /**
     *
     * @public
     * @method getStaticContext
     * @param {string} resHTML The responseText HTML string from router
     * @memberof core.Analytics
     * @description Attempt to parse the Squarespace data context from responseText.
     * @returns {object}
     *
     */
    getStaticContext ( resHTML ) {
        // Match the { data } in Static.SQUARESPACE_CONTEXT
        let ctx = cache.get( `context--${util.getPageKey()}` );

        if ( !ctx ) {
            ctx = resHTML.match( /Static\.SQUARESPACE_CONTEXT\s=\s(.*?)\};/ );

            if ( ctx && ctx[ 1 ] ) {
                ctx = ctx[ 1 ];

                // Put the ending {object} bracket back in there :-(
                ctx = `${ctx}}`;

                // Parse the string as a valid piece of JSON content
                try {
                    ctx = JSON.parse( ctx );

                } catch ( error ) {
                    log( "warn", "Analytics JSON.parse Error", error );
                }

                // Cache context locally
                this.cacheStaticContext( ctx );

            } else {
                ctx = false;
            }
        }

        return ctx;
    }


    /**
     *
     * @public
     * @method cacheStaticContext
     * @param {object} json The Static.SQUARESPACE_CONTEXT ref
     * @memberof core.Analytics
     * @description Cache the sqs context once its been parsed out.
     *
     */
    cacheStaticContext ( json ) {
        cache.set( `context--${util.getPageKey()}`, json );
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Analytics;
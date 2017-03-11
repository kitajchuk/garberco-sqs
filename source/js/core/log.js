import env from "./env";


/**
 *
 * @public
 * @method log
 * @description Normalized app console logger.
 *
 */
const log = function ( ...args ) {
    if ( env.isDev() ) {
        console.log( args );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default log;

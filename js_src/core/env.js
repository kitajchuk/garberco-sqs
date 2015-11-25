/**
 *
 * @public
 * @module env
 * @description Set the app environment.
 *
 */
const env = {
    /**
     *
     * @member DEV
     * @memberof env
     * @description The `production` development ref.
     *
     */
    DEV: "development",


    /**
     *
     * @member PROD
     * @memberof env
     * @description The `production` environment ref.
     *
     */
    PROD: "production",


    /**
     *
     * @method get
     * @memberof env
     * @description Returns the active code `environment`.
     * @returns {boolean}
     *
     */
    get () {
        return (/localhost|squarespace/g.test( document.domain ) ? this.DEV : this.PROD);
    },


    /**
     *
     * @method isConfig
     * @memberof env
     * @description Determine whether we are in Squarespace /config land or not.
     * @returns {boolean}
     *
     */
    isConfig () {
        return (window.parent.location.pathname.indexOf( "/config" ) !== -1);
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default env;
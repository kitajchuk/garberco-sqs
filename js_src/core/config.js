/**
 *
 * @public
 * @module config
 * @description Stores app-wide config values.
 *
 */
const config = {
    /**
     *
     * @public
     * @member homepageKey
     * @memberof config
     * @description The cache key to use for homepage.
     *
     */
    homepageKey: "homepage",


    /**
     *
     * @public
     * @member lazyImageSelector
     * @memberof config
     * @description The string selector used for images deemed lazy-loadable.
     *
     */
    lazyImageSelector: ".js-lazy-image",


    /**
     *
     * @public
     * @member lazyImageAttr
     * @memberof config
     * @description The string attribute for lazy image source URLs.
     *
     */
    lazyImageAttr: "data-img-src",


    /**
     *
     * @public
     * @member imageLoaderAttr
     * @memberof config
     * @description The string attribute ImageLoader gives loaded images.
     *
     */
    imageLoaderAttr: "data-imageloader"
};



/******************************************************************************
 * Export
*******************************************************************************/
export default config;
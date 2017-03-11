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
     * @member rootUrlId
     * @memberof config
     * @description The urlId for "/".
     *
     */
    rootUrlId: "garberco",


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
    imageLoaderAttr: "data-imageloader",


    /**
     *
     * @public
     * @member offcanvasClasses
     * @memberof config
     * @description The string of offcanvas element classNames.
     *
     */
    offcanvasClasses: "is-offcanvas is-offcanvas--about is-offcanvas--index is-offcanvas--project"
};



/******************************************************************************
 * Export
*******************************************************************************/
export default config;
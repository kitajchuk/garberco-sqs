import Store from "./Store";


/**
 *
 * @public
 * @module cache
 * @description Return Singleton instances of the cache Store.
 *
 */
export default new Store({
    // If TRUE the Store will use LocalStorage...
    enableStorage: false
});
import * as core from "./core";


/**
 *
 * @public
 * @namespace intro
 * @description Performs the branded load-in screen sequence.
 *
 */
const intro = {
    /**
     *
     * @public
     * @method teardown
     * @memberof intro
     * @description Method removes loadin node from DOM.
     *
     */
    teardown () {
        if ( !core.dom.intro.length ) {
            return;
        }

        setTimeout( () => {
            core.dom.intro.removeClass( "is-active" );

            setTimeout( () => core.dom.intro.remove(), core.util.getTransitionDuration( core.dom.intro[ 0 ] ) );

        }, 1000 );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
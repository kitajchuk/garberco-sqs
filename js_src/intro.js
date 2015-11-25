import * as core from "./core";


const _transTime = core.util.getTransitionDuration( core.dom.intro[ 0 ] );


/**
 *
 * @public
 * @module intro
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
        core.dom.intro.removeClass( "is-active" );

        setTimeout( () => {
            core.dom.intro.remove();

            setTimeout( () => {
                core.dom.intro = null;

            }, 0 );

        }, _transTime );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;
import * as core from "./core";


let isActive = false;
let isSuppressed = false;


/**
 *
 * @public
 * @module overlay
 * @description Performs the branded load-in screen sequence.
 *
 */
const overlay = {
    /**
     *
     * @public
     * @method init
     * @memberof overlay
     * @description Initialize the overlay element.
     *
     */
    init () {
        if ( core.dom.overlay.element.is( ".is-active" ) ) {
            isActive = true;

        } else {
            core.dom.overlay.element.detach();
        }
    },


    /**
     *
     * @public
     * @method open
     * @memberof overlay
     * @description Open the overlay.
     * @returns {@this}
     *
     */
    open () {
        if ( isActive || isSuppressed ) {
            return this;
        }

        isActive = true;

        core.dom.html.addClass( "is-overlay-active" );
        core.dom.body.append( core.dom.overlay.element );

        setTimeout( () => core.dom.overlay.element.addClass( "is-active" ), 10 );
    },


    /**
     *
     * @public
     * @method close
     * @memberof overlay
     * @description Close the overlay.
     * @returns {@this}
     *
     */
    close () {
        if ( !isActive ) {
            return this;
        }

        core.dom.overlay.element.removeClass( "is-active" );

        setTimeout( () => {
            isActive = false;

            core.dom.html.removeClass( "is-overlay-active" );
            core.dom.overlay.element.detach().removeClass( "is-intro" );

            this.empty();

        }, core.dom.overlay.elementTransitionDuration );
    },


    /**
     *
     * @public
     * @method empty
     * @memberof overlay
     * @description Empty the overlay.
     *
     */
    empty () {
        core.dom.overlay.elementTitle[ 0 ].innerHTML = "";
    },


    /**
     *
     * @public
     * @method suppress
     * @param {boolean} bool Will it be suppressed?
     * @memberof overlay
     * @description Suppress the overlay.
     *
     */
    suppress ( bool ) {
        isSuppressed = bool;

        if ( isSuppressed && isActive ) {
            this.close();
        }
    },


    /**
     *
     * @public
     * @method setTitle
     * @param {string} text The text/html to set.
     * @memberof overlay
     * @description Add text to the overlay.
     *
     */
    setTitle ( text ) {
        if ( !isSuppressed ) {
            core.dom.overlay.elementTitle[ 0 ].innerHTML = text;
        }
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof overlay
     * @description Is the overlay open?.
     * @returns {boolean}
     *
     */
    isActive () {
        return isActive;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default overlay;

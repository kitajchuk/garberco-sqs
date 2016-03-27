import * as core from "./core";


let isActive = false;
const transTime = core.util.getTransitionDuration( core.dom.overlay.element[ 0 ] );


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
        if ( isActive ) {
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

        }, transTime );
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
     * @method setTitle
     * @param {string} text The text/html to set.
     * @memberof overlay
     * @description Add text to the overlay.
     *
     */
    setTitle ( text ) {
        core.dom.overlay.elementTitle[ 0 ].innerHTML = text;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default overlay;
import * as core from "./core";


let _isActive = false;
const _transTime = core.util.getTransitionDuration( core.dom.overlay.element[ 0 ] );


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
            _isActive = true;

        } else {
            core.dom.overlay.element.detach();
        }
    },


    open () {
        _isActive = true;

        core.dom.html.addClass( "is-overlay-active" );
        core.dom.page.append( core.dom.overlay.element );

        setTimeout( () => core.dom.overlay.element.addClass( "is-active" ), 10 );
    },


    close () {
        core.dom.overlay.element.removeClass( "is-active" );

        setTimeout( () => {
            _isActive = false;

            core.dom.html.removeClass( "is-overlay-active" );
            core.dom.overlay.element.detach();

        }, _transTime );
    },


    setTitle ( text ) {
        core.dom.overlay.elementTitle.html( text );
    },


    isActive () {
        return _isActive;
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default overlay;
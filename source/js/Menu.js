import * as core from "./core";


/**
 *
 * @public
 * @class Menu
 * @classdesc Handle normalized open/close for overlay menus.
 * @param {Hobo} $node The menu element
 *
 */
class Menu {
    constructor ( $node ) {
        this.$node = $node;
        this.tDuration = core.util.getTransitionDuration( this.$node[ 0 ] );
        this.isOpen = false;
        //this.scrollPos = core.scroller.getScrollY();

        this.$node.detach();
    }


    /**
     *
     * @public
     * @instance
     * @method open
     * @memberof menus.Menu
     * @description Open the menu.
     *
     */
    open () {
        this.isOpen = true;

        core.dom.html.addClass( "is-menu-open" );
        core.dom.body.append( this.$node );

        // 0.4 => Broadcast the open menu
        core.emitter.fire( "app--menu-opened" );

        setTimeout( () => this.$node.addClass( "is-active" ), 10 );
        setTimeout( () => {
            this.$node.addClass( "is-active-events" );
            core.dom.html.addClass( "is-clipped" );
            core.dom.body.addClass( "is-clipped" );

        }, (this.tDuration * 2) );
    }


    /**
     *
     * @public
     * @instance
     * @method close
     * @memberof menus.Menu
     * @description Close the menu.
     *
     */
    close () {
        this.$node.removeClass( "is-active is-active-events" );
        core.dom.html.removeClass( "is-clipped" );
        core.dom.body.removeClass( "is-clipped" );

        // 0.3 => Broadcast the closed menu
        core.emitter.fire( "app--menu-closed" );

        setTimeout( () => {
            this.isOpen = false;
            core.dom.html.removeClass( "is-menu-open" );
            this.$node.detach();

        }, (this.tDuration * 2) );
    }


    /**
     *
     * @public
     * @instance
     * @method toggle
     * @memberof menus.Menu
     * @description Open or Close the menu.
     *
     */
    toggle () {
        if ( this.isOpen ) {
            this.close();

        } else {
            this.open();
        }
    }


    /**
     *
     * @public
     * @instance
     * @method isActive
     * @memberof menus.Menu
     * @description Check the state of the menu.
     * @returns {boolean}
     *
     */
    isActive () {
        return this.isOpen;
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Menu;

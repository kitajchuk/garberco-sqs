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
        this.scrollPos = core.scroller.getScrollY();

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

        // Handle scroll suppression

        // 0.2 => Get the current scroll position
        this.scrollPos = core.scroller.getScrollY();

        // 0.3 => Suppress the scrolls emitter
        core.scrolls.suppress( true );

        // 0.4 => Broadcast the open menu
        core.emitter.fire( "app--menu-opened" );

        setTimeout( () => this.$node.addClass( "is-active" ), 0 );
        setTimeout( () => {
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
        this.isOpen = false;

        this.$node.removeClass( "is-active" );
        core.dom.html.removeClass( "is-clipped" );
        core.dom.body.removeClass( "is-clipped" );

        // Handle scroll suppression

        // 0.1 => Reset the document scroll position
        core.dom.body[ 0 ].scrollTop = this.scrollPos;

        // 0.2 => Un-suppress the scrolls emitter
        core.scrolls.suppress( false );

        // 0.3 => Broadcast the closed menu
        core.emitter.fire( "app--menu-closed" );

        setTimeout( () => {
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
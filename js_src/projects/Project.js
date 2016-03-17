import * as core from "../core";
import overlay from "../overlay";


let isActive = false;


/**
 *
 * @public
 * @class Project
 * @param {jQuery} $node The element
 * @param {object} data The datas
 * @classdesc Handle an index.
 *
 */
class Project {
    constructor ( $node, data ) {
        this.$node = $node;
        this.data = data;
        this.$plates = this.$node.find( ".js-project-plate" );
        this.$images = this.$node.find( ".js-lazy-image" );
        this.isEnded = false;

        core.images.handleImages( this.$images, this.onPreload.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method onPreload
     * @memberof Project
     * @description Handle loaded index grid.
     *
     */
    onPreload () {
        core.dom.project.elementPane.html( this.$node );

        if ( overlay.isActive() ) {
            overlay.close();
        }

        this.cycleAnimation();
    }


    cycleAnimation () {
        this.onUpdateEmitter();

        core.util.emitter.go( this.onUpdateEmitter.bind( this ) );
    }


    updatePlates () {
        let $plate = null;
        let i = this.$plates.length;

        for ( i; i--; ) {
            $plate = this.$plates.eq( i );

            if ( core.util.isElementInViewport( $plate[ 0 ] ) ) {
                $plate.addClass( "is-active" );

            } else {
                $plate.removeClass( "is-active" );
            }
        }
    }


    updatePosition () {
        const nodeRect = this.$node[ 0 ].getBoundingClientRect();
        const $imageloaded = this.$images.filter( ".-is-lazy-handled" );

        if ( $imageloaded.length !== this.$images.length ) {
            return;
        }

        if ( Math.floor( nodeRect.bottom ) <= 0 && !this.isEnded ) {
            this.isEnded = true;

            core.dom.project.element.addClass( "is-inactive" );

            setTimeout( () => {
                core.util.emitter.fire( "app--project-ended" );

            }, core.dom.project.elementTransitionDuration );
        }
    }


    onUpdateEmitter () {
        this.updatePlates();
        this.updatePosition();
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof Project
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {
        Project.close();
    }
}



/******************************************************************************
 * Static
*******************************************************************************/

Project.isActive = function () {
    return isActive;
};


Project.open = function () {
    isActive = true;

    core.dom.html.addClass( "is-project" );
    core.dom.body.append( core.dom.project.element );

    setTimeout( () => core.dom.project.element.addClass( "is-active" ), 10 );
};


Project.close = function () {
    isActive = false;

    core.util.emitter.stop();

    core.dom.project.element.removeClass( "is-active is-inactive" );

    setTimeout( () => {
        core.dom.html.removeClass( "is-project" );
        core.dom.project.element.detach();
        core.dom.project.elementPane.empty();

    }, core.dom.project.elementTransitionDuration );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default Project;
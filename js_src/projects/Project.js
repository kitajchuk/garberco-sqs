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
 * @memberof projects
 *
 */
class Project {
    constructor ( $node, data ) {
        this.$node = $node;
        this.data = data;
        this.$plates = this.$node.find( ".js-project-plate" );
        this.$images = this.$node.find( ".js-lazy-image" );
        this.isEnded = false;

        core.log( "Project", this );

        // Node must be in DOM for image size to work
        core.dom.project.elementPane.append( this.$node );

        core.images.handleImages( this.$images, this.onPreload.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method onPreload
     * @memberof projects.Project
     * @description Handle loaded project images.
     *
     */
    onPreload () {
        overlay.close();

        this.cycleAnimation();
    }


    /**
     *
     * @public
     * @instance
     * @method cycleAnimation
     * @memberof projects.Project
     * @description Run raf cycle to handle animations.
     *
     */
    cycleAnimation () {
        this.onUpdateEmitter();

        core.emitter.go( this.onUpdateEmitter.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method updatePlates
     * @memberof projects.Project
     * @description Update active plates for the project.
     *
     */
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


    /**
     *
     * @public
     * @instance
     * @method updatePosition
     * @memberof projects.Project
     * @description Determine when to teardown a project.
     *
     */
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
                core.emitter.fire( "app--project-ended" );

            }, core.dom.project.elementTransitionDuration );
        }
    }


    /**
     *
     * @public
     * @instance
     * @method onUpdateEmitter
     * @memberof projects.Project
     * @description Handle the raf cycle.
     *
     */
    onUpdateEmitter () {
        this.updatePlates();
        this.updatePosition();
    }


    /**
     *
     * @public
     * @instance
     * @method destroy
     * @memberof projects.Project
     * @description Undo event bindings for this instance.
     *
     */
    destroy () {
        Project.close();
    }
}



/**
 *
 * @public
 * @static
 * @method isActive
 * @memberof projects.Project
 * @description Test if a project is active.
 * @returns {boolean}
 *
 */
Project.isActive = function () {
    return isActive;
};


/**
 *
 * @public
 * @static
 * @method open
 * @memberof projects.Project
 * @description Open the project view element.
 *
 */
Project.open = function () {
    isActive = true;

    core.dom.html.addClass( "is-project" );
    core.dom.body.append( core.dom.project.element );

    setTimeout( () => core.dom.project.element.addClass( "is-active" ), 10 );
};


/**
 *
 * @public
 * @static
 * @method close
 * @memberof projects.Project
 * @description Close the project view element.
 *
 */
Project.close = function () {
    isActive = false;

    core.emitter.stop();

    core.dom.project.element.removeClass( "is-active is-inactive" );

    setTimeout( () => {
        core.dom.html.removeClass( "is-project" );
        core.dom.project.element.detach();
        core.dom.project.elementPane[ 0 ].innerHTML = "";

    }, core.dom.project.elementTransitionDuration );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default Project;
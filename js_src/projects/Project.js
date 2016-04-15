import * as core from "../core";
import overlay from "../overlay";
import Menu from "../Menu";
import Controller from "properjs-controller";


let isActive = false;
const animator = new Controller();


/**
 *
 * @public
 * @class Project
 * @param {Hobo} $node The element
 * @param {object} data The datas
 * @classdesc Handle an index.
 * @memberof projects
 *
 */
class Project {
    constructor ( $node, $info, data ) {
        isActive = true;

        this.$node = $node;
        this.$infoScreen = $info;
        this.$infoButton = core.dom.header.find( ".js-project-info" );
        this.menu = new Menu( this.$infoScreen );
        this.data = data;
        this.$plates = this.$node.find( ".js-project-plate" );
        this.$images = this.$node.find( ".js-lazy-image" );
        this.isEnded = false;

        this.bindEvents();
        this.loadProject();

        core.log( "Project", this );
    }


    /**
     *
     * @public
     * @instance
     * @method bindEvents
     * @memberof projects.Project
     * @description Bind event handlers for open Project.
     *
     */
    bindEvents () {
        this._onClickInfo = this.onClickInfo.bind( this );

        this.$infoScreen.on( "click", this._onClickInfo );
        this.$infoButton.on( "click", this._onClickInfo );
    }


    /**
     *
     * @public
     * @instance
     * @method loadProject
     * @memberof projects.Project
     * @description Load images with {@link ImageController}.
     *
     */
    loadProject () {
        // Node must be in DOM for image size to work
        core.dom.project.elementPane.append( this.$node );

        core.images.handleImages( this.$images, this.onPreload.bind( this ) );
    }


    /**
     *
     * @public
     * @instance
     * @method onClickInfo
     * @memberof projects.Project
     * @description Handle Info text/overlay interaction.
     *
     */
    onClickInfo () {
        if ( core.env.isConfig() && this.menu.isActive() ) {
            return;
        }

        if ( this.menu.isActive() ) {
            this.menu.close();

        } else {
            this.menu.open();
        }
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

        animator.stop();
        animator.go( this.onUpdateEmitter.bind( this ) );
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
        const $imageloaded = this.$images.filter( `[${core.config.imageLoaderAttr}]` );

        if ( $imageloaded.length !== this.$images.length ) {
            return;
        }

        if ( core.dom.project.element[ 0 ].scrollTop !== 0 && Math.floor( nodeRect.bottom ) <= 0 && !this.isEnded ) {
            this.isEnded = true;

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
     * @method teardown
     * @memberof projects.Project
     * @description Undo event bindings for this instance.
     *
     */
    teardown () {
        if ( this._onClickInfo ) {
            this.$infoScreen.on( "click", this._onClickInfo );
            this.$infoButton.on( "click", this._onClickInfo );
        }

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

    core.dom.html.addClass( "is-offcanvas is-offcanvas--project" );
    core.dom.body.append( core.dom.project.element );

    setTimeout( () => core.dom.project.element.addClass( "is-active" ), 10 );
    setTimeout( () => core.dom.project.element.removeClass( "is-noscroll" ), core.dom.project.elementTransitionDuration );
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

    animator.stop();

    core.dom.project.element.removeClass( "is-active" );

    setTimeout( () => {
        core.dom.html.removeClass( core.config.offcanvasClasses );
        core.dom.project.element.detach().addClass( "is-noscroll" );
        core.dom.project.elementPane[ 0 ].innerHTML = "";

    }, core.dom.project.elementTransitionDuration );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default Project;
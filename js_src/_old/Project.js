//import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import overlay from "./overlay";


let _isOpen = false;


/**
 *
 * @public
 * @class Project
 * @param {jQuery} $node The dom element
 * @classdesc Load the Project collection into its container
 *
 */
class Project {
    constructor ( $node ) {
        this.$node = $node;
        this.$plates = this.$node.find( ".js-project-plate" );
        this.$images = this.$node.find( ".js-lazy-image" );
        this.isEnded = false;
        this.cycleAnimation();

        if ( overlay.isActive() ) {
            overlay.close();
        }

        core.log( "Project", this );
    }


    destroy () {
        Project.close();
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
        const $imageloaded = this.$images.filter( ".-is-lazy-handled" );
        const scrollMaxY = (core.dom.project.element[ 0 ].scrollHeight - window.innerHeight);
        const scrollCurrY = core.dom.project.element[ 0 ].scrollTop;
        const calcBuffer = 10;

        if ( $imageloaded.length !== this.$images.length ) {
            return;
        }

        if ( scrollCurrY >= (scrollMaxY - calcBuffer) && !this.isEnded ) {
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
}


// Static
Project.isOpen = function () {
    return _isOpen;
};


Project.open = function () {
    _isOpen = true;

    core.dom.html.addClass( "is-project-active" );
    core.dom.body.append( core.dom.project.element );

    setTimeout( () => core.dom.project.element.addClass( "is-active" ), 100 );
};


Project.close = function () {
    _isOpen = false;

    core.util.emitter.stop();

    core.dom.project.element.removeClass( "is-active is-inactive" );

    setTimeout( () => {
        core.dom.html.removeClass( "is-project-active" );
        core.dom.project.element.detach().empty();

    }, core.dom.project.elementTransitionDuration );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default Project;
import $ from "js_libs/jquery/dist/jquery";
import * as core from "./core";
import router from "./router";
import overlay from "./overlay";


/**
 *
 * @public
 * @class Project
 * @classdesc Load the Project collection into its container
 *
 */
class Project {
    constructor ( app, options ) {
        this.app = app;
        this.opts = options;
        this.$plates = null;
        this.$images = null;
        this.isLoaded = false;
        this.isEnded = false;

        if ( this.opts.onLoad ) {
            this.loadCollection();

        } else {
            this.initCollection();
        }

        core.log( "Project", this );
    }


    destroy () {
        this.close();
    }


    cycleAnimation () {
        this.onUpdateEmitter();

        core.util.emitter.go( this._onUpdateEmitter );
    }


    initCollection () {
        this._onUpdateEmitter = this.onUpdateEmitter.bind( this );
        this.$plates = core.dom.project.element.find( ".js-project-plate" );
        this.cycleAnimation();
    }


    loadCollection () {
        const dataType = { dataType: "html" };
        const format = { format: "full", nocache: true };
        const cached = core.cache.get( `project-${this.opts.url}` );

        this.open();

        router.push( this.opts.url, () => {} );

        if ( cached ) {
            this.onLoadCollection( cached );

        } else {
            core.api.collection(
                this.opts.url,
                format,
                dataType

            ).done( this.onLoadCollection.bind( this ) );
        }
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
        const scrollMaxY = (core.dom.project.element[ 0 ].scrollHeight - window.innerHeight);
        const scrollCurrY = core.dom.project.element[ 0 ].scrollTop;

        if ( scrollCurrY >= scrollMaxY && !this.isEnded ) {
            core.log( "Project Ended" );

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


    onLoadCollection ( response ) {
        let html = "";
        let $project = null;

        if ( typeof response === "object" ) {
            html = response.response;
            $project = $( response.response );

        } else {
            html = response;
            $project = $( response ).filter( ".js-page" ).find( ".js-project" );
        }

        core.util.emitter.fire( "app--analytics-push", html );

        this.$plates = $project.find( ".js-project-plate" );
        this.$images = this.$plates.find( ".js-lazy-image" );

        core.dom.project.elementNode.html( this.$plates );

        //core.util.loadImages( this.$images, core.util.noop ).on( "done", () => {
        core.images.handleImages( this.$images, () => {
            if ( overlay.isActive() ) {
                overlay.close();
            }

            if ( typeof this.opts.onLoad === "function" ) {
                this.opts.onLoad();
            }

            this._onUpdateEmitter = this.onUpdateEmitter.bind( this );
            this.cycleAnimation();
        });

        core.cache.set( `project-${this.opts.url}`, response );
    }


    open () {
        core.dom.html.addClass( "is-neverflow is-project-active" );
        core.dom.page.append( core.dom.project.element );

        setTimeout( () => core.dom.project.element.addClass( "is-active" ), 100 );
    }


    close () {
        core.util.emitter.stop();

        core.dom.project.element.removeClass( "is-active is-inactive" );
        core.dom.html.removeClass( "is-neverflow" );

        setTimeout( () => {
            core.dom.html.removeClass( "is-project-active" );
            core.dom.project.element.detach();
            core.dom.project.elementNode.empty();

        }, core.dom.project.elementTransitionDuration );
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Project;
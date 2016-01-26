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
        this.isLoaded = false;

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
        this.isLoaded = true;
        this.$plates = core.dom.project.find( ".js-project-plate" );
        this._onUpdateEmitter = this.onUpdateEmitter.bind( this );
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


    onUpdateEmitter () {
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


    onLoadCollection ( response ) {
        const $node = $( response );
        let $project = null;

        if ( typeof response === "object" ) {
            $project = $( response.response );

        } else {
            $project = $node.filter( ".js-page" ).find( ".js-project" );
        }

        this.isLoaded = true;
        this.$plates = $project.find( ".js-project-plate" );
        this._onUpdateEmitter = this.onUpdateEmitter.bind( this );

        core.dom.project.html( this.$plates );

        core.util.loadImages( this.$plates.find( ".js-lazy-image" ), core.util.noop ).on( "done", () => {
            if ( overlay.isActive() ) {
                overlay.close();
            }

            if ( typeof this.opts.onLoad === "function" ) {
                this.opts.onLoad();
            }

            this.cycleAnimation();
        });

        core.cache.set( `project-${this.opts.url}`, response );
    }


    open () {
        core.dom.html.addClass( "is-neverflow is-project-active" );
        core.dom.page.append( core.dom.project );

        setTimeout( () => core.dom.project.addClass( "is-active" ), 10 );
    }


    close () {
        core.util.emitter.stop();

        core.dom.project.removeClass( "is-active" );
        core.dom.html.removeClass( "is-neverflow" );

        setTimeout( () => {
            this.$plates = null;

            core.dom.html.removeClass( "is-project-active" );
            core.dom.project.detach().empty();

        }, core.util.getTransitionDuration( core.dom.project[ 0 ] ) );
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Project;
/*!
 *
 * App javascript
 *
 * Initializes Web App.
 *
 *
 */
import * as core from "./core";
import intro from "./intro";
import router from "./router";
import projects from "./projects";


/**
 *
 * @method modInit
 * @description Start modules that are NOT PageController plugs..
 *
 */
const modInit = function () {
    core.detect.init();
    core.resizes.init();
    core.scrolls.init();
    router.init();
    projects.init();

    // Expose a global { app }
    window.app = {
        core,
        intro,
        router,
        projects
    };
};


/**
 *
 * @method appInit
 * @description Tears down the branded load screen Instrument.
 *
 */
const appInit = function () {
    core.util.emitter.off( "app--init", appInit );
    core.util.emitter.off( "app--preload-done", appInit );

    core.dom.html.removeClass( "is-clipped" );
    core.dom.body.removeClass( "is-clipped" );

    intro.teardown();
};


/**
 *
 * @method Window.onload
 * @description Handles the Window.onload Event.
 *
 */
window.onload = function () {

    // Initialize { app } modules
    modInit();


    // Start-er-up after content preloads
    core.util.emitter.on( "app--preload-done", appInit );

};
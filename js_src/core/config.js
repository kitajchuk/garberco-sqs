import Easing from "properjs-easing";


/**
 *
 * @public
 * @module config
 * @description Stores app-wide config values.
 *
 */
const config = {
    /**
     *
     * @public
     * @member defaultDragBeltOptions
     * @memberof config
     * @description The base options for Draggable().
     *
     */
    defaultDragBeltOptions: {
        type: "x",
        edgeResistance: 0.6,
        dragResistance: 0.25,
        throwProps: true,
        cursor: "grab",
        lockAxis: true,
        zIndexBoost: false
    },


    /**
     *
     * @public
     * @member sqsMaxImgWidth
     * @memberof config
     * @description The max width Squarespace allows for images.
     *
     */
    sqsMaxImgWidth: 2500,


    /**
     *
     * @public
     * @member sqsSpecialProps
     * @memberof config
     * @description Normalize access to certain item object properties for application.
     *
     * Any of these indicate a post HAS a thumbnail image:
     * - systemDataId
     * - systemDataVariants
     * - systemDataSourceType
     * - systemDataOrigin
     *
     */
    sqsSpecialProps: {
        published: "publishOn",
        userUpload: "systemDataVariants",
        blockDataKey: "blockJson",
        mainContent: "main-content"
    },


    /**
     *
     * @public
     * @member defaultCategory
     * @memberof config
     * @description The non-category that signifies "all".
     *
     */
    defaultCategory: "All",


    /**
     *
     * @public
     * @member caseStudyCollection
     * @memberof config
     * @description The collection typeName configured for case studies.
     *
     */
    caseStudyCustomType: "custom_case_study",


    /**
     *
     * @public
     * @member caseStudyCollection
     * @memberof config
     * @description The collection typeName configured for device video screens.
     *
     */
    deviceVideoCustomType: "custom_device_video",


    /**
     *
     * @public
     * @member caseStudyCollection
     * @memberof config
     * @description The collection typeName configured for custom video posts.
     *
     */
    customVideoCustomType: "custom_video",


    /**
     *
     * @public
     * @member defaultEasing
     * @memberof config
     * @description The default easing function for javascript Tweens.
     *
     */
    defaultEasing: Easing.easeInOutCubic,


    /**
     *
     * @public
     * @member defaultDuration
     * @memberof config
     * @description The default duration for javascript Tweens.
     *
     */
    defaultDuration: 300,


    /**
     *
     * @public
     * @member defaultVideoChannel
     * @memberof config
     * @description The [MediaBox]{@link https://github.com/ProperJS/MediaBox} channel used for video.
     *
     */
    defaultVideoChannel: "vid",


    /**
     *
     * @public
     * @member autoplayVideoChannel
     * @memberof config
     * @description The [MediaBox]{@link https://github.com/ProperJS/MediaBox} channel used for autoplay video.
     *
     */
    autoplayVideoChannel: "vid--autoplay",


    /**
     *
     * @public
     * @member defaultAudioChannel
     * @memberof config
     * @description The [MediaBox]{@link https://github.com/ProperJS/MediaBox} channel used for audio.
     *
     */
    defaultAudioChannel: "bgm",


    /**
     *
     * @public
     * @member lazyImageSelector
     * @memberof config
     * @description The string selector used for images deemed lazy-loadable.
     *
     */
    lazyImageSelector: ".js-lazy-image",


    /**
     *
     * @public
     * @member lazyImageAttr
     * @memberof config
     * @description The string attribute for lazy image source URLs.
     *
     */
    lazyImageAttr: "data-img-src",


    /**
     *
     * @public
     * @member imageLoaderAttr
     * @memberof config
     * @description The string attribute ImageLoader gives loaded images.
     *
     */
    imageLoaderAttr: "data-imageloader",


    /**
     *
     * @public
     * @member activateLinkAttr
     * @memberof config
     * @description The string attribute for link hover activation.
     *
     */
    activateLinkAttr: "data-title",


    /**
     *
     * @public
     * @member asyncScriptPath
     * @memberof config
     * @description The string path where async scripts are kept.
     *
     */
    asyncScriptPath: "/assets/async/scripts/",


    /**
     *
     * @public
     * @member asyncStylePath
     * @memberof config
     * @description The string path where async styles are kept.
     *
     */
    asyncStylePath: "/assets/async/styles/"
};



/******************************************************************************
 * Export
*******************************************************************************/
export default config;
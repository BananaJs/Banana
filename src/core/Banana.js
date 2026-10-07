import { Control } from "../controls/Control.js";
import { Page } from "../controls/Page.js";
import { UrlManager } from "../util/UrlManager.js";

// A global unique ID source for DOM elements.
window.domuuid = window.domuuid || 0;

/**
 * The main Application class. It orchestrates page loading, URL management,
 * and the overall lifecycle of a single-page application.
 */
export class Application extends Control {
    // Application settings, provided on instantiation.
    settings = {};
    // A unique ID that increments on each new page load.
    id = 0;
    // The currently displayed page instance.
    activePage = null;
    // The main page template/layout for the application.
    pageTemplate = null;

    // State flag to prevent concurrent page loads.
    isLoadingPage = false;
    // Queue for page load requests that arrive while another is in progress.
    delayedScheduledPageLoads = [];

    /**
     * @param {object} settings - The application configuration object.
     */
    constructor(settings) {
        super();
        console.log("STARTING APPLICATION", settings);

        if (!window.jQuery) {
            console.error("jQuery is not found. This application requires jQuery.");
            return;
        }

        this.settings = settings || {};
        this._setupUnloadListener();
    }

    /**
     * Prepares the application for unload by removing event listeners and cleaning up resources.
     * This is bound to the window's `beforeunload` event.
     * @private
     */
    _setupUnloadListener() {
        window.jQuery(window).on("beforeunload", () => {
            // This is a heavy-handed approach to unbinding events but is preserved from the original.
            window.jQuery("*").unbind();

            // Clean up pages to prevent memory leaks.
            this.activePage?.remove();
            this.pageTemplate?.remove();

            // Assuming 'Banana' is a global namespace to be torn down.
            // This can have wide-ranging effects and should be used with caution.
            window.Banana = null;
        });
    }

    /**
     * Returns the application settings.
     * @returns {object} The settings object.
     */
    getSettings() {
        return this.settings;
    }

    /**
     * Loads a page by its registered name, handling URL state and history.
     * This is the primary public method for navigating between pages.
     *
     * @param {string} pageName - The name of the page to load (must be in `settings.pages`).
     * @param {object} [urlParameters={}] - Key-value pairs to set in the URL.
     * @param {boolean} [ignoreHistory=false] - If true, does not restore the page's previous URL state.
     * @param {Function} [callback] - A function to execute after the page has loaded.
     * @param {object} [pageParameters={}] - Additional parameters to pass to the page's constructor.
     */
    loadPage(pageName, urlParameters = {}, ignoreHistory = false, callback, pageParameters = {}) {
        if (this.isLoadingPage) {
            console.warn(`Page load already in progress. Queuing request for "${pageName}".`);
            this.delayedScheduledPageLoads.push({ pageName, urlParameters, ignoreHistory, callback, pageParameters });
            return;
        }
        this.isLoadingPage = true;

        UrlManager.saveModuleHistory("section");
        UrlManager.clearUrl();

        const loadingWithHistory = !ignoreHistory;
        if (loadingWithHistory) {
            const history = UrlManager.getModuleHistory(pageName) || {};
            Object.entries(history).forEach(([key, value]) => {
                UrlManager.registerModule(key);
                UrlManager.setModule(key, value, true);
            });
        }

        Object.entries(urlParameters).forEach(([key, value]) => {
            UrlManager.registerModule(key);
            UrlManager.setModule(key, value, true);
        });

        this.run(pageName, callback, pageParameters);
    }

    /**
     * Executes the page loading and rendering pipeline.
     * This method is intended for internal use, called by `loadPage`.
     *
     * @param {string | Page} page - The page name (string) or a Page instance to run.
     * @param {Function} [callback] - A function to execute after running the page.
     * @param {object} [params] - Parameters for the page constructor.
     * @internal
     */
    run(page, callback, params) {
        // Handle the special case where a pre-built Page instance is provided.
        if (page instanceof Page) {
            this._runPageInstance(page);
            return;
        }

        this.triggerEvent("onPreLoadPage");

        if (!this.activePage) {
            UrlManager.autoRegisterModules();
        }

        this._ensurePageTemplate();

        const section = page || UrlManager.getModule("section") || this.settings.defaultPage;
        this.pageTemplate.triggerEvent("preLoadPage", section);

        this._registerUrlSection(section);

        // This method contains the core logic for swapping the old page with the new one.
        this._transitionToPage(section, params, callback);
    }

    //region Private Helper Methods

    /**
     * Instantiates and runs a page that is already an object instance.
     * @private
     * @param {Page} pageInstance
     */
    _runPageInstance(pageInstance) {
        this._ensurePageTemplate();

        pageInstance.bind("renderComplete", () => {
            this._cleanupActivePage();
            this.activePage = pageInstance;
            this.activePage.setVisible(true);
            this.isLoadingPage = false;
            this._processDelayedPageLoads();
        });

        pageInstance.setVisible(false);
        this.pageTemplate.addPageControl(pageInstance);
        this.pageTemplate.setApplication(this);
        this.pageTemplate.run(this);
    }

    /**
     * Handles the asynchronous process of removing the old page and loading the new one.
     * @private
     * @param {string} section - The name of the new page/section.
     * @param {object} params - Constructor parameters for the new page.
     * @param {Function} callback - Callback to run on completion.
     */
    _transitionToPage(section, params, callback) {
        const loadNewPage = () => {
            const PageClass = this.settings.pages[section];
            if (!PageClass) {
                console.error(`Page "${section}" not found in settings. Loading default page.`);
                this.isLoadingPage = false; // Reset lock
                this.loadPage(this.settings.defaultPage);
                return;
            }

            this.id++;
            const newPage = new PageClass(params);

            newPage.bind("renderComplete", () => {
                this._cleanupActivePage();
                this.activePage = newPage;
                this.activePage.setVisible(true);
                this.isLoadingPage = false;
                this._processDelayedPageLoads();
            });

            newPage.setVisible(false);
            this.pageTemplate.addPageControl(newPage);
            this.pageTemplate.setApplication(this);

            // Update URL after setting up the new page.
            // A full update is needed on first load, otherwise a silent update is fine.
            UrlManager.updateUrl(!this.activePage);

            this.pageTemplate.run();

            // Re-bind the URL listener to the new page context.
            UrlManager.unlistenModule("section");
            UrlManager.listenModule("section", () => {
                this.loadPage(UrlManager.getModule("section"));
            });

            callback?.();
        };

        if (this.activePage) {
            UrlManager.stopChecking();
            // Remove the old page but keep its DOM container, then load the new one.
            this.activePage.remove(true, () => {
                UrlManager.startChecking();
                loadNewPage();
            });
        } else {
            // No active page, so just load the new one directly.
            loadNewPage();
        }
    }

    /**
     * If a page template is not loaded, it instantiates it from settings.
     * @private
     */
    _ensurePageTemplate() {
        if (this.pageTemplate) return;

        const PageTemplateClass = this.settings.pageTemplate;
        if (!PageTemplateClass) {
            throw new Error("No PageTemplate defined in application settings.");
        }
        this.pageTemplate = new PageTemplateClass();
    }

    /**
     * Processes the next queued page load request, if any.
     * @private
     */
    _processDelayedPageLoads() {
        if (this.delayedScheduledPageLoads.length > 0) {
            const { pageName, urlParameters, ignoreHistory, callback, pageParameters } = this.delayedScheduledPageLoads.shift();
            this.loadPage(pageName, urlParameters, ignoreHistory, callback, pageParameters);
        }
    }

    /**
     * Cleans up the properties of the previously active page to prevent memory leaks.
     * @private
     */
    _cleanupActivePage() {
        if (this.activePage) {
            this.activePage.removeDom();
            this.activePage.clearProps();
            this.activePage = null;
        }
    }

    /**
     * Registers the current page section in the URL manager.
     * @private
     * @param {string} section - The section name to register.
     */
    _registerUrlSection(section) {
        UrlManager.registerModule("section", section);
        UrlManager.setModule("section", section, true);
    }

    //endregion
}
export const UrlManagerNavigationHistory = (function(){
    var modules = {};
    var listeners = {};
    var lastUrl = "";

    var getUrlParams = function(path){
        var split = path.split("/");
        var params = {};
        params.section = split[1];
        for (var i = 2; i < split.length; i+=2){
            params[split[i]] = split[i+1];
        }
        return params;
    };

    var init = function(){
        //console.log("init")
        addEventListener("popstate", (event) => {

            var urlPath = event.target.document.location.pathname;
            var currentUrlParams = getUrlParams(urlPath);

            for (var key in modules){

                if (!currentUrlParams[key]){
                    ///removed
                    //if (key == "section") {
                    delete modules[key];
                    //}
                    if (listeners[key]){
                        for (var i = 0; i < listeners[key].length; i++){
                            listeners[key][i](event,currentUrlParams[key],currentUrlParams[key]);
                            if (!listeners[key]) break;
                        }
                    }
                }
                else if (modules[key] != currentUrlParams[key]){

                    if (listeners[key]){
                        for (var i = 0; i < listeners[key].length; i++){
                            modules[key] = currentUrlParams[key];
                            listeners[key][i](event,currentUrlParams[key],currentUrlParams[key]);
                        }
                    }
                }
            }

            //auto add new modules
            for (var key in currentUrlParams){
                if (!modules[key]){
                    modules[key] = currentUrlParams[key];
                }
            }
        });
    };

    init();

    return {

        updateUrl : function(replace){

            var url = "";
            if (modules["section"]){
                url += "/"+modules["section"];
            }
            for (var key in modules){
                if (key == "section") continue;
                url += "/"+key+"/"+modules[key];
            }

            if (window.location.pathname == url){
                //console.log("url not changed #2 ",url);
                return;
            }
            lastUrl = url;

            if (replace){
                history.replaceState(null,null,url);
            }
            else {
                history.pushState(null, null, url);
            }
        },

        setModule : function(module,value,dontUpdateUrl,dontAffectHistory){
            modules[module] = value;
            if (!dontUpdateUrl){
                this.updateUrl(dontAffectHistory);
            }
        },

        getModule : function(module){
            return modules[module];
        },

        registerModule : function(module){
            if (!listeners[module]){
                listeners[module] = [];
            }
        },

        removeModule : function(module){
            delete modules[module];
        },

        listenModule : function(module,handler){
            if (!listeners[module]){
                listeners[module] = [];
            }
            listeners[module].push(handler);
        },

        unlistenModule : function(module,handler){
            delete listeners[module];
        },

        stopChecking : function(){
            //console.log("stop checking");
        },

        startChecking : function(){
            //console.log("start checking");
        },

        saveModuleHistory : function(module){

        },

        getModuleHistory : function(module){

        },

        clearUrl : function(){
            modules = {};
        },

        autoRegisterModules : function(){
            var urlPath = document.location.pathname;
            var currentUrlParams = getUrlParams(urlPath);
            for (var key in currentUrlParams){
                if (modules[key]) continue;
                modules[key] = currentUrlParams[key];
            }
        }
    }
    init();
})();


export const UrlManager = UrlManagerNavigationHistory;
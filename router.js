class Router {
    constructor(){
        this.getRoutes = {},
        this.postRoutes = {},
        this.deleteRoutes = {},
        this.putRoutes = {},
        this.patchRoutes = {}
    }

    _get(url, controller, middleware = []){
        this.getRoutes[url] = [...middleware, controller];
    }

    _post(url, controller, middleware = []){
        this.postRoutes[url] = [...middleware, controller];
    }

    _delete(url, controller, middleware = []){
        this.deleteRoutes[url] = [...middleware, controller];
    }

    _put(url, controller, middleware = []){
        this.putRoutes[url] = [...middleware, controller];
    }

    _patch(url, controller, middleware = []){
        this.patchRoutes[url] = [...middleware, controller];
    }
}

module.exports = Router;



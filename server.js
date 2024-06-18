const http = require("http");

const Router = require('./router');
const router = new Router();

const RestService = require('./rest-service');
const restService = new RestService(router);

const serverHandler = restService.initialize();

const server = http.createServer(serverHandler);

const port = 3000;
server.listen(port, "127.0.0.1", () => console.log(`Server started! At port ${port}`));

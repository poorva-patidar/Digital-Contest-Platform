const url = require("url");
const formidable = require("formidable");
const response = require("./utils/response-handler");
const constants = require("./utils/constants");

const {
  signInController,
  signUpController,
  createUserController,
  deleteUserController,
  updateUserController,
  getUserController,
  getUsersController,
  activateUserController,
  forgotPasswordController,
  resetPasswordController,
} = require("./controllers/user-controller");

const {
  getReferralsController,
  sendReferralController,
} = require("./controllers/user-referral-controllers");

const {
  getMatchController,
  getMatchesController,
} = require("./controllers/match-controller");

const {
  createContestController,
  getContestByMatchController,
  deleteContestController,
  getContestController,
  getHostedContestController,
  getParticipatedContestController,
  updateContestController,
  sendContestInviteController,
} = require("./controllers/contest-controller");

const {
  getContestResultController,
  joinContestController
} = require('./controllers/contest-info-controller');

const {
  protect,
  checkUserPermission,
  checkUpdateDeleteUserPermission
} = require("./middlewares/auth-middlewares");

const createSuperAdminController = require("./test/create-super-admin");

class RestService {
  constructor(router) {
    this.router = router;
  }

  async requestHandler(req, res, routerMapping) {
    const parsedUrl = url.parse(req.url, true);
    req.pathname = parsedUrl.pathname;
    req.query = parsedUrl.query;
    req.body = await this.getRequestBody(req);

    if (req.body === false) {
      response.error(
        res,
        constants.error.UNSUPPORTED_FORMAT,
        constants.status.BAD_REQUEST
      );
      return;
    }

    req.cookies = this.parseCookies(req);

    this.setUrlPathAndParams(req, Object.keys(routerMapping));

    const methods = routerMapping[req.urlPath ?? req.pathname];

    if (!methods) {
      response.error(
        res,
        constants.error.ROUTE_NOT_FOUND,
        constants.status.NOT_FOUND
      );
      return;
    }

    for (let method of methods) {
      const check = await method(req, res);
      if (!check) {
        break;
      }
    }
  }

  async getRequestBody(req) {
    const contentType =
      req.headers["content-type"] || req.headers["Content-Type"];

    if (!contentType) return "";

    if (contentType === "text/json" || contentType === "application/json") {
      return await this.getJsonData(req);
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await this.getFormData(req);
      req.files = formData.files;
      const bodyData = {};
      for (const key in formData.fields) {
        bodyData[key] =
          formData.fields[key].length === 1
            ? formData.fields[key][0]
            : formData.fields[key];
      }
      return bodyData;
    } else if (contentType === "application/x-www-form-urlencoded") {
      return await this.getUrlEncodedData(req);
    } else {
      console.log("Unsupported format");
      return false;
    }
  }

  async getJsonData(req) {
    return new Promise((resolve, reject) => {
      let bodyData = [];
      req.on("data", (chunk) => bodyData.push(chunk));
      req.on("end", () => {
        if (!bodyData[0]) resolve({});
        else resolve(JSON.parse(Buffer.from(...bodyData)));
      });
      req.on("error", () => {
        reject("Some error occurred!");
      });
    });
  }

  async getFormData(req) {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });
  }

  async getUrlEncodedData(req) {
    return new Promise((resolve, reject) => {
      let bodyString = [];
      req.on("data", (chunk) => (bodyString += chunk.toString()));
      req.on("end", () => {
        const bodyData = {};
        const entries = bodyString.split("&");

        entries.forEach((entry) => {
          const [key, value] = entry.split("=");
          bodyData[decodeURIComponent(key)] = decodeURIComponent(value);
        });

        resolve(bodyData);
      });

      req.on("error", () => {
        reject("Some error occurred!");
      });
    });
  }

  setUrlPathAndParams(req, routesList) {
    const urlArray = req.pathname.split("/");

    for (let route of routesList) {
      const params = {};
      const routeArray = route.split("/");

      if (routeArray.length !== urlArray.length) continue;

      let i;
      for (i = 0; i < urlArray.length; i++) {
        if (urlArray[i] !== routeArray[i]) {
          if (routeArray[i].startsWith(":")) {
            params[routeArray[i].slice(1)] = urlArray[i];
          } else {
            break;
          }
        }
      }

      if (i === urlArray.length && Object.keys(params).length) {
        req.urlPath = route;
        req.params = params;
        break;
      } else if (i === urlArray.length) {
        break;
      }
    }
  }

  parseCookies(req) {
    const cookiesString = req.headers["cookie"] || req.headers["Cookie"] || "";

    if (cookiesString) {
      const cookiesList = cookiesString.split(";");
      const cookies = {};

      for (let cookie of cookiesList) {
        const [key, value] = cookie.split("=");
        cookies[key.trim()] = value.trim();
      }
      return cookies;
    }

    return cookiesString;
  }

  setCORS(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  initialize() {
    this.userRoutes();
    this.testRoutes();
    this.referralRoutes();
    this.matchRoutes();
    this.contestRoutes();
    this.contestInfoRoutes();

    return async (req, res) => {
      this.setCORS(res);
      switch (req.method.toUpperCase()) {
        case "GET":
          await this.requestHandler(req, res, this.router.getRoutes);
          break;

        case "POST":
          await this.requestHandler(req, res, this.router.postRoutes);
          break;

        case "DELETE":
          await this.requestHandler(req, res, this.router.deleteRoutes);
          break;

        case "PUT":
          await this.requestHandler(req, res, this.router.putRoutes);
          break;

        case "PATCH":
          await this.requestHandler(req, res, this.router.patchRoutes);
          break;

        case "OPTIONS":
          response.success(res, "OK", constants.status.OK);
          break;

        default:
          response.error(
            res,
            constants.error.METHOD_NOT_ALLOWED,
            constants.status.BAD_REQUEST
          );
      }
    };
  }

  testRoutes() {
    this.router._post("/api/v1/superadmin", createSuperAdminController);
  }

  userRoutes() {
    this.router._post("/api/v1/user", createUserController, [
      protect,
      checkUserPermission,
    ]);
    this.router._patch("/api/v1/user/activate", activateUserController);
    this.router._post("/api/v1/user/forgot-password", forgotPasswordController);
    this.router._patch("/api/v1/user/reset-password", resetPasswordController);
    this.router._delete("/api/v1/user/:userId", deleteUserController, [
      protect,
      checkUpdateDeleteUserPermission
    ]);
    this.router._patch("/api/v1/user/:userId", updateUserController, [protect, checkUpdateDeleteUserPermission]);
    this.router._get("/api/v1/users", getUsersController, [
      protect,
      checkUserPermission,
    ]);
    this.router._get("/api/v1/user/:userId", getUserController, [protect, checkUpdateDeleteUserPermission]);
    this.router._post("/api/v1/signUp", signUpController);
    this.router._post("/api/v1/signIn", signInController);
  }

  referralRoutes() {
    this.router._get("/api/v1/referral", getReferralsController, [protect]);
    this.router._post("/api/v1/referral", sendReferralController, [protect]);
  }

  matchRoutes() {
    this.router._get("/api/v1/match", getMatchesController, [protect]);
    this.router._get("/api/v1/match/:matchId", getMatchController, [protect]);
  }

  contestRoutes() {
    this.router._get("/api/v1/contest/hosted", getHostedContestController, [protect]);
    this.router._get("/api/v1/contest/participated", getParticipatedContestController, [
      protect,
    ]);
    this.router._get("/api/v1/contest/:contestId", getContestController, [protect]);
    this.router._get("/api/v1/contest/match/:matchId", getContestByMatchController, [
      protect,
    ]);
    this.router._post("/api/v1/contest", createContestController, [protect]);
    this.router._patch("/api/v1/contest/:contestId", updateContestController, [protect]);
    this.router._delete("/api/v1/contest/:contestId", deleteContestController, [protect]);
    this.router._post("/api/v1/contest/invite/:contestId", sendContestInviteController, [
      protect,
    ]);
  }

  contestInfoRoutes() {
    this.router._get("/api/v1/contest/result/:contestId", getContestResultController, [protect]);
    this.router._post("/api/v1/contest/join/:contestId", joinContestController, [protect]);
  }
}

module.exports = RestService;

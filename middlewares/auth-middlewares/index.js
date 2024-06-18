const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/environment");
const { response, constants, CustomError } = require('../../utils');

const buildProtect = require('./protect');
const protect = buildProtect(response, constants, CustomError, jwt, JWT_SECRET);

const buildCheckUserPermission = require('./check-user-permission');
const checkUserPermission = buildCheckUserPermission(response, constants);

const buildCheckUpdateDeleteUserPermission = require("./check-update-delete-user-permission")
const checkUpdateDeleteUserPermission = buildCheckUpdateDeleteUserPermission({ constants, response });

module.exports = Object.freeze({
    protect,
    checkUserPermission,
    checkUpdateDeleteUserPermission
});


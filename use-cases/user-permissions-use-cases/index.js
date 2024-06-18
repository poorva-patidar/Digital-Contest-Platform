const Joi = require('joi')
const { userPermissionsDb } = require('../../data-access');   
const { CustomError, constants } = require('../../utils');

const buildCheckAdminPermissions = require('./check-admin-permissions');
const checkAdminPermissions = buildCheckAdminPermissions({userPermissionsDb, constants, CustomError, Joi});

const buildCreateUserPermission = require('./create-user-permission');
const createUserPermission = buildCreateUserPermission({userPermissionsDb, constants, CustomError, Joi});

module.exports = Object.freeze({
    checkAdminPermissions,
    createUserPermission
});
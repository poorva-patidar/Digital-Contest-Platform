const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { CLIENT_URL, JWT_SECRET } = require("../../config/environment");
const {
  userDb,
  userReferralDb,
  userPermissionsDb,
} = require("../../data-access");

const {
  CustomError,
  constants,
  generateCode,
  sendEmail,
  verifyPassword,
} = require("../../utils");

const buildCreateUser = require("./create-user");
const createUser = buildCreateUser({
  userDb,
  userReferralDb,
  generateCode,
  constants,
  CustomError,
  jwt,
  sendEmail,
  CLIENT_URL,
  JWT_SECRET,
  Joi
});

const buildDeleteUser = require("./delete-user");
const deleteUser = buildDeleteUser({ userDb, constants, CustomError, Joi });

const buildUpdateUser = require("./update-user");
const updateUser = buildUpdateUser({
  userDb,
  userPermissionsDb,
  constants,
  CustomError,
  Joi
});

const buildSignInUser = require("./sign-in-user");
const signInUser = buildSignInUser({
  userDb,
  constants,
  CustomError,
  verifyPassword,
  Joi,
});

const buildGetUserByEmail = require("./get-user-by-email");
const getUserByEmail = buildGetUserByEmail({
  userDb,
  constants,
  CustomError,
  Joi,
});

const buildActivateUser = require("./activate-user");
const activateUser = buildActivateUser({
  userDb,
  userPermissionsDb,
  constants,
  CustomError,
  Joi,
});

const buildGetUserById = require("./get-user-by-id");
const getUserById = buildGetUserById({ userDb, constants, CustomError, Joi });

const buildGetUsers = require("./get-users");
const getUsers = buildGetUsers({ userDb, constants, CustomError, Joi });

const buildForgotPassword = require("./forgot-password");
const forgotPassword = buildForgotPassword({
  userDb,
  constants,
  CustomError,
  jwt,
  sendEmail,
  CLIENT_URL,
  JWT_SECRET,
  Joi,
});

const buildResetPassword = require("./reset-password");
const resetPassword = buildResetPassword({
  userDb,
  constants,
  CustomError,
  Joi,
});

module.exports = Object.freeze({
  createUser,
  deleteUser,
  updateUser,
  signInUser,
  getUserByEmail,
  activateUser,
  getUserById,
  getUsers,
  forgotPassword,
  resetPassword,
});

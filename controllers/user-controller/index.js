const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/environment");
const { response, CustomError, constants } = require('../../utils');

const buildSignUpController = require("./sign-up-controller");
const signUpController = buildSignUpController(
  response,
  constants,
  CustomError,
  setToken
);

const buildSignInController = require("./sign-in-controller");
const signInController = buildSignInController(
  response,
  constants,
  CustomError,
  setToken
);

const buildCreateUserController = require("./create-user-controller");
const createUserController = buildCreateUserController(
  response,
  constants,
  CustomError
);

const buildActivateUserController = require("./activate-user-controller");
const activateUserController = buildActivateUserController(
  response,
  constants,
  CustomError,
  jwt,
  JWT_SECRET
);

const buildForgotPasswordController = require("./forgot-password-controller");
const forgotPasswordController = buildForgotPasswordController(
  response,
  constants,
  CustomError
);

const buildResetPasswordController = require("./reset-password-controller");
const resetPasswordController = buildResetPasswordController(
  response,
  constants,
  CustomError,
  jwt,
  JWT_SECRET
);

const buildUpdateUserController = require("./update-user-controller");
const updateUserController = buildUpdateUserController(
  response,
  constants,
  CustomError
);

const buildDeleteUserController = require("./delete-user-controller");
const deleteUserController = buildDeleteUserController(
  response,
  constants,
  CustomError
);

const buildGetUserController = require("./get-user-controller");
const getUserController = buildGetUserController(
  response,
  constants,
  CustomError
);

const buildGetUsersController = require("./get-users-controller");
const getUsersController = buildGetUsersController(
  response,
  constants,
  CustomError
);

function setToken(rememberMe, email) {
  let token;
  let cookie;
  if (rememberMe) {
    const expiryTime = new Date();
    expiryTime.setTime(expiryTime.getTime() + 7 * 24 * 60 * 60 * 1000);
    token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
    cookie = `token=${token}; expires=${expiryTime.toUTCString()}; Secure; path=/;`;
  } else {
    token = jwt.sign({ email }, JWT_SECRET);
    cookie = `token=${token}; Secure; path=/;`;
  }
  return cookie;
}

module.exports = Object.freeze({
  createUserController,
  forgotPasswordController,
  resetPasswordController,
  signInController,
  signUpController,
  activateUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  getUsersController,
});

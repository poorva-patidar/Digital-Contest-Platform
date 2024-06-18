const {
  Given,
  When,
  Then,
  BeforeAll,
  Before,
  After,
  AfterAll,
} = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();
const Joi = require("joi");
const { CustomError, constants} = require("../../utils");
const buildForgotPassword = require('./forgot-password');
const { CLIENT_URL, JWT_SECRET } = require("../../config/environment");

const userDb = {
  findByEmail: () => {},
};

const utils = {
    sendEmail: () => {},
}

const jwt = {
    sign: sinon.stub().returns("jwt token")
}

let findByEmailStub;
let sendEmailStub;

BeforeAll(() => {
  findByEmailStub = sandBox.stub(userDb, "findByEmail");
  sendEmailStub = sandBox.stub(utils, "sendEmail");
});

Before(() => {
  findByEmailStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    if (args.email === "usernotfound@email.com") {
      return undefined;
    }

    return {
      id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      name: "Akhya B",
      email: "akhya@example.com",
      password: "5e2b266c0259ab352c5750139329551a",
      role: "admin",
      balance: "100",
      referral_code: "4042573",
      created_at: "2024-06-03T11:18:49.663Z",
      updated_at: "2024-06-03T11:42:17.572Z",
    };
  });

  sendEmailStub.callsFake((args) => {
    return true;
  });
});

After(() => {
  sandBox.resetHistory();
  this.email = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("email: {string} forgot-password", async (email) => {
  this.email = email;
});

When("try for forgot password", async () => {
  const forgotPassword = buildForgotPassword({
    userDb,
    constants,
    CustomError,
    jwt,
    sendEmail: utils.sendEmail,
    CLIENT_URL: "http://client.com",
    JWT_SECRET: "secret key",
    Joi,
  });

  try {
    await forgotPassword(this.email);
    this.result = "Email sent successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for forgot password",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for forgot password",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

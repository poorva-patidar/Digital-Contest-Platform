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
const { CustomError, constants } = require("../../utils");
const buildResetPassword = require('./reset-password');

const userDb = {
  findByEmail: () => {},
  updatePassword: () => {},
};

let findByEmailStub;
let updatePasswordStub;


BeforeAll(() => {
  findByEmailStub = sandBox.stub(userDb, "findByEmail");
  updatePasswordStub = sandBox.stub(userDb, "updatePassword");
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
      role: "admin",
      balance: "100",
      referral_code: "4042573",
      created_at: "2024-06-03T11:18:49.663Z",
      updated_at: "2024-06-03T11:42:17.572Z",
    };
  });

  updatePasswordStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("password");
  });
});

After(() => {
  sandBox.resetHistory();
  this.email = undefined;
  this.password = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "email: {string}, password: {string} reset-password",
  async (email, password) => {
    this.email = email;
    this.password = password;
  }
);

When("try to reset password", async () => {
  const resetPassword = buildResetPassword({
    userDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    await resetPassword(this.email, this.password);
    this.result = "Password updated successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for reset password",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for reset password",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

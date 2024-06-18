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
const { CustomError, constants, verifyPassword } = require("../../utils");
const buildSignInUser = require('./sign-in-user');

const userDb = {
  findByEmail: () => {},
};

const utils = {
  verifyPassword: () => {},
};

let findByEmailStub;
let verifyPasswordStub;

BeforeAll(() => {
  findByEmailStub = sandBox.stub(userDb, "findByEmail");
  verifyPasswordStub = sandBox.stub(utils, "verifyPassword");
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

  verifyPasswordStub.callsFake((args) => {
    expect(args).to.have.own.property("password");
    expect(args).to.have.own.property("hashedPassword");

    if(args.password === "invalidPassword"){
        return false;
    }

    return true;
  })
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
  "email: {string}, password: {string} sign-in-user",
  async (email, password) => {
    this.email = email;
    this.password = password;
  }
);

When("try to sign in user", async () => {
  const signInUser = buildSignInUser({
    userDb,
    constants,
    CustomError,
    verifyPassword: utils.verifyPassword,
    Joi,
  });

  try {
    await signInUser(this.email, this.password);
    this.result = "User logged in successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for sign in user",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for sign in user",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

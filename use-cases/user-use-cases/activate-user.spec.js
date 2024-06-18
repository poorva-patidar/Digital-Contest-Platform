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
const buildActivateUser = require("./activate-user");

const userDb = {
  findByEmail: () => {},
  updatePassword: () => {},
};

const userPermissionDb = {
  updateStatus: () => {},
};

let findByEmailStub;
let updatePasswordStub;
let updateStatusStub;

BeforeAll(() => {
  findByEmailStub = sandBox.stub(userDb, "findByEmail");
  updatePasswordStub = sandBox.stub(userDb, "updatePassword");
  updateStatusStub = sandBox.stub(userPermissionDb, "updateStatus");
});

Before(() => {
  findByEmailStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    if (args.email === "usernotfound@email.com") {
      return undefined;
    }

    if (args.email === "alreadyactivated@example.com") {
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

  updateStatusStub.callsFake((args) => {
    expect(args).to.have.own.property("userId");
    expect(args).to.have.own.property("status");
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
  "email: {string}, password: {string} activate-user",
  async (email, password) => {
    this.email = email;
    this.password = password;
  }
);

When("try to activate user", async () => {
  const activateUser = buildActivateUser({
    userDb,
    userPermissionDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    await activateUser(this.email, this.password);
    this.result = "User activated successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for activate user",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for activate user",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

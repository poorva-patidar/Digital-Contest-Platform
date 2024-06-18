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
const buildCreateUserPermission = require('./create-user-permission');

const userPermissionsDb = {
  insert: () => {},
};

let insertStub;

BeforeAll(() => {
  insertStub = sandBox.stub(userPermissionsDb, "insert");
});

Before(() => {
  insertStub.callsFake((args) => {
    expect(args).to.have.own.property("userId");
    expect(args).to.have.own.property("status");
    expect(args).to.have.own.property("createUser");
    expect(args).to.have.own.property("updateUser");
    expect(args).to.have.own.property("deleteUser");
    expect(args).to.have.own.property("createContest");
    expect(args).to.have.own.property("updateContest");
    expect(args).to.have.own.property("deleteContest");
  });
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.permissions = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "userId: {string}, permissions: {string} create-user-permissions",
  async (userId, permissions) => {
    this.userId = userId;
    this.permissions = permissions ? JSON.parse(permissions): permissions ;
  }
);

When("try to create user permissions", async () => {
  const createUserPermission = buildCreateUserPermission({
    userPermissionsDb,
    constants,
    Joi,
  });

  try {
    await createUserPermission(this.userId, this.permissions);
    this.result = "User permissions created successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for creating user permissions",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for creating user permissions",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

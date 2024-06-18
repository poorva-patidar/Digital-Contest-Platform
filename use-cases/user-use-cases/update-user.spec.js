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
const buildUpdateUser = require('./update-user');

const userDb = {
  findById: () => {},
  update: () => {},
  findByEmail: () => {},
};

const userPermissionDb = {
    findByUserId: () => {},
    updatePermissions: () => {}
}

let findByIdStub;
let updateStub;
let findByEmailStub;
let findByUserIdStub;
let updatePermissionsStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(userDb, "findById");
  updateStub = sandBox.stub(userDb, "update");
  findByEmailStub = sandBox.stub(userDb, "findByEmail");
  findByUserIdStub = sandBox.stub(userPermissionDb, "findByUserId");
  updatePermissionsStub = sandBox.stub(userPermissionDb, "updatePermissions");
});

Before(() => {
  findByIdStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    if (args.id === "2100582a-bcfd-439c-a401-af2c79e12dc2") return false;
    return {
      id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      name: "yuvraj",
      email: "yuvraj@example.com",
      password: "825037248b80d7865e9f1525628b714a",
      role: "user",
      balance: 167,
      referral_code: "8179101",
      created_at: "2024-06-01T10:41:59.000Z",
      updated_at: "2024-06-01T19:55:35.000Z",
    };
  });

  updateStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("data");
  });

  findByEmailStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    return false;
  });

  findByUserIdStub.callsFake((args) => {
    expect(args).to.have.own.property("userId");
  });

  updatePermissionsStub.callsFake((args) => {
    expect(args).to.have.own.property("userId");
    expect(args).to.have.own.property("permissions");
  })
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.userData = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("userId: {string}, userData: {string} update-user", async (userId, userData) => {
  this.userId = userId;
  this.userData = JSON.parse(userData);
});

When("try to update a user", async () => {
  const updateUser = buildUpdateUser({
    userDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    await updateUser(this.userId, this.userData);
    this.result = "User updated successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for updating a user",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for updating a user",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

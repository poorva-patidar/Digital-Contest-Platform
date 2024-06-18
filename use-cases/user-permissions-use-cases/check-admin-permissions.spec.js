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
const buildCheckAdminPermissions = require("./check-admin-permissions");

const userPermissionDb = {
  findByUserId: () => {},
};

let findByUserIdStub;

BeforeAll(() => {
  findByUserIdStub = sandBox.stub(userPermissionDb, "findByUserId");
});

Before(() => {
    findByUserIdStub.callsFake((args) => {
    expect(args).to.have.own.property("userId");
    if (args.userId === "9b1e63a4-15c8-46d3-b493-c5125ef4d009") return {
        create_user: false,
        update_user: false,
        delete_user: false,
        create_contest: false,
        update_contest: false,
        delete_contest: false
    };

    return {
        create_user: true,
        update_user: true,
        delete_user: true,
        create_contest: true,
        update_contest: true,
        delete_contest: true
    };
  });
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.userRole = undefined;
  this.permission = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "userId: {string}, userRole: {string}, permission: {string} check-admin-permissions",
  async (userId, userRole, permission) => {
    this.userId = userId;
    this.userRole = userRole;
    this.permission = permission;
  }
);

When("try to check admin permissions", async () => {
  const checkAdminPermissions = buildCheckAdminPermissions({
    userPermissionDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    await checkAdminPermissions(this.userId, this.userRole, this.permission);
    this.result = "Allowed";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for checking admin permissions",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for checking admin permissions",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

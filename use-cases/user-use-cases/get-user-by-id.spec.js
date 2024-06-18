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
const buildGetUserById = require('./get-user-by-id');

const userDb = {
  findById: () => {},
};

let findByIdStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(userDb, "findById");
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
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("userId: {string} get-user", async (userId) => {
  this.userId = userId;
});

When("try to get a user", async () => {
  const getUserById = buildGetUserById({
    userDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    const user = await getUserById(this.userId);
    this.result = JSON.stringify(user);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting a user",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting a user",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

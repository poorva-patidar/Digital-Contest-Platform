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
const { CustomError, constants } = require('../../utils');
const buildGetUserByEmail = require('./get-user-by-email');

const userDb = {
  findByEmail: () => {},
};

let findByEmailStub;

BeforeAll(() => {
  findByEmailStub = sandBox.stub(userDb, "findByEmail");
});

Before(() => {
  findByEmailStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    if(args.email === "usernotfound@email.com"){
      return undefined;
    }

    return {
        "id": "7100582a-bcfd-439c-a401-af2c79e12dc1",
        "name": "Akhya B",
        "email": "akhya@example.com",
        "password": "5e2b266c0259ab352c5750139329551a",
        "role": "admin",
        "balance": "100",
        "referral_code": "4042573",
        "created_at": "2024-06-03T11:18:49.663Z",
        "updated_at": "2024-06-03T11:42:17.572Z"
    };
  });
});

After(() => {
  sandBox.resetHistory();
  this.email = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given('the minimalism', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'success';
});

Given('email: {string} get-user-by-email', async(email) => {
    this.email = email;
});

When('try to get user by email', async() => {
    const getUserByEmail = buildGetUserByEmail({
        userDb,
        constants,
        CustomError,
        Joi
    });

    try {
        const user = await getUserByEmail(this.email);
        this.result = JSON.stringify(user);
    } catch(error){
        this.error = error.message;
    }
});

Then('It should return the result: {string} for getting user by email', async(result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
});

Then('It should return the error: {string} for getting user by email', async(error) => {
    expect(this.error).to.be.equal(error);
});


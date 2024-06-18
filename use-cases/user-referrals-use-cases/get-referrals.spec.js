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
const buildGetReferrals = require("./get-referrals");

const userReferralDb = {
  findByReferrerId: () => {},
};

let findByReferrerIdStub;

BeforeAll(() => {
  findByReferrerIdStub = sandBox.stub(userReferralDb, "findByReferrerId");
});

Before(() => {
  findByReferrerIdStub.callsFake((args) => {
    expect(args).to.have.own.property("referrerId");
    if (args.referrerId === "2100582a-bcfd-439c-a401-af2c79e12dc2") return [];
    return [
      {
        referrer_id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
        referred_email: "mohit@example.com",
        status: "accepted",
      },
      {
        referrer_id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
        referred_email: "shyam@example.com",
        status: "accepted",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.referrerId = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("referrerId: {string} get-referrals", async (referrerId) => {
  this.referrerId = referrerId;
});

When("try to get all referrals", async () => {
  const getReferrals = buildGetReferrals({
    userReferralDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    const referrals = await getReferrals(this.referrerId);
    this.result = JSON.stringify(referrals);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting all referrals",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting all referrals",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

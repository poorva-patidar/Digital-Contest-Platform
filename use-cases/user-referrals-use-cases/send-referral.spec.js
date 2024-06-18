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
const buildSendReferral = require("./send-referral");
const { constants, CustomError } = require("../../utils");
const Joi = require("joi");

const userReferralDb = {
  findByReferrerAndReferred: () => {},
  insert: () => {},
};

const externalFunctions = {
  sendEmail: () => {},
};

let findByReferrerAndReferredStub;
let insertUserReferralStub;
let sendEmailStub;

BeforeAll(() => {
  findByReferrerAndReferredStub = sandBox.stub(
    userReferralDb,
    "findByReferrerAndReferred"
  );

  insertUserReferralStub = sandBox.stub(userReferralDb, "insert");
  sendEmailStub = sandBox.stub(externalFunctions, "sendEmail");
});

Before(() => {
  findByReferrerAndReferredStub.callsFake((args) => {
    expect(args).to.have.own.property("referrerId");
    expect(args).to.have.own.property("referredEmail");
    if (
      args.referrerId === "2100582a-bcfd-439c-a401-af2c79e12dc2" &&
      args.referredEmail === "alreadyexist@example.com"
    )
      return true;
    return false;
  });

  insertUserReferralStub.callsFake((args) => {
    expect(args).to.have.own.property("referrerId");
    expect(args).to.have.own.property("referredEmail");
    expect(args).to.have.own.property("status");
  });

  sendEmailStub.callsFake(() => {
    return true;
  });
});

After(() => {
  sandBox.resetHistory();
  this.referrerId = undefined;
  this.referredEmail = undefined;
  this.referralCode = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "referrerId: {string}, referredEmail: {string}, referralCode: {string} send-referral",
  async (referrerId, referredEmail, referralCode) => {
    this.referrerId = referrerId;
    this.referredEmail = referredEmail;
    this.referralCode = referralCode === '' ? undefined: +referralCode;
  }
);

When("try to send referral", async () => {
  const sendReferral = buildSendReferral({
    userReferralDb,
    constants,
    CustomError,
    sendEmail: externalFunctions.sendEmail,
    Joi,
  });

  try {
    await sendReferral(this.referrerId, this.referredEmail, this.referralCode);
    this.result = "Referral sent successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for sending referral",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for sending referral",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

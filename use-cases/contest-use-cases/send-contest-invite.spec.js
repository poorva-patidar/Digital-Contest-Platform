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
const buildSendContestInvite = require('./send-contest-invite');

const contestDb = {
  findById: () => {},
};

const utils = {
    sendEmail: () => {},
}

let findByIdStub;
let sendEmailStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(contestDb, "findById");
  sendEmailStub = sandBox.stub(utils, "sendEmail");
});

Before(() => {
  findByIdStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    if (args.id === "2200582a-bcfd-439c-a401-af2c79e12dc2") return false;
    return {
      id: "7100582a-abcd-439c-a401-af2c79e12dc1",
      name: "contest_3",
      contest_code: "17084",
      type: "private",
      status: "Finished",
      no_of_participants: 8,
      entry_fee: 10,
      total_winner: 3,
      created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      match_id: "6659c0be1b283595041e2144",
    };
  });

  sendEmailStub.callsFake(() => {
    return true;
  });

});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.contestId = undefined;
  this.email = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("userId: {string}, contestId: {string}, email: {string} send-contest-invite", async (userId, contestId, email) => {
  this.userId = userId;
  this.contestId = contestId,
  this.email = email
});

When("try to send contest invite", async () => {
  const sendContestInvite = buildSendContestInvite({
    contestDb,
    constants,
    CustomError,
    sendEmail: utils.sendEmail,
    Joi,
  });

  try {
    await sendContestInvite(this.userId, this.contestId, this.email);
    this.result = "Email sent successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for sending contest invite",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for sending contest invite",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

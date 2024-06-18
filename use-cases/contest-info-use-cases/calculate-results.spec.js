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
const buildCalculateAndUpdateResult = require("./calculate-results");

const contestInfoDb = {
  updateWinners: () => {},
  updateParticipants: () => {},
};

const userDb = {
  updateBalanceByRole: () => {},
  updateBalance: () => {},
};

let updateWinnersStub;
let updateParticipantsStub;
let updateBalanceStub;
let updateBalanceByRoleStub;

BeforeAll(() => {
  updateWinnersStub = sandBox.stub(contestInfoDb, "updateWinners");
  updateParticipantsStub = sandBox.stub(contestInfoDb, "updateParticipants");
  updateBalanceStub = sandBox.stub(userDb, "updateBalance");
  updateBalanceByRoleStub = sandBox.stub(userDb, "updateBalanceByRole");
});

Before(() => {
  updateWinnersStub.callsFake((args) => {
    expect(args).to.have.own.property("contestId");
    expect(args).to.have.own.property("participantId");
    expect(args).to.have.own.property("prizeAmount");
  });

  updateParticipantsStub.callsFake((args) => {
    expect(args).to.have.own.property("contestId");
    expect(args).to.have.own.property("participantId");
    expect(args).to.have.own.property("points");
    expect(args).to.have.own.property("participantRank");
  });

  updateBalanceByRoleStub.callsFake((args) => {
    expect(args).to.have.own.property("role");
    expect(args).to.have.own.property("amount");
  });

  updateBalanceStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("amount");
  });
});

After(() => {
  sandBox.resetHistory();
  this.match = undefined;
  this.contest = undefined;
  this.participants = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "match: {string}, contest: {string}, participants: {string} calculate-results",
  async (match, contest, participants) => {
    this.match = match ? JSON.parse(match) : match;
    this.contest = contest ? JSON.parse(contest) : contest;
    this.participants = participants ? JSON.parse(participants) : participants;
  }
);

When("try to calculate contest result", async () => {
  const calculateAndUpdateResult = buildCalculateAndUpdateResult({
    contestInfoDb,
    userDb
  });

  try {
    await calculateAndUpdateResult(
      this.match,
      this.contest,
      this.participants
    );
    this.result = "Result calculated successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for calculating contest result",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);
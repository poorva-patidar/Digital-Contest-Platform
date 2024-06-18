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
const buildCreateContest = require('./create-contest');

const contestDb = {
  findById: () => {},
  insert: () => {},
  getContestCodes: () => {}
};


const matchDb = {
  findById: () => {},
};

const utils = {
  generateCode: () => {},
};

let findByIdContestStub;
let insertStub;
let generateCodeStub;
let findByIdMatchStub;
let getContestCodesStub;

BeforeAll(() => {
  findByIdContestStub = sandBox.stub(contestDb, "findById");
  insertStub = sandBox.stub(contestDb, "insert");
  generateCodeStub = sandBox.stub(utils, "generateCode");
  findByIdMatchStub = sandBox.stub(matchDb, "findById");
  getContestCodesStub = sandBox.stub(contestDb, "getContestCodes");
});

Before(() => {
  findByIdContestStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    if (args.id === "2100582a-bcfd-439c-a401-af2c79e12dc2") return false;

    return {
      id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      name: "contest_2",
      contest_code: "2427",
      type: "private",
      status: "Upcoming",
      no_of_participants: 8,
      entry_fee: 10,
      total_winner: 3,
      created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      match_id: "6659c0be1b283595041e2144",
    };
  });

  insertStub.callsFake((args) => {
    expect(args).to.have.own.property("name");
    expect(args).to.have.own.property("contestCode");
    expect(args).to.have.own.property("type");
    expect(args).to.have.own.property("status");
    expect(args).to.have.own.property("noOfParticipants");
    expect(args).to.have.own.property("entryFee");
    expect(args).to.have.own.property("totalWinners");
    expect(args).to.have.own.property("createdBy");
    expect(args).to.have.own.property("matchId");
  });

  generateCodeStub.callsFake((args) => {
    return 1245543;
  });

  findByIdMatchStub.callsFake((args) => {
    expect(args).to.have.own.property("matchId");

    if (args.matchId === "6659c0be1b283595041e2148") return false;
    if (args.matchId === "6659c0be1b283595041e2149")
      return {
        status: "Live",
      };
    return {
      status: "Upcoming",
    };
  });

  getContestCodesStub.callsFake((args) => {
    return [];
  })
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.userRole = undefined;
  this.contest = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "userId: {string}, userRole: {string}, contest: {string} create-contest",
  async (userId, userRole, contest) => {
    this.userId = userId;
    this.userRole = userRole;
    this.contest = contest ? JSON.parse(contest): undefined;
  }
);

When("try to create contest", async () => {
  const createContest = buildCreateContest({
    contestDb,
    matchDb,
    generateCode: utils.generateCode,
    constants,
    CustomError,
    Joi,
  });

  try {
    await createContest(this.userId, this.userRole, this.contest);
    this.result = "Contest created successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for creating contest",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for creating contest",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

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
const buildGetContestByMatch = require("./get-contest-by-match");

const contestDb = {
  findByMatchId: () => {},
};

let findByMatchIdStub;

BeforeAll(() => {
  findByMatchIdStub = sandBox.stub(contestDb, "findByMatchId");
});

Before(() => {
  findByMatchIdStub.callsFake((args) => {
    expect(args).to.have.own.property("matchId");
    if (args.matchId === "8859c0be1b283595041e2144") return [];
    return [
      {
        id: "8200582a-bcfd-439c-a401-af2c79e12dc1",
        name: "contest_2",
        contest_code: "2427",
        type: "mega",
        status: "Finished",
        no_of_participants: 8,
        entry_fee: 10,
        total_winner: 3,
        created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
        match_id: "6659c0be1b283595041e2144",
      },
      {
        id: "8200582a-bcfd-439c-a401-af2c79e12dc2",
        name: "contest_3",
        contest_code: "17084",
        type: "mega",
        status: "Finished",
        no_of_participants: 8,
        entry_fee: 10,
        total_winner: 3,
        created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
        match_id: "6659c0be1b283595041e2144",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.matchId = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("userId: {string}, matchId: {string} get-contest-by-match", async (userId, matchId) => {
  this.userId = userId;
  this.matchId = matchId;
});

When("try to get contest by match", async () => {
  const getContestByMatch = buildGetContestByMatch({
    contestDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    const contests = await getContestByMatch(this.userId, this.matchId);
    this.result = JSON.stringify(contests);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting contest by match",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting contest by match",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

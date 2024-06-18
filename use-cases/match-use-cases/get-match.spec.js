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
const buildGetMatch = require("./get-match");

const matchDb = {
  findById: () => {},
};

let findByIdStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(matchDb, "findById");
});

Before(() => {
  findByIdStub.callsFake((args) => {
    expect(args).to.have.own.property("matchId");
    if (args.matchId === "663228a4c4f7dd33f8b72793") return false;
    return {
      id: "66595f7b1b283595041e0d82",
      name: "t20_blast_2024_sg7",
      status: "Finished",
      format: "T20",
      series: "T20 Blast 2024",
      team1_name: "Glamorgan",
      team2_name: "Surrey",
      team1_score: 181,
      team2_score: 200,
      winner: "Surrey",
      start_time: "2024-05-31T17:30:00.000Z",
    };
  });
});

After(() => {
  sandBox.resetHistory();
  this.matchId = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("matchId: {string} get-match", async (matchId) => {
  this.matchId = matchId;
});

When("try to get a match", async () => {
  const getMatch = buildGetMatch({
    matchDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    const match = await getMatch(this.matchId);
    this.result = JSON.stringify(match);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting a match",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting a match",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

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
const buildGetMatches = require("./get-matches");

const matchDb = {
  getSortedMatches: () => {},
  findAll: () => {},
};

let getSortedMatchesStub;
let findAllStub;

BeforeAll(() => {
  getSortedMatchesStub = sandBox.stub(matchDb, "getSortedMatches");
  findAllStub = sandBox.stub(matchDb, "findAll");
});

Before(() => {
  getSortedMatchesStub.callsFake((args) => {
    expect(args).to.have.own.property("sort");
    expect(args).to.have.own.property("order");
    expect(args).to.have.own.property("limit");
    expect(args).to.have.own.property("offset");
    if (args.offset === 20) {
      return false;
    }
    return [
      {
        id: "6598f3383fe3fde81aabdc8d",
        name: "t20_wc_2024_g1",
        status: "Upcoming",
        format: "T20",
        series: "Mens T20 World Cup 2024",
        team1_name: "United States",
        team2_name: "Canada",
        team1_score: null,
        team2_score: null,
        winner: null,
        start_time: "2024-06-02T00:30:00.000Z",
      },
      {
        id: "6659c0be1b283595041e21f4",
        name: "t20_blast_2024_sg17",
        status: "Upcoming",
        format: "T20",
        series: "T20 Blast 2024",
        team1_name: "Glamorgan",
        team2_name: "Sussex",
        team1_score: null,
        team2_score: null,
        winner: null,
        start_time: "2024-06-02T13:30:00.000Z",
      },
      {
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
      },
      {
        id: "66595ff0f8240694f69a6c6e",
        name: "t20_blast_2024_ng8",
        status: "Finished",
        format: "T20",
        series: "T20 Blast 2024",
        team1_name: "Leicestershire",
        team2_name: "Yorkshire",
        team1_score: 155,
        team2_score: 148,
        winner: "Leicestershire",
        start_time: "2024-05-31T17:30:00.000Z",
      },
    ];
  });

  findAllStub.callsFake((args) => {
    expect(args).to.have.own.property("limit");
    expect(args).to.have.own.property("offset");
    if (args.offset === 20) {
      return false;
    }

    return [
      {
        id: "6598f3383fe3fde81aabdc8d",
        name: "t20_wc_2024_g1",
        status: "Upcoming",
        format: "T20",
        series: "Mens T20 World Cup 2024",
        team1_name: "United States",
        team2_name: "Canada",
        team1_score: null,
        team2_score: null,
        winner: null,
        start_time: "2024-06-02T00:30:00.000Z",
      },
      {
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
      },
      {
        id: "66595ff0f8240694f69a6c6e",
        name: "t20_blast_2024_ng8",
        status: "Finished",
        format: "T20",
        series: "T20 Blast 2024",
        team1_name: "Leicestershire",
        team2_name: "Yorkshire",
        team1_score: 155,
        team2_score: 148,
        winner: "Leicestershire",
        start_time: "2024-05-31T17:30:00.000Z",
      },
      {
        id: "665965d4f8240694f69a6c88",
        name: "t20_blast_2024_sg9",
        status: "Finished",
        format: "T20",
        series: "T20 Blast 2024",
        team1_name: "Somerset",
        team2_name: "Essex",
        team1_score: 197,
        team2_score: 193,
        winner: "Somerset",
        start_time: "2024-05-31T17:30:00.000Z",
      },
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.sort = undefined;
  this.order = undefined;
  this.limit = undefined;
  this.offset = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "sort: {string}, order: {string}, limit: {int}, offset: {int} get-matches",
  async (sort, order, limit, offset) => {
    this.sort = sort;
    this.order = order;
    this.limit = limit;
    this.offset = offset;
  }
);

When("try to get matches", async () => {
  const getMatches = buildGetMatches({
    matchDb,
    constants,
    CustomError,
  });

  try {
    const matches = await getMatches(
      this.sort,
      this.order,
      this.limit,
      this.offset
    );
    this.result = JSON.stringify(matches);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting matches",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting matches",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

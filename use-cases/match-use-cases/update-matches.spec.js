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
const { CustomError, constants } = require("../../utils");
const buildUpdateMatches = require("./update-matches");

const matchDb = {
  findById: () => {},
  insert: () => {},
  update: () => {},
};

const utils = {
  getMatchUpdates: () => {},
};

const usecases = {
  updateContests: () => {},
};

let findByIdStub;
let getMatchUpdatesStub;
let insertStub;
let updateStub;
let updateContestsStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(matchDb, "findById");
  getMatchUpdatesStub = sandBox.stub(utils, "getMatchUpdates");
  insertStub = sandBox.stub(matchDb, "insert");
  updateStub = sandBox.stub(matchDb, "update");
  updateContestsStub = sandBox.stub(usecases, "updateContests");
});

Before(() => {
  getMatchUpdatesStub.callsFake(() => {
    return [
      {
        _id: "659906db75678ee810aa54a5",
        format: "T20",
        isPtable: true,
        key: "t20_wc_2024_g10",
        matchStatus: "Finished",
        matchSuffix: "10th Match, Group B",
        result: { message: "Australia won by 39 runs", wT: "aus" },
        srs: "Mens T20 World Cup 2024",
        srsKey: "t20_wc_2024",
        teams: {
          t1: {
            key: "aus",
            logo: "aus.png",
            name: "Australia",
            sName: "AUS",
            score: "164/5 (20.0)",
          },
          t2: {
            key: "omn",
            logo: "omn.png",
            name: "Oman",
            sName: "OMN",
            score: "125/9 (20.0)",
          },
        },
        time: 1717633800,
      },
      {
        _id: "665d71be1b283595041e97df",
        format: "T20",
        isPtable: true,
        key: "mpl_2024_6",
        matchStatus: "Finished",
        matchSuffix: "6th Match",
        result: { message: "Ratnagiri Jets won by 5 wickets", wT: "rj" },
        srs: "Maharashtra Premier League 2024",
        srsKey: "mpl_2024",
        teams: {
          t1: {
            key: "rj",
            logo: "rj.png",
            name: "Ratnagiri Jets",
            sName: "RJ",
            score: "190/5 (18.5)",
          },
          t2: {
            key: "kings",
            logo: "kings.png",
            name: "Chhatrapati Sambhaji Kings",
            sName: "KINGS",
            score: "188/9 (20.0)",
          },
        },
        time: 1717576200,
      },
    ];
  });

  findByIdStub.callsFake((args) => {
    expect(args).to.have.own.property("matchId");
    if (args.matchId === "659906db75678ee810aa54a5") return false;
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

  insertStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("name");
    expect(args).to.have.own.property("status");
    expect(args).to.have.own.property("format");
    expect(args).to.have.own.property("series");
    expect(args).to.have.own.property("team1Name");
    expect(args).to.have.own.property("team2Name");
    expect(args).to.have.own.property("team1Score");
    expect(args).to.have.own.property("team2Score");
    expect(args).to.have.own.property("winner");
    expect(args).to.have.own.property("startTime");
  });

  updateStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("data");
  });

  updateContestsStub.callsFake((args) => {
    expect(args).to.have.own.property("_id");
    expect(args).to.have.own.property("matchStatus");
    expect(args).to.have.own.property("key");
    expect(args).to.have.own.property("format");
    expect(args).to.have.own.property("series");
    expect(args).to.have.own.property("teams");
    expect(args).to.have.own.property("time");
  });
});

After(() => {
  sandBox.resetHistory();
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("update-matches", async () => {});

When("try to update matches", async () => {
  const updateMatches = buildUpdateMatches({
    matchDb,
    constants,
    CustomError,
    getMatchUpdates: utils.getMatchUpdates,
    updateContests: usecases.updateContests,
  });

  try {
    await updateMatches();
    this.result = "Matches updated successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for updating matches",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

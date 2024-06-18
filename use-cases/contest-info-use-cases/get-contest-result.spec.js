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
const buildGetContestResult = require('./get-contest-result');

const contestDb = {
  findById: () => {},
};

const contestInfoDb = {
  findByContest: () => {},
};

let findByIdStub;
let findByContestStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(contestDb, "findById");
  findByContestStub = sandBox.stub(contestInfoDb, "findByContest");
});

Before(() => {
  findByIdStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    if (args.id === "2100582a-bcfd-439c-a401-af2c79e12dc2") return false;
    if(args.id === "2100582a-bcfd-439c-a401-af2c79e12dc5") return { status: "Live"};

    return {
      id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      name: "contest_2",
      contest_code: "2427",
      type: "private",
      status: "Finished",
      no_of_participants: 8,
      entry_fee: 10,
      total_winner: 3,
      created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      match_id: "6659c0be1b283595041e2144",
    };
  });


  findByContestStub.callsFake((args) => {
    expect(args).to.have.own.property("contestId");
    if(args.contestId === "2100582a-bcfd-439c-a401-af2c79e12dc3") return [];
    if(args.contestId === "7100582a-bcfd-439c-a401-af2c79e12dc1") return [
        {
            "contest_id": "7100582a-bcfd-439c-a401-af2c79e12dc1",
            "participant_id": "4d21c2e5-d9d2-4206-b1b1-53694f3452eb",
            "chosen_team": "Chennai super kings",
            "score_guess": 200,
            "points": 1200,
            "participant_rank": 1,
            "prize_amount": 21
        },
        {
            "contest_id": "7100582a-bcfd-439c-a401-af2c79e12dc1",
            "participant_id": "2b7a9b6d-75a7-4f92-b8cb-235e59c7d5e1",
            "chosen_team": "Chennai super kings",
            "score_guess": 190,
            "points": 1190,
            "participant_rank": 2,
            "prize_amount": 17
        },
        {
            "contest_id": "7100582a-bcfd-439c-a401-af2c79e12dc1",
            "participant_id": "a6fb825e-ff5f-45cb-b80f-542bd805cb16",
            "chosen_team": "Mumbai Indians",
            "score_guess": 175,
            "points": 995,
            "participant_rank": 3,
            "prize_amount": 0
        }
    ];

    return [
        {
            participant_id: "7100582a-bcfd-439c-a401-af2c79e12dc1"
        }
    ];
  });
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.userRole = undefined;
  this.contestId = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "userId: {string}, userRole: {string}, contestId: {string} get-contest-result",
  async (userId, userRole, contestId) => {
    this.userId = userId;
    this.userRole = userRole;
    this.contestId = contestId;
  }
);

When("try to get contest result", async () => {
  const getContestResult = buildGetContestResult({
    contestInfoDb,
    contestDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    const result = await getContestResult(this.userId, this.userRole, this.contestId);
    this.result = JSON.stringify(result);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting contest result",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting contest result",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

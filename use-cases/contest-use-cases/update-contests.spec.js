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
const { constants } = require("../../utils");
const buildUpdateContests = require("./update-contests");

const contestDb = {
  findByMatchId: () => {},
  update: () => {},
};

const contestInfoUsecases = {
  calculateAndUpdateResult: () => {},
};

const userDb = {
  updateBalance: () => {},
};

const contestInfoDb = {
  findByContest: () => {},
};

let findByMatchIdStub;
let updateStub;
let calculateAndUpdateResultStub;
let updateBalanceStub;

BeforeAll(() => {
  findByMatchIdStub = sandBox.stub(contestDb, "findByMatchId");
  updateStub = sandBox.stub(contestDb, "update");
  updateBalanceStub = sandBox.stub(userDb, "updateBalance");
  calculateAndUpdateResultStub = sandBox.stub(
    contestInfoUsecases,
    "calculateAndUpdateResult"
  );
  findByContestStub = sandBox.stub(contestInfoDb, "findByContest");
});

Before(() => {
  findByMatchIdStub.callsFake((args) => {
    expect(args).to.have.own.property("matchId");
    return [
      {
        id: "8200582a-bcfd-439c-a401-af2c79e12dc1",
        name: "contest_2",
        contest_code: "2427",
        type: "mega",
        status: "Live",
        no_of_participants: 8,
        entry_fee: 10,
        total_winner: 3,
        created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
        match_id: "659906db75678ee810aa54a5",
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
        match_id: "659906db75678ee810aa54a5",
      },
    ];
  });

  updateStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("data");
  });

  updateBalanceStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("amount");
  });

  findByContestStub.callsFake((args) => {
    expect(args).to.have.own.property("contestId");
    if (args.contestId === "2100582a-bcfd-439c-a401-af2c79e12dc3") return [];
    if (args.contestId === "7100582a-bcfd-439c-a401-af2c79e12dc1")
      return [
        {
          contest_id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
          participant_id: "4d21c2e5-d9d2-4206-b1b1-53694f3452eb",
          chosen_team: "Chennai super kings",
          score_guess: 200,
          points: 1200,
          participant_rank: 1,
          prize_amount: 21,
        },
        {
          contest_id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
          participant_id: "2b7a9b6d-75a7-4f92-b8cb-235e59c7d5e1",
          chosen_team: "Chennai super kings",
          score_guess: 190,
          points: 1190,
          participant_rank: 2,
          prize_amount: 17,
        },
        {
          contest_id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
          participant_id: "a6fb825e-ff5f-45cb-b80f-542bd805cb16",
          chosen_team: "Mumbai Indians",
          score_guess: 175,
          points: 995,
          participant_rank: 3,
          prize_amount: 0,
        },
      ];

    return [
      {
        participant_id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      },
    ];
  });

  calculateAndUpdateResultStub(() => {
    return true;
  })
});

After(() => {
  sandBox.resetHistory();
  this.match = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("match: {string} update-contests", async (match) => {
  this.match = match ? JSON.parse(match) : match;
});

When("try to update contests", async () => {
  const updateContests = buildUpdateContests({
    contestDb,
    contestInfoDb,
    userDb,
    constants,
    calculateAndUpdateResult: contestInfoUsecases.calculateAndUpdateResult,
    Joi,
  });

  try {
    await updateContests(this.match);
    this.result = "Contests updated successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for updating contests",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for updating contests",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

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
const buildGetContest = require("./get-contest");

const contestDb = {
  findById: () => {},
};

let findByIdStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(contestDb, "findById");
});

Before(() => {
  findByIdStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    if (args.id === "2100582a-bcfd-439c-a401-af2c79e12dc2") return false;

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
  "userId: {string}, userRole: {string}, contestId: {string} get-contest",
  async (userId, userRole, contestId) => {
    this.userId = userId;
    this.userRole = userRole;
    this.contestId = contestId;
  }
);

When("try to get contest", async () => {
  const getContest = buildGetContest({
    contestDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    const contest = await getContest(
      this.userId,
      this.userRole,
      this.contestId
    );
    this.result = JSON.stringify(contest);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting contest",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting contest",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

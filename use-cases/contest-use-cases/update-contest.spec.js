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
const buildUpdateContest = require("./update-contest");

const contestDb = {
  findById: () => {},
  update: () => {},
};

const contestInfoDb = {
  getParticipants: () => {},
};

let findByIdStub;
let updateStub;
let getParticipantsStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(contestDb, "findById");
  updateStub = sandBox.stub(contestDb, "update");
  getParticipantsStub = sandBox.stub(contestInfoDb, "getParticipants");
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
      status: "Upcoming",
      no_of_participants: 8,
      entry_fee: 10,
      total_winner: 3,
      created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      match_id: "6659c0be1b283595041e2144",
    };
  });

  updateStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("data");
  });

  getParticipantsStub.callsFake((args) => {
    expect(args).to.have.own.property("contestId");
    return [];
  });
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.userRole = undefined;
  this.contestId = undefined;
  this.contestData = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "userId: {string}, userRole: {string}, contestId: {string}, contestData: {string} update-contest",
  async (userId, userRole, contestId, contestData) => {
    this.userId = userId;
    this.userRole = userRole;
    this.contestId = contestId;
    this.contestData = JSON.parse(contestData);
  }
);

When("try to update contest", async () => {
  const updateContest = buildUpdateContest({
    contestDb,
    contestInfoDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    await updateContest(this.userId, this.userRole, this.contestId, this.contestData);
    this.result = "Contest updated successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for updating contest",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for updating contest",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

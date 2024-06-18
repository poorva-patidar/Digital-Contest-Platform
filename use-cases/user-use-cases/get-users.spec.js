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
const buildGetUsers = require("./get-users");

const userDb = {
  getSortedUsers: () => {},
  findAll: () => {},
};

let getSortedUsersStub;
let findAllStub;

BeforeAll(() => {
  getSortedUsersStub = sandBox.stub(userDb, "getSortedUsers");
  findAllStub = sandBox.stub(userDb, "findAll");
});

Before(() => {
  getSortedUsersStub.callsFake((args) => {
    expect(args).to.have.own.property("sort");
    expect(args).to.have.own.property("order");
    expect(args).to.have.own.property("limit");
    expect(args).to.have.own.property("offset");
    if (args.offset === 20) {
      return false;
    }
    return [
      {
        id: 24,
        name: "yuvraj",
        email: "yuvraj@example.com",
        role: "user",
        balance: 167,
        created_at: "2024-06-01T10:41:59.000Z",
        updated_at: "2024-06-01T19:55:35.000Z",
      },
      {
        id: 21,
        name: "Vansh",
        email: "vansh@example.com",
        role: "user",
        balance: 121,
        created_at: "2024-06-01T10:38:17.000Z",
        updated_at: "2024-06-01T19:55:35.000Z",
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
        id: 14,
        name: "Poorva",
        email: "poorva@example.com",
        role: "superadmin",
        balance: 105,
        created_at: "2024-06-01T10:25:17.000Z",
        updated_at: "2024-06-01T19:55:35.000Z",
      },
      {
        id: 15,
        name: "Ram",
        email: "ram@example.com",
        role: "user",
        balance: 400,
        created_at: "2024-06-01T10:26:20.000Z",
        updated_at: "2024-06-01T19:41:15.000Z",
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
  "sort: {string}, order: {string}, limit: {int}, offset: {int} get-users",
  async (sort, order, limit, offset) => {
    this.sort = sort;
    this.order = order;
    this.limit = limit;
    this.offset = offset;
  }
);

When("try to get users", async () => {
  const getUsers = buildGetUsers({
    userDb,
    constants,
    CustomError,
  });

  try {
    const users = await getUsers(
      this.sort,
      this.order,
      this.limit,
      this.offset
    );
    this.result = JSON.stringify(users);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting users",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting users",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);

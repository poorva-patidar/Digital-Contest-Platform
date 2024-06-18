module.exports = function buildGetUsers({ userDb, constants, CustomError }) {
  return async function getUsers(sort, order, limit, offset) {
    let users;

    if (sort) {
      users = await userDb.getSortedUsers({ sort, order, limit, offset });
    } else {
      users = await userDb.findAll({ limit, offset });
    }

    if (!users) {
      throw new CustomError(
        constants.error.NO_USERS,
        constants.status.NOT_FOUND
      );
    }
    return users;
  };
};

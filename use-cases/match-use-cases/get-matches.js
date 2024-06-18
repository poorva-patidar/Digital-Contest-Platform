module.exports = function buildGetMatches({ matchDb, constants, CustomError }) {
  return async function getMatches(sort, order, limit, offset) {
    let matches;

    if (sort) {
      matches = await matchDb.getSortedMatches({ sort, order, limit, offset });
    } else {
      matches = await matchDb.findAll({ limit, offset });
    }

    if (!matches) {
      throw new CustomError(
        constants.error.NO_MATCHES,
        constants.status.NOT_FOUND
      );
    }

    return matches;
  };
};

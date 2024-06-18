module.exports = function buildContestDb({ pool, constants, CustomError }) {
  async function insert({
    name,
    contestCode,
    type,
    status,
    noOfParticipants,
    entryFee,
    totalWinners,
    createdBy,
    matchId,
  }) {
    try {
      await pool.query(
        `INSERT INTO contests (name, contest_code, type, status, no_of_participants, entry_fee, total_winner, created_by, match_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          name,
          contestCode,
          type,
          status,
          noOfParticipants,
          entryFee,
          totalWinners,
          createdBy,
          matchId,
        ]
      );
    } catch (error) {
      throw new CustomError(
        "Error while creating contest!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findById({ id }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM contests WHERE id = $1`,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new CustomError(
        "Error while finding contest by id!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function getContestCodes() {
    try {
      const { rows } = await pool.query(`SELECT contest_code FROM contests`);
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding contest codes!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findAll() {
    try {
      const { rows } = await pool.query(`SELECT * FROM contests`);
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding contests!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByCreatedBy({ userId }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM contests WHERE created_by = $1`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding contest by created by!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByMatchId({ matchId }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM contests WHERE match_id = $1`,
        [matchId]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding contest by match id!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function update({ id, data }) {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const values = Object.values(data);
    values.push(id);
    try {
      await pool.query(
        `UPDATE contests SET ${setClause} WHERE id = $${values.length}`,
        values
      );
    } catch (error) {
      throw new CustomError(
        "Error while finding contest by id!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function remove({ contestId }) {
    try {
      // Delete the contest info for the contest
      await pool.query("DELETE FROM contest_info WHERE contest_id = $1", [
        contestId,
      ]);

      // Delete the contest
      await pool.query(`DELETE FROM contests WHERE id = $1`, [contestId]);
    } catch (error) {
      throw new CustomError(
        "Error while deleting contest!",
        constants.status.SERVER_ERROR
      );
    }
  }

  return Object.freeze({
    insert,
    findById,
    getContestCodes,
    update,
    remove,
    findAll,
    findByCreatedBy,
    findByMatchId,
  });
};

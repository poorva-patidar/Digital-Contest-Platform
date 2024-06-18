module.exports = function buildMatchDb({ pool, constants, CustomError }) {
  async function insert(match) {
    try {
      await pool.query(
        "INSERT INTO matches (id, name, status, format, series, team1_name, team2_name, team1_score, team2_score, winner, start_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [
          match.id,
          match.name,
          match.status,
          match.format,
          match.series,
          match.team1Name,
          match.team2Name,
          match.team1Score,
          match.team2Score,
          match.winner,
          match.startTime,
        ]
      );
    } catch (error) {
      throw new CustomError(
        "Error while inserting match!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findById({ matchId }) {
    try {
      const { rows } = await pool.query(`SELECT * FROM matches WHERE id = $1`, [
        matchId,
      ]);
      return rows[0];
    } catch (error) {
      throw new CustomError(
        "Error while finding match by id!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function getSortedMatches({ sort, order = "ASC", limit, offset }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM matches ORDER BY ${sort} ${order} LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while getting sorted matches!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByStatus({ status }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM matches WHERE status = $1`,
        [status]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while getting match by status!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findAll({ limit, offset }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM matches LIMIT ${limit} OFFSET ${offset}`
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while getting all matches!",
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
        `UPDATE matches SET ${setClause} WHERE id = $${values.length}`,
        values
      );
    } catch (error) {
      throw new CustomError(
        "Error while updating match!",
        constants.status.SERVER_ERROR
      );
    }
  }

  return Object.freeze({
    insert,
    findById,
    getSortedMatches,
    findByStatus,
    update,
    findAll,
  });
};

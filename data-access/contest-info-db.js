module.exports = function buildContestInfoDb({ pool, constants, CustomError }) {
  async function insert(contestInfo) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO contest_info (contest_id, participant_id, chosen_team, score_guess) VALUES ($1, $2, $3, $4)",
        [
          contestInfo.contestId,
          contestInfo.participantId,
          contestInfo.chosenTeam,
          contestInfo.scoreGuess,
        ]
      );
      return rows.insertId;
    } catch (error) {
      throw new CustomError(
        "Error while inserting contest info!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByContest({ contestId }) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM contest_info WHERE contest_id = $1",
        [contestId]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding contest info by contest!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByParticipant({ participantId }) {
    try {
      const { rows } = await pool.query(
        "SELECT contest_id FROM contest_info WHERE participant_id = $1",
        [participantId]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding contest info by participant!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByContestAndParticipant({ contestId, participantId }) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM contest_info WHERE contest_id = $1 AND participant_id = $2",
        [contestId, participantId]
      );
      return rows[0];
    } catch (error) {
      throw new CustomError(
        "Error while finding contest info by contest and participant!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function getParticipantsCount({ contestId }) {
    try {
      const { rows } = await pool.query(
        "SELECT COUNT(*) as count FROM contest_info WHERE contest_id = $1",
        [contestId]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while getting participants count!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function updateWinners({ contestId, participantId, prizeAmount }) {
    try {
      await pool.query(
        `UPDATE contest_info SET prize_amount = ${prizeAmount} WHERE contest_id = '${contestId}' AND participant_id = '${participantId}';`
      );
    } catch (error) {
      throw new CustomError(
        "Error while updating winners!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function updateParticipants({
    contestId,
    participantId,
    points,
    rank,
  }) {
    try {
      const { rows } = await pool.query(
        `UPDATE contest_info SET points = ${points}, participant_rank = ${rank} WHERE contest_id = '${contestId}' AND participant_id = '${participantId}';`
      );
      return rows.affectedRows;
    } catch (error) {
      throw new CustomError(
        "Error while updating participants!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function getParticipants({ contestId }) {
    try {
      const { rows } = await pool.query(
        `SELECT participant_id FROM contest_info WHERE contest_id = '${contestId}';`
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while getting participants!",
        constants.status.SERVER_ERROR
      );
    }
  }

  return Object.freeze({
    insert,
    findByContest,
    findByParticipant,
    findByContestAndParticipant,
    getParticipantsCount,
    updateWinners,
    updateParticipants,
    getParticipants,
  });
};

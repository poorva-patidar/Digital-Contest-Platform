module.exports = function buildUserReferralDb({
  pool,
  constants,
  CustomError,
}) {
  async function insert({ referrerId, referredEmail, status }) {
    try {
      await pool.query(
        "INSERT INTO user_referrals (referrer_id, referred_email, status) VALUES ($1, $2, $3)",
        [referrerId, referredEmail, status]
      );
    } catch (error) {
      throw new CustomError(
        "Error while creating user referral!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByReferrerId({ referrerId }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM user_referrals WHERE referrer_id = $1`,
        [referrerId]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding user referral by referrer id!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function updateStatus({ referrerId, referredEmail, status }) {
    try {
      await pool.query(
        "UPDATE user_referrals SET status = $1 WHERE referrer_id = $2 AND referred_email = $3",
        [status, referrerId, referredEmail]
      );
    } catch (error) {
      throw new CustomError(
        "Error while updating user referral status!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByReferrerAndReferred({ referrerId, referredEmail }) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM user_referrals WHERE referrer_id = $1 AND referred_email = $2",
        [referrerId, referredEmail]
      );
      return rows[0];
    } catch (error) {
      throw new CustomError(
        "Error while finding user referral by referrer id and referred email!",
        constants.status.SERVER_ERROR
      );
    }
  }

  return Object.freeze({
    insert,
    findByReferrerId,
    updateStatus,
    findByReferrerAndReferred,
  });
};

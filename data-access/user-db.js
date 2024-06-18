module.exports = function buildUserDb({ pool, constants, CustomError }) {
  async function insert({
    name,
    email,
    password,
    role,
    balance,
    referralCode,
  }) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO users (name, email, password, role, balance, referral_code)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [name, email, password, role, balance, referralCode]
      );
      return rows[0].id;
    } catch (error) {
      throw new CustomError(
        "Error while creating user!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findById({ id }) {
    try {
      const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        id,
      ]);
      return rows[0];
    } catch (error) {
      throw new CustomError(
        "Error while getting user by ID!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByEmail({ email }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );
      return rows[0];
    } catch (error) {
      throw new CustomError(
        "Error while getting user by email!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function getReferralCodes() {
    try {
      const { rows } = await pool.query(`SELECT referral_code FROM users`);
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while getting referral codes!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByReferralCode({ referralCode }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM users WHERE referral_code = $1`,
        [referralCode]
      );
      return rows[0];
    } catch (error) {
      throw new CustomError(
        "Error while finding user by referral code",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function updateBalance({ id, amount }) {
    try {
      await pool.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2`,
        [amount, id]
      );
    } catch (error) {
      throw new CustomError(
        "Error while updating balance",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function updatePassword({ email, password }) {
    try {
      await pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [
        password,
        email,
      ]);
    } catch (error) {
      throw new CustomError(
        "Error while finding updating password",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function getSortedUsers({ sort, order = "ASC", limit, offset }) {
    try {
      const { rows } = await pool.query(
        `SELECT id, name, email, role, balance, created_at, updated_at FROM users ORDER BY ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding sorted users",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findAll({ limit, offset }) {
    try {
      const { rows } = await pool.query(
        `SELECT id, name, email, role, balance, created_at, updated_at FROM users LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw new CustomError(
        "Error while finding all users",
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
        `UPDATE users SET ${setClause} WHERE id = $${values.length}`,
        values
      );
    } catch (error) {
      throw new CustomError(
        "Error while updating user",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function remove({ userId }) {
    // Get the contests created by the user
    try {
      const { rows } = await pool.query(
        "SELECT id FROM contests WHERE created_by = $1",
        [userId]
      );

      // Delete the contest info for the contests created by the user
      for (let contest of rows) {
        await pool.query("DELETE FROM contest_info WHERE contest_id = $1", [
          contest.id,
        ]);
      }

      // Delete the contests created by the user
      await pool.query("DELETE FROM contests WHERE created_by = $1", [userId]);

      // Delete the contest info for the user
      await pool.query("DELETE FROM contest_info WHERE participant_id = $1", [
        userId,
      ]);

      // Delete the user permissions
      await pool.query("DELETE FROM user_permissions WHERE user_id = $1", [
        userId,
      ]);

      // Delete the user referrals
      await pool.query("DELETE FROM user_referrals WHERE referrer_id = $1", [
        userId,
      ]);

      // Delete the user
      await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
    } catch (error) {
      throw new CustomError(
        "Error while deleting user",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function updateBalanceByRole({ role, amount }) {
    try {
      await pool.query(
        "UPDATE users SET balance = balance + $1 WHERE role = $2",
        [amount, role]
      );
    } catch (error) {
      throw new CustomError(
        "Error while updating user balance by role",
        constants.status.SERVER_ERROR
      );
    }
  }

  return Object.freeze({
    insert,
    findById,
    findByEmail,
    getReferralCodes,
    findByReferralCode,
    updateBalance,
    updatePassword,
    getSortedUsers,
    findAll,
    update,
    remove,
    updateBalanceByRole,
  });
};

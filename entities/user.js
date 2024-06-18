//Purpose: Define the user entity
module.exports = function buildMakeUser(hashPassword, Joi) {
  return async function makeUser({
    name,
    email,
    password = null,
    role = "user",
    balance = 0,
    referralCode = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  } = {}) {

    if(!password){
      password = null;
    }
    
    // Validate user data
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().allow(null),
      role: Joi.string().valid("user", "admin", "superadmin"),
      balance: Joi.number().min(0).default(0),
      referralCode: Joi.number().allow(null),
      createdAt: Joi.date().default(new Date()),
      updatedAt: Joi.date().default(new Date()),
    });

    const { error } = schema.validate({
      name,
      email,
      password,
      role,
      balance,
      referralCode,
      createdAt,
      updatedAt,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Hash password
    if (password) {
      password = await hashPassword(password);
    }

    return Object.freeze({
      getName: () => name,
      getEmail: () => email,
      getPassword: () => password,
      getRole: () => role,
      getBalance: () => balance,
      getReferralCode: () => referralCode,
      getCreatedAt: () => createdAt,
      getUpdatedAt: () => updatedAt,
    });
  };
};

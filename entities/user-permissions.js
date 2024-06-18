// Purpose: Define the user-permissions entity.
module.exports = function buildMakeUserPermissions(Joi) {
  return function makeUserPermissions({
    userId,
    status,
    createUser = false,
    updateUser = false,
    deleteUser = false,
    createContest = false,
    updateContest = false,
    deleteContest = false,
  } = {}) {
    // Validate
    const schema = Joi.object({
      userId: Joi.string().guid().required(),
      status: Joi.string().valid("active", "inactive").required(),
      createUser: Joi.boolean().default(false),
      updateUser: Joi.boolean().default(false),
      deleteUser: Joi.boolean().default(false),
      createContest: Joi.boolean().default(false),
      updateContest: Joi.boolean().default(false),
      deleteContest: Joi.boolean().default(false),
    });

    const { error } = schema.validate({
      userId,
      status,
      createUser,
      updateUser,
      deleteUser,
      createContest,
      updateContest,
      deleteContest,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    return Object.freeze({
      getUserId: () => userId,
      getStatus: () => status,
      getCreateUser: () => createUser,
      getUpdateUser: () => updateUser,
      getDeleteUser: () => deleteUser,
      getCreateContest: () => createContest,
      getUpdateContest: () => updateContest,
      getDeleteContest: () => deleteContest,
    });
  };
};

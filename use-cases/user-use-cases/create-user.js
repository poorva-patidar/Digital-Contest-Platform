const { makeUser } = require("../../entities");

module.exports = function buildCreateUser({
  userDb,
  UserReferralDb,
  generateCode,
  constants,
  CustomError,
  jwt,
  sendEmail,
  CLIENT_URL,
  JWT_SECRET,
}) {
  return async function createUser(user) {
    if (!user.password && user.role === constants.role.USER) {
      throw new CustomError(
        "No password provided",
        constants.status.BAD_REQUEST
      );
    }

    // for generating unique referral code
    let referralCodes = await userDb.getReferralCodes();
    referralCodes = referralCodes.map((element) => element.referral_code);
    user.referralCode = generateCode(100000, 10000000, referralCodes);
    user.balance = 100;

    const newUser = await makeUser(user);

    const exists = await userDb.findByEmail({ email: newUser.getEmail() });
    if (exists) {
      throw new CustomError(
        constants.error.USER_ALREADY_EXISTS,
        constants.status.BAD_REQUEST
      );
    }

    // if referral code applied
    const appliedCode = user.appliedCode;
    if (appliedCode && referralCodes.includes(appliedCode)) {
      const referrer = await userDb.findByReferralCode({
        referralCode: appliedCode,
      });
      if (referrer) {
        const referrals = await UserReferralDb.findByReferrerId({
          referrerId: referrer.id,
        });
        const referred = referrals.find(
          (referral) => referral.referred_email === user.email
        );
        if (referred)
          await UserReferralDb.updateStatus({
            referredId: referrer.id,
            referredEmail: user.email,
            status: constants.referralStatus.ACCEPTED,
          });
        else
          await UserReferralDb.insert({
            referredId: referrer.id,
            referredEmail: user.email,
            status: constants.referralStatus.ACCEPTED,
          });
        user.balance += 50;
        await userDb.updateBalance({ id: referrer.id, amount: 100 });
      }
    }

    if (newUser.getRole() === constants.role.ADMIN) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "3d",
      });

      await sendEmail({
        email: user.email,
        subject: "Activate your account",
        message: `<h1>Welcome to Digital Contest Platform.</h1> 
            <p>You have been added as an admin.</p> 
            <p>Please click on the link to activate your account:</p> 
            <a href=${CLIENT_URL}/activate?token=${token}>Activation link</a>`,
      });
    }

    return userDb.insert({
      name: newUser.getName(),
      email: newUser.getEmail(),
      password: newUser.getPassword(),
      role: newUser.getRole(),
      balance: newUser.getBalance(),
      referralCode: newUser.getReferralCode(),
    });
  };
};

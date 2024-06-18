module.exports = function generateCode(lowerLimit, upperLimit, codes) {
  let code;
  do {
    code = Math.floor(Math.random() * (upperLimit - lowerLimit)) + lowerLimit;
  } while (codes.includes(code));

  return code;
};

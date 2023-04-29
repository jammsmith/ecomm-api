exports = async function () {
  const crypto = require('crypto');

  try {
    const string = crypto.randomBytes(10).toString('hex');

    const part1 = string.substring(0, 4);
    const part2 = string.substring(5, 9);
    const part3 = string.substring(10, 14);
    const part4 = string.substring(15, 19);

    return `${part1}-${part2}-${part3}-${part4}`;
  } catch (err) {
    console.log(err);
  }
};

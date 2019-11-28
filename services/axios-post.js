const axios = require("axios");

module.exports = async (url, body) => {
  const result = await axios.post(url, body);
  return result;
};

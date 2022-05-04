const axios = require("axios").default;

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another option
  // res.setHeader('Access-Control-Allow-Origin', req.header.origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};

const handler = (request, response) => {
  return axios
    .get("https://thispersondoesnotexist.com/image")
    .then((res) => {
      console.log(res.data);
      response.status(200).json({
        personImage: res.data,
        query: request.query,
        cookies: request.cookies,
      });
    })
    .catch((error) => {
      response.status(error.status).json(error.response.data);
    });
};

module.exports = allowCors(handler);

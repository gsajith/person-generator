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
  console.log(request.headers);
  return axios
    .get("https://thispersondoesnotexist.com/image", {
      responseType: "arraybuffer",
    })
    .then((res) => {
      response.status(200).json({
        personImage: Buffer.from(res.data, "binary").toString("base64"),
        query: request.query,
        cookies: request.cookies,
      });
    })
    .catch((error) => {
      response.status(error.status).json(error.response.data);
    });
};

module.exports = allowCors(handler);

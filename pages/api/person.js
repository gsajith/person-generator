export default function handler(request, response) {
  response.status(200).json({
    body: "This is the body",
    query: request.query,
    cookies: request.cookies,
  });
}

const config = require("./config.js");

function basicAuth(req, res) {
  if (!config.auth.enabled) {
    return true;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    res.end("Authentication required");
    return false;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = credentials.split(":");

  if (username === config.auth.username && password === config.auth.password) {
    return true;
  }

  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
  res.end("Invalid credentials");
  return false;
}

module.exports = basicAuth;

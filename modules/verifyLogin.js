const jwt = require("jsonwebtoken");

async function verifyLogin(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) return res.redirect("/login");
  //Verify token and Allow access if Everything is good
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch {
    return res.redirect("/login");
  }
}

module.exports = { verifyLogin };

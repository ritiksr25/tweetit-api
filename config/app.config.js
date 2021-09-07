require("dotenv").config();

module.exports.AppConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  TOKEN_HEADER: "x-auth-token",
};

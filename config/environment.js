require("dotenv").config({
    path: __dirname + "/../.env"
  });
  
  module.exports = {
    PORT: process.env.PORT || 3000,
    
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    NODE_PORT: process.env.NODE_PORT,
    
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  
    API_KEY: process.env.API_KEY,
    API_HOST: process.env.API_HOST,
  
    CLIENT_URL: process.env.CLIENT_URL,
    SALT: process.env.SALT,
    JWT_SECRET: process.env.JWT_SECRET
};
  
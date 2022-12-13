const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
//for swagger documentation
const swaggerUi = require("swagger-ui-express");
//here we are using yaml instead of json to handle swagger
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
//this is a middleware to handle swagger requests
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//regular middlewares
app.use(express.json());

//cookies and file-upload middlewares
app.use(cookieParser());
app.use(fileUpload({
    //this is used when you want to limit file uploads
//   limits: {
//     fileSize: 1024 * 1024 * 10, // 10 MB
//     files: 1,
//   },
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));


//morgan middleware
app.use(morgan('dev'));
//export app.js
module.exports = app;
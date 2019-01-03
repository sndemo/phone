'use strict';

const express = require('express');
const request = require('request');
const util = require('util')
const faker = require('faker')

var PORT = process.env.PORT || 8080;
var HOST = process.env.HOST || '0.0.0.0';
var VERSION = process.env.VERSION || 'v1';
var SERVICE_NAME = process.env.SERVICE_NAME || 'Unknown';

var bodyParser = require('body-parser');

var initTracer = require('jaeger-client').initTracer;
var config = {
    serviceName: process.env.SERVICE_NAME,
    sampler: {
      type: "const",
      param: 1,
    },
    reporter: {
      logSpans: true,
    },
  };
var options = {
    logger: {
      info: function logInfo(msg) {
        console.log("INFO ", msg);
      },
      error: function logError(msg) {
        console.log("ERROR", msg);
      },
    },
  };
var tracer = initTracer(config, options);

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



router.get("/", function(req, res) {
  res.status(200).send("Welcome to phone  service. I am running on version="+VERSION);
});

router.get("/phone", function (req, res) {
  var data = {
    'version': VERSION,
    'service_name': SERVICE_NAME,
    'phone': faker.phone.phoneNumber()
  };
  res.status(200).send(data);  
});

app.use('/', router);

console.log('HOST='+HOST);
console.log('PORT='+PORT);
console.log('SERVICE_NAME='+SERVICE_NAME);
console.log('VERSION='+VERSION);

app.listen(PORT, HOST);

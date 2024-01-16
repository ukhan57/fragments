// src/logger.js

// Use `info` as our standard log level if not specified
const options = { level: process.env.LOG_LEVEL || 'info' };

// If we're doing `debug` logging, make the logs easier to read
if (options.level === 'debug') {
  // https://github.com/pinojs/pino-pretty
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  };
}

//To print all the process' environment variables so we can easily debug what has/hasn't been set
// console.log("Environment variables: ");
// for (const [key, value] of Object.entries(process.env)) {
//   console.log(`${key}: ${value}`);
// }

// Create and export a Pino Logger instance:
// https://getpino.io/#/docs/api?id=logger
module.exports = require('pino')(options);

var winston = require('winston'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  sentry = require('winston-sentry'),
  config = require('./config/config');

var makeSureDirExists = function (path) {
  fs.exists(path, function (exists) {
    if (!exists) {
      mkdirp(path, function (err) {
        if (err)
          console.error(err);
      });
    }
  });
};

makeSureDirExists(config.log_path + 'info');
makeSureDirExists(config.log_path + 'error');
makeSureDirExists(config.log_path + 'debug');
makeSureDirExists(config.log_path + 'stats');

var infoLogger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      timestamp: true,
      colorize: true,
      level: 'info'
    }),
    new(winston.transports.File)({
      timestamp: true,
      dirname: config.log_path + 'info',
      filename: 'log.log',
      createLogFolder: true,
      maxFiles: 10,
      maxsize: 5242880,
      lebel: 'info'
    })
  ]
});
var debugLogger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      timestamp: true,
      colorize: true,
      level: 'debug'
    }),
    new(winston.transports.File)({
      timestamp: true,
      dirname: config.log_path + 'debug',
      filename: 'log.log',
      createLogFolder: true,
      maxFiles: 10,
      maxsize: 5242880,
      lebel: 'debug'
    })
  ]
});

var errorLogger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      timestamp: true,
      colorize: true,
      level: 'error'
    }),
    new(winston.transports.File)({
      timestamp: true,
      dirname: config.log_path + 'error',
      filename: 'log.log',
      createLogFolder: true,
      maxFiles: 10,
      maxsize: 5242880,
      lebel: 'error',
      colorize: true,
      handleExceptions: true,
      json: true
    }),
    new sentry({
      level: 'error',
      dsn: config.sentryDsn,
      patchGlobal: true
    })
  ]
});

var statsLogger = new(winston.Logger)({
  transports: [
    new(winston.transports.File)({
      timestamp: true,
      dirname: config.log_path + 'stats',
      filename: 'log.log',
      createLogFolder: true,
      maxFiles: 10,
      maxsize: 5242880,
      lebel: 'error',
      colorize: true,
      handleExceptions: true,
      json: true
    })
  ]
});

Object.defineProperty(Error.prototype, 'toJSON', {
  value: function () {
    var alt = {};

    Object.getOwnPropertyNames(this).forEach(function (key) {
      alt[key] = this[key];
    }, this);

    return alt;
  },
  configurable: true
});

var formatMsg = function (msg) {
  if (typeof (msg) == 'object') {
    msg = JSON.stringify(msg);
  }
  msg = msg.replace(/\\n/ig, '\n');
  return msg;
};

module.exports = {
  info: infoLogger.info,
  infoObject: function (msg) {
    infoLogger.info(formatMsg(msg));
  },
  warn: infoLogger.warn,
  warnObject: function (msg) {
    infoLogger.warn(formatMsg(msg));
  },
  error: errorLogger.error,
  errorObject: function (msg) {
    errorLogger.error(formatMsg(msg));
  },
  stats: statsLogger.info,
  statsObject: function (msg) {
    statsLogger.info(formatMsg(msg));
  },
  debug: debugLogger.debug,
  debugObject: function (msg) {
    debugLogger.debug(formatMsg(msg));
  },
  disableConsole: function () {
    infoLogger.remove(infoLogger.transports.console);
    errorLogger.remove(errorLogger.transports.console);
  }
};
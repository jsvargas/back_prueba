const { createLogger, format, transports , level} = require('winston');
require('winston-daily-rotate-file');
require('dotenv').config();
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp} ${info.level} ${info.message}`;
});
var transport = new (transports.DailyRotateFile)({
    filename: 'Form-%DATE%.log',
    datePattern: 'YYYY-MM-DD',   //Moment.js format, modify if you want other 
    dirname: process.env.LOGS_DIR,
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '30'
  });
transport.on('rotate', function(oldFilename, newFilename) {
});

//Nueva instancia del Logger
const logger = createLogger({
  format: combine(
  	timestamp(),
    label({ label: level }),
  	myFormat
  ),
  transports: [
    new transports.Console(),
    transport
  ]
});
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};
module.exports = function(fileName) {    
    var myLogger = {
        error: function(text) {
            logger.error('['+fileName+'] '+text);
        },
        info: function(text) {
            logger.info('['+fileName+'] '+text);
        },
        stream: logger.stream
    }
    return myLogger;
}
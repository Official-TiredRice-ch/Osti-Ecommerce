const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../logs');
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  getLogFileName(type = 'app') {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logsDir, `${type}-${date}.log`);
  }

  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    let logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      if (data instanceof Error) {
        logMessage += `\n  Error: ${data.message}\n  Stack: ${data.stack}`;
      } else if (typeof data === 'object') {
        logMessage += `\n  Data: ${JSON.stringify(data, null, 2)}`;
      } else {
        logMessage += `\n  Data: ${data}`;
      }
    }
    
    return logMessage + '\n';
  }

  writeToFile(filename, message) {
    try {
      fs.appendFileSync(filename, message, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message, data = null) {
    const logMessage = this.formatMessage('INFO', message, data);
    console.log(logMessage);
    this.writeToFile(this.getLogFileName('app'), logMessage);
  }

  error(message, error = null) {
    const logMessage = this.formatMessage('ERROR', message, error);
    console.error(logMessage);
    this.writeToFile(this.getLogFileName('error'), logMessage);
    this.writeToFile(this.getLogFileName('app'), logMessage);
  }

  warn(message, data = null) {
    const logMessage = this.formatMessage('WARN', message, data);
    console.warn(logMessage);
    this.writeToFile(this.getLogFileName('app'), logMessage);
  }

  debug(message, data = null) {
    const logMessage = this.formatMessage('DEBUG', message, data);
    console.log(logMessage);
    this.writeToFile(this.getLogFileName('debug'), logMessage);
  }

  api(method, endpoint, status, data = null) {
    const message = `${method} ${endpoint} - Status: ${status}`;
    const logMessage = this.formatMessage('API', message, data);
    console.log(logMessage);
    this.writeToFile(this.getLogFileName('api'), logMessage);
  }

  database(operation, table, data = null) {
    const message = `${operation} on ${table}`;
    const logMessage = this.formatMessage('DB', message, data);
    console.log(logMessage);
    this.writeToFile(this.getLogFileName('database'), logMessage);
  }
}

module.exports = new Logger();

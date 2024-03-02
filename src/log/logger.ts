import { ConsoleLogger, ConsoleLoggerOptions, LogLevel } from '@nestjs/common';
import * as fs from 'fs';

export class FileLogger extends ConsoleLogger {
  protected fileName = 'nest-js.log';

  protected dir: string;

  constructor(context?: string, options?: ConsoleLoggerOptions) {
    super(context, { ...options, timestamp: true });
    this.dir = './logs';
  }

  private writeLogFile(message: string) {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }

    fs.appendFile(
      `${this.dir}/${this.fileName}`,
      message,
      {
        encoding: 'utf-8',
      },
      function (err) {
        if (err) {
          fs.writeFile(`${this.dir}/${this.fileName}`, message, { flag: 'wx' }, function (_err) {
            if (_err) throw _err;
          });
        }
      },
    );
  }

  private writeToFile(logLevel: LogLevel, message: string, ...optionalParams: any[]) {
    const context = optionalParams.pop() ?? this.context;
    if (this.isLevelEnabled(logLevel)) {
      const _message = `${message}: ${optionalParams.map(
        (param) => param && !isNaN(param) ? typeof param === "object" ? JSON.stringify(param) : param.toString() : '').join(', ')
      }`;
      // const _formattedMessage = this.formatMessage(logLevel, _message, this.formatPid(process.pid), "\tLOG", this.formatContext(context), this.formatTimestampDiff(3));
      const formattedMessage =
      `${this.formatPid(process.pid)} ${this.getTimestamp()}\t ${logLevel.toUpperCase()} ${context ? `[${context}]` : ''} ${_message}\n`;
      this.writeLogFile(formattedMessage);
    }
  }

  private writeStack(stack: string) {
    if (this.isLevelEnabled('error')) this.printStackTrace(stack);
    this.writeLogFile(
      stack
        .split('\n')
        .map((line) => '\t' + line)
        .join('\n') + '\n',
    );
  }

  /**
   * Write a 'log' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  log(message: any, ...optionalParams: [...any, string?]): void {
    // this.writeToFile('log', message, ...optionalParams);
    super.log(message, ...optionalParams);
  }
  /**
   * Write an 'error' level log, if the configured level allows for it.
   * Prints to `stderr` with newline.
   */
  error(message: any, ...optionalParams: [...any, string?, string?]): void {
    if (message instanceof Error) {
      const context = optionalParams.pop() ?? this.context;
      this.writeToFile('error', message.message, ...[context]);

      super.error(message, ...[context]);

      if (message.stack) this.writeStack(message.stack);
    } else {
      const context = optionalParams.pop() ?? this.context;
      const stack = optionalParams.pop();

      const params = [...optionalParams, context];
      this.writeToFile('error', message, ...params);

      super.error(message, ...params);

      if (stack) this.writeStack(stack);
    }

  }
  /**
   * Write a 'warn' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  warn(message: any, ...optionalParams: [...any, string?]): void {
    this.writeToFile('warn', message, ...optionalParams);
    super.warn(message, ...optionalParams);
  }
  /**
   * Write a 'debug' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  debug(message: any, ...optionalParams: [...any, string?]): void {
    this.writeToFile('debug', message, ...optionalParams);
    super.debug(message, ...optionalParams);
  }
  /**
   * Write a 'verbose' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  verbose(message: any, ...optionalParams: [...any, string?]): void {
    this.writeToFile('verbose', message, ...optionalParams);
    super.verbose(message, ...optionalParams);
  }
}

import * as vscode from 'vscode';
export interface IError {
  success: boolean;
  message: string;
}

function padLeft(s: string, n: number, pad = ' ') {
  return pad.repeat(Math.max(0, n - s.length)) + s;
}

export class Logger {
  constructor(private readonly name: string, private readonly level: string) {}

  get output() {
    return vscode.window.createOutputChannel(this.name);
  }

  private data2String(data: Error | IError) {
    if (data instanceof Error) {
        return data.stack || data.message;
    }
    if (data.success === false && data.message) {
        return data.message;
    }
    return data.toString();
  }

  private now() {
    const now = new Date();
    return padLeft(now.getUTCHours() + '', 2, '0')
      + ':' + padLeft(now.getMinutes() + '', 2, '0')
      + ':' + padLeft(now.getUTCSeconds() + '', 2, '0') + '.' + now.getMilliseconds();
  }

  public show() {
    this.output.show();
  }

  public error(message: string, data: Error | IError) {
    this.logLevel('Error', message, data);
  }

  public info(message: string, data: Error | IError) {
    this.logLevel('Info', message, data);
  }

  public warn(message: string, data: Error | IError) {
    this.logLevel('Warn', message, data);
  }

  public log(message: string, data: Error | IError) {
    this.logLevel(this.level, message, data);
  }

  public logLevel(level: string, message: string, data: Error | IError) {
    this.output.appendLine(`[${level} - ${this.now()}] ${message}`);
    if (data) {
        this.output.appendLine(this.data2String(data));
    }
  }
}


let logger: Logger;
export const loggerFactory = (name: string, defaultLevel: string) => {
  if (logger) {
    return logger;
  }
  logger = new Logger(name, defaultLevel);
  return logger;
}

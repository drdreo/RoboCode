import { formatTime } from "../utils";

export enum LogLevel {
    DEBUG,
    VERBOSE,
    LOG,
    WARN,
    ERROR,
}

export interface ILogger {
    log(message: unknown, context?: string): void;

    error(message: unknown, trace?: string, context?: string): void;

    warn(message: unknown, context?: string): void;

    debug(message: unknown, context?: string): void;

    verbose(message: unknown, context?: string): void;
}

/**
 * Logging utility class
 * inspiration gathered from Nest.js Logging https://docs.nestjs.com/techniques/logger
 */
export class Logger implements ILogger {
    private static logLevel: LogLevel = LogLevel.DEBUG;
    private static lastTimestamp?: number;
    protected static instance?: typeof Logger | ILogger = Logger;

    constructor(
        protected context?: string,
        private readonly isTimestampEnabled: boolean = false,
    ) {}

    group(message: string, context?: string): void {
        if (!this.isLogLevelEnabled(LogLevel.LOG)) {
            return;
        }
        this.callFunction("group", message, context);
    }

    groupEnd(): void {
        if (!this.isLogLevelEnabled(LogLevel.LOG)) {
            return;
        }
        Logger.groupEnd();
    }

    log(message: unknown, context?: string): void {
        if (!this.isLogLevelEnabled(LogLevel.LOG)) {
            return;
        }
        this.callFunction("log", message, context);
    }

    debug(message: unknown, context?: string): void {
        if (!this.isLogLevelEnabled(LogLevel.DEBUG)) {
            return;
        }
        this.callFunction("debug", message, context);
    }

    verbose(message: unknown, context?: string): void {
        if (!this.isLogLevelEnabled(LogLevel.VERBOSE)) {
            return;
        }
        this.callFunction("verbose", message, context);
    }

    warn(message: unknown, context?: string): void {
        if (!this.isLogLevelEnabled(LogLevel.WARN)) {
            return;
        }
        this.callFunction("warn", message, context);
    }

    error(message: unknown, trace = "", context?: string): void {
        const instance = this.getInstance();
        if (!this.isLogLevelEnabled(LogLevel.ERROR)) {
            return;
        }
        instance && instance.error.call(instance, message, trace, context || this.context, this.isTimestampEnabled);
    }

    setContext(context: string): void {
        this.context = context;
    }

    static getLogLevelName(): string {
        switch (Logger.logLevel) {
            case LogLevel.DEBUG:
                return "DEBUG";
            case LogLevel.LOG:
                return "LOG";
            case LogLevel.VERBOSE:
                return "VERBOSE";
            case LogLevel.WARN:
                return "WARNING";
            case LogLevel.ERROR:
                return "ERROR";
            default:
                return `${Logger.logLevel} not handled`;
        }
    }

    static setLogLevel(level: LogLevel): void {
        Logger.logLevel = level;
    }

    getTimestamp(): string {
        return Logger.getTimestamp();
    }

    static group(message: any): void {
        console.groupCollapsed(message);
    }

    static groupEnd(): void {
        console.groupEnd();
    }

    static log(message: any, context = "", isTimeDiffEnabled = true): void {
        this.printMessage("log", message, undefined, context, isTimeDiffEnabled);
    }

    static debug(message: any, context = "", isTimeDiffEnabled = true): void {
        this.printMessage("debug", message, consoleColor.blue, context, isTimeDiffEnabled);
    }

    static verbose(message: any, context = "", isTimeDiffEnabled = true): void {
        this.printMessage("log", message, consoleColor.cyanBright, context, isTimeDiffEnabled);
    }

    static warn(message: any, context = "", isTimeDiffEnabled = true): void {
        this.printMessage("warn", message, consoleColor.yellow, context, isTimeDiffEnabled);
    }

    static error(message: any, trace = "", context = "", isTimeDiffEnabled = true): void {
        this.printMessage("error", message, consoleColor.red, context, isTimeDiffEnabled);
        this.printStackTrace(trace);
    }

    static getTimestamp(): string {
        return formatTime(Date.now());
    }

    private callFunction(name: "group" | "log" | "warn" | "debug" | "verbose", message: any, context?: string): void {
        const instance = this.getInstance();
        const func = instance && (instance as typeof Logger)[name];
        func && func.call(instance, message, context || this.context, this.isTimestampEnabled);
    }

    protected getInstance(): ILogger | typeof Logger | undefined {
        const { instance } = Logger;
        return instance === this ? Logger : instance;
    }

    private isLogLevelEnabled(level: LogLevel): boolean {
        return level >= Logger.logLevel;
    }

    private static printMessage(
        level: "log" | "warn" | "debug" | "error",
        message: any,
        color: string | undefined,
        context = "",
        isTimeDiffEnabled?: boolean,
    ): void {
        const output = isPlainObject(message)
            ? `Object:\n${JSON.stringify(message, null, 2)}\n`
            : isError(message)
              ? message.message
              : message;

        const contextColor = context ? consoleColor.yellow : "";
        const contextMessage = context ? `%c[${context}] ` : "";
        const timestampDiff = this.updateAndGetTimestampDiff(isTimeDiffEnabled);
        const timestampColor = timestampDiff.length ? consoleColor.white : "";
        const instance = (this.instance as typeof Logger) ?? Logger;
        const timestamp = instance.getTimestamp ? instance.getTimestamp() : Logger.getTimestamp?.();
        const computedMessage = `${timestamp} ${contextMessage} %c${output} ${timestampDiff}\n`;

        // log complex objects more detailed
        if (isObject(message) && !isPlainObject(message)) {
            Logger.logMessage("groupCollapsed", computedMessage, contextColor, color, timestampColor);

            isError(message) ? console.error(message) : console.dir(message);
            console.groupEnd();
        } else {
            Logger.logMessage(level, computedMessage, contextColor, color, timestampColor);
        }
    }

    private static logMessage(
        level: "log" | "warn" | "debug" | "error" | "groupCollapsed",
        message: string,
        contextColor: string | undefined,
        color: string | undefined,
        timestampColor: string,
    ) {
        color = level === "warn" || level === "error" ? undefined : color;

        if (!contextColor) {
            console[level](message, color, timestampColor);
        } else {
            console[level](message, contextColor, color, timestampColor);
        }
    }

    private static updateAndGetTimestampDiff(isTimeDiffEnabled?: boolean): string {
        let result = "";
        if (Logger.lastTimestamp && isTimeDiffEnabled) {
            result = `%c +${Date.now() - Logger.lastTimestamp}ms `;
            Logger.lastTimestamp = Date.now();
            return result;
        }
        Logger.lastTimestamp = Date.now();
        return result;
    }

    private static printStackTrace(trace: string): void {
        if (!trace) {
            return;
        }
        console.error(trace);
    }

    static testLogs(context?: string) {
        this.debug("Debug message!", context);
        this.debug({ test: 123, debug: true }, context);
        this.verbose("Verbose message!", context);
        this.verbose({ test: 123, verbose: true }, context);
        this.log("Log message!", context);
        this.log({ test: 123, log: true }, context);
        this.warn("Warn message!", context);
        this.warn(new Error("New Warning"), context, false);
        this.error("Error message!", undefined, context);
        this.error(new Error("New Error"), undefined, context, false);
    }
}

const isError = (obj: any): obj is Error =>
    obj instanceof Error || obj instanceof ErrorEvent || obj.error instanceof ErrorEvent;

const isUndefined = (obj: any): obj is undefined => typeof obj === "undefined";

const isNil = (obj: any): obj is null | undefined => isUndefined(obj) || obj === null;

const isObject = (fn: any): fn is object => !isNil(fn) && typeof fn === "object";

const isPlainObject = (fn: any): fn is object => {
    if (!isObject(fn)) {
        return false;
    }
    const proto = Object.getPrototypeOf(fn);
    if (proto === null) {
        return true;
    }
    const ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    return (
        typeof ctor === "function" &&
        ctor instanceof ctor &&
        Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object)
    );
};

const consoleColor = {
    white: "color: white; background: gray;",
    green: "color: #bada55;",
    yellow: "color: #f4d03f;",
    red: "color: #ED4337;",
    magentaBright: "color: #e056fd;",
    cyanBright: "color: #22a6b3;",
    blue: "color: #4d88ff;",
};

import { write, writeJSON, append } from "./files.js"

export function print(str) {
    console.log(str)
    writeJSON("output.json", str)
}

export const colour = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

export class Log {
    constructor(clean, filename = "log.txt") {
        this.filename = filename
        this.headers = ["TIME", "TYPE", "MESSAGE"]
        this.types = { NORMAL: "NORMAL", ERROR: "ERROR" }
        this.cleaned = clean ? this.startFile(clean) : false
    }

    format(msg, type = this.types.NORMAL) {
        return `${this.time()}${" ".repeat(5)}${type}${" ".repeat(5)}${msg}\n`
    }

    time() {
        return new Date().toLocaleString()
    }

    info(message) {
        console.log(message)
        append(this.filename, this.format(message))
    }

    error(message) {
        console.error(colour.fg.red, message, colour.reset)
        append(this.filename, this.format(message, this.types.ERROR))
    }

    interactive(color, message){
        try {
            console.error(color, message, colour.reset)
        } catch(err) {
            console.log(message)
        }
        append(this.filename, this.format(message, this.types.NORMAL))
    }

    startFile() {
        const titles = `${this.headers[0]}${" ".repeat(19)}${this.headers[1]}${" ".repeat(7)}${this.headers[2]}\n`
        write(this.filename, titles)
    }
} 
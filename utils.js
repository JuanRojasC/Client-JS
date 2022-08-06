import readline from "readline";

export function attempt(callbackTry = (() => true), callbackCatch  = (() => false)) {
    try {
        callbackTry()
        return true
    } catch(err) {
        callbackCatch()
        return false
    }
}

/**
 * Try execute one of callbacks sent like params and when one execution is successful
 * return the result
 * @param  {...any} callbacks callbacks(attempts) to will be executed until get a result
 * @returns result of fisrt callback that could be executed
 */
export function tryUntil(...callbacks) {
    let result = null
    for(let callback of callbacks) {
        if(attempt(callback)) {
            result = callback()
            break
        }
    }
    return result
}

export function parseDate(data){
    try {
        parseNumber(data)
    } catch(err) {
        const date = new Date(data)
        if(date == "Invalid Date"){
            throw date
        }
        return date
    }
    throw "is a number"
}

export function parseNumber(data) {
    const number = parseFloat(data)
    if(Number.isNaN(number)) {
        throw 'NaN'
    }
    return number
}

export function minChars(str = "", min = 0) {
    let strFormatted = `${str}`
    if(min > strFormatted.length) {
        strFormatted = str + " ".repeat(min - strFormatted.length)
    } else {
        strFormatted = strFormatted.slice(0, min)
    }
    return strFormatted
}

export class Crono {
    constructor() {
        this.state = "initialized"
        this.startTime = 0
        this.endTime = 0
        this.duration = 0
    }

    start() {
        this.startTime = Date.now()
        return this.startTime
    }

    end() {
        this.endTime = Date.now()
        return this.endTime
    }

    time() {
        this.end()
        this.duration = this.endTime - this.startTime
        return this.duration
    }
}

export function getArgs(start = 2, callback = () => {}) {
    const args = []
    process.argv.map((val, index, array) => {
        if (index >= start) {
            callback(val, index)
            args.push(val)
        }
    })
    return args
}

/**
 * Get the input user on console
 * @param {*} msg message will be printed on console
 * @param {*} callback for apply to input user
 * @returns string with entered value
 */
export async function input(msg, callback = () => {}){
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        })
        rl.question(msg, (input) => {
            callback(input)
            rl.close()
            resolve(input)
        })
    })
}

/**
 * Hide the input of user in console, perfect to passwords request for console
 * @param {*} msg message will be printed on console
 * @param {*} callback for apply to input user
 * @returns string with entered value
 */
export async function secretInput(msg, callback = () => {}){
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        const stdin = process.openStdin();
        process.stdin.on('data', char => {
          char = char + '';
          switch (char) {
            case '\n':
            case '\r':
            case '\u0004':
              stdin.pause();
              break;
            default:
              process.stdout.clearLine();
              readline.cursorTo(process.stdout, 0);
              process.stdout.write(msg + Array(rl.line.length + 1).join('*'));
              break;
          }
        });
        rl.question(msg, value => {
          rl.history = rl.history.slice(1);
          rl.close()
          resolve(value);
        });
      });
}
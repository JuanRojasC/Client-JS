import f from "fs";
const fs = f.promises;
import { parseDate, parseNumber, tryUntil } from "./utils.js";

/**
 * Read files
 * @param {*} path path of filename with extension
 * @param {*} format default utf-8
 * @param {*} callback for apply to file data read
 * @returns string
 */
export async function read(path = "/.", format = "utf8", callback = null) {
    return await fs.readFile(path, format, function(err, data) {
        if (err) {
            return console.log(err)
        }
        if (callback != null) {
            callback(data)
        }
        return data
    })
}

/**
 * Write a file json wihtout need of stringify manually
 * @param {*} filename name desired for file must include extension .json
 * @param {*} object object to apply stringify
 * @param {*} format default utf-8
 * @param {*} callback for apply to data
 * @returns null
 */
export async function writeJSON(filename = "newfile.json", object = null, format = "utf8", callback = null) {
    return await write(filename, JSON.stringify(object), format, callback)
}

/**
 * 
 * @param {*} filename name desired for file must include extension
 * @param {*} file data to be save
 * @param {*} format default utf-8
 * @param {*} callback for apply to data
 * @returns boolean that indicates if was successful operation
 */
export async function write(filename = "./newfile.txt", file = null, format = "utf8", callback = null) {
    return await fs.writeFile(filename, file, format, function(err, data){
        if (err) {
            return console.error(err)
        }
        if (callback) {
            callback(data)
        }
        return true
    })
}

export async function append(filename = "./overwrite.txt", data = null, format = "utf8", callback = null) {
    fs.appendFile(filename, data)
    return true
}

/**
 * Map csv file to object readible for javascript
 * @param {*} path path of location file
 * @returns object with csv data mapped
 */
export async function csvToObject(path) {
    const file = await read(path)
    const array = file.replace("\r", "").split("\n")
    const sepator = array[0].split(",").length > 1 ? "," : ";" 
    const headers = array[0].replace(/\s/g, "_").split(sepator)
    const body = array.splice(1)
    const obj = body.map((v) => {
        let row = {}
        const values = v.replace("\r", "").split(sepator)
        headers.map((hv, hi) => {
            const value = values[hi]
            row[hv] = tryUntil(() => parseDate(value), () => parseNumber(value), () => value)
        })
        return row
    })
    return obj
}

export function copy(data) {
    var proc = require('child_process').spawn('pbcopy'); 
    proc.stdin.write(data); proc.stdin.end();
}

export async function deleteFile(path) {
    fs.unlink(path, (err => {
        if (err) console.log(err);
        else {
          console.log(`\nDeleted file: ${path}`);
        }
      }));
}
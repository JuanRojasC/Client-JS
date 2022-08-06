import { writeJSON } from "./files.js"
import { Log } from "./output.js"
import { minChars } from "./utils.js"

const log = new Log()

// export function compareObjects(objReference, objCheck, name = "object to check") {
//     if (compareJSON(objReference, objCheck)) return true
//     for (const [k,v] of Object.entries(objReference)) {
//         const value = objCheck[k]
//         if (typeof value == "undefined") {
//             return `key "${k}" not present in ${name}`
//         }
//         if (Array.isArray(value)) {
//             if (compareJSON(v, value)) continue
//             return `key "${k}" is different in ${name}`
//         }
//         if (typeof value == "object") {
//             if (compareJSON(v, value)) continue
//             return compareObjects(v, value)
//         }
//         if (value != v) {
//             return `key "${k}" is different in ${name}`
//         }
//     }
//     return compareObjects(objCheck, objReference, "object reference")
// }

const index = []

/**
 * 
 * @param {*} objReference Object reference to comparision
 * @param {*} objCheck Object that will be compared
 * @returns boolean that idicates if are or not equals
 */
export function compareObjects(objReference, objCheck) {
    if (compareJSON(objReference, objCheck)) return true
    let same = true
    const obj1 = formatObjects(objReference)
    writeJSON("obj1.json", obj1)
    while (index.length > 0) index.pop()
    const obj2 = formatObjects(objCheck)
    writeJSON("obj2.json", obj2)
    for(const [k,v] of Object.entries(obj1)){
        if (typeof v == 'object' && compareJSON(v, obj2[k])) {
            continue
        }
        if (obj2[k] != v) {
            log.error(`Key: ${minChars(k, 20)} => ${minChars(" ", 5)} ${minChars(v,30)} | ${minChars(obj2[k], 30)}`)
            same = false
        }
    }
    return same
}

/**
 * This function extract all keys with values at the top level of object
 * val myObj = { first_key: { second_key: { third_key: "hello" } } }
 * result - { third_key: "hello" }
 * @param {*} obj object to extract values
 * @returns object with all its keys at top level
 */
export function formatObjects(obj) {
    let count = {}
    if (typeof obj == "object") {
        if (Array.isArray(obj)) {
            for (let item of obj) {
                count = destruct(count, formatObjects(item))
            }
        } else {
            for (const [k,v] of Object.entries(obj)) {
                if (typeof v == 'object') {
                    if (v === null || v.length == 0 || Object.keys(v) == 0) {
                        count[`${k}${index.length}`] = v
                        index.push(1)
                    } else {
                        count = destruct(count, formatObjects(v))
                    }
                } else {
                    count[`${k}${index.length}`] = v
                    index.push(1)
                }
            }
        }
        return count
    }
}

function destruct(objOriginal, objToAdd) {
    return {...objOriginal, ...objToAdd}
}

function compareJSON(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true
    }
}
import { writeJSON } from "./files.js"
import { colour, Log } from "./output.js"
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
export function compareObjects(objReference, objCheck, ignore = []) {
    if (compareJSON(objReference, objCheck)) return true
    const obj1 = formatObjects(objReference)
    const obj2 = formatObjects(objCheck)
    let same = true
    let counter = 0
    let ignored = 0
    for (const [i, obj] of obj1.entries()) {
        const key = obj[0]
        const val = obj[1]
        const timesObj1 = obj1.filter(e => (key === e[0]) && (`${val}` === `${e[1]}`))
        const timesObj2 = obj2.filter(e => (key === e[0]) && (`${val}` === `${e[1]}`))
        const sameLength = timesObj1.length == timesObj2.length

        if (!sameLength) {
            counter++
            if (ignore.filter(i => key.includes(i)).length >= 1) {
                ignored++
                continue
            }
            log.error(`Key: ${minChars(key, 20)} ${minChars(timesObj1.length, 3)} | ${minChars(timesObj2.length, 3)} missing   =>   ${minChars(JSON.stringify(val),100)}`)
            same = false
        }
    }
    log.error(`diferencia: ${parseInt((counter / obj1.length) * 100)}% o ${counter}/${obj1.length} keys ignoradas: ${ignored}`)
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
    let count = []
    if (typeof obj == "object") {
        if (Array.isArray(obj)) {
            for (let item of obj) {
                count = destruct(count, formatObjects(item))
            }
        } else {
            for (const [k,v] of Object.entries(obj)) {
                if (typeof v == 'object') {
                    if (v === null || v.length == 0 || (Object.keys(v) == 0 && !Array.isArray(v))) {
                        count.push([k,v])
                    } else {
                        if (Array.isArray(v)) {
                            for (const item of v) {
                                if (typeof item != "object") count.push([k, item])
                                else count = destruct(count, formatObjects(item))
                            }
                        } else {
                            count = destruct(count, formatObjects(v))
                        }
                    }
                } else {
                    count.push([k,v])
                }
            }
        }
        return count
    }
}

function destruct(objOriginal, objToAdd) {
    return [...objOriginal, ...objToAdd]
}

function compareJSON(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true
    }
}

export function validateProperty(obj={}, value="", ...subkeys) {
    try {
        let valueFound = obj[subkeys[0]]
        const keysToFind = subkeys.slice(1)
        for (const subkey of keysToFind) {
            valueFound = valueFound[subkey]
        }
        return valueFound == value
    } catch (err) {
        return false
    }
}

export function getProperty(obj={},  ...subkeys) {
    try {
        if (subkeys.length > 0) {
            let valueFound = obj[subkeys[0]]
            const keysToFind = subkeys.slice(1)
            for (const subkey of keysToFind) {
                valueFound = valueFound[subkey]
            }
            return valueFound
        }
        return null
    } catch (err) {
        return null
    }
}
   
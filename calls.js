import fecth from "node-fetch";
import { Log } from "./output.js";

const log = new Log(false, "callsLog.txt")

/**
 * Function to make get requests
 * @param {*} endpoint url of request
 * @param {*} headers object with headers for request
 * @param {*} timeout time desired to kill request
 * @returns object with keys status, data and time of request
 */
export async function get(endpoint, headers = {}, timeout = 5000) {
    const abortController = new AbortController()
    const id = setTimeout(() => abortController.abort(), timeout)
    let err = null
    try {
        const start = new Date()
        const response = await fecth(endpoint, {headers: {...headers}, signal: abortController.signal})
        const duration = new Date() - start
        try {
            const json = await response.json()
            return {status: response.status, data: json, time: duration}
        } catch (err) {
            const text = await response.text()
            return {status: response.status, data: text, time: duration}
        }
    } catch(err) {
        log.error(`Get Failed ${err}`)
        err = err
    }
    clearTimeout(id)
    return {status: 500, data: {}, err: err, time: 0}
}

/**
 * Function to make delete requests
 * @param {*} endpoint url of request
 * @param {*} headers object with headers for request
 * @param {*} timeout time desired to kill request
 * @returns object with keys status, data and time of request
 */
 export async function delette(endpoint, headers = {}, timeout = 5000) {
    const abortController = new AbortController()
    const id = setTimeout(() => abortController.abort(), timeout)
    let err = null
    try {
        const start = new Date()
        const response = await fecth(endpoint, {
                method: 'DELETE',
                headers: {...headers}, 
                signal: abortController.signal
        })
        const duration = new Date() - start
        if (response.status == 204) {
            return {status: response.status, data: {}, time: duration}
        }
        try {
            const json = await response.json()
            return {status: response.status, data: json, time: duration}
        } catch (err) {
            const text = await response.text()
            return {status: response.status, data: text, time: duration}
        }
    } catch(err) {
        log.error(`Delete Failed ${err}`)
        err = err
    }
    clearTimeout(id)
    return {status: 500, data: {}, err: err, time: 0}
}

/**
 * Function to make post request
 * @param {*} endpoint url of request
 * @param {*} headers object with headers for request
 * @param {*} body object to be send in request body
 * @param {*} timeout time desired to kill request
 * @returns object with keys status, data and request
 */
export async function post(endpoint, headers = {}, body = {}, timeout = 5000) {
    const abortController = new AbortController()
    const id = setTimeout(() => abortController.abort(), timeout)
    let err = null
    try {
        const start = new Date()
        const response = await fecth(endpoint, {
            method: "POST",
            headers: {
                ...headers,
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const duration = new Date() - start
        try {
            const json = await response.json()
            return {status: response.status ,data: json, time: duration}
        } catch (err) {
            const text = await response.text()
            return {status: response.status ,data: text, time: duration}
        }
    } catch(err) {
        log.error(`Post Failed ${err}`)
        err = err
    }
    clearTimeout(id)
    return {status: 500, data: {}, err: err, time: 0}
}

/**
 * Function to make put request
 * @param {*} endpoint url of request
 * @param {*} headers object with headers for request
 * @param {*} body object to be send in request body
 * @param {*} timeout time desired to kill request
 * @returns object with keys status, data and request
 */
 export async function put(endpoint, headers = {}, body = {}, timeout = 5000) {
    const abortController = new AbortController()
    const id = setTimeout(() => abortController.abort(), timeout)
    let err = null
    try {
        const start = new Date()
        const response = await fecth(endpoint, {
            method: "PUT",
            headers: {
                ...headers,
                "content-type": "application/json"
            },
            body: JSON.stringify(body),
            signal: abortController.signal
        })
        const duration = new Date() - start
        try {
            const json = await response.json()
            return {status: response.status ,data: json, time: duration}
        } catch (err) {
            const text = await response.text()
            return {status: response.status ,data: text, time: duration}
        }
    } catch(err) {
        log.error(`Post Failed ${err}`)
        err = err
    }
    clearTimeout(id)
    return {status: 500, data: {}, err: err, time: 0}
}

export const timer = ms => new Promise(res => setTimeout(res, ms))
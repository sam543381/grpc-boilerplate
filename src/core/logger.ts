
export function log(message: string|any) {

    if (typeof message === "string") {
        console.log(message)
    } else {
        console.log(JSON.stringify(message))
    }

}

export function error(message: string|any) {

    if (typeof message === "string") {
        console.error(message)
    } else {
        console.error(JSON.stringify(message))
    }

}

export function fatal(message: string|any, exitCode: number = 1) {
    
    this.error(`FATAL: ${message}`)
    process.exit(exitCode)

}

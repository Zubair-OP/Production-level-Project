class ApiError extends Error {
    constructor(
        message = "Something went wrong",
        statuscode,
        errors =[],
        stack= ''
    ){
        super(message)
        this.statuscode = statuscode
        this.errors = errors
        this.stack = stack
        this.success = false
        this.data = null

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError
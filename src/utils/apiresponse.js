class apiresponse {
    constructor(status, message, data = 'success') {
        this.status = status
        this.message = message
        this.data = data
        this.success = message < 400
    }
}

export default apiresponse
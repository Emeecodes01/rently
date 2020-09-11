function Error(code, message) {
    this.code = code
    this.message = message
}

/**
 * @param validationResult this contains an error
 */
function extractErrorFromValidator(validationResult) {
    let errorMessage = ''
    const details = validationResult.error.details
    for (let i of details){
        errorMessage += `${i.message}`
    }
    return errorMessage
}


module.exports.Error = Error
module.exports.extractError = extractErrorFromValidator
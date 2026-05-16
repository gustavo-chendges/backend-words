const crypto = require('crypto')

function createSixDigitCode(){
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)

    const number = array[0] % 900000 + 100000

    return number
}

module.exports = {
    createSixDigitCode
}
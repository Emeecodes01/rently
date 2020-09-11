const Status = {
    BadRequest: 400,
    InternalServerError: 500,
    NotFound: 404,
    UnAuthorized: 401,
    OK: 200
}

Object.freeze(Status)
module.exports = Status
class ResponseHandler {
  static success(res, status, code, data, message = "success") {
    return res.status(code).json({ status, code, message, data });
  }

  static badRequest(res, status, code = 500, error = "internal server error") {
    return res.status(code).json({ status, code, error: error });
  }

  static throwError(code, message = "error") {
    throw { code, message };
  }
}

module.exports = ResponseHandler;

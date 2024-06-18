module.exports = {
  success: function (res, data, statusCode = 200, headers = {}) {
    res.statusCode = statusCode;

    for (let header in headers) {
      res.setHeader(header, headers[header]);
    }

    if (data instanceof Buffer) {
      res.setHeader("content-type", "image/png");
      res.end(data);
    } else {
      res.setHeader("content-type", "application/json");
      const payload = { status: "success", data };
      res.end(JSON.stringify(payload));
    }
  },

  error: function (res, message, statusCode = 500) {
    res.statusCode = statusCode;
    res.setHeader("content-type", "application/json");
    const payload = { status: "failed", message };
    res.end(JSON.stringify(payload));
  },
};

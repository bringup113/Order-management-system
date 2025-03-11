const { validationResult } = require("express-validator");

/**
 * 验证请求参数
 */
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: '请求参数验证失败',
      errors: errors.array()
    });
  }
  next();
};

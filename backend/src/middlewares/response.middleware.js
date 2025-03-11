/**
 * 响应格式化中间件
 * 统一处理API响应格式
 */

// 扩展Response对象，添加自定义方法
const responseMiddleware = (req, res, next) => {
  // 成功响应
  res.success = (data, statusCode = 200) => {
    // 处理列表数据
    if (Array.isArray(data) && req.query.page) {
      return res.status(statusCode).json({
        total: data.length,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        data
      });
    }
    
    // 处理分页数据
    if (data && data.rows && data.count !== undefined) {
      return res.status(statusCode).json({
        total: data.count,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        data: data.rows
      });
    }
    
    // 处理普通数据
    return res.status(statusCode).json({
      data
    });
  };
  
  // 创建成功响应
  res.created = (data) => {
    return res.success(data, 201);
  };
  
  // 错误响应
  res.error = (message, error, statusCode = 400) => {
    const response = { message };
    if (error) {
      response.error = error;
    }
    return res.status(statusCode).json(response);
  };
  
  // 资源不存在响应
  res.notFound = (message = '资源不存在') => {
    return res.error(message, null, 404);
  };
  
  // 服务器错误响应
  res.serverError = (message = '服务器内部错误', error) => {
    return res.error(message, error, 500);
  };
  
  // 未授权响应
  res.unauthorized = (message = '未授权') => {
    return res.error(message, null, 401);
  };
  
  // 权限不足响应
  res.forbidden = (message = '权限不足') => {
    return res.error(message, null, 403);
  };
  
  next();
};

module.exports = responseMiddleware; 
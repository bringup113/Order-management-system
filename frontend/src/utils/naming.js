/**
 * 命名规范转换工具
 * 用于统一前后端的命名规范
 */

/**
 * 将驼峰命名转换为下划线命名
 * @param {Object} obj - 需要转换的对象
 * @returns {Object} - 转换后的对象
 * @example
 * camelToSnake({ firstName: 'John' }) // 返回 { first_name: 'John' }
 */
export function camelToSnake(obj) {
  if (!obj) return obj;
  
  // 如果是基本类型，直接返回
  if (typeof obj !== 'object') return obj;
  
  // 如果是数组，处理数组中的每个元素
  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item));
  }

  const result = {};
  Object.keys(obj).forEach(key => {
    // 跳过空值
    if (obj[key] === null || obj[key] === undefined) {
      result[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = obj[key];
      return;
    }
    
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    const value = obj[key];
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = camelToSnake(value);
    } else if (Array.isArray(value)) {
      result[snakeKey] = value.map(item => {
        if (item && typeof item === 'object') {
          return camelToSnake(item);
        }
        return item;
      });
    } else {
      result[snakeKey] = value;
    }
  });

  return result;
}

/**
 * 将下划线命名转换为驼峰命名
 * @param {Object} obj - 需要转换的对象
 * @returns {Object} - 转换后的对象
 * @example
 * snakeToCamel({ first_name: 'John' }) // 返回 { firstName: 'John' }
 */
export function snakeToCamel(obj) {
  if (!obj) return obj;
  
  // 如果是基本类型，直接返回
  if (typeof obj !== 'object') return obj;
  
  // 如果是数组，处理数组中的每个元素
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item));
  }

  const result = {};
  Object.keys(obj).forEach(key => {
    // 跳过空值
    if (obj[key] === null || obj[key] === undefined) {
      result[key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())] = obj[key];
      return;
    }
    
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    const value = obj[key];
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[camelKey] = snakeToCamel(value);
    } else if (Array.isArray(value)) {
      result[camelKey] = value.map(item => {
        if (item && typeof item === 'object') {
          return snakeToCamel(item);
        }
        return item;
      });
    } else {
      result[camelKey] = value;
    }
  });

  return result;
}

/**
 * 统一命名规范
 * 根据配置决定使用驼峰命名还是下划线命名
 */
export const namingConvention = {
  // 前端向后端发送数据时的转换函数
  toBackend: (data) => {
    const result = camelToSnake(data);
    console.log('转换为后端命名规范:', { before: data, after: result });
    return result;
  },
  
  // 从后端接收数据时的转换函数
  fromBackend: (data) => {
    const result = snakeToCamel(data);
    console.log('转换为前端命名规范:', { before: data, after: result });
    return result;
  }
}; 
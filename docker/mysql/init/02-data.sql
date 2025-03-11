-- 使用数据库
USE order_management;

-- 插入超级管理员账号
-- 密码为password的MD5加密值
INSERT INTO `user` (`username`, `password`, `name`, `role`, `status`, `created_at`, `updated_at`)
VALUES ('admin', '$2a$10$rTm/LmMUk/uEZQpwn7cVaOXUq8YfYBPcx9hSVcQT8RGKLYXaMf0Iy', '系统管理员', 'admin', 'enabled', NOW(), NOW());

-- 插入系统配置
INSERT INTO `config` (`config_key`, `config_value`, `description`, `created_at`, `updated_at`)
VALUES 
('SYSTEM_NAME', '订单管理系统', '系统名称', NOW(), NOW()),
('COMPANY_NAME', '公司名称', '公司名称', NOW(), NOW()),
('CONTACT_EMAIL', 'admin@example.com', '联系邮箱', NOW(), NOW()),
('CONTACT_PHONE', '12345678901', '联系电话', NOW(), NOW()),
('UPLOAD_PATH', '/app/uploads', '上传文件路径', NOW(), NOW()),
('ALLOWED_FILE_TYPES', 'jpg,jpeg,png,pdf', '允许上传的文件类型', NOW(), NOW()),
('MAX_FILE_SIZE', '5242880', '最大文件大小（字节）', NOW(), NOW()),
('ORDER_NO_PREFIX', 'ORD', '订单编号前缀', NOW(), NOW()),
('INVOICE_NO_PREFIX', 'INV', '账单编号前缀', NOW(), NOW());

-- 插入测试供应商数据
INSERT INTO `supplier` (`name`, `contact_person`, `contact_phone`, `address`, `status`, `remark`, `created_at`, `updated_at`)
VALUES 
('测试供应商1', '张三', '13800138001', '北京市朝阳区', 'active', '测试数据', NOW(), NOW()),
('测试供应商2', '李四', '13800138002', '上海市浦东新区', 'active', '测试数据', NOW(), NOW());

-- 插入测试代理数据
INSERT INTO `agent` (`name`, `contact_person`, `contact_phone`, `address`, `status`, `remark`, `created_at`, `updated_at`)
VALUES 
('测试代理1', '王五', '13800138003', '广州市天河区', 'active', '测试数据', NOW(), NOW()),
('测试代理2', '赵六', '13800138004', '深圳市南山区', 'active', '测试数据', NOW(), NOW());

-- 插入测试产品数据
INSERT INTO `product` (`name`, `type`, `description`, `details`, `status`, `remark`, `created_at`, `updated_at`)
VALUES 
('日本东京3日游', 'tour', '日本东京3日精品旅游产品', '包含机票、酒店、导游、景点门票等', 'active', '热门产品', NOW(), NOW()),
('泰国曼谷5日游', 'tour', '泰国曼谷5日精品旅游产品', '包含机票、酒店、导游、景点门票等', 'active', '热门产品', NOW(), NOW()),
('香港迪士尼乐园门票', 'tour', '香港迪士尼乐园一日门票', '含园内交通', 'active', '单项产品', NOW(), NOW()),
('东京羽田机场-市区单程接机', 'tour', '东京羽田机场-市区单程接机服务', '专车接送', 'active', '单项产品', NOW(), NOW());

-- 插入测试产品报价数据
INSERT INTO `product_quote` (`product_id`, `supplier_id`, `cost_price`, `remark`, `created_at`, `updated_at`)
VALUES 
(1, 1, 3000.00, '供应商1报价', NOW(), NOW()),
(1, 2, 2900.00, '供应商2报价', NOW(), NOW()),
(2, 1, 4500.00, '供应商1报价', NOW(), NOW()),
(3, 2, 400.00, '供应商2报价', NOW(), NOW()),
(4, 1, 300.00, '供应商1报价', NOW(), NOW());

-- 插入测试代理产品价格数据
INSERT INTO `agent_product_price` (`product_quote_id`, `agent_id`, `cost_price`, `selling_price`, `remark`, `created_at`, `updated_at`)
VALUES 
(1, 1, 3000.00, 3600.00, '代理1价格', NOW(), NOW()),
(1, 2, 3000.00, 3500.00, '代理2价格', NOW(), NOW()),
(2, 1, 2900.00, 3400.00, '代理1价格', NOW(), NOW()),
(3, 1, 4500.00, 5400.00, '代理1价格', NOW(), NOW()),
(4, 2, 400.00, 500.00, '代理2价格', NOW(), NOW()),
(5, 1, 300.00, 400.00, '代理1价格', NOW(), NOW()); 
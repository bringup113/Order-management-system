-- 添加用户表中缺失的字段
-- 根据错误信息，用户表中缺少email和phone字段

-- 添加email字段
ALTER TABLE `user` ADD COLUMN `email` VARCHAR(100) NULL COMMENT '邮箱';

-- 添加phone字段
ALTER TABLE `user` ADD COLUMN `phone` VARCHAR(20) NULL COMMENT '手机号';

-- 添加remarks字段
ALTER TABLE `user` ADD COLUMN `remarks` TEXT NULL COMMENT '备注'; 
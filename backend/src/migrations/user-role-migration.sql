-- 用户角色迁移SQL脚本
-- 将用户表中的role字段（ENUM类型）迁移到roleId字段（INTEGER类型）

-- 1. 添加roleId字段
ALTER TABLE `user` ADD COLUMN `roleId` INT UNSIGNED NULL COMMENT '角色ID（关联角色表）';

-- 2. 创建外键约束
ALTER TABLE `user` ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- 3. 更新roleId字段的值（根据role字段的值）
-- 注意：这一步需要确保roles表中已经有对应的角色记录
UPDATE `user` u
JOIN `roles` r ON 
  CASE 
    WHEN u.role = 'admin' THEN r.code = 'admin'
    WHEN u.role = 'user' THEN r.code = 'user'
    WHEN u.role = 'supplier' THEN r.code = 'supplier'
  END
SET u.roleId = r.id;

-- 4. 设置roleId字段为非空
ALTER TABLE `user` MODIFY COLUMN `roleId` INT UNSIGNED NOT NULL COMMENT '角色ID（关联角色表）';

-- 5. 删除role字段（可选，建议先保留一段时间，确认迁移无误后再删除）
-- ALTER TABLE `user` DROP COLUMN `role`; 
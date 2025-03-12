-- 删除用户表中的role字段
-- 由于我们已经将角色信息迁移到roleId字段，role字段现在是冗余的

-- 删除role字段
ALTER TABLE `user` DROP COLUMN `role`; 
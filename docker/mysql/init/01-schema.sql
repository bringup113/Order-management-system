-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS order_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE order_management;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `role` ENUM('admin', 'user', 'supplier') NOT NULL DEFAULT 'user' COMMENT '角色（管理员/普通用户/供应商）',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态（启用/禁用）',
  `last_login_time` DATETIME NULL COMMENT '最后登录时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 供应商表
CREATE TABLE IF NOT EXISTS `supplier` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '供应商名称',
  `contact_person` VARCHAR(50) NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) NULL COMMENT '联系电话',
  `address` VARCHAR(255) NULL COMMENT '地址',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态（合作中/已终止）',
  `remark` TEXT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';

-- 代理表
CREATE TABLE IF NOT EXISTS `agent` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '代理名称',
  `contact_person` VARCHAR(50) NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) NULL COMMENT '联系电话',
  `address` VARCHAR(255) NULL COMMENT '地址',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '状态（合作中/已终止）',
  `remark` TEXT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='代理表';

-- 护照信息表
CREATE TABLE IF NOT EXISTS `passport` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '客户姓名',
  `passport_no` VARCHAR(50) NOT NULL COMMENT '护照号码',
  `nationality` VARCHAR(50) NOT NULL COMMENT '国籍',
  `birth_date` DATE NOT NULL COMMENT '出生日期',
  `gender` ENUM('male', 'female', 'other') NOT NULL COMMENT '性别',
  `issue_date` DATE NOT NULL COMMENT '护照签发日期',
  `expiry_date` DATE NOT NULL COMMENT '护照有效期',
  `remark` TEXT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_passport_no` (`passport_no` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='护照信息表';

-- 签证信息表
CREATE TABLE IF NOT EXISTS `visa` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `passport_id` INT NOT NULL COMMENT '护照ID',
  `visa_type` VARCHAR(50) NOT NULL COMMENT '签证类型',
  `issue_country` VARCHAR(50) NOT NULL COMMENT '签发国家/地区',
  `issue_date` DATE NOT NULL COMMENT '签发日期',
  `expiry_date` DATE NOT NULL COMMENT '有效期',
  `entry_count` ENUM('single', 'multiple') NOT NULL DEFAULT 'single' COMMENT '入境次数（单次/多次）',
  `status` ENUM('valid', 'expired', 'expiring_soon') NOT NULL DEFAULT 'valid' COMMENT '签证状态（有效/过期/即将过期）',
  `remark` TEXT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `fk_visa_passport_idx` (`passport_id` ASC),
  CONSTRAINT `fk_visa_passport`
    FOREIGN KEY (`passport_id`)
    REFERENCES `passport` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='签证信息表';

-- 产品信息表
CREATE TABLE IF NOT EXISTS `product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '产品名称',
  `type` ENUM('tour', 'hotel', 'flight', 'other') NOT NULL DEFAULT 'tour' COMMENT '产品类型',
  `description` TEXT NULL COMMENT '产品描述',
  `details` TEXT NULL COMMENT '产品详情',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT '产品状态（上架/下架）',
  `remark` TEXT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品信息表';

-- 产品报价表
CREATE TABLE IF NOT EXISTS `product_quote` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL COMMENT '产品ID',
  `supplier_id` INT NOT NULL COMMENT '供应商ID',
  `cost_price` DECIMAL(10,2) NOT NULL COMMENT '成本价格',
  `remark` TEXT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `fk_product_quote_product_idx` (`product_id` ASC),
  INDEX `fk_product_quote_supplier_idx` (`supplier_id` ASC),
  CONSTRAINT `fk_product_quote_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `product` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_product_quote_supplier`
    FOREIGN KEY (`supplier_id`)
    REFERENCES `supplier` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品报价表';

-- 代理产品价格表
CREATE TABLE IF NOT EXISTS `agent_product_price` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_quote_id` INT NOT NULL COMMENT '产品报价ID',
  `agent_id` INT NOT NULL COMMENT '代理ID',
  `cost_price` DECIMAL(10,2) NOT NULL COMMENT '成本价格',
  `selling_price` DECIMAL(10,2) NOT NULL COMMENT '销售价格',
  `remark` TEXT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `fk_agent_product_price_product_quote_idx` (`product_quote_id` ASC),
  INDEX `fk_agent_product_price_agent_idx` (`agent_id` ASC),
  CONSTRAINT `fk_agent_product_price_product_quote`
    FOREIGN KEY (`product_quote_id`)
    REFERENCES `product_quote` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_agent_product_price_agent`
    FOREIGN KEY (`agent_id`)
    REFERENCES `agent` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='代理产品价格表';

-- 订单主表
CREATE TABLE IF NOT EXISTS `order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单编号',
  `passport_id` INT NOT NULL COMMENT '客户ID',
  `agent_id` INT NOT NULL COMMENT '代理ID',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `status` ENUM('pending', 'processing', 'cancelled', 'completed') NOT NULL DEFAULT 'pending' COMMENT '订单状态（待处理/处理中/已取消/已完成）',
  `payment_status` ENUM('unpaid', 'partially_paid', 'paid') NOT NULL DEFAULT 'unpaid' COMMENT '支付状态（未支付/部分支付/已支付）',
  `order_date` DATE NOT NULL COMMENT '下单日期',
  `remark` TEXT NULL COMMENT '备注',
  `created_by` INT NOT NULL COMMENT '创建人',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `order_no_UNIQUE` (`order_no` ASC),
  INDEX `fk_order_passport_idx` (`passport_id` ASC),
  INDEX `fk_order_agent_idx` (`agent_id` ASC),
  INDEX `fk_order_user_idx` (`created_by` ASC),
  CONSTRAINT `fk_order_passport`
    FOREIGN KEY (`passport_id`)
    REFERENCES `passport` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_agent`
    FOREIGN KEY (`agent_id`)
    REFERENCES `agent` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_user`
    FOREIGN KEY (`created_by`)
    REFERENCES `user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单主表';

-- 订单明细表
CREATE TABLE IF NOT EXISTS `order_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL COMMENT '订单ID',
  `product_id` INT NOT NULL COMMENT '产品ID',
  `product_quote_id` INT NOT NULL COMMENT '产品报价ID',
  `agent_product_price_id` INT NOT NULL COMMENT '代理产品价格ID',
  `quantity` INT NOT NULL DEFAULT 1 COMMENT '数量',
  `unit_price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计金额',
  `remark` TEXT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `fk_order_item_order_idx` (`order_id` ASC),
  INDEX `fk_order_item_product_idx` (`product_id` ASC),
  INDEX `fk_order_item_product_quote_idx` (`product_quote_id` ASC),
  INDEX `fk_order_item_agent_product_price_idx` (`agent_product_price_id` ASC),
  CONSTRAINT `fk_order_item_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `order` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_item_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `product` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_item_product_quote`
    FOREIGN KEY (`product_quote_id`)
    REFERENCES `product_quote` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_item_agent_product_price`
    FOREIGN KEY (`agent_product_price_id`)
    REFERENCES `agent_product_price` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- 账单主表
CREATE TABLE IF NOT EXISTS `invoice` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `invoice_no` VARCHAR(50) NOT NULL COMMENT '账单编号',
  `passport_id` INT NOT NULL COMMENT '客户ID',
  `agent_id` INT NOT NULL COMMENT '代理ID',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '账单总金额',
  `paid_amount` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '已支付金额',
  `unpaid_amount` DECIMAL(10,2) NOT NULL COMMENT '未支付金额',
  `status` ENUM('unpaid', 'partially_paid', 'paid') NOT NULL DEFAULT 'unpaid' COMMENT '账单状态（未支付/部分支付/已支付）',
  `issue_date` DATE NOT NULL COMMENT '生成日期',
  `remark` TEXT NULL COMMENT '备注',
  `created_by` INT NOT NULL COMMENT '创建人',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `invoice_no_UNIQUE` (`invoice_no` ASC),
  INDEX `fk_invoice_passport_idx` (`passport_id` ASC),
  INDEX `fk_invoice_agent_idx` (`agent_id` ASC),
  INDEX `fk_invoice_user_idx` (`created_by` ASC),
  CONSTRAINT `fk_invoice_passport`
    FOREIGN KEY (`passport_id`)
    REFERENCES `passport` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_invoice_agent`
    FOREIGN KEY (`agent_id`)
    REFERENCES `agent` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_invoice_user`
    FOREIGN KEY (`created_by`)
    REFERENCES `user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单主表';

-- 账单订单关联表
CREATE TABLE IF NOT EXISTS `invoice_order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `invoice_id` INT NOT NULL COMMENT '账单ID',
  `order_id` INT NOT NULL COMMENT '订单ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '金额',
  `status` ENUM('active', 'cancelled') NOT NULL DEFAULT 'active' COMMENT '状态（有效/取消）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `fk_invoice_order_invoice_idx` (`invoice_id` ASC),
  INDEX `fk_invoice_order_order_idx` (`order_id` ASC),
  CONSTRAINT `fk_invoice_order_invoice`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `invoice` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_invoice_order_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `order` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单订单关联表';

-- 支付记录表
CREATE TABLE IF NOT EXISTS `payment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `invoice_id` INT NOT NULL COMMENT '账单ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额',
  `payment_method` ENUM('bank_transfer', 'cash', 'other') NOT NULL DEFAULT 'bank_transfer' COMMENT '支付方式（银行转账/现金/其他）',
  `payment_date` DATE NOT NULL COMMENT '支付日期',
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '支付状态（待审核/已审核/已拒绝）',
  `proof_image_url` VARCHAR(255) NULL COMMENT '凭证图片URL',
  `approved_by` INT NULL COMMENT '审核人',
  `approved_at` DATETIME NULL COMMENT '审核时间',
  `approval_remark` TEXT NULL COMMENT '审核备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `fk_payment_invoice_idx` (`invoice_id` ASC),
  INDEX `fk_payment_user_idx` (`approved_by` ASC),
  CONSTRAINT `fk_payment_invoice`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `invoice` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_user`
    FOREIGN KEY (`approved_by`)
    REFERENCES `user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- 配置表
CREATE TABLE IF NOT EXISTS `config` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `config_key` VARCHAR(50) NOT NULL COMMENT '配置键',
  `config_value` TEXT NOT NULL COMMENT '配置值',
  `description` VARCHAR(255) NULL COMMENT '配置描述',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `config_key_UNIQUE` (`config_key` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='配置表';

-- 操作日志表
CREATE TABLE IF NOT EXISTS `operation_log` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT '用户ID',
  `operation_type` VARCHAR(50) NOT NULL COMMENT '操作类型',
  `operation_content` TEXT NOT NULL COMMENT '操作内容',
  `operation_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  `ip_address` VARCHAR(50) NULL COMMENT 'IP地址',
  `device_info` VARCHAR(255) NULL COMMENT '设备信息',
  PRIMARY KEY (`id`),
  INDEX `fk_operation_log_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_operation_log_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表'; 
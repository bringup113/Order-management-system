const express = require('express');
const { body } = require('express-validator');
const agentController = require('../controllers/agent.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @route GET /api/agents
 * @desc 获取所有代理
 * @access Private
 */
router.get('/', verifyToken, agentController.getAgents);

/**
 * @route GET /api/agents/:id
 * @desc 获取单个代理
 * @access Private
 */
router.get('/:id', verifyToken, agentController.getAgentById);

/**
 * @route POST /api/agents
 * @desc 创建代理
 * @access Private/Admin
 */
router.post(
  '/',
  [
    verifyToken,
    isAdmin,
    body('name').notEmpty().withMessage('代理名称不能为空'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('状态无效'),
    validate
  ],
  agentController.createAgent
);

/**
 * @route PUT /api/agents/:id
 * @desc 更新代理
 * @access Private/Admin
 */
router.put(
  '/:id',
  [
    verifyToken,
    isAdmin,
    body('name').optional().notEmpty().withMessage('代理名称不能为空'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('状态无效'),
    validate
  ],
  agentController.updateAgent
);

/**
 * @route DELETE /api/agents/:id
 * @desc 删除代理
 * @access Private/Admin
 */
router.delete('/:id', [verifyToken, isAdmin], agentController.deleteAgent);

module.exports = router; 
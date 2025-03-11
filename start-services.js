const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 加载环境变量
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const key in envConfig) {
      process.env[key] = envConfig[key];
    }
    console.log('已加载环境变量');
  }
} catch (error) {
  console.error('加载环境变量失败:', error);
}

// 获取端口配置
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 5001;
const PROJECT_NAME = process.env.COMPOSE_PROJECT_NAME || 'order-management';

// 检查Docker是否运行
function checkDockerRunning() {
  return new Promise((resolve, reject) => {
    exec('docker info', (error) => {
      if (error) {
        console.error('Docker未运行，请先启动Docker');
        reject(new Error('Docker未运行'));
      } else {
        resolve();
      }
    });
  });
}

// 检查服务是否运行
function checkServiceRunning(containerName) {
  return new Promise((resolve) => {
    exec(`docker ps -q -f name=${containerName}`, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`${containerName} 服务未运行`);
        resolve(false);
      } else {
        console.log(`${containerName} 服务正在运行`);
        resolve(true);
      }
    });
  });
}

// 停止服务
function stopService(containerName) {
  return new Promise((resolve, reject) => {
    console.log(`正在停止 ${containerName} 服务...`);
    exec(`docker stop ${containerName}`, (error) => {
      if (error) {
        console.error(`停止 ${containerName} 服务失败:`, error);
        reject(error);
      } else {
        console.log(`${containerName} 服务已停止`);
        resolve();
      }
    });
  });
}

// 启动所有服务
function startAllServices() {
  return new Promise((resolve, reject) => {
    console.log('正在启动所有服务...');
    exec('docker-compose up -d', (error) => {
      if (error) {
        console.error('启动服务失败:', error);
        reject(error);
      } else {
        console.log('所有服务已启动');
        resolve();
      }
    });
  });
}

// 检查服务健康状态
function checkServiceHealth(serviceName, port) {
  return new Promise((resolve) => {
    const maxAttempts = 10;
    let attempts = 0;
    
    const checkInterval = setInterval(() => {
      attempts++;
      console.log(`检查 ${serviceName} 服务健康状态 (${attempts}/${maxAttempts})...`);
      
      let command = '';
      if (serviceName === 'frontend') {
        command = `curl -s http://localhost:${port}`;
      } else if (serviceName === 'backend') {
        command = `curl -s http://localhost:${port}/api/test`;
      }
      
      exec(command, (error, stdout) => {
        if (!error && stdout) {
          clearInterval(checkInterval);
          console.log(`${serviceName} 服务运行正常`);
          resolve(true);
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.warn(`${serviceName} 服务可能未正常运行，请检查日志`);
          resolve(false);
        }
      });
    }, 2000);
  });
}

// 显示服务访问信息
function showServiceInfo() {
  console.log('\n===== 服务访问信息 =====');
  console.log(`前端服务: http://localhost:${FRONTEND_PORT}`);
  console.log(`后端服务: http://localhost:${BACKEND_PORT}`);
  console.log('========================\n');
}

// 显示服务日志
function showServiceLogs(containerName, lines = 20) {
  return new Promise((resolve) => {
    exec(`docker logs --tail ${lines} ${containerName}`, (error, stdout) => {
      if (error) {
        console.error(`获取 ${containerName} 日志失败:`, error);
      } else {
        console.log(`\n===== ${containerName} 最近日志 =====`);
        console.log(stdout);
        console.log('========================\n');
      }
      resolve();
    });
  });
}

// 主函数
async function main() {
  try {
    console.log('===== 订单管理系统服务启动脚本 =====');
    
    // 检查Docker是否运行
    await checkDockerRunning();
    
    // 容器名称
    const frontendContainer = 'order-management-frontend';
    const backendContainer = 'order-management-backend';
    
    // 检查前端服务是否运行
    const isFrontendRunning = await checkServiceRunning(frontendContainer);
    if (isFrontendRunning) {
      await stopService(frontendContainer);
    }
    
    // 检查后端服务是否运行
    const isBackendRunning = await checkServiceRunning(backendContainer);
    if (isBackendRunning) {
      await stopService(backendContainer);
    }
    
    // 启动所有服务
    await startAllServices();
    
    // 等待服务启动
    console.log('等待服务启动...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 检查服务健康状态
    await checkServiceHealth('backend', BACKEND_PORT);
    await checkServiceHealth('frontend', FRONTEND_PORT);
    
    // 显示后端日志
    await showServiceLogs(backendContainer);
    
    // 显示服务访问信息
    showServiceInfo();
    
    console.log('服务启动脚本执行完成');
  } catch (error) {
    console.error('启动服务时发生错误:', error);
    process.exit(1);
  }
}

// 执行主函数
main(); 
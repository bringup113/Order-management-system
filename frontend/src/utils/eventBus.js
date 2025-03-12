// 使用Vue 3的内置功能创建一个简单的事件总线
const eventBus = {
  events: {},
  
  // 注册事件监听器
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  },
  
  // 移除事件监听器
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    
    if (!callback) {
      // 如果没有提供回调函数，则移除该事件的所有监听器
      delete this.events[eventName];
      return;
    }
    
    // 移除特定的回调函数
    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    );
  },
  
  // 触发事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) return;
    
    this.events[eventName].forEach(callback => {
      callback(...args);
    });
  }
};

// 导出事件总线
export default eventBus;

// 定义事件常量
export const EVENTS = {
  ROLE_LIST_UPDATED: 'role_list_updated',
  RESET_USER_FORM: 'reset_user_form'
}; 
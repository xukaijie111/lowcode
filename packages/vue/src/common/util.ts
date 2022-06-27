

//@ts-nocheck
export function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};
  
    var later = function() {
      previous = options.leading === false ? 0 : new Date();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null; // 显示地释放内存，防止内存泄漏
    };
  
    var throttled = function() {
      var now = new Date();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  
    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };
  
    return throttled;
  }
  
  export const compThrottled = (func, delay = 800, options = {}) => {
    return throttle(func, delay, Object.assign({ leading: true, trailing: false }, options));
  };
  
  export const debounce = (fn, wait) => {
    const callback = fn;
    let timerId = null;
  
    function debounced() {
      // 保存作用域
      const context = this;
      // 保存参数，例如 event 对象
      const args = arguments;
  
      clearTimeout(timerId);
      timerId = setTimeout(function() {
        callback.apply(context, args);
      }, wait);
    }
  
    // 返回一个闭包
    return debounced;
  };
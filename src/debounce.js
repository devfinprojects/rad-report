/**
 * Debounce Module - Rate Limiting and Throttling Utilities
 * Part of RadReport AI Core Utilities
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to delay
 * @param {boolean} immediate - If true, trigger on the leading edge
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout = null;
  let lastArgs = null;
  let lastThis = null;
  
  const debounced = function(...args) {
    lastThis = this;
    lastArgs = args;
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate && lastArgs) {
        func.apply(lastThis, lastArgs);
      }
    }, wait);
    
    if (callNow) {
      func.apply(this, args);
    }
  };
  
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };
  
  debounced.flush = function() {
    if (timeout && lastArgs) {
      clearTimeout(timeout);
      func.apply(lastThis, lastArgs);
      timeout = null;
      lastArgs = null;
    }
  };
  
  return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * @param {Function} func - Function to throttle
 * @param {number} wait - Minimum time between invocations
 * @param {Object} options - Throttle options
 * @returns {Function} Throttled function
 */
export function throttle(func, wait = 300, options = {}) {
  let lastTime = 0;
  let timeout = null;
  let lastArgs = null;
  let lastThis = null;
  const { leading = true, trailing = true } = options;
  
  const throttled = function(...args) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    
    lastThis = this;
    lastArgs = args;
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      lastTime = now;
      func.apply(this, args);
    } else if (trailing && !timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        if (lastArgs) {
          func.apply(lastThis, lastArgs);
        }
      }, remaining);
    }
  };
  
  throttled.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
    lastTime = 0;
  };
  
  return throttled;
}

/**
 * Creates a debounced async function
 * @param {Function} func - Async function to debounce
 * @param {number} wait - Milliseconds to delay
 * @returns {Function} Debounced async function
 */
export function debounceAsync(func, wait = 300) {
  let pending = null;
  let resolve = null;
  let timeout = null;
  
  return function(...args) {
    if (timeout) clearTimeout(timeout);
    
    if (!pending) {
      pending = new Promise((res) => {
        resolve = res;
      });
    }
    
    timeout = setTimeout(async () => {
      const result = await func.apply(this, args);
      resolve(result);
      pending = null;
      resolve = null;
      timeout = null;
    }, wait);
    
    return pending;
  };
}

/**
 * Creates a debounced function specifically for search operations
 * @param {Function} searchFunc - Search function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Object} Debounced search with cancel and execute
 */
export function createSearchDebounce(searchFunc, delay = 300) {
  let timeout = null;
  let lastQuery = null;
  
  const search = (query) => {
    lastQuery = query;
    
    return new Promise((resolve, reject) => {
      if (timeout) clearTimeout(timeout);
      
      timeout = setTimeout(async () => {
        try {
          const results = await searchFunc(lastQuery);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
  
  search.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  search.executeNow = async () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (lastQuery !== null) {
      return await searchFunc(lastQuery);
    }
    return null;
  };
  
  return search;
}

/**
 * Creates a rate limiter for API calls
 * @param {number} maxCalls - Maximum calls allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} Rate limiter
 */
export function createRateLimiter(maxCalls = 10, windowMs = 60000) {
  const calls = [];
  
  const limiter = {
    tryAcquire() {
      const now = Date.now();
      // Remove old calls outside the window
      while (calls.length > 0 && now - calls[0] > windowMs) {
        calls.shift();
      }
      
      if (calls.length >= maxCalls) {
        return {
          allowed: false,
          retryAfter: Math.ceil((calls[0] + windowMs - now) / 1000)
        };
      }
      
      calls.push(now);
      return { allowed: true };
    },
    
    getUsage() {
      const now = Date.now();
      while (calls.length > 0 && now - calls[0] > windowMs) {
        calls.shift();
      }
      return {
        current: calls.length,
        max: maxCalls,
        remaining: Math.max(0, maxCalls - calls.length)
      };
    },
    
    reset() {
      calls.length = 0;
    }
  };
  
  return limiter;
}

/**
 * Creates a debounced function for auto-save operations
 * @param {Function} saveFunc - Save function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Object} Auto-save handler
 */
export function createAutoSave(saveFunc, delay = 2000) {
  let timeout = null;
  let saveData = null;
  let isSaving = false;
  let lastSaveTime = null;
  
  const save = (data) => {
    saveData = data;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(async () => {
      if (isSaving) {
        // Wait for current save to complete
        return;
      }
      
      isSaving = true;
      try {
        await saveFunc(saveData);
        lastSaveTime = Date.now();
        saveData = null;
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        isSaving = false;
      }
    }, delay);
  };
  
  const saveNow = async () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    
    if (isSaving) {
      // Wait for current save to complete
      return new Promise((resolve) => {
        const checkSave = setInterval(() => {
          if (!isSaving) {
            clearInterval(checkSave);
            resolve();
          }
        }, 100);
      });
    }
    
    if (saveData) {
      isSaving = true;
      try {
        await saveFunc(saveData);
        lastSaveTime = Date.now();
        saveData = null;
      } finally {
        isSaving = false;
      }
    }
  };
  
  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    saveData = null;
  };
  
  return {
    save,
    saveNow,
    cancel,
    getStatus: () => ({
      isSaving,
      lastSaveTime,
      hasPending: saveData !== null
    })
  };
}

/**
 * Debounce decorator for class methods
 * @param {number} wait - Milliseconds to delay
 * @param {boolean} immediate - If true, trigger on leading edge
 * @returns {Function} Decorator function
 */
export function debounced(wait = 300, immediate = false) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    let timeout = null;
    
    descriptor.value = function(...args) {
      const callNow = immediate && !timeout;
      
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        timeout = null;
        if (!immediate) {
          originalMethod.apply(this, args);
        }
      }, wait);
      
      if (callNow) {
        originalMethod.apply(this, args);
      }
    };
    
    return descriptor;
  };
}

/**
 * Creates a memoized function with debounce
 * @param {Function} func - Function to memoize
 * @param {number} wait - Debounce wait time
 * @returns {Function} Memoized debounced function
 */
export function memoizeDebounced(func, wait = 300) {
  const cache = new Map();
  const debouncedCalls = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    // Return cached result if exists and not expired
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < wait) {
      return cached.value;
    }
    
    // Check if there's a pending debounced call
    if (debouncedCalls.has(key)) {
      return debouncedCalls.get(key);
    }
    
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        const result = func.apply(this, args);
        cache.set(key, { value: result, timestamp: Date.now() });
        debouncedCalls.delete(key);
        resolve(result);
      }, wait);
    });
    
    debouncedCalls.set(key, promise);
    return promise;
  };
}

export default {
  debounce,
  throttle,
  debounceAsync,
  createSearchDebounce,
  createRateLimiter,
  createAutoSave,
  debounced,
  memoizeDebounced
};
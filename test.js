function StrongArray(...items) {
  var array = [];

  Object.defineProperty(this, 'length', {
    get: function() {
      return array.length;
    },
    enumerable: true,
    configurable: false
  });

  Object.defineProperty(this, 'set', {
    value: function(index, value) {
      if (index >= 0 && index < array.length) {
        array[index] = value;
      } else {
        throw new Error('Invalid index!');
      }
    },
    writable: false,
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(this, 'get', {
    value: function(index) {
      if (index >= 0 && index < array.length) {
        return array[index];
      } else {
        throw new Error('Invalid index!');
      }
    },
    writable: false,
    enumerable: false,
    configurable: false
  });

  Object.setPrototypeOf(this, Array.prototype);

  // Override mutating array methods
  ['pop', 'shift'].forEach(function(method) {
    Object.defineProperty(this, method, {
      value: function() {
        if (array.length > 0) {
          var removedItem;
          if (method === 'pop') {
            removedItem = array.pop();
          } else if (method === 'shift') {
            removedItem = array.shift();
          }
          return removedItem;
        } else {
          throw new Error('Cannot remove item from an empty array!');
        }
      },
      writable: false,
      enumerable: false,
      configurable: false
    });
  }, this);

  // Additional methods for adding and removing items without holes
  Object.defineProperty(this, 'push', {
    value: function(...pushItems) {
      array.push(...pushItems);
    },
    writable: false,
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(this, 'unshift', {
    value: function(...unshiftItems) {
      array.unshift(...unshiftItems);
    },
    writable: false,
    enumerable: false,
    configurable: false
  });
  
  Object.defineProperty(this, 'forEach', {
    value: function(cb) {
      array.forEach(cb);
    },
    writable: false,
    enumerable: false,
    configurable: false
  });
  
  Object.defineProperty(this, 'map', {
    value: function(cb) {
      array.map(cb);
    },
    writable: false,
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(this, 'remove', {
    value: function(index) {
      if (index >= 0 && index < array.length) {
        var removedItem = array.splice(index, 1)[0];
        return removedItem;
      } else {
        throw new Error('Invalid index!');
      }
    },
    writable: false,
    enumerable: false,
    configurable: false
  });

  // Populate the array with initial items
  if (items.length > 0) {
    array = items.filter(Boolean); // Remove falsy values (undefined, null, etc.)
  }
  
  const proxy = new Proxy(this, {
    get (t, p, r) {
      //p = Number.parseInt(p)
      if(typeof p === "number" && (p > t.length || p < t.length)) {
        throw new Error("Cannot access this index")
      }
      
      return t[p]
    },
    set (t, p, r) {
      p = Number.parseInt(p)
      if(typeof p === "number" && (p > t.length || p < t.length)) {
        throw new Error("Cannot access this index")
      }
      
      return t[p]
    }
  })
  
  return proxy
}

const arr = new StrongArray(1,2,3,4)

arr.push(5)

arr[5]
//arr[7] = 7

const c = arr.map(i => i*2)

console.log(arr, arr.length, c)
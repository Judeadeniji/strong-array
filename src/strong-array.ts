interface StrongArray<T> extends Array<T> {
  get: (index: number) => T;
  remove: (index: number) => T;
}

export function StrongArray<T>(...items: T[]): T[] {
  const array: T[] = [];
  
  const notAllowed: any[] = ["splice", "fill", "copyWithin"];

  const handler: ProxyHandler<StrongArray<T>> = {
    get(target: T[], prop) {
      if (prop === 'length') {
        return array.length;
      } else if (prop === 'get') {
        return function (index: number): T {
          if (index >= 0 && index < array.length) {
            return array[index];
          } else {
            throw new Error('Invalid index!');
          }
        };
      } else if (prop === 'set') {
        return function (index: number, value: T): void {
          throw new Error('Direct assignment is not allowed!');
        };
      } else if (prop === 'remove') {
        return function (index: number): T {
          if (index >= 0 && index < array.length) {
            const removedItem = array.splice(index, 1)[0];
            return removedItem;
          } else {
            throw new Error('Invalid index!');
          }
        };
      } else if (notAllowed.includes(prop)) {
        throw new Error("This method is not allowed")
      } else if (prop === 'push' || prop === 'unshift') {
        return function (...args: T[]): void {
          array[prop](...args.filter(function (item: T) {
            return item !== undefined;
          }));
        };
      } else if (prop === 'pop' || prop === 'shift') {
        return function (): T | undefined {
          return array[prop]();
        };
      } else if (prop === Symbol.iterator) {
        return array[prop].bind(array);
      } else if (typeof array[prop] === 'function') {
        return array[prop].bind(array);
      } else {
        return (target as any)[prop];
      }
    },
    set(target, prop, value) {
      throw new Error('Direct assignment is not allowed!');
    },
    deleteProperty(target, prop) {
      throw new Error('Direct deletion is not allowed!');
    }
  };

  const proxy = new Proxy<T[]>(array, handler);

  Object.setPrototypeOf(proxy, Array.prototype);

  // Populate the array with initial items
  if (items.length > 0) {
    array.push(...items.filter(function (item: T) {
      return item !== undefined;
    }));
  }

  return proxy;
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrongArray = void 0;
function StrongArray(...items) {
    const array = [];
    const notAllowed = ["splice", "fill", "copyWithin"];
    const handler = {
        get(target, prop) {
            if (prop === 'length') {
                return array.length;
            }
            else if (prop === 'get') {
                return function (index) {
                    if (index >= 0 && index < array.length) {
                        return array[index];
                    }
                    else {
                        throw new Error('Invalid index!');
                    }
                };
            }
            else if (prop === 'set') {
                return function (index, value) {
                    throw new Error('Direct assignment is not allowed!');
                };
            }
            else if (prop === 'remove') {
                return function (index) {
                    if (index >= 0 && index < array.length) {
                        const removedItem = array.splice(index, 1)[0];
                        return removedItem;
                    }
                    else {
                        throw new Error('Invalid index!');
                    }
                };
            }
            else if (notAllowed.includes(prop)) {
                throw new Error("This method is not allowed");
            }
            else if (prop === 'push' || prop === 'unshift') {
                return function (...args) {
                    array[prop](...args.filter(function (item) {
                        return item !== undefined;
                    }));
                };
            }
            else if (prop === 'pop' || prop === 'shift') {
                return function () {
                    return array[prop]();
                };
            }
            else if (prop === Symbol.iterator) {
                return array[prop].bind(array);
            }
            else if (typeof array[prop] === 'function') {
                return array[prop].bind(array);
            }
            else {
                return target[prop];
            }
        },
        set(target, prop, value) {
            throw new Error('Direct assignment is not allowed!');
        },
        deleteProperty(target, prop) {
            throw new Error('Direct deletion is not allowed!');
        }
    };
    const proxy = new Proxy(array, handler);
    Object.setPrototypeOf(proxy, Array.prototype);
    // Populate the array with initial items
    if (items.length > 0) {
        array.push(...items.filter(function (item) {
            return item !== undefined;
        }));
    }
    return proxy;
}
exports.StrongArray = StrongArray;
//# sourceMappingURL=strong-array.js.map
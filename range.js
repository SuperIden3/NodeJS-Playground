/**
 * Build an array ranging from `start` to `end` incrementing or decrementing by `step`.
 * @param {number} start The starting number.
 * @param {number} end The ending number.
 * @param {number} step The number to increment or decrement by.
 */
function range(start, end, step = 1) {
    try {
        let arr = [];
        if(start < end) {
            for(let i = start; i <= end; i += step)
                arr.push(i);
        } else {
            for(let j = start; j >= end; i -= step)
                arr.push(j);
        }
        return arr;
    } catch(e) {
        throw(e);
    }
}

module.exports = range;
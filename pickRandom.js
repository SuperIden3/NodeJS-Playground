/**
 * Pick a random value from a list of values.
 * @param {...any} values The list of values.
 * @returns {any} The random value.
 */
function pickRandom(...values) {
    let rand = Math.random() * values.length | 0;
    let r = values[rand];
    return r;
}

module.exports = pickRandom;
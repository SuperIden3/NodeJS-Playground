// NOTUSED

/**
 * Prints a string.
 * @param {string} str The string to print.
 * @param {...any} args The arguments for the string.
 * @version 1.0.0
 */
function println(str, ...args) {
  const cp = require("child_process");
  const colors = {
    Blue: "\u001b[34m",
    Reset: "\u001b[0m",
    Black: "\u001b[30m",
    Red: "\u001b[31m",
    Green: "\u001b[32m",
    Yellow: "\u001b[33m",
    Magenta: "\u001b[35m",
    Cyan: "\u001b[36m",
    White: "\u001b[37m",
    Gray: "\u001b[90m",
    "Bright Red": "\u001b[91m",
    "Bright Green": "\u001b[92m",
    "Bright Yellow": "\u001b[93m",
    "Bright Magenta": "\u001b[95m",
    "Bright Cyan": "\u001b[96m",
    "Bright White": "\u001b[97m",
    "Bright Black": "\u001b[30;1m",
    "Bright Blue": "\u001b[34;1m",
    "Bright Cyan": "\u001b[36;1m",
    "Bright Magenta": "\u001b[35;1m",
    "Bright White": "\u001b[37;1m",
    "Bright Yellow": "\u001b[33;1m",
    "Bright Gray": "\u001b[90;1m",
    "Dark Gray": "\u001b[90;2m",
  };
  const searches = str.match(/\%c/g);
  for (const i in searches) {
    str = str.replace(searches[i], colors[args[i]]);
  }
  for (const i in args) {
    str = str.replace("%s", args[i]);
  }
  for (const i in args) {
    // Search for `%d` or `%i`.
    str = str.replace(/(%[di])/g, args[i]);
  }
  for (const i in args) {
    // Search for `%f`.
    str = str.replace(/(%f)/g, args[i]);
  }

  return process.stdout.write(String(str));
}
println("Hello, %s!", "World");

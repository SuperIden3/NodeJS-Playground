console.time("Code");
//------------------------------------------------------------//

// Imports here.
const pickRandom = require("./pickRandom.js");
const range = require("./range.js");

const FS = require("fs");
const HTTP = require("http"); // Port: 3421
const YARGS = require("yargs")(process.argv);
const STREAM = require("stream");
const _URL = require("url");
const ZOD = require("zod");
const TRANSLATE = require("translate");
/*const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});*/

//------------------------------------------------------------//
// Custom functions or pre-defined variables here.

/**
 * Decode a buffered array.
 * @param {ArrayBuffer} bufferedArray The buffered array to decode.
 * @param {string} encoding The encoding format of the buffered array to decode.
 * @returns {string} The decoded buffered array.
 */
function decode(bufferedArray, encoding = "utf-8") {
  let decoder = new TextDecoder(encoding);
  return decoder.decode(bufferedArray);
}
/**
 * Encode any string into the encoding format `encoding`.
 * @param {string} str The string to encode.
 * @param {Uint8Array | Buffer} mode Either makes the function return a `Uint8Array` or a `Buffer`.
 * @returns {Uint8Array | Buffer} The encoded string in `utf-8` format.
 */
function encode(str) {
  let encoder = new TextEncoder();
  return encoder.encode(str);
}
/**
 * Goes over the keys and values of an array or an object.
 * @param {any[] | object} obj The object to iterate over.
 * @yields {{index: number, value: any} | {key: string, index: number, value: any}} The object in which contains each key, index, and value in `obj`.
 */
function* enumerate(obj) {
  if (Array.isArray(obj)) {
    for (let index in obj)
      yield {
        index: index,
        value: obj[index],
      };
  } else {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    /**
     * @type {Array<{key: string, index: number, value: any}>}
     */
    let vals = [];
    for (let i = 0; i < keys.length; i++) {
      let x = {
        key: keys[i],
        index: parseInt(i),
        value: values[i],
      };
      yield x;
      vals.push(x);
    }
  }
}
/**
 * Initialize a new `LineReader` using the `readline` module to read input from the user.
 * @param {NodeJS.ReadableStream} input The input to read from.
 * @param {NodeJS.WriteableStream} output The output to write to.
 * @param {import("readline").Completer | import("readline").AsyncCompleter} completer The completer or async completer.
 * @param {boolean} terminal Use the terminal or not.
 * @returns {readline.Interface} The object for reading and writing from the user to the console.
 */
class LineReader {
  /**
   * Initialize a new `LineReader` using the `readline` module to read input from the user.
   * @param {NodeJS.ReadableStream} input The input to read from.
   * @param {NodeJS.WriteableStream} output The output to write to.
   * @param {import("readline").Completer | import("readline").AsyncCompleter} completer The completer or async completer.
   * @param {boolean} terminal Use the terminal or not.
   * @returns {readline.Interface} The object for reading and writing from the user to the console.
   */
  constructor(
    input = process.stdin,
    output = process.stdout,
    completer,
    terminal = false,
  ) {
    const o = this;
    const readline = require("readline");
    const prompt = require("prompt-sync")();
    const rl = readline.createInterface(input, output, completer, terminal);
    Object.defineProperties(this, {
      readLine: {
        value: rl,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      prompt: {
        value: prompt,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      [Symbol.iterator]: {
        value: function* iterator() {
          const keys = Object.keys(o);
          const values = Object.values(o);
          for (const i in keys)
            yield {
              key: keys[i],
              index: i,
              count: i + 1,
              value: values[i],
            };
        },
      },
    });
  }
}
class URL {
  /**
   * Initialize a new URL object.
   * @param {string} _url The URL.
   */
  constructor(_url) {
    if (_url.startsWith("http://") || _url.startsWith("https://")) {
      this["url"] = z.string().parse(_url);
    } else {
      this["url"] = z.string.parse(`https://${_url}`);
    }
  }
  async open() {
    return new Promise((r, f) => {
      try {
        window.open(this["url"]);
        r(true);
      } catch (e) {
        f(e);
      }
    });
  }
}
/**
 * Reads, iterates, and yields over all the values of a ReadableStream (`readableStream`).
 * @param {ReadableStream} readableStream The `ReadableStream` to read.
 * @yields {any} The iterated value of `readableStream`.
 * @returns {any[]} All the iterated values of `readableStream` in an array.
 */
const rsra = async function* readableStreamReadAll(readableStream) {
  const reader = readableStream.getReader();
  let readValue = z.any().parse(await reader.read());
  const readValues = [];
  while (readValue.done === false) {
    yield readValue.value;
    readValues.push(readValue);
    readValue = await reader.read();
  }
  reader.releaseLock();
  return readValues;
};
/**@typedef {...number} NumberArray */
/**
 * Find the maximum value in an array.
 * @typedef {number} MaxNumber A maximum value in an array.
 * @param {NumberArray} values The numbers to iterate over.
 * @returns {MaxNumber} The maximum value from `values`.
 */
function max(...values) {
  let maximum = values[0];
  for (const num of values) if (z.number().parse(num) > maximum) maximum = num;
  return maximum;
}
/**
 * Find the minimum value in an array.
 * @typedef {number} MinNumber A minimum value in an array.
 * @param {NumberArray} values The numbers to iterate over.
 * @returns {MinNumber} The minimum value from `values`.
 */
function min(...values) {
  let minimum = values[0];
  for (const num of values) if (z.number().parse(num) < minimum) minimum = num;
  return minimum;
}
class Person {
  name = z.string({
    invalid_type_error: "Must be a string for a name.",
    required_error: "The name is required for the person.",
    description: "This is the name for the person.",
  });
  age = z
    .number({
      invalid_type_error: "Must be a number for an age.",
      required_error: "The age is required for the person.",
      description: "This is the age for the person.",
    })
    .or(
      z.bigint({
        invalid_type_error: "Must be a number for an age.",
        required_error: "The age is required for the person.",
        description: "This is the age for the person.",
      }),
    );
  hobbies = z
    .array(z.string(), {
      invalid_type_error: "Must be an array with all strings for hobbies.",
      required_error: "The hobbies is required for the person.",
      description: "These are the hobbies for the person.",
    })
    .or(z.object(new Set()));
  /**
   * Makes a new Person.
   * @param {string} name The name for the person.
   * @param {number} age The age for the person.
   * @param {string[]} hobbies The hobbies for the person.
   */
  constructor(name, age, hobbies) {
    if (age <= 0)
      throw new Error(
        `The person cannot be${age === -1 ? " a" : ""} ${age} year${
          age === -1 ? "" : "s"
        } old.`,
      );
    this.name = this.name.parse(name);
    this.age = this.age.parse(age);
    this.hobbies = this.hobbies.parse(hobbies);
  }
}
/**
 * Calculate the factorial of a number.
 * @typedef {number} FactorialNumberArgument
 * @param {FactorialNumberArgument} n The number to calculate its factorial.
 * @typedef {number} FactorialResult
 * @returns {FactorialResult}
 */
function factorial(n) {
  z.number().or(z.bigint()).parse(n);
  if (n === 1 || n === 1n) return n;
  return n * factorial(n - (typeof n === "bigint" ? 1n : 1));
}
function YouSuckError(message) {
  const error = new Error(message);
  Object.defineProperty(error, "name", {
    value: "YouSuckError",
    writable: false,
    enumerable: true,
    configurable: false,
  });
  return error;
}
const esc = async function executeShellCommand(command) {
  const cp = require("child_process");
  return new Promise((r, f) => {
    try {
      cp.exec(command, (err, stdout, stderr) => {
        r({
          error: err,
          stdout,
          stderr,
        });
      });
    } catch (e) {
      f(e);
    }
  });
};
const convertTo = {
  /**
   * Convert a string to its binary form.
   * @typedef {string} StringArgumentBinary
   * @typedef {ArrayBuffer} BinaryNumber
   */
  binary(str) {
    const _binary = new ArrayBuffer(str.length);
    for (let i = 0; i < str.length; i++)
      _binary.push(parseInt(str[i].charCodeAt(0).toString(2)));
    return _binary;
  },
  /**
   * Convert a string into its hexadecimal form.
   * @typedef {string} StringArgumentHexadecimal
   * @param {StringArgumentHexadecimal} str
   * @typedef {Buffer} HexadecimalNumbers
   * @returns {HexadecimalNumbers}
   */
  hexadecimal(str) {
    const _hexadecimal = [];
    for (let i = 0; i < str.length; i++)
      _hexadecimal[i] = str[i].charCodeAt(0).toString(16);
    return Buffer.from(str);
  },
  /**
   * Convert a string into its octal form.
   * @typedef {string} StringArgumentOctal
   * @param {StringArgumentOctal} str
   * @typedef {ArrayBuffer} OctalNumbers
   * @returns {OctalNumbers}
   */
  octal(str) {
    const _octal = new ArrayBuffer(str.length);
    for (let i = 0; i < str.length; i++)
      _octal[i] = parseInt(str[i].charCodeAt(0).toString(8));
    return _octal;
  },
  /**
   * Convert a string into any base you want.
   * @typedef {string} StringArgumentCustomBase
   * @typedef {number} BaseNumberCustomBase
   * @param {StringArgumentCustomBase} str
   * @param {BaseNumberCustomBase} base
   * @typedef {ArrayBuffer} CustomBaseNumbers
   * @returns {CustomBaseNumbers}
   */
  cb: function customBase(str, base = 10) {
    const nums = new ArrayBuffer(str.length);
    for (let i = 0; i < str.length; i++)
      nums[i] = str[i].charCodeAt(0).toString(parseInt(base));
    return nums;
  },
};
/**
 * Check if a value is one of the expected types.
 * @param {...string} types
 * @returns {{types: string[], match: (value: any) => {value: any, valueType: string, matchesType: {yes: boolean, type: string}}, expectedTypes: string[], formatter: Intl.ListFormat}}
 */
function Union(...types) {
  return {
    types,
    match(value) {
      const listFormatter = new Intl.ListFormat("en", {
        style: "long",
        type: "disjunction",
      });
      const arr = new Set();
      for (const i of this.types)
        if (typeof value === i) arr.add(true);
        else;
      arr.add(false);
      if (arr.has(true))
        return {
          value,
          valueType: typeof value,
          matchesType: {
            yes: true,
            type: (() => {
              for (const i of types) if (typeof value === i) return i;
            })(),
          },
          expectedTypes: types,
          formatter: listFormatter,
        };
      else;
      throw new TypeError(
        `expected a${
          types[0].startsWith("a") ||
          types[0].startsWith("e") ||
          types[0].startsWith("i") ||
          types[0].startsWith("o") ||
          types[0].startsWith("u")
            ? "n"
            : ""
        } ${listFormatter.format(types)}, but recieved ${typeof value}`,
      );
    },
  };
}
function Trace(message) {
  const traceMessage = Error(message);
  traceMessage.name = "Trace";
  Object.defineProperty(traceMessage, Symbol.toStringTag, {
    value: function toPrimitive(hint) {
      if (hint === "string") return traceMessage.stack;
      else if (hint === "number") return 1;
      return traceMessage;
    },
    enumerable: true,
    writable: false,
  });
  return traceMessage;
}
const cet = function createEventTarget(options = {}) {
  const et = new EventTarget();
  if (typeof options === "object" && !Array.isArray(options))
    Object.assign(et, options);
  else if (Array.isArray(options))
    throw new TypeError("options for function must be an object, not an array");
  else if (typeof options !== "object")
    throw new TypeError(
      `options for function must be an object, not type of ${
        Array.isArray(options) ? "array" : typeof options
      }`,
    );
  return et;
};
/**
 * Calculate the perimeter of a rectangle.
 * @param {...number} nums The length and width of the rectangle.
 * @returns {number} The perimeter of the rectangle.
 */
function perimeter(...nums) {
  const arr = [];
  for (const i in nums) arr[i] = nums[i] * 2;
  const sum = arr.reduce((p, c) => p + c);
  return sum;
}

/**
 * Inspired by Python, this method of the `String` class allows you to format strings.
 * @param {...any} args The values to replace the indexes.
 * @typedef {string} FormattedString
 * @returns {FormattedString} The formatted string.
 * @example `console.log("Hello, {0}!".format("World"));` prints `Hello, World!`.
 */
String.prototype.format = function format(...args) {
  /**
   * Finds the string `"{(number)}""`.
   *
   * In `{}`, `\d` is a digit from `0` to `9`. The `+` means one or more. `?` means optional. The flag `g` means global.
   * @type {RegExp}
   */
  const regexp = /{(\d+)}?/g;
  return this.replace(
    regexp,
    /**
     * @param {string} match The matched string.
     * @param {number} number The index of the matched string.
     * @returns {string} The replaced string.
     */
    (match, number) => (!!args[number] ? args[number] : match),
  );
};
/**
 * Messager is an `EventTarget` that allows you to send and receive messages.
 * @param {string} str The message to send.
 * @returns {string} The message that was sent.
 * @throws {TypeError} If `str` is not a string.
 */
const Messager = Object.freeze(
  cet({
    message(str) {
      if (typeof str !== "string") {
        console.error(
          Messager.dispatchEvent(
            new CustomEvent("error", {
              message: "str is not a string",
              error: new TypeError("str is not a string"),
            }),
          ),
        );
        return new TypeError("str is not a string");
      } else {
        Messager.dispatchEvent(
          new MessageEvent("message", { data: String(str) }),
        );
        return String(str);
      }
    },
  }),
);
/**
 * Format an array using `Intl.ListFormat`.
 * @param {("conjunction" | "disjunction" | "unit")} type The type of grouping.
 * @param {("long" | "short" | "narrow")} style The style of the grouping.
 * @returns {string} The formatted array.
 */
Array.prototype.format = function format(
  language = "en-US",
  type = "conjunction",
  style = "long",
) {
  const listFormatter = new Intl.ListFormat(language, {
    style,
    type,
  });
  return listFormatter.format(this);
};
/**
 * Translates from one language to another.
 * @param {string} from The language to translate **from**.
 * @param {string} to The language to translate **to**.
 * @returns {(str: string) => string} The translation function.
 */
function translate(from, to) {
  TRANSLATE.from = from;
  TRANSLATE.to = to;
  return (str) => TRANSLATE(str);
}
//----------------------------------------------------------//

/**
 * Main function for code.
 * @typedef {...any} Arguments Arguments of a function.
 * @typedef {Promise<any> | void} IIAFE A return type for Immediately Invoked Async Function Expressions.
 * @param {Arguments} args The arguments for the function.
 * @returns {IIAFE}
 */
(async function main() {
  "use strict";
  const main = {
    arguments: process.argv.slice(2),
    file: process.argv[1],
    interpreter: process.argv[0],
    ...process.argv,
  };
  try {
    console.dir(main);
    console.log(
      await translate(
        !!main.arguments[0] ? "en" : main.arguments[0],
        !!main.arguments[1] ? "es" : main.arguments[1],
      )(!!main.arguments[2] ? main.arguments[2] : "Hello, World!"),
    );
  } catch (
    /**
     * The error that occurred.
     * @type {(Error)}
     */
    e
  ) {
    console.error("Type: ", e.name);
    console.error(e);
  } finally {
    console.timeEnd("Code");
    process.exit();
  }
})();

console.time("Code");
// ------------------------------------------------------------//

// @imports
const pickRandom = require("./pickRandom.js");
const range = require("./range.js");

const UTIL = require("util");
const FS = require("fs");
const OS = require("os");
const BUFFER = require("buffer") || require("node:buffer");
const HTTP = require("http"); // Port: 3421
const YARGS = require("yargs")(process.argv);
const STREAM = require("stream");
const _URL = require("url");
const ZOD = require("zod");
const TRANSLATE = require("translate");
const DOTENV = require("dotenv");
DOTENV.config();
const CRYPTO = require("crypto");
const _JSDOM = require("jsdom");
/* const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});*/

const imports = {
  util: UTIL,
  fs: FS,
  os: OS,
  buffer: BUFFER,
  http: HTTP,
  yargs: require("yargs"),
  stream: STREAM,
  url: _URL,
  zod: ZOD,
  translate: TRANSLATE,
  dotenv: DOTENV,
  crypto: CRYPTO,
  readline: require("readline"),
  jsdom: _JSDOM,
};
// ------------------------------------------------------------//
/**
 * Decode a buffered array.
 * @param {ArrayBuffer} bufferedArray The buffered array to decode.
 * @param {string} encoding The encoding format of the buffered array to decode.
 * @returns {string} The decoded buffered array.
 */
function decode(bufferedArray, encoding = "utf-8") {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(bufferedArray);
}
/**
 * Encode any string into the encoding format `encoding`.
 * @param {string} str The string to encode.
 * @param {Uint8Array | Buffer} mode Either makes the function return a `Uint8Array` or a `Buffer`.
 * @returns {Uint8Array | Buffer} The encoded string in `utf-8` format.
 */
function encode(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}
/**
 * Goes over the keys and values of an array or an object.
 * @param {any[] | object} obj The object to iterate over.
 * @yields {{index: number, value: any} | {key: string, index: number, value: any}} The object in which contains each key, index, and value in `obj`.
 */
function* enumerate(obj) {
  if (Array.isArray(obj)) {
    for (const index in obj) {
      yield {
        index: index,
        value: obj[index],
      };
    }
  } else {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    /**
     * @type {Array<{key: string, index: number, value: any}>}
     */
    const vals = [];
    for (let i = 0; i < keys.length; i++) {
      const x = {
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
          for (const i in keys) {
            yield {
              key: keys[i],
              index: i,
              count: i + 1,
              value: values[i],
            };
          }
        },
      },
    });
  }
}
/**
 * Initialize a new URL object.
 * @param {string} _url The URL.
 * @returns {URL}
 * @example const url = new URL("https://example.com");
 * console.log(url); // URL { url: 'https://example.com' }
 * url.open().then(console.log).catch(console.error); // Opens the URL in a new tab.
 */
class URL {
  /**
   * Initialize a new URL object.
   * @param {string} _url The URL.
   */
  constructor(_url) {
    if (_url.startsWith("http://") || _url.startsWith("https://")) {
      this["url"] = ZOD.string().parse(_url);
    } else {
      this["url"] = ZOD.string().parse(`https://${_url}`);
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
 * @async
 * @template T
 * @type {<T>(readableStream: ReadableStream<T>) => AsyncGenerator<T, void, void>}
 * @param {ReadableStream} readableStream The `ReadableStream` to read.
 * @yields {T} The iterated value of `readableStream`.
 * @returns {T[]} All the iterated values of `readableStream` in an array.
 */
const rsra = async function* readableStreamReadAll(readableStream) {
  /**
   * @type {ReadableStreamDefaultReader<T>}
   */
  const reader = readableStream.getReader();
  /**
   * @type {ReadableStreamDefaultReadResult<T>}
   */
  let readValue = await reader.read();
  /**
   * @type {Array<T>}
   */
  const readValues = [];
  while (readValue.done === false) {
    yield readValue.value;
    readValues.push(readValue);
    readValue = await reader.read();
  }
  reader.releaseLock();
  return readValues;
};
/** @typedef {...number} NumberArray */
/**
 * Find the maximum value in an array.
 * @typedef {number} MaxNumber A maximum value in an array.
 * @param {NumberArray} values The numbers to iterate over.
 * @returns {MaxNumber} The maximum value from `values`.
 */
function max(...values) {
  let maximum = values[0];
  for (const num of values) {
    if (ZOD.number().parse(num) > maximum) maximum = num;
  }
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
  for (const num of values) {
    if (ZOD.number().parse(num) < minimum) minimum = num;
  }
  return minimum;
}
/**
 * Makes a new Person.
 * @param {string} name The name for the person.
 * @param {number} age The age for the person.
 * @param {string[]} hobbies The hobbies for the person.
 * @returns {Person} The `Person`.
 * @example const person = new Person("John", 25, ["hiking", "reading"]);
 * console.log(person); // Person { name: "John", age: 25, hobbies: ["hiking", "reading"] }
 */
class Person {
  name = ZOD.string({
    invalid_type_error: "Must be a string for a name.",
    required_error: "The name is required for the person.",
    description: "This is the name for the person.",
  });
  age = ZOD.number({
    invalid_type_error: "Must be a number for an age.",
    required_error: "The age is required for the person.",
    description: "This is the age for the person.",
  }).or(
    ZOD.bigint({
      invalid_type_error: "Must be a number for an age.",
      required_error: "The age is required for the person.",
      description: "This is the age for the person.",
    }),
  );
  hobbies = ZOD.array(ZOD.string(), {
    invalid_type_error: "Must be an array with all strings for hobbies.",
    required_error: "The hobbies is required for the person.",
    description: "These are the hobbies for the person.",
  }).or(ZOD.object(new Set()));
  constructor(name, age, hobbies) {
    if (age <= 0) {
      throw new Error(
        `The person cannot be${age === -1 ? " a" : ""} ${age} year${
          age === -1 ? "" : "s"
        } old.`,
      );
    }
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
  ZOD.number().or(ZOD.bigint()).parse(n);
  if (n === 1 || n === 1n) return n;
  return n * factorial(n - (typeof n === "bigint" ? 1n : 1));
}
/**
 * Execute a shell command.
 * @param {string} command The shell command to execute.
 * @returns {Promise<{error: ?Error, stdout: string, stderr: string}>} The result of the execution.
 */
const esc = function executeShellCommand(command) {
  const cp = require("child_process");
  return new Promise((r, f) => {
    try {
      cp.exec(command, (err, stdout, stderr) => {
        r({
          error: (() => {
            if (err instanceof Error) return new Error(err.message);
            if (err !== null) return new Error(err);
            return err;
          })(),
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
    for (let i = 0; i < str.length; i++) {
      _binary.push(parseInt(str[i].charCodeAt(0).toString(2)));
    }
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
    for (let i = 0; i < str.length; i++) {
      _hexadecimal[i] = str[i].charCodeAt(0).toString(16);
    }
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
    for (let i = 0; i < str.length; i++) {
      _octal[i] = parseInt(str[i].charCodeAt(0).toString(8));
    }
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
    for (let i = 0; i < str.length; i++) {
      nums[i] = str[i].charCodeAt(0).toString(parseInt(base));
    }
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
      for (const i of this.types) {
        if (typeof value === i) arr.add(true);
        else;
      }
      arr.add(false);
      if (arr.has(true)) {
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
      } else;
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
/**
 * Create a trace message.
 * @param {string} message The message.
 * @returns {Error} The trace message.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 * ```js
 * const trace = Trace("this is a trace message");
 * console.log(trace);
 * ```
 */
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
/**
 * Create an event target.
 * @param {object} options The options.
 * @returns {EventTarget} The event target.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 */
const cet = function createEventTarget(options = {}) {
  const et = new EventTarget();
  if (typeof options === "object" && !Array.isArray(options)) {
    Object.assign(et, options);
  } else if (Array.isArray(options)) {
    throw new TypeError("options for function must be an object, not an array");
  } else if (typeof options !== "object") {
    throw new TypeError(
      `options for function must be an object, not type of ${
        Array.isArray(options) ? "array" : typeof options
      }`,
    );
  }
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
 * @typedef {(string[]|object)} FormatStringArguments
 * @param {FormatStringArguments} args The values to replace the indexes.
 * @typedef {string} FormattedString
 * @returns {FormattedString} The formatted string.
 * @example `console.log("Hello, {0}!".format("World"));` prints `Hello, World!`.
 */
const format = function format(args) {
  if (Array.isArray(args)) {
    const regex = /{(\d+)}/g;
    return this.replace(regex, (_, i) => args[i]);
  } else {
    const regex = /{([^}]+)}/g;
    return this.replace(regex, (_, i) => args[i]);
  }
};
String.prototype.format = format;
/**
 * Messager is an `EventTarget` that allows you to send and receive messages.
 * @template {string} Message The actual message.
 * @type {{message: (str: string) => string}}
 */
const Messager = Object.freeze(
  cet({
    /**
     * Send a message.
     * @param {Message} str The message to send.
     * @returns {Message} The message that was sent.
     * @throws {TypeError} If `str` is not a string.
     */
    message(str) {
      if (typeof str !== "string") {
        console.error(
          new TypeError(
            Messager.dispatchEvent(
              new CustomEvent("error", {
                message: "str is not a string",
                error: new TypeError("str is not a string"),
              }),
            ),
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
function toFile(data, info, name = "") {
  const file =
    name !== "" && typeof name === "string"
      ? new BUFFER.File(Buffer.from(data), name, info)
      : new BUFFER.Blob(Buffer.from(data), info);
  return file;
}
const { EventEmitter } = STREAM;
/**
 * Prettify JSON.
 * @param {?((this: any, key: string, value: any) => any)} replacer The replacer, which is a function that can be used to transform the result.
 * @this {object}
 * @param {?number} spacing The spacing, which is the tab size in spaces.
 * @returns {string} The prettified JSON.
 */
const prettify = function prettify(replacer = null, spacing = 2) {
  return JSON.stringify(this, replacer, spacing);
};
Object.prototype.prettify = prettify;
/**
 * *Mappify* or *Settify* an object.
 * Turns `obj` and everything inside of it into a `Map` or `Set`.
 * @returns {Map<(string | symbol | number), any> | Set<any>} The mappified/settified object.
 * @version 2.1.1
 * @example
 * ```js
 * const obj = {
 *   a: 1,
 *   b: 2,
 *   c: {
 *     d: 3,
 *     e: 4,
 *
 *   },
 *   f: [5, 6],
 * };
 * console.log(obj.mappify()); // Map(4) { 'a' => 1, 'b' => 2, 'c' => Map(2) { 'd' => 3, 'e' => 4 }, 'f' => Set(2) { 5, 6 } }
 * ```
 */
function mappify() {
  if (Array.isArray(this)) {
    for (const [key, value] of Object.entries(this)) {
      if (Array.isArray(value) && !!value) {
        this[key] = mappify.call(value);
      }
      this[key] =
        typeof value === "object" && !Array.isArray(value) && !!value
          ? new Map(Object.entries(value))
          : Array.isArray(value)
            ? new Set(value)
            : value;
    }
    return new Set(this);
  } else {
    return new Map(
      Object.entries(this).map(([key, _value]) => {
        if (typeof _value === "object" && !!_value) {
          return [key, mappify.call(_value)];
        }
        return [
          key,
          typeof _value !== "function" &&
          typeof _value !== "undefined" &&
          _value !== null
            ? new Map(Object.entries(_value))
            : Array.isArray(_value)
              ? new Set(_value)
              : _value,
        ];
      }),
    );
  }
}
Object.prototype.mappify = mappify;
const dn = function doNothing() {
  return this;
};
/**
 * The object that contains methods for encrypting and decrypting data with different algorithms.
 * @type {{pig: (str: string, shift?: number) => string, ab: (str: string) => string, cs: (str: string, shift?: number) => string, rf: (str: string, shift?: number) => string}} The object that contains methods for encrypting and decrypting data with different algorithms.
 * @method pig Pigpens a string.
 * @method ab Atbash cipher.
 * @method cs Caesar cipher.
 * @method  rf Rail Fence cipher.
 * @version 1.0.0
 */
const cipher = {
  pig: function pigpen(str, shift = 1) {
    return str
      .split("")
      .map((char) => String.fromCharCode(char.charCodeAt(0) + shift))
      .join("")
      .trim()
      .valueOf();
  },
  ab: function atbash(str) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".valueOf();
    return str
      .toLowerCase()
      .split("")
      .map((char) => {
        const index =
          alphabet.indexOf(char) === undefined ? -1 : alphabet.indexOf(char);
        if (index === -1) return char;
        return alphabet[alphabet.length - index - 1];
      })
      .join("")
      .trim()
      .valueOf();
  },
  cs: function caesar(str, shift = 1) {
    // Unlike pigpen, caesar does not use symbols.
    return str
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        } else {
          return char;
        }
      })
      .join("")
      .trim()
      .valueOf();
  },
  rf: function railfence(str, shift = 1) {
    return str
      .split("")
      .map((char, index) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        } else {
          return char;
        }
      })
      .join("")
      .trim()
      .valueOf();
  },
};
/**
 * The `Integer` function.
 * @param {number} num The number to be converted to an `Integer`.
 * @typedef {number|object} Integer
 * @returns {Integer}
 * @version 1.0.0
 */
function Integer(num) {
  num = Number(num);
  if (new.target) {
    Object.setPrototypeOf(this, Number.prototype);
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Integer): ${Math.floor(num)}]${
        main.colors.Reset
      }`;
    return Number(Math.floor(num));
  } else {
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Integer): ${Math.floor(num)}]${
        main.colors.Reset
      }`;
    return Number(Math.floor(num));
  }
}
/**
 * The `Float` function.
 * @param {number} num The number to be converted to an `Float`.
 * @typedef {number|object} Float
 * @returns {Float}
 * @version 1.0.0
 */
function Float(num) {
  num = Number(num);
  if (new.target) {
    Object.setPrototypeOf(this, Number.prototype);
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Float): ${num.toFixed(9)}]${main.colors.Reset}`;
    return Number(Number(num).toFixed(9));
  } else {
    num = num.toFixed(9);
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Float): ${num}]${main.colors.Reset}`;
    return Number(num);
  }
}
/**
 * The `Double` function.
 * @param {number} num The number to be converted to an `Double`.
 * @typedef {number|object} Double
 * @returns {Double}
 * @version 1.0.0
 */
function Double(num) {
  num = Number(num);
  if (new.target) {
    Object.setPrototypeOf(this, Number.prototype);
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Double): ${num.toFixed(15)}]${main.colors.Reset}`;
    return Number(Number(num).toFixed(15));
  } else {
    num = num.toFixed(15);
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Double): ${num}]${main.colors.Reset}`;
    return Number(num);
  }
}
/**
 * The `getCustomInspect` function.
 * @returns {symbol} The symbol for custom inspect (`Symbol.for("nodejs.util.inspect.custom")`).
 * @version 1.0.0
 */
const gci = function getCustomInspect() {
  return Symbol.for("nodejs.util.inspect.custom");
};
/**
 * The `_Session` object.
 * @returns {object} The `_Session` object.
 * @version 1.0.0
 */
function _Session() {
  const obj = {};
  const closed = [false];
  const open = [true];
  let i = 0;
  /**
   * Checks if the `_Session` is **closed**.
   * @returns {Promise<boolean>}
   */
  obj.closed = () => new Promise((r) => (closed[i] ? r(true) : undefined));
  /**
   * Checks if the `_Session` is **opened**.
   * @returns {Promise<boolean>}
   */
  obj.opened = () => new Promise((r) => (open[i] ? r(true) : undefined));
  /**
   * Get the `_Session` info.
   * @returns {{object: {opened: Promise<boolean>, closed: Promise<boolean>}, map: Map<string, Promise<boolean>>}}
   */
  obj.getInfo = () => ({
    object: { opened: obj.opened(), closed: obj.closed() },
    map: new Map(
      Object.entries({ opened: obj.opened(), closed: obj.closed() }),
    ),
  });
  const et = new EventTarget();
  /**
   * Closes the `_Session`.
   * @returns {boolean} Shows if the function is successful.
   */
  obj.close = () => {
    i = i + 1;
    open[i] = false;
    closed[i] = true;
    const event = new Event("close");
    event.data = {
      ...obj.getInfo().object,
      id: i,
      eventtarget: {
        addEventListener: (name, callback) =>
          et.addEventListener(name, callback),
        removeEventListener: (name, callback) =>
          et.removeEventListener(name, callback),
        dispatchEvent: () => {
          throw new Error(
            'Cannot use `dispatchEvent` in a `Session`, use `_Session.object.on()` or `_Session.map.get("on")()` instead.',
          );
        },
      },
    };
    et.dispatchEvent(event);
    return true;
  };
  /**
   * Opens the `_Session`.
   * @returns {boolean} Shows if the function is successful.
   */
  obj.open = () => {
    i = i + 1;
    open[i] = true;
    closed[i] = false;
    const event = new Event("open");
    event.data = {
      ...obj.getInfo().object,
      id: i,
      eventtarget: {
        addEventListener: (name, callback) =>
          et.addEventListener(name, callback),
        removeEventListener: (name, callback) =>
          et.removeEventListener(name, callback),
        dispatchEvent: () => {
          throw new Error(
            'Cannot use `dispatchEvent` in a `Session`, use `_Session.object.on()` or `_Session.map.get("on")()` instead.',
          );
        },
      },
    };
    et.dispatchEvent(event);
    return true;
  };
  /**
   * Adds an event listener.
   * @param {string} name The name of the event.
   * @param {function} callback The callback function.
   * @returns {void}
   */
  obj.on = (name, callback) => et.addEventListener(name, callback);
  /**
   * Removes an event listener.
   * @param {string} name The name of the event.
   * @param {function} callback The callback function.
   * @returns {void}
   */
  obj.off = (name, callback) => et.removeEventListener(name, callback);
  /**
   * Adds an event listener once.
   * @param {string} name The name of the event.
   * @param {function} callback The callback function.
   * @returns {void}
   */
  obj.once = (name, callback) => {
    function handler(event) {
      callback(event);
      et.removeEventListener(name, handler);
    }
    et.addEventListener(name, handler);
  };
  if (new.target) {
    Object.assign(this, { object: obj, map: new Map(Object.entries(obj)) });
    Object.freeze(this);
  } else {
    return { object: obj, map: new Map(Object.entries(obj)) };
  }
}
function Octal(num) {
  num = Number(num);
  if (new.target) {
    Object.setPrototypeOf(this, Number.prototype);
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Octal): ${parseInt(num, 10).toString(8)}]${main.colors.Reset}`;
    return parseInt(num, 10).toString(8);
  } else {
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Octal): ${parseInt(num, 10).toString(8)}]${main.colors.Reset}`;
    return parseInt(num, 10).toString(8);
  }
}
function Hex(num) {
  num = Number(num);
  if (new.target) {
    Object.setPrototypeOf(this, Number.prototype);
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Hex): ${parseInt(num, 10).toString(16)}]${main.colors.Reset}`;
    return parseInt(num, 10).toString(16);
  } else {
    this[Symbol.for("nodejs.util.inspect.custom")] = () =>
      `${main.colors.yellow}[Number (Hex): ${parseInt(num, 10).toString(16)}]${main.colors.Reset}`;
    return parseInt(num, 10).toString(16);
  }
}
const engroup = function engroup(label, code, ...args) {
  const returnValue = [];
  console.group(label);
  returnValue[0] = code(...args);
  console.groupEnd(label);
  return returnValue[0];
};
console.engroup = engroup.bind(console);
/**
 * The `AsyncFunction` object.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
 */
const _AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const _GeneratorFunction = Object.getPrototypeOf(function* () {}).constructor;
const _AsyncGeneratorFunction = Object.getPrototypeOf(
  async function* () {},
).constructor;
const Interface = class {
  constructor(actuallyConstructable = false) {
    if (!actuallyConstructable) {
      throw new TypeError(
        `This expression is not constructable.\n\rType '${this.constructor.name}' has no construct signatures.`,
      );
    }
  }
};
/**
 * A shortcut for creating a `ReadableStream`.
 * @param {(controller: ReadableStreamDefaultController) => void} start The `start` function where the `controller` enqueues... stuff.
 * @param {{pull: (controller: ReadableStreamDefaultController) => void, cancel: (reason: any) => void, autoAllocateChunkSize: number, type: string}} extraUnderlyingSourceOptions The extra underlying source options to also pass to the `ReadableStream`.
 * @param {{highWaterMark: number, size: (chunk: any) => number}} streamStrategy The stream strategy to use.
 * @returns {ReadableStream}
 */
const crs = function createReadableStream(
  start,
  extraUnderlyingSourceOptions = {},
  streamStrategy = {},
) {
  if (start in extraUnderlyingSourceOptions) {
    throw new TypeError(
      "`start` cannot be a key in `extraUnderlyingSourceOptions`: it is already defined in the first argument.",
    );
  }
  return new ReadableStream(
    { start, ...extraUnderlyingSourceOptions },
    streamStrategy,
  );
};
/**
 * A shortcut for creating a `WritableStream`.
 * @param {(chunk: any, controller: WritableStreamDefaultController) => void} write The `write` function where the `controller` writes... stuff.
 * @param {(controller: WritableStreamDefaultController) => void} start The `start` function that starts immediately once the `WritableStream` is created.
 * @param {{close: (controller: WritableStreamDefaultController) => void, abort: (reason: any) => void}?} extraUnderlyingSinkOptions The extra underlying sink options to also pass to the `WritableStream`.
 * @param {{highWaterMark: number, size: (chunk: any) => number}?} streamStrategy The stream strategy to use.
 * @returns {WritableStream}
 */
const cws = function createWritableStream(
  write,
  start,
  extraUnderlyingSinkOptions = {},
  streamStrategy = {},
) {
  if (
    start in extraUnderlyingSinkOptions ||
    write in extraUnderlyingSinkOptions
  ) {
    throw new TypeError(
      "`start` and `write` cannot be keys in `extraUnderlyingSinkOptions`: they are already defined in the first two argument.",
    );
  }
  return new WritableStream(
    { start, write, ...extraUnderlyingSinkOptions },
    streamStrategy,
  );
};
/**
 * A shortcut for creating a `TransformStream`.
 * @param {(chunk: any, controller: TransformStreamDefaultController) => void} transform The `transform` function that is called every time the `WritableStream` part of the `TransformStream` is written to.
 * @param {(controller: TransformStreamDefaultController) => void} start The `start` function that starts immediately once the `TransformStream` is created.
 * @param {{flush: (controller: TransformStreamDefaultController) => void}?} extraTransformerOptions The extra transformer options to also pass to the `TransformStream`.
 * @param {{highWaterMark: number, size: (chunk: any) => number}?} writableStrategy The strategy for the `WritableStream` side to use.
 * @param {{highWaterMark: number, size: (chunk: any) => number}?} readableStrategy The strategy for the `ReadableStream` side to use.
 */
const cts = function createTransformStream(
  transform,
  start,
  extraTransformerOptions = {},
  writableStrategy = {},
  readableStrategy = {},
) {
  if (
    start in extraTransformerOptions ||
    transform in extraTransformerOptions
  ) {
    throw new TypeError(
      "`start` and `transform` cannot be keys in `extraUnderlyingSinkOptions`: they are already defined in the first two argument.",
    );
  }
  return new TransformStream(
    { start, transform, ...extraTransformerOptions },
    writableStrategy,
    readableStrategy,
  );
};
/**
 * Converts the argument passed in into an array of arrays, or entries.
 * @version 2.0.1
 * @param {object | any} thing The value to convert to an array of arrays.
 * @returns {Array<[any, any]>} The array of arrays or entries from `thing`.
 */
function Entries(thing) {
  thing = thing || {};
  let returnValue;
  if ("entries" in thing) {
    const arr = [];
    for (const i of thing.entries()) {
      arr.push(i);
    }
    returnValue = arr;
  } else if (Array.isArray(thing)) {
    for (const i of thing) {
      if (!Array.isArray(i)) {
        throw new Error("`Entries` only works with arrays of arrays.");
      }
    }
    returnValue = thing;
  } else if ("next" in thing) {
    const arr = [];
    while (true) {
      const val = thing.next();
      if (val.done) break;
      arr.push(val.value);
    }
    returnValue = arr;
  } else {
    returnValue = Object.entries(thing);
  }
  function toObject() {
    return Object.fromEntries(Array.from(returnValue));
  }
  Object.defineProperties(returnValue, {
    name: {
      value: "Entries",
    },
    constructor: {
      value: Entries,
    },
  });
  const _prototype = Array.prototype;
  _prototype.toObj = toObject;
  Object.setPrototypeOf(returnValue, _prototype);
  return returnValue;
}
/**
 * Converts a string to an array buffer.
 * @param {string} str The string to convert into an `ArrayBuffer`.
 * @returns {ArrayBuffer} The corresponding `ArrayBuffer` of the string `str`.
 */
const toab = function toArrayBuffer(str) {
  if (typeof str !== "string") {
    throw new TypeError(
      `The first argument must be a string, but it is a type of ${Array.isArray(str) ? "array" : typeof str} and its value is \`${str}\`.`,
    );
  }
  let arrayType;
  let maxCharCode = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str[i].codePointAt(0);
    maxCharCode = Math.max(maxCharCode, charCode);
  }
  if (maxCharCode <= 255) {
    arrayType = Uint8Array;
  } else if (maxCharCode > 255 && maxCharCode <= 65535) {
    arrayType = Uint16Array;
  } else {
    arrayType = Uint32Array;
  }
  const buffer = new arrayType(str.length);
  for (let i = 0; i < str.length; i++) {
    const charCode = str[i].codePointAt(0);
    buffer[i] = charCode;
  }
  return new DataView(buffer.buffer).buffer;
};
/**
 * Creates a `Warning` object.
 *
 * Meant for functions `console.warn` and `console.error`.
 * @version 1.0.0
 * @param {string} message The message to display.
 * @param {{cause: Error | void, errors: any[] | void} = {}} options The options for the `Warning`.
 */
function Warning(message, options = { cause: null, errors: null }) {
  options.cause = options.cause || {};
  options.errors = options.errors || [];
  const warning = [];
  if (options.errors[0])
    warning[0] = new AggregateError(options.errors, message, options);
  else warning[0] = new Error(message, options);
  Object.defineProperties(warning[0], {
    name: {
      value: "Warning",
      writable: true,
    },
  });
  return warning[0];
}
const ng = function* numberGenerator(minimum = 0, maximum = 1) {
  if (typeof minimum !== "number" || typeof maximum !== "number")
    throw new TypeError("Both `minimum` and `maximum` must be numbers.", {
      cause: (() => {
        const returnValue = Object(
          minimum !== "number" || maximum !== "number",
        );
        returnValue.minimum = minimum;
        returnValue.maximum = maximum;
        return returnValue;
      })(),
    });
  if (minimum > maximum)
    throw new RangeError("`minimum` must be less than or equal to `maximum`.", {
      cause: (() => {
        const returnValue = Object(minimum > maximum);
        returnValue.minimum = minimum;
        returnValue.maximum = maximum;
        return returnValue;
      })(),
    });
  do {
    const range = maximum - minimum;
    const num = Math.random() * range + minimum;
    yield num;
  } while (
    typeof minimum === "number" &&
    typeof maximum === "number" &&
    minimum < maximum
  );
};

// @functions
const customs = {
  encode,
  decode,
  enumerate,
  LineReader,
  URL,
  rsra,
  max,
  min,
  Person,
  factorial,
  esc,
  convertTo,
  Union,
  Trace,
  cet,
  perimeter,
  format,
  Messager,
  translate,
  toFile,
  prettify,
  mappify,
  dn,
  cipher,
  Integer,
  Float,
  Double,
  gci,
  _Session,
  Octal,
  Hex,
  engroup,
  AsyncFunction: _AsyncFunction,
  GeneratorFunction: _GeneratorFunction,
  AsyncGeneratorFunction: _AsyncGeneratorFunction,
  Function,
  Interface,
  crs,
  cws,
  cts,
  Entries,
  toab,
  Warning,
  numberGenerator: ng,
};
// ----------------------------------------------------------//
/**
 * The object that contrains the main info for the program.
 * @type {({arguments: {argv: () =.>string[], length: () => number, [Symbol.for("input.txt")]: Promise<string[]>}, env: () => NodeJS.ProcessEnv, file:  () => string, interpreter: () => string, [Symbol.for("nodejs.util.inspect.custom")]: () => string, [Symbol.for("map")]: () => Map<string, string>, colors: { red: string green: string yellow: string blue: string magenta: string cyan: string white: string black: string reset: string bold: string underline: string blink: string reverse: string hidden: string Blue: string Reset: string Black: string Red: string Green: string Yellow: string Magenta: string Cyan: string White: string Gray: string "Bright Red": string "Bright Green": string "Bright Yellow": string "Bright Magenta": string "Bright Cyan": string "Bright White": string "Bright Black": string "Bright Blue": string "Bright Cyan": string "Bright Magenta": string "Bright White": string "Bright Yellow": string "Bright Gray": string "Dark Gray": string, [Symbol.for("nodejs.util.inspect.custom")]: () => string}})}
 * @property {{argv: () => string[],() => length: number, "input.txt": string[], env: NodeJS.ProcessEnv, file: string, interpreter: string}} arguments The arguments of the program.
 * @property {() => NodeJS.ProcessEnv} env The environment of the program.
 * @property {() => string} file The name of the file.
 * @property {() => string} interpreter The name of the interpreter.
 * @property {() => Map<string, string>} [Symbol.for("map")] The map of the program.
 * @property {{ red: string green: string yellow: string blue: string magenta: string cyan: string white: string black: string reset: string bold: string underline: string blink: string reverse: string hidden: string Blue: string Reset: string Black: string Red: string Green: string Yellow: string Magenta: string Cyan: string White: string Gray: string "Bright Red": string "Bright Green": string "Bright Yellow": string "Bright Magenta": string "Bright Cyan": string "Bright White": string "Bright Black": string "Bright Blue": string "Bright Cyan": string "Bright Magenta": string "Bright White": string "Bright Yellow": string "Bright Gray": string "Dark Gray": string}} colors The colors of the program.
 * @version 1.2.0
 */
const main = {
  /**
   * @property {string[]} argv The arguments of the program.
   * @property {number} length The length of the arguments.
   * @property {Promise<string[]>} "input.txt" The content of the file.
   */
  arguments: {
    entire: () => process.argv,
    argv: () => process.argv.slice(2),
    length: () => process.argv.length,
    [Symbol.for("input.txt")]: FS.promises.readFile(
      "./input.txt",
      "utf8",
      /**
       * @param {NodeJS.ErrnoException} err
       * @param {string} data
       * @returns {string[]}
       */
      (err, data) => {
        if (err) throw err;
        return data.toString().trim().valueOf();
      },
    ),
  },
  env: () => process.env,
  file: () => process.argv[1],
  interpreter: () => process.argv[0],
  [Symbol.toStringTag]: "Main",
  [Symbol.for("nodejs.util.inspect.custom")]: async () => {
    return `${main.colors.Cyan}${main[Symbol.toStringTag]} { arguments: { argv: [ ${main.arguments.argv().join(", ")} ], length: ${main.arguments.length()}, "input.txt": [ ${await main.arguments[Symbol.for("input.txt")]} ] }, env: ${main.env()}, file: ${main.file()}, interpreter: ${main.interpreter()} }${main.colors.reset}`;
  },
  [Symbol.for("map")]: () => {
    const val = mappify.call(this);
    val[Symbol.for("nodejs.util.inspect.custom")] = () => {
      return `${main.colors.bold}Map ${JSON.stringify(main, null, 2).replace(
        /\:/g,
        ": ",
      )}${main.colors.reset}`;
    };
    return val;
  },
  /**
   * @see https://github.com/SuperIden3/NodeJS-Playground/blob/main/Color%20Codes%20(NodeJS).md
   */
  colors: {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    black: "\x1b[30m",
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    italic: "\x1b[3m",
    underline: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
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
    [Symbol.for("nodejs.util.inspect.custom")]: () => {
      return `${this} ${prettify.call(this).replace(/\:/g, ": ")}${this.reset}`;
    },
  },
};

/**
 * Main function for code.
 * @typedef {...any} Arguments Arguments of a function.
 * @typedef {Promise<any>} IIAFE A return type for Immediately Invoked Async Function Expressions.
 * @param {Arguments} args The arguments for the function.
 * @returns {IIAFE}
 */
async function Main() {
  "use strict";
  Object.setPrototypeOf(main, Object.prototype);
  Object.defineProperties(process, {
    arguments: {
      value: main.arguments,
      writable: false,
      enumerable: false,
      configurable: false,
    },
    file: {
      value: main.file,
      writable: false,
      enumerable: false,
      configurable: false,
    },
    interpreter: {
      value: main.interpreter,
      writable: false,
      enumerable: false,
      configurable: false,
    },
  });
  Object.assign(module.exports, {
    main: main,
    all: globalThis,
    imports,
    customs,
  });
  try {
    // @main
    const mystream = new STREAM.Transform({
      transform(chunk, encoding, callback) {
        const ch = Number(chunk);
        this.push(
          JSON.stringify({
            input: ch,
            output: ch + ch * 3.14159265358979232653505,
            condition: `${ch} + (${ch} ${String.fromCharCode(215)} 3.14159265358979232653505)`,
          }),
        );
        callback();
      },
    });
    mystream.on("data", (data) => {
      console.log("Read Data:", new Map(Entries(JSON.parse(data.toString()))));
    });
    for (let i = -5; i <= 5; i = i + 0.5) mystream.write(String(i));
    mystream.end();
  } catch (
    /**
     * The error that occurred.
     * @type {(Error|Object)}
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
     * @extends {Error}
     */
    e
  ) {
    console.error(new Error("Seems like an error occurred.", { cause: e }));
    console.error(
      new Event("error", {
        error: e,
        type: "error",
        message: e.message,
        stack: e.stack,
        name: e.name,
      }),
    );
    process.kill(process.pid, "SIGINT");
  }
}
Main().finally(() => {
  console.timeEnd("Code");
});

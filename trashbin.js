/**
 * Formats an object into a `String`.
 * @param {object} obj The object to be formatted.
 * @returns {string} The formatted string.
 * @version 1.0.0
 */
function format(obj) {
  const arr = ["{ "];
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && !!value && !Array.isArray(value)) {
      if (key.includes(/\s/g.)) {
        arr.push(`"${key}": ${format(value)}`);
      } else {
        arr.push(`${key}: ${format(value)}`);
      }
    } else {
      if (Array.isArray(value)) {
        if (value.every((v) => typeof v === "object" && !Array.isArray(v))) {
          arr.push(`${key}: ${format(value)}`);
        } else {
          arr.push(`${key}: ${value}`);
        }
      } else {
        arr.push(`${key}: ${value}`);
      }
    }
  }
  arr.push(" }");
  return arr.join(", ").replace("{ ,", "{").replace(",  }", " }");
};

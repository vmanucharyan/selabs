function* range(min, max, step) {
  "use strict";
  for (let i = min; i < max; i += step) {
    yield i;
  }
}

module.exports = {
  range: range
};

module.exports.simpson = function(f, a, b, n) {
  var sum = 0;
  var h = (b - a) / n;
  var x = a + h;

  while (x < b) {
    sum += 4 * f(x);
    x += h;
    sum += 2 * f(x);
    x += h;
  }
  sum = (h / 3) * (sum + f(a) - f(b));
  return sum;
}

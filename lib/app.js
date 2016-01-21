const d3            = require('d3');
const functionPlot  = require('function-plot');
const normalDist    = require('gaussian');
const integral      = require('./lib/integral');
const xi2           = require('./lib/xi2table');
const _             = require('./lib/helpers.js');

function gauss(x) {
  "use strict";
  return (Math.exp(-Math.pow(x, 2)) * 0.5) / Math.sqrt(2 * Math.PI)
}

function gaussPoints(r) {
  "use strict";
  return [..._.range(r.min, r.max, r.step)].map((x) => [x, gauss(x)]);
}

function pointsToGist(points) {
  'use strict';
  var res = [];
  for (let i = 0; i < points.length; i++) {
    let x = points[i][0];
    let y = points[i][1];
    res.push([x - GI * 0.5, 0]);
    res.push([x - GI * 0.5, y]);
    res.push([x + GI * 0.5, y]);
    res.push([x + GI * 0.5, 0]);
  }
  return res;
}

var A = 0.5;
var N = 100;

var RNG_MEAN = 0;
var RNG_VARIANCE = 0.008;

var GI = 1;

$('#btn-calculate').click(function() {
  N = Number($('#num-points').val());
  A = Number($('#alpha').val());
  RNG_MEAN = Number($('#rng-mean').val());
  RNG_VARIANCE = Number($('#rng-var').val());
  calculate();
});

function calculate() {
  console.log('calculate');

  var func = x => (Math.sqrt(x));

  var dist = normalDist(RNG_MEAN, RNG_VARIANCE);
  var rng = () => dist.ppf(Math.random());

  console.log($('#num-points').val());

  var randomVals = [... _.range(0, 1, 1 / N)].map(x => [x, rng()]);
  var randomPoints = randomVals.map(v => [v[0], func(v[0]) + v[1]]);

  console.log(randomVals);
  console.log(randomPoints);

  var integralFunc = x => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-Math.pow(x, 2) / 2);
  var integralPoints =
    [... _.range(-5, 5, GI)].map(x => [x + GI * 0.5, integral.simpson(integralFunc, x, x + GI, N) * N])

  console.log(integralPoints);

  var integralPoints2 = integralPoints
    .map(x => { return { start: x[0] - GI * 0.5, end: x[0] + GI * 0.5 } })
    .map(range => [range.end - range.start * 0.5, randomVals.filter(p => p[0] >= range.start && p[0] <= range.end).length])

  functionPlot({
    target: '#plot',
    xDomain: [0.01, 1],
    yDomain: [-1, 1.5],
    data: [
      {
        graphType: 'polyline',
        fn: function(scope) {
          var x = scope.x;
          return func(x);
        }
      },
      {
        fnType: 'points',
        graphType: 'scatter',
        points: randomPoints
      }
    ]
  });

  functionPlot({
    target: '#plot2',
    xDomain: [-5, 5],
    yDomain: [-1, 40],
    data: [
      {
        fnType: 'points',
        graphType: 'polyline',
        closed: true,
        points: pointsToGist(integralPoints)
      },
      {
        fnType: 'points',
        graphType: 'polyline',
        closed: true,
        points: pointsToGist(integralPoints2)
      }
    ]
  })
}

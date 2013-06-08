(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
var Application, Drone, Visualizer;

Drone = require('drone');

Visualizer = require('visualizer');

module.exports = Application = (function() {
  function Application() {
    var AudioContext, context;

    AudioContext = window.webkitAudioContext || window.AudioContext;
    if (!AudioContext) {
      throw 'WebAudio support required';
    }
    context = new AudioContext;
    this.drone = new Drone(context);
    this.visualizer = new Visualizer('html');
    this.initialize();
  }

  Application.prototype.initialize = function() {
    this.visualizer.render();
    return this.drone.play();
  };

  return Application;

})();

window.app = new Application;


});window.require.register("drone", function(exports, require, module) {
var Drone,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Drone = (function() {
  var floor, pow, random;

  random = Math.random, floor = Math.floor, pow = Math.pow;

  Drone.prototype.scale = [0, 2, 4, 6, 7, 9, 11, 12, 14];

  function Drone(context) {
    this.context = context;
    this.onAudioProcess = __bind(this.onAudioProcess, this);
    this.randomizePan = __bind(this.randomizePan, this);
    if (!this.context) {
      throw 'AudioContext required';
    }
    this.noiseNodes = [];
    this.createOutput();
  }

  Drone.prototype.play = function() {
    this.stop();
    this.generate();
    return true;
  };

  Drone.prototype.stop = function() {
    while (this.noiseNodes.length) {
      this.noiseNodes.pop().disconnect();
    }
    return true;
  };

  Drone.prototype.destroy = function() {
    this.stop();
    return this.output.disconnect(this.context.destination);
  };

  Drone.prototype.createOutput = function() {
    this.output = this.context.createGainNode();
    this.output.gain.value = 20.0;
    return this.output.connect(this.context.destination);
  };

  Drone.prototype.generate = function() {
    var i, _i, _ref, _results;

    this.toneCount || (this.toneCount = _.random(1, 40));
    this.baseNote || (this.baseNote = _.random(40, 70));
    _results = [];
    for (i = _i = 0, _ref = this.toneCount; _i <= _ref; i = _i += 1) {
      _results.push(this.createTone(this.randomFreq()));
    }
    return _results;
  };

  Drone.prototype.randomFreq = function() {
    var freq, note, rand;

    note = this.randomNote();
    freq = this.midiToFreq(note);
    rand = (random() * 4) - 2;
    return freq += rand;
  };

  Drone.prototype.randomNote = function() {
    var degree, idx;

    idx = floor(random() * this.scale.length);
    degree = this.scale[idx];
    return this.baseNote + degree;
  };

  Drone.prototype.randomCoords = function() {
    var i, max, min, _i, _ref, _results;

    _ref = [-20, 20], min = _ref[0], max = _ref[1];
    _results = [];
    for (i = _i = 0; _i <= 2; i = ++_i) {
      _results.push(_.random(min, max));
    }
    return _results;
  };

  Drone.prototype.midiToFreq = function(number) {
    var exponent;

    exponent = (number - 69) / 12;
    return pow(2, exponent) * 440;
  };

  Drone.prototype.createTone = function(freq) {
    var filter, noiseGen, panner;

    panner = this.createPanner();
    panner.connect(this.output);
    filter = this.createFilter(freq);
    filter.connect(panner);
    noiseGen = this.createNoiseGen();
    return noiseGen.connect(filter);
  };

  Drone.prototype.createPanner = function() {
    var movePan, panner, x, y, z, _ref,
      _this = this;

    panner = this.context.createPanner();
    _ref = this.randomCoords(), x = _ref[0], y = _ref[1], z = _ref[2];
    panner.setPosition(x, y, z);
    movePan = function() {
      return _this.randomizePan(panner, [x, y, z]);
    };
    setInterval(movePan, 500);
    return panner;
  };

  Drone.prototype.randomizePan = function(panner, coords) {
    var x, y, z;

    x = coords[0], y = coords[1], z = coords[2];
    x = x + _.random(-0.1, 0.1);
    y = y + _.random(-0.1, 0.1);
    z = z + _.random(-0.1, 0.1);
    return panner.setPosition(x, y, z);
  };

  Drone.prototype.createFilter = function(freq) {
    var filter;

    filter = this.context.createBiquadFilter();
    filter.type = filter.BANDPASS;
    filter.frequency.value = freq;
    filter.Q.value = 150;
    return filter;
  };

  Drone.prototype.createNoiseGen = function() {
    var bufferSize, noiseGen;

    bufferSize = 256;
    noiseGen = this.context.createJavaScriptNode(bufferSize, 0, 1);
    this.noiseNodes.push(noiseGen);
    noiseGen.onaudioprocess = this.onAudioProcess;
    return noiseGen;
  };

  Drone.prototype.onAudioProcess = function(e) {
    var buffer, bufferSize, i, out, _i, _results;

    buffer = e.outputBuffer;
    out = buffer.getChannelData(0);
    bufferSize = buffer.length;
    _results = [];
    for (i = _i = 0; _i < bufferSize; i = _i += 1) {
      _results.push(out[i] = (random() * 2) - 1);
    }
    return _results;
  };

  return Drone;

})();


});window.require.register("visualizer", function(exports, require, module) {
var Visualizer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Visualizer = (function() {
  var floor, random;

  random = Math.random, floor = Math.floor;

  function Visualizer(element) {
    this.randomColor = __bind(this.randomColor, this);    if (!element) {
      throw 'Visualizer requires an element';
    }
    this.element = $(element);
  }

  Visualizer.prototype.render = function() {
    var values;

    values = (_.times(2, this.randomColor)).join(',');
    return this.element.css({
      background: "-webkit-radial-gradient(" + values + ")"
    });
  };

  Visualizer.prototype.randomColor = function() {
    var num, rgb;

    rgb = ((function() {
      var _i, _results;

      _results = [];
      for (num = _i = 0; _i <= 2; num = ++_i) {
        _results.push(this.randomNumber());
      }
      return _results;
    }).call(this)).join(',');
    return "rgb(" + rgb + ")";
  };

  Visualizer.prototype.randomNumber = function() {
    return floor(random() * 255);
  };

  return Visualizer;

})();


});
//@ sourceMappingURL=app.js.map
(function(){"use strict";var t="undefined"!=typeof window?window:global;if("function"!=typeof t.require){var r={},e={},n=function(t,r){return{}.hasOwnProperty.call(t,r)},o=function(t,r){var e,n,o=[];e=/^\.\.?(\/|$)/.test(r)?[t,r].join("/").split("/"):r.split("/");for(var i=0,u=e.length;u>i;i++)n=e[i],".."===n?o.pop():"."!==n&&""!==n&&o.push(n);return o.join("/")},i=function(t){return t.split("/").slice(0,-1).join("/")},u=function(r){return function(e){var n=i(r),u=o(n,e);return t.require(u)}},s=function(t,r){var n={id:t,exports:{}};r(n.exports,u(t),n);var o=e[t]=n.exports;return o},a=function(t){var i=o(t,".");if(n(e,i))return e[i];if(n(r,i))return s(i,r[i]);var u=o(i,"./index");if(n(e,u))return e[u];if(n(r,u))return s(u,r[u]);throw Error('Cannot find module "'+t+'"')},c=function(t,e){if("object"==typeof t)for(var o in t)n(t,o)&&(r[o]=t[o]);else r[t]=e};t.require=a,t.require.define=c,t.require.register=c,t.require.brunch=!0}})(),window.require.register("application",function(t,r,e){var n,o,i;o=r("drone"),i=r("visualizer"),e.exports=n=function(){function t(){var t,r;if(t=window.webkitAudioContext||window.AudioContext,!t)throw"WebAudio support required";r=new t,this.drone=new o(r),this.visualizer=new i("html"),this.initialize()}return t.prototype.initialize=function(){return this.visualizer.render(),this.drone.play()},t}(),window.app=new n}),window.require.register("drone",function(t,r,e){var n,o=function(t,r){return function(){return t.apply(r,arguments)}};e.exports=n=function(){function t(t){if(this.context=t,this.onAudioProcess=o(this.onAudioProcess,this),this.randomizePan=o(this.randomizePan,this),!this.context)throw"AudioContext required";this.noiseNodes=[],this.createOutput()}var r,e,n;return n=Math.random,r=Math.floor,e=Math.pow,t.prototype.scale=[0,2,4,6,7,9,11,12,14],t.prototype.play=function(){return this.stop(),this.generate(),!0},t.prototype.stop=function(){for(;this.noiseNodes.length;)this.noiseNodes.pop().disconnect();return!0},t.prototype.destroy=function(){return this.stop(),this.output.disconnect(this.context.destination)},t.prototype.createOutput=function(){return this.output=this.context.createGainNode(),this.output.gain.value=20,this.output.connect(this.context.destination)},t.prototype.generate=function(){var t,r,e,n;for(this.toneCount||(this.toneCount=_.random(1,40)),this.baseNote||(this.baseNote=_.random(40,70)),n=[],t=r=0,e=this.toneCount;e>=r;t=r+=1)n.push(this.createTone(this.randomFreq()));return n},t.prototype.randomFreq=function(){var t,r,e;return r=this.randomNote(),t=this.midiToFreq(r),e=4*n()-2,t+=e},t.prototype.randomNote=function(){var t,e;return e=r(n()*this.scale.length),t=this.scale[e],this.baseNote+t},t.prototype.randomCoords=function(){var t,r,e,n,o,i;for(o=[-20,20],e=o[0],r=o[1],i=[],t=n=0;2>=n;t=++n)i.push(_.random(e,r));return i},t.prototype.midiToFreq=function(t){var r;return r=(t-69)/12,440*e(2,r)},t.prototype.createTone=function(t){var r,e,n;return n=this.createPanner(),n.connect(this.output),r=this.createFilter(t),r.connect(n),e=this.createNoiseGen(),e.connect(r)},t.prototype.createPanner=function(){var t,r,e,n,o,i,u=this;return r=this.context.createPanner(),i=this.randomCoords(),e=i[0],n=i[1],o=i[2],r.setPosition(e,n,o),t=function(){return u.randomizePan(r,[e,n,o])},setInterval(t,500),r},t.prototype.randomizePan=function(t,r){var e,n,o;return e=r[0],n=r[1],o=r[2],e+=_.random(-.1,.1),n+=_.random(-.1,.1),o+=_.random(-.1,.1),t.setPosition(e,n,o)},t.prototype.createFilter=function(t){var r;return r=this.context.createBiquadFilter(),r.type=r.BANDPASS,r.frequency.value=t,r.Q.value=150,r},t.prototype.createNoiseGen=function(){var t,r;return t=256,r=this.context.createJavaScriptNode(t,1,1),this.noiseNodes.push(r),r.onaudioprocess=this.onAudioProcess,r},t.prototype.onAudioProcess=function(t){var r,e,o,i,u,s;for(r=t.outputBuffer,i=r.getChannelData(0),e=r.length,s=[],o=u=0;e>u;o=u+=1)s.push(i[o]=2*n()-1);return s},t}()}),window.require.register("visualizer",function(t,r,e){var n,o=function(t,r){return function(){return t.apply(r,arguments)}};e.exports=n=function(){function t(t){if(this.randomColor=o(this.randomColor,this),!t)throw"Visualizer requires an element";this.element=$(t)}var r,e;return e=Math.random,r=Math.floor,t.prototype.render=function(){var t;return t=_.times(2,this.randomColor).join(","),this.element.css({background:"-webkit-radial-gradient("+t+")"})},t.prototype.randomColor=function(){var t,r;return r=function(){var r,e;for(e=[],t=r=0;2>=r;t=++r)e.push(this.randomNumber());return e}.call(this).join(","),"rgb("+r+")"},t.prototype.randomNumber=function(){return r(255*e())},t}()});
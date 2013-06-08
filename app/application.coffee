Drone = require 'drone'
Visualizer = require 'visualizer'

module.exports = class Application

  constructor: ->
    AudioContext = window.webkitAudioContext or window.AudioContext
    throw 'WebAudio support required' unless AudioContext
    context = new AudioContext
    @drone = new Drone context
    @visualizer = new Visualizer 'html'
    @initialize()

  initialize: ->
    @visualizer.render()
    @drone.play()

window.app = new Application

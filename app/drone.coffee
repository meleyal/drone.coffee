#
# A drone noise generator using the Web Audio API.
#
# By [William Meleyal](http://meleyal.com), algorithm based on [Javascript Drone](http://matt-diamond.com/drone.html) by Matt Diamond.
#

module.exports = class Drone

  # Shortcuts for Math methods.
  { random, floor, pow } = Math

  # Define the [musical scale](http://goo.gl/O3S91) that notes are selected from.
  scale:
    [ 0, 2, 4, 6, 7, 9, 11, 12, 14 ]

  # Connect to the provided `AudioContext`.
  constructor: (@context) ->
    throw 'AudioContext required' unless @context
    @noiseNodes = []
    @createOutput()

  # Start generating.
  play: ->
    @stop()
    @generate()
    true

  # Stop generating.
  stop: ->
    @noiseNodes.pop().disconnect() while @noiseNodes.length
    true

  # Destroy and cleanup.
  destroy: ->
    @stop()
    @output.disconnect @context.destination

  # Connect the main audio output.
  createOutput: ->
    @output = @context.createGainNode()
    @output.gain.value = 20.0
    @output.connect @context.destination

  # Generate the drone using a random `toneCount`.
  # The frequency of all tones are based on the `baseNote`.
  generate: ->
    @toneCount or= _.random 1, 40
    @baseNote or= _.random 40, 70

    for i in [0..@toneCount] by 1
      @createTone @randomFreq()

  # Generate a random frequency.
  # TODO: document why rand is needed.
  randomFreq: ->
    note = @randomNote()
    freq = @midiToFreq note
    rand = (random() * 4) - 2
    freq += rand

  # Generate a random note relative to the `baseNote`.
  # Notes are picked from the scale to ensure harmony.
  randomNote: ->
    idx = floor(random() * @scale.length)
    degree = @scale[idx]
    @baseNote + degree

  # Generate random 3D (`x,y,z`) coordinates.
  randomCoords: ->
    [min, max] = [-20, 20]
    _.random(min, max) for i in [0..2]

  # Convert midi note number to frequency.
  # Based on [`mtof()`](http://goo.gl/8KS8M) from ChucK/PD.
  midiToFreq: (number) ->
    exponent = (number - 69) / 12
    pow(2, exponent) * 440

  # Create a tone from the combination of a panner, filter, and noise generator node.
  createTone: (freq) ->
    panner = @createPanner()
    panner.connect @output
    filter = @createFilter freq
    filter.connect panner
    noiseGen = @createNoiseGen()
    noiseGen.connect filter

  # Create a [panner](http://goo.gl/DilZN) to position the sound in 3D space.
  # Randomize the position of the sound every half second to prevent sounds 'merging'.
  createPanner: ->
    panner = @context.createPanner()
    [x,y,z] = @randomCoords()
    panner.setPosition x,y,z
    movePan = => @randomizePan panner, [x,y,z]
    setInterval movePan, 500
    panner

  # Randomize panner position incrementally.
  randomizePan: (panner, coords) =>
    [x, y, z] = coords
    x = x + _.random -0.1, 0.1
    y = y + _.random -0.1, 0.1
    z = z + _.random -0.1, 0.1
    panner.setPosition x, y, z

  # Create a bandpass [filter](http://goo.gl/VpVHq) to limit
  # the sound to a given frequency range.
  createFilter: (freq) ->
    filter = @context.createBiquadFilter()
    filter.type = filter.BANDPASS
    filter.frequency.value = freq
    filter.Q.value = 150
    filter

  # Create a [script processor](http://goo.gl/eQEeW) to generate sound.
  # `bufferSize` defines the sound quality (number of samples to be processed).
  createNoiseGen: ->
    bufferSize = 256
    noiseGen = @context.createJavaScriptNode bufferSize, 1, 1
    @noiseNodes.push noiseGen
    noiseGen.onaudioprocess = @onAudioProcess
    noiseGen

  # On each `audioprocess` event, fill each sample in the `noiseGen`
  # buffer with random numbers (multiplied so they are audible).
  onAudioProcess: (e) =>
    buffer = e.outputBuffer
    out = buffer.getChannelData 0
    bufferSize = buffer.length

    for i in [0...bufferSize] by 1
      out[i] = (random() * 2) - 1

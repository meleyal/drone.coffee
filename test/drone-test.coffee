Drone = require 'drone'

describe 'Drone', ->

  context = new window.webkitAudioContext or window.AudioContext

  beforeEach ->
    @drone = new Drone context
    @clock = sinon.useFakeTimers()

  afterEach ->
    @clock.restore()
    @drone.destroy()

  it 'should require an AudioContext', ->
    expect(Drone).toThrow()

  it 'should exist', ->
    expect(@drone).toBeDefined()

  it 'should create an output', ->
    expect(@drone.output).toBeDefined()

  it 'should generate a random toneCount in range', ->
    @drone.generate()
    inRange = 1 <= @drone.toneCount <= 40
    expect(inRange).toBe(true)

  it 'should generate a random baseNote in range', ->
    @drone.generate()
    inRange = 40 <= @drone.baseNote <= 70
    expect(inRange).toBe(true)

  it 'should generate a random note from the scale', ->
    @drone.generate()
    baseNote = @drone.baseNote
    note = @drone.randomNote()
    maxDegree = _.last @drone.scale
    maxNote = baseNote + maxDegree
    expect(note >= baseNote).toBe(true)
    expect(note <= maxNote).toBe(true)

  it 'should generate a random frequency', ->
    freq = @drone.randomFreq()
    expect(freq).toEqual(jasmine.any(Number))

  it 'should convert a note to a frequency', ->
    note = @drone.randomNote()
    freq = @drone.midiToFreq note
    expect(freq).toEqual(jasmine.any(Number))

  it 'should create a panner', ->
    panner = @drone.createPanner()
    expect(panner).toBeDefined()

  it 'should randomize the panner position over time', ->
    randomizePan = sinon.stub @drone, 'randomizePan'
    panner = @drone.createPanner()
    @clock.tick(1001)
    expect(randomizePan).toHaveBeenCalledTwice()
    randomizePan.restore()

  it 'should adjust panner position incrementally', ->
    panner = @drone.createPanner()
    setPosition = sinon.stub panner, 'setPosition'
    @drone.randomizePan(panner, [1,1,1])
    for arg in setPosition.args[0]
      # are these correct?
      expect(arg).toBeGreaterThan(0.8)
      expect(arg).toBeLessThan(2)
    setPosition.restore()

  it 'should create a filter for a given frequency', ->
    filter = @drone.createFilter(2000)
    expect(filter).toBeDefined()
    expect(filter.frequency.value).toBe(2000)

  it 'should create a noise generator', ->
    noiseGen = @drone.createNoiseGen()
    expect(noiseGen).toBeDefined()
    expect(@drone.noiseNodes.length).toBe(1)

  it 'should generate a random set of x,y,z coordinates', ->
    for coord in @drone.randomCoords()
      inRange = -20 <= coord <= 20
      expect(inRange).toBe(true)

  it 'should generate a random tone', ->
    createTone = @drone.createTone.bind(@drone)
    expect(createTone).not.toThrow()

  it 'should fill noiseGen with random data', ->
    event = { outputBuffer: { length: 10, getChannelData: -> [] } }
    result = @drone.onAudioProcess(event)
    expect(result.length).toBe(10)
    expect(result[0]).toBeLessThan(1)

  it 'should generate a set of tones based on the toneCount', ->
    expect(@drone.generate().length - 1).toEqual(@drone.toneCount)

  it 'should play', ->
    generate = sinon.stub @drone, 'generate'
    @drone.play()
    expect(generate).toHaveBeenCalled()

  it 'should stop', ->
    noiseNode = { disconnect: sinon.spy() }
    @drone.noiseNodes.push(noiseNode)
    @drone.stop()
    expect(@drone.noiseNodes.length).toBe(0)
    expect(noiseNode.disconnect).toHaveBeenCalled()


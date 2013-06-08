Visualizer = require 'visualizer'

describe 'Visualizer', ->

    beforeEach ->
      @visualizer = new Visualizer('html')

    it 'should exist', ->
      expect(@visualizer).toBeDefined()

    it 'should require an element', ->
      expect(-> new Visualizer).toThrow()
      expect(-> new Visualizer('html')).not.toThrow()

    it 'should generate a random rgb color', ->
      color = @visualizer.randomColor()
      expect(color).toMatch(/rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/)

    it 'should generate a random number in rgb range', ->
      number = @visualizer.randomNumber()
      inRange = 0 <= number <= 255
      expect(inRange).toBe(true)

    it 'should render', ->
      @visualizer.render()
      element = $('html')[0]
      console.log element.style.background
      expect(element.style.background).toMatch(/rgb/)



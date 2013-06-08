module.exports = class Visualizer

  { random, floor } = Math

  constructor: (element) ->
    throw 'Visualizer requires an element' unless element
    @element = $(element)

  render: ->
    values = (_.times 2, @randomColor).join(',')
    @element.css { background: "-webkit-radial-gradient(#{values})" }

  randomColor: =>
    rgb = (@randomNumber() for num in [0..2]).join(',')
    "rgb(#{rgb})"

  randomNumber: ->
    floor random() * 255

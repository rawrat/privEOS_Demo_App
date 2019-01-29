import React, { Component } from 'react'

const UNITS = [
  "Bytes",
  "Kb",
  "Mb",
  "Gb",
  "Tb"
]

class Size extends Component {
  render() {
    let size = parseInt(this.props.size)
    let unit = 0


    while (size > 1000 && unit < UNITS.length) {
      size /= 1000
      unit++
    }

    return (
      <span>{size} {UNITS[unit]}</span>
    )
  }
}

export default Size

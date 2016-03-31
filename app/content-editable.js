'use strict'

const React = require('react')

const DOM = React.DOM

module.exports = class ContentEditable extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
  }

  render() {
    return (
      DOM.div({
        ref: el => this.el = el,
        className: this.props.className,
        contentEditable: !this.props.readOnly,
        onInput: e => this.onInput(e),
        onFocus: e => this.onFocus(e),
        onBlur: e => this.onBlur(e),
        onKeyDown: e => this.onKeyDown(e)
      })
    )
  }

  componentDidMount() {
    this.el.textContent = this.props.value
  }

  componentDidUpdate() {
    if (this.props.value !== this.el.textContent)
      this.el.textContent = this.props.value
    this.el.contentEditable = !this.props.readOnly
  }

  onFocus({target: {textContent}}) {
    this.initialValue = textContent
    setTimeout(() => document.execCommand('selectAll', false, null), 1)
    this.props.onFocus()
  }

  onInput({target: {textContent}}) {
    if (textContent != this.initialValue)
      this.props.onChange({target: {value: textContent}})
  }

  onBlur({target: {textContent}}) {
    window.getSelection().removeAllRanges()
    this.props.onBlur({target: {value: textContent}})
  }

  onKeyDown(e) {
    // Prevent line breaks
    if (e.keyCode == 13)
      e.preventDefault()
  }
}

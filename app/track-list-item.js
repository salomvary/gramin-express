'use strict'

const ContentEditable = require('./content-editable')
const moment = require('moment')
const React = require('react')

const DOM = React.DOM

module.exports = class TrackListItem extends React.Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      name: props.track.name || props.track.defaultName
    }
  }

  render() {
    const track = this.props.track
    const isSuccess = track.status == 'success'
    const isUploading = track.status == 'uploading'
    const isEditable = !track.status || track.status == 'fail'

    if (isSuccess)
      var link = DOM.a({
        className: 'track-activity-link',
        href: 'https://www.strava.com/activities/' + track.activityId,
        children: 'View on Strava'
      })
    else
      var button = DOM.button({
        className: 'track-upload-button',
        disabled: isUploading,
        onClick: () => this.props.onUploadClick(track.path),
        children: isUploading ? 'Uploading…' : 'Upload'
      })

    return (
      DOM.tr(null,
        DOM.td({className: 'track-name-cell'},
          React.createElement(ContentEditable, {
            className: 'track-name',
            value: this.state.name,
            readOnly: !isEditable,
            onChange: event => this.setState({name: event.target.value}),
            onBlur: () => this.onNameBlur()
          }),
          DOM.div({className: 'track-error'},
            track.error)),
        DOM.td({
          className: 'birthtime',
          title: track.birthtime.toString()
        }, moment(track.birthtime).calendar()),
        DOM.td({className: 'actions'}, link, button))
    )
  }

  onNameBlur() {
    const name = this.state.name.trim()
    this.setState({name: name || this.props.track.defaultName})
    this.props.onNameChange(this.props.track.path, name)
  }
}

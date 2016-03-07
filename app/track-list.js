'use strict'

const React = require('react')
const TrackListItem = require('./track-list-item')

const DOM = React.DOM

module.exports = class TrackList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    var rows
    var noTracks
    var noDevice

    if (this.state.tracks)
      if (this.state.tracks.length)
        rows = this.state.tracks.map(track =>
          React.createElement(TrackListItem, {
            key: track.path,
            track: track,
            onUploadClick: this.props.onUploadClick
          })
        )
      else
        noTracks = DOM.div({
          className: 'message',
          children: 'There are no GPX tracks on this device.'
        })
    else
      noDevice = DOM.div({
        className: 'message',
        children: 'No device connected.'
      })

    return (
      DOM.div(null,
        DOM.table(null,
          DOM.tbody(null, rows)),
        DOM.div({className: 'messages'},
          noTracks,
          noDevice))
    )
  }
}

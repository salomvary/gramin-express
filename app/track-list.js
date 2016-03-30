'use strict'

const React = require('react')
const TrackListItem = require('./track-list-item')

const DOM = React.DOM

module.exports = function TrackList(props) {
  var rows
  var noTracks
  var noDevice

  if (props.tracks)
    if (props.tracks.length)
      rows = props.tracks.map(track =>
        React.createElement(TrackListItem, {
          key: track.path,
          track: track,
          onUploadClick: props.onUploadClick,
          onNameChange: props.onNameChange
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

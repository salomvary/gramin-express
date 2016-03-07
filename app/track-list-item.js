'use strict'

const path = require('path')
const React = require('react')
const shell = require('electron').shell

const DOM = React.DOM

module.exports = function TrackListItem(props) {
  const track = props.track
  const isSuccess = track.status == 'success'
  const isUploading = track.status == 'uploading'

  if (isSuccess)
    var link = DOM.a({
      className: 'track-activity-link',
      href: 'https://www.strava.com/activities/' + track.activityId,
      onClick: openExternal,
      children: 'View on Strava'
    })
  else
    var button = DOM.button({
      className: 'track-upload-button',
      disabled: isUploading,
      onClick: () => props.onUploadClick(track.path),
      children: isUploading ? 'Uploading…' : 'Upload'
    })

  return (
    DOM.tr(null,
      DOM.td(null,
        DOM.span({className: 'track-name'},
          path.basename(track.path)),
        DOM.span({className: 'track-error'},
          track.error)),
      DOM.td({className: 'actions'}, link, button))
  )
}

function openExternal(event) {
  event.preventDefault()
  shell.openExternal(event.target.href)
}

'use strict'

const Events = require('events')
const fs = require('fs')
const path = require('path')

const volumes = getVolumes()

module.exports = class Garmin extends Events {
  startWatching() {
    this.update()
    fs.watch(volumes, {persistent: true, recursive: false}, () => this.update())
  }

  update() {
    findDevices()
      .then(devices => Promise.all(devices.map(findTracks)))
      .then(deviceTracks => sortTracks(deviceTracks))
      .then(tracks => this.setTracks(tracks))
      .catch(error => console.error(error))
  }

  setTracks(tracks) {
    this.tracks = tracks
    this.emit('update', tracks)
  }
}

function findDevices() {
  return readdir(volumes)
    .then(devices => Promise.all([devices, Promise.all(devices.map(isGarmin))]))
    .then(results => {
      const devices = results[0]
      const isGarmin = results[1]
      return devices.filter((device, i) => isGarmin[i])
    })
}

function findTracks(device) {
  const gpxDir = path.join(device, 'Garmin', 'GPX')
  return readdir(gpxDir)
    .then(entries => Promise.all([entries, Promise.all(entries.map(stat))]))
    .then(results => {
      const entries = results[0]
      const stat = results[1]
      return entries
        .map((entry, i) => ({path: entry, stat: stat[i]}))
        .filter(entry => entry.stat.isFile())
        .map(entry => ({path: entry.path, birthtime: entry.stat.birthtime}))
    })
}

function sortTracks(deviceTracks) {
  return deviceTracks
    .reduce((a, b) => a.concat(b))
    .sort((a, b) => b.birthtime.getTime() - a.birthtime.getTime())
}

function isGarmin(device) {
  return containsChild(device, 'Garmin')
    .then(isGarmin => {
      return isGarmin && containsChild(path.join(device, 'Garmin'), 'GPX')
    })
}

function containsChild(parent, child) {
  return stat(parent)
    .then(stat => stat.isDirectory() && retryReaddir(parent))
    .then(entries => entries && entries.some(entry => path.basename(entry) == child))
}

function readdir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, result) => {
      if (err)
        if (err.code == 'EACCES')
          // If we don't have permissions to access dir pretend it was empty
          resolve([])
        else
          reject(err)
      else
        resolve(result.map(entry => path.join(dir, entry)))
    })
  })
}

function stat(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, result) => {
      if (err)
        reject(err)
      else
        resolve(result)
    })
  })
}

function retry(fn, count, isRetriable) {
  return fn().catch(e => {
    if (count > 0 && isRetriable(e))
      return sleep(100, () => retry(fn, count - 1, isRetriable))
    else
      return e
  })
}

function sleep(time, fn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn().then(resolve, reject)
    }, time)
  })
}

function retryReaddir(path) {
  // For some reason permissions are not set up right after a device is connected
  return retry(() => readdir(path), 10, e => e.code == 'EACCES')
}

function getVolumes() {
  if (process.platform == 'darwin')
    return '/Volumes'
  else
    return '/media/' + process.env.USER
}

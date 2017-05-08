#!/usr/bin/env node

'use strict'

const vorpal = require('vorpal')()
const request = require('request')
const fs = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')
const standardSettings = require('standard-settings')
const logUpdate = require('log-update')

const settings = standardSettings.getSettings()

var minInterval = 1
var tempDir = settings.tmpDir
mkdirp(tempDir)
var id
let intervals = []

vorpal
  .command('fetch [keyword] [interval] [width] [height] [destination]')
  .description('Starts downloading images from Flickr to a given <destination> folder.\n' +
    'One image is downloaded every <interval> seconds (minimum is 1).\n' +
    'You can provide a [keyword] to download images matching a specific subject. If not supplying any keyword, you will get images matching the keyword "kitten".\n' +
    'You can provide [width] and [height] to change the images size, default size is 320x240')
  .action(({ keyword, interval, width, height, destination}, callback) => {
    width = width || settings.image.width
    height = height || settings.image.height
    keyword = keyword || settings.keyword
    interval = Number(interval) || minInterval
    var destinationPath = destination || settings.destinationPath
    mkdirp(destinationPath)
    if (interval < minInterval) { interval = minInterval }
    intervals[`${keyword}`] = setInterval(() => {  
      let filename = keyword + '_' + Date.now() + '.jpg'
      let finalDestinationPath = path.join(destinationPath, filename)
      let tempDestinationPath = path.join(tempDir, filename)
      var stream = fs.createWriteStream(tempDestinationPath)
      stream.on('error', err => {
        this.log('Error:', err)
        return callback()
      })
      .on('finish', () => {
        fs.move(tempDestinationPath, finalDestinationPath, (err) => {
          if (err) {
            console.log(err)
          }
        })
      })
      request(`http://loremflickr.com/${width}/${height}/${keyword}`).pipe(stream)
      //this.log('Downloading ', )
      vorpal.ui.redraw(`downloading ${finalDestinationPath}`)
    }, interval * 1000)
    return callback()
  })

vorpal
  .command('stop <fetchName>', 'Stop fetching specific named fetcher.')
  .action(({fetchName}, callback) => {
    if(intervals[fetchName]){
      clearInterval(intervals[fetchName])
      vorpal.log(`Stop fetch: ${fetchName}`)
    } else {
      vorpal.log(`${fetchName} unknown.`)
    }
    return callback()
  })

vorpal
  .command('list', 'List current fetcher.')
  .action((args, callback) => {
    vorpal.log('Here are your fetch:')
    vorpal.log(Object.keys(intervals).join(' | '))
    return callback()
  })

vorpal
  .delimiter('fetch-images$')
  .show()

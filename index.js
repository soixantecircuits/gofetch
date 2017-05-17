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
var tempDir = settings.tmpDir || '/tmp'
mkdirp(tempDir)
var id
let intervals = []


function downloadFileToFolder (url, destination, keyword, extension) {
  let filename = `${keyword}_${Date.now()}${extension}`
  let finalDestinationPath = path.join(destination, filename)
  let tempDestinationPath = path.join(tempDir, filename)

  var stream = fs.createWriteStream(tempDestinationPath)
  stream.on('error', err => {
    vorpal.log('Error:', err)
    return callback()
  })
    .on('finish', () => {
      fs.move(tempDestinationPath, finalDestinationPath, (err) => {
        if (err) {
          vorpal.log(err)
        } else if (settings.verbose) {
          vorpal.log('Downloaded ', stream.path)
        }
      })
    })
  request(url).pipe(stream)
  if (settings.verbose) {
    vorpal.log(`downloading ${finalDestinationPath}`)
  }
}

var fetchFunctions = {
  image: (options) => {
    downloadFileToFolder(`http://loremflickr.com/${options.width}/${options.height}/${options.keyword}`, options.destinationPath, options.keyword, '.jpg')
  },

  gif: (options) => {
    request(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${options.keyword}`, (err, res , body) => {
      if (err) {
        vorpal.log(err)
      }
      try {
        let dataObj = JSON.parse(body)
        downloadFileToFolder(dataObj.data.image_url, options.destinationPath, options.keyword, '.gif')
      } catch (error) {
        vorpal.log(error)
      }
    })
  }
}

vorpal
  .command('fetch [keyword] [type] [interval] [width] [height] [destination]')
  .description('Starts downloading media to a given <destination> folder.\n' +
    "You can provide the [type] of media you want to download (image or gif). The default value is 'image'\n" +
    'One medium is downloaded every [interval] seconds (minimum is 1).\n' +
    'You can provide a [keyword] to download media matching a specific subject. If not supplying any keyword, you will get media matching the keyword "kitten".\n' +
    'You can provide [width] and [height] to change the images size, default size is 320x240 (This only works for images).\n')
  .action(({ keyword, type, interval, width, height, destination}, callback) => {
    var options = {
      width: width || settings.image.width || 320,
      height: height || settings.image.height || 240,
      keyword: keyword || settings.keyword || 'kitten',
      interval: Number(interval) || minInterval,
      type: type || settings.image.type || 'image',
      destinationPath: destination || settings.destinationPath || '/tmp/gofetch'
    }
    mkdirp(options.destinationPath)

    if (options.interval < minInterval) { options.interval = minInterval }

    if (typeof fetchFunctions[options.type] !== 'function') {
      vorpal.log(`Cannot fetch media type '${options.type}'. Possible values are: 'image', 'gif'.`)
    } else {
      intervals[`${options.keyword}`] = setInterval(() => {
        fetchFunctions[options.type](options)
      }, options.interval * 1000)
      vorpal.log(`Started downloading ${options.keyword} ${options.type}`)
    }
    return callback()
  })

vorpal
  .command('stop <fetchName>', 'Stop fetching specific named fetcher.')
  .action(({fetchName}, callback) => {
    if (intervals[fetchName]) {
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
  .delimiter('gofetch$')
  .show()

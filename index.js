#!/usr/bin/env node

'use strict'

const vorpal = require('vorpal')()
const request = require('request')
const fs = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')

var tempDir = '/tmp'
mkdirp(tempDir)
var id

vorpal
  .command('fetch <destination> <interval> [keyword] [width] [height]')
  .description('Starts downloading images from Flickr to a given <destination> folder.\n' +
    'One image is downloaded every <interval> seconds (minimum is 1).\n' +
    'You can provide a [keyword] to download images matching a specific subject. If not supplying any keyword, you will get images matching the keyword "kitten".\n' +
    'You can provide [width] and [height] to change the images size, default size is 320x240')
  .action(function (args, callback) {
    var width = args.width || 320
    var height = args.height || 240
    var keyword = args.keyword || 'kitten'
    var interval = Number(args.interval)
    if (interval < 1) { interval = 1 }

    id = setInterval(() => {
      
      let filename = keyword + '_' + Date.now() + '.jpg'
      let finalDestinationPath = path.join(args.destination, filename)
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
      request('http://loremflickr.com/' + width + '/' + height + '/' + keyword).pipe(stream)
      this.log('Downloading ', stream.path)
    }, interval * 1000)
  })
  .cancel(function () {
    clearInterval(id)
  })

vorpal
  .delimiter('fetch-images$')
  .show()

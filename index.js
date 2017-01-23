#!/usr/bin/env node

'use strict'

const vorpal = require('vorpal')()
const request = require('request')
const fs = require('fs')
const path = require('path')

var id

vorpal
  .command('fetch <destination> <interval> [keyword] [width] [height]')
  .description('Starts downloading images from Flickr to a given <destination> folder.\nOne image is downloaded every <interval> seconds.\nYou can provide a [keyword] to download images matching a specific subject. If not supplying any keyword, you will get images matching the keyword "kitten".\nYou can provide [width] and [height] to change the images size, default size is 320x240')
  .action(function (args, callback) {
    var width = args.width || 320
    var height = args.height || 240
    var keyword = args.keyword || 'kitten'

    id = setInterval(() => {
      var ws = fs.createWriteStream(path.join(args.destination, keyword + '_' + Date.now() + '.jpg'))
      ws.on('error', err => {
        this.log('Error:', err)
        return callback()
      })
      ws.on('response', res => {
        if (res === 200) { this.log('Downloaded', ws.path) }
      })

      request('http://loremflickr.com/' + width + '/' + height + '/' + keyword).pipe(ws)
    }, args.interval * 1000)
  })
  .cancel(function () {
    clearInterval(id)
  })

vorpal
  .delimiter('fetch-images$')
  .show()

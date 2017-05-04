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
    var interval = Number(args.interval || 1)
    if (typeof interval !== 'number' || interval < 1) { interval = 1 }

    id = setInterval(() => {
      try {
        return downloadImageToFolder(`http://loremflickr.com/${width}/${height}/${keyword}`, args.destination, keyword, '.jpg')
      } catch (err) {
        return console.error(err)
      }
    }, interval * 1000)
  })
  .cancel(function () {
    clearInterval(id)
  })

vorpal.command('gif <destination> [interval] [keyword]')
  .description('Download a gif with a tag <keyword> from giphy to a given <destination> folder every <interval>.\n' +
    '<interval> must be at least 1.\n')
  .action(function (args, callback) {
    var keyword = args.keyword || 'kitten'
    var interval = Number(args.interval || 1)
    if (typeof interval !== 'number' || interval < 1) { interval = 1 }

    id = setInterval(() => {
      request(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${keyword}`, (err, res ,body) => {
        if (err) {
          return console.error(err)
        }
        try {
          let dataObj = JSON.parse(body)
          return downloadImageToFolder(dataObj.data.image_url, args.destination, keyword, '.gif')
        } catch (error) {
          return console.error(error)
        }
      })
    }, interval * 1000)
  })
  .cancel(function () {
    clearInterval(id)
    vorpal.show()
  })


vorpal
  .delimiter('fetch-images$')
  .show()

function downloadImageToFolder(url, destinationDir, keyword, extension) {
      let filename = `${keyword}_${Date.now()}${extension}`
      let finalDestinationPath = path.join(destinationDir, filename)
      let tempDestinationPath = path.join(tempDir, filename)


      var stream = fs.createWriteStream(tempDestinationPath)
      stream.on('error', err => {
        console.error('Error:', err)
        return callback()
      })
      .on('finish', () => {
        fs.move(tempDestinationPath, finalDestinationPath, (err) => {
          if (err) {
            console.error(err)
          } else {
            console.log('Downloaded ', stream.path)
          }
        })
      })
      request(url).pipe(stream)
      console.log('Downloading ', stream.path)
    }

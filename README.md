# Gofetch

Dog food your hard drive in few types.
Fetch images periodically from flickr and giphy.

You can let it run and feed a database with images.

This is mainly a devtool that should go on your Tool Belt.

- [x] fetch images
- [x] fetch gif
- [ ] fetch video

## 🌍 Installation

`npm install -g gofetch`

## 👋 Usage

`$ gofetch`

### 🐈 Fetch kitten images every second and save them to tmp:

`$gofetch fetch kitten`

### 🍌 Fetch bananas gif every second and save them to tmp:

`$gofetch fetch bananas gif`

### Stoping bananas fetching:

`$gofetch stop bananas`

### Getting help

```
gofetch$ help

  Commands:

  Commands:

    help [command...]                                                 Provides help for a given command.
    exit                                                              Exits application.
    fetch [keyword] [type] [interval] [width] [height] [destination]  Starts downloading media to a given <destination> folder.
                                                                      You can provide the [type] of media you want to download (image or gif). The default value is 'image'
                                                                      One medium is downloaded every [interval] seconds (minimum is 1).
                                                                      You can provide a [keyword] to download media matching a specific subject. If not supplying any keyword, you will get media matching the keyword "kitten".
                                                                      You can provide [width] and [height] to change the images size, default size is 320x240 (This only works for images).
                                                                      
    stop <fetchName>                                                  Stop fetching specific named fetcher.
    list                                                              List current fetcher.

```

## ⚙ Configuration

You can use a configuration which looks like:

``` 
{
  "tmpDir": "/tmp",
  "destinationPath": "/tmp/fetch-image",
  "verbose": false,
  "image":{
    "width":320,
    "height":240,
    "type": "image"
  },
  "keyword":"kitten"
}
```

## 📦 Dependencies

- vorpal: allow to display an interactive cli
- request: allow to download the images
- standard-settings: allow for loading settings, and default settings
- fs-extra: allow to manipulate the file system
- mkdirp: allow to create a directory

## 🕳 Troubleshooting

Please add some relevant information to help troubleshoot.

## ❤️ Contribute

Please follow [standard style](https://github.com/feross/standard) conventions.

Enjoy !
# fetch Images

A script for fetching images from flickr and giphy. Dog food your hard drive in few types.

This is mainly a devtool that should go on your Tool Belt.

## 🌍 Installation

`npm install -g fetch-images`

## 👋 Usage

`$ fetch-images`

### Fetching kitten every second and save them to tmp:

`$fetch-images fetch kitten`

### Fetching bananas every second and save them to tmp:

`$fetch-images fetch bananas`

### Stoping bananas fetching:

`$fetch-images fetch bananas`

### Getting help

```
fetch-images$ help

  Commands:

    help [command...]                                          Provides help for a given command.
    exit                                                       Exits application.
    fetch [keyword] [interval] [width] [height] [destination]  Starts downloading images from Flickr to a given <destination>
                                                               folder.
                                                               One image is downloaded every <interval> seconds.
                                                               You can provide a [keyword] to download images matching a specific
                                                               subject. If not supplying any keyword, you will get images
                                                               matching the keyword "kitten".
                                                               You can provide [width] and [height] to change the images size,
                                                               default size is 320x240

```

## ⚙ Configuration

You can use a configuration which looks like:

``` 
{
  "tmpDir": "/tmp",
  "destinationPath": "/tmp/fetch-image",
  "image":{
    "width":320,
    "height":240
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
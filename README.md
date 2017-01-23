# fetch-images

### Installation

1. `git clone https://github.com/soixantecircuits/fetch-images.git`
2. `cd fetch-images`
3. `npm install -g`

### Usage

Once installed, run `fetch-images`
```
fetch-images$ help

  Commands:

    help [command...]                                          Provides help for a given command.
    exit                                                       Exits application.
    fetch <destination> <interval> [keyword] [width] [height]  Starts downloading images from Flickr to a given <destination>
                                                               folder.
                                                               One image is downloaded every <interval> seconds.
                                                               You can provide a [keyword] to download images matching a specific
                                                               subject. If not supplying any keyword, you will get images
                                                               matching the keyword "kitten".
                                                               You can provide [width] and [height] to change the images size,
                                                               default size is 320x240

```

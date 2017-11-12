## Why should you care about Gramin Express?

So you have a shiny Garmin device and you like sharing your rides, runs or any
other activities on [Strava](http://strava.com). You might run into the following
problems:

- You don't like [Garmin Express](http://software.garmin.com/en-US/express.html)
- You think [Garmin Connect](https://connect.garmin.com/) is a joke
- Neither of those but you have a "non-sport" device, eg. an Oregon which is
  often used by mountain bikers. However these devices do not seem to have
  support for automatic upload to Garmin Connect<sup>*</sup>

<sup>*</sup> Even Garmin is confused whether these devices are suported or not, see [here](https://connect.garmin.com/api/content/page/help/start/devices.faces?actionMethod=api%2Fcontent%2Fpage%2Fhelp%2Fstart%2Fdevices.xhtml%3AuserSwitcher.switchSystem&cid=663158) and [here](https://connect.garmin.com/api/content/page/help/faq.faces?cid=507967#gettingStarted).

If you want something that simply works with your device, Gramin Express for the rescue. Here is how it works:

- Connect your device via USB
- Start Gramin Connect
- Click "Upload"
- Profit

![Gramin Express screenshot](https://raw.githubusercontent.com/salomvary/gramin-express/master/screenshot.png)

## Download and install

### Mac OS X

- [Download Gramin Express for Mac OS X](https://github.com/salomvary/gramin-express/releases)
- Open the dmg file
- Move Gramin Express to /Applications (optional)
- Right click (or control-click) on Gramin Express
- Click Open
- Click Open when prompted **“Gramin Express” is from an unidentified developer. Are you sure you want to open it?**

The last three steps are only necessary when running Gramin Express the first time.

### Linux

Gramin Express was tested on Ubuntu 17.10. It might not work on other distributions.

- Install libgconf (`apt-get install libgconf-2-4` when using Ubuntu)
- [Download Gramin Express for Linux](https://github.com/salomvary/gramin-express/releases)
- Extract the archive (eg. `tar xjvf gramin-express-*.tar.bz2`)
- The executable is `gramin-express-*/gramin-express`

### Windows

If you are interested in Windows support [buy me beers](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8A6RB264GKBBE).

## Source code

Gramin Express is an open source project. [Fork it on GitHub](https://github.com/salomvary/gramin-express).

## Disclaimer

Use at your own risk. It might destroy the Earth. Or better don't use
it.

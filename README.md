znc-logviewer
=============

Node based web interface to browse through ZNC log files.

The project is a work in progress!

### Requirements

* Installed `npm` and `grunt`:  
  `npm install -g grunt-cli`
* Installed `ruby` and `gem` to install the `sass` gem:  
  `gem install sass`
* Enabled global ZNC logs (`${ZNCUSERHOME}/.znc/moddata/log/`)

### Installation

1. Clone the repository:  
  `git clone https://github.com/frdmn/Live.app`
2. Duplicate and rename the example settings file:  
  `cp settings-example.json	settings.json`  
3. Adjust the users and the log file path in the configuration file:  
  `editor settings.json`
4. Install all dependencies:  
  `npm install`
5. Install web libraries:  
  `bower install`
6. Run grunt task:  
  `grunt`
7. Start Node server:  
  `npm start`

### Dependencies

* NodeJS (`npm`)
* Bower
* Grunt

## Version

0.0.1

## License

[WTFPL](LICENSE)

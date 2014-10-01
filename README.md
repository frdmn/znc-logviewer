znc-logviewer
=============

Node based web interface to browse through ZNC log files.

The project is a work in progress!

### Requirements

* NodeJS (`npm`)
* Bower
* Grunt
* Ruby (`gem`)
* global ZNC logs (`${ZNCUSERHOME}/.znc/moddata/log/`)

### Installation

1. Clone the repository:  
  `git clone https://github.com/frdmn/Live.app`
2. Duplicate and rename the example settings file:  
  `cp settings-example.json	settings.json`  
3. Adjust the users and the log file path in the configuration file:  
  `editor settings.json`
4. Install dependencies:  
  `npm install -g grunt-cli`  
  `gem install sass`  
4. Install all packages:  
  `npm install`
5. Install web libraries:  
  `bower install`
6. Run grunt task:  
  `grunt`
7. Start Node server:  
  `npm start`

### Dependencies

* Grunt
* Sass

## Version

0.0.1

## License

[WTFPL](LICENSE)

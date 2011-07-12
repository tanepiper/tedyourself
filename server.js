module.exports = (function() {
    
    // Features required to build the server object
    var inherits        = require('util').inherits;
    var EventEmitter    = require('events').EventEmitter;
    
    /**
     * Server constructor
     * @param base_path The directory that the is the root of the server.
     *                  Defaults to __dirname if not passed
     * @param options   Object of options
     */
    var Server = function(base_path, options) {
        
        // Set the base path of the server
        this.base_path = base_path || __dirname;
        
        // Load the requires that we attach to the servers
        this._              = require('underscore');
        this.fs             = require('fs');
        this.qs             = require('querystring');
        this.url            = require('url');
        this.User           = require('./lib/User')(this);
        this.OAuth          = require('oauth').OAuth;
        this.async          = require('async');
        this.Bitly          = require('./lib/bitly')(this);
        this.mailer         = require('mailer');
        this.cradle         = require('cradle');
        this.express        = require('express');
        this.request        = require('request');
        this.pauseReq       = require('express/node_modules/connect/lib/utils').pause;
        this.imagemagick    = require('imagemagick');
        this.ted_yourself   = require('./lib/ted_yourself')(this);
        
        // Merge the options with defaults.  If no options passed, then
        // create an empty object
        this.options = this._.defaults(options || {}, {
            server: {
                host: '0.0.0.0',
                port: 8080,
                views: this.base_path + '/views',
                static: this.base_path + '/static'
            }
        });
    };
    
    // Server inherits from EventEmitter
    inherits(Server, EventEmitter);
    
    Server.prototype.start = function() {
        // Create circular reference for scope
        var _server = this;
        
        _server.emit('message', 'Starting server');
        
        // Set up some of our storage objects
        _server.assets = {};
        
        _server.loadAssetToArray = function(file, callback) {
            var arr = _server.assets[file] = [];
            _server.fs.readFile(_server.base_path + '/assets/' + file, function(err, data) {
                if (err) {
                    callback(err);
                    return;
                }
                data.toString().split('\n').forEach(function(item) {
                    if (item && item !== '')
                        arr.push(item);
                });
                callback();
            });
        };
        
        // Load the required asset files
        var asset_types = ['bios_long', 'bios_short', 'job_titles_prefix', 'job_titles_suffix'];
        
        _server.async.forEach(asset_types, _server.loadAssetToArray, function(err) {
            if (err) {
                throw new Error('Cannot start server, assets not loaded: ' + err);
            }
            
            _server.emit('message', 'Assets loaded');
            
            // Set up OAuth Client
            _server.OAuthClient = require(_server.base_path + '/lib/oauth_client')(_server);
            
            _server.BitlyLink = new _server.Bitly(_server.options.bitly.username, _server.options.bitly.api_key);
            
            // Set up database
            _server.database = new (_server.cradle.Connection)(_server.options.database.options).database(_server.options.database.name);
            
            // Create express server
            _server.server = _server.express.createServer();
            _server.server.configure(require(server.base_path + '/express_server')(_server));
            
            // Add some helpers
            _server.server.helpers({
                siteTitle: 'Ted Yourself',
                metaTag: '',
                bodyClass: 'normal',
                google_analytics_account_key: _server.options.google_analytics.account_key
            });
            
            _server.server.dynamicHelpers({
                user: function(req, res) {
                    return req.session.user || null;
                }
            });
            
            // Start server listening on port and host
            _server.server.listen(_server.options.server.port, _server.options.server.host);
            _server.emit('message', 'Server listening on ' + _server.options.server.host + ':' + _server.options.server.port);
        });
    };
    
    return Server;
    
})();
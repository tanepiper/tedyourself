module.exports = function(server) {
        
    var Bitly = function(login, api_key, options) {
        
        this.options = server._.defaults(options || {}, {
            login       : login,
            apiKey     : api_key,
            format      : 'json',
            api_url     : 'api.bit.ly',
            api_version : 'v3',
            domain      : 'bit.ly'
        });
    };
    
    Bitly.prototype._generateNiceUrl = function(query, method) {
        var pathname = this.options.api_version + '/' + method;
        return server.url.parse('http://'+  this.options.api_url + '/'+ pathname+'?'+ query);
    };
    
    Bitly.prototype.shorten = function(long_url, callback) {
        var _self = this;
        
        var query = server.qs.stringify(server._.extend(this.options, {
            longUrl: long_url
        }), '&', '=', false);
        
        var uri = this._generateNiceUrl(query, 'shorten');
        
        server.request({uri: uri}, function(err, response, body) {
            if (err) {
                callback(err);
                return;
            }
            
            var result;
            try {
                result = JSON.parse(body);
            } catch (exp) {
                callback(exp);
                return;
            }
            
            callback(null, result);
        });
    };
    
    return Bitly;
};
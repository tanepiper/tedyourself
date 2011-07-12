module.exports = function (server) {
    
    return new server.OAuth(
        server.options.oauth.url_request_token,
        server.options.oauth.url_access_token,
        server.options.oauth.consumer_key,
        server.options.oauth.consumer_secret,
        '1.0',
        server.options.oauth.url_callback,
        'HMAC-SHA1',
        null,
        {'Accept': '*/*', 'Connection': 'close'}
    );
};
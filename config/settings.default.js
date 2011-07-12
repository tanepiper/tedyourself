module.exports = function(base_path) {
    return {
        server: {
            host: '0.0.0.0',
            port: 8080,
            views: base_path + '/views',
            static: base_path + '/static'
        },
        oauth: {
            url_request_token: 'https://api.linkedin.com/uas/oauth/requestToken',
            url_access_token: 'https://api.linkedin.com/uas/oauth/accessToken',
            consumer_key: '',
            consumer_secret: '',
            url_callback: 'http://tedyourself.com/authorised'
        },
        database: {
            options: {
                host: 'tedyourself.iriscouch.com',
                port: 5984,
                timeout: 20000,
                cache: false,
                raw : false,
                secure: false,
                auth: {
                    username: '',
                    password: ''
                }
            },
            name: 'tedyourself'
        },
        bitly: {
            username: '',
            api_key : ''
        },
        google_analytics: {
            account_key: ''
        }
    };
};
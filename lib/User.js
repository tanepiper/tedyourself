module.exports = function(server) {
    
    var User = function(data) {
        
        data = data || {};
        
        var user = server._.defaults(data, {
            _id         : '',
            created     : 0,
            details     : {
                name        : '',
                job_title   : '',
                short_bio   : '',
                antoa       : 0,
            },
            linkedin            : {},
            oauth_access_token  : '',
            profile_url: ''
        });
        
        return user;
    };
    
    return User;
};
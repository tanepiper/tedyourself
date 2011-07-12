module.exports = function(server) {
    
    return function(req, res, next) {
        
        // Pause the request before we do an async method
        var pause = server.pauseReq(req);
        
        try {
            // Get an access token and secret for this session
            server.OAuthClient.getOAuthRequestToken(
                // Callback function with the results
                function(err, session_token, session_secret, result) {
                    // Resume the current request                
                    pause.resume();
                    
                    if (err) {
                        next(new Error('OAuth Error ' + err.statusCode + ': ' + err.data));
                        return;
                    }
                    
                    // We need to store this token and secret for this session only
                    server._.extend(req.session, {
                        oauth_session_token: session_token,
                        oauth_session_secret: session_secret
                    });
                    
                    // Redirect for login
                    res.redirect("https://www.linkedin.com/uas/oauth/authenticate?oauth_token=" + session_token);
                }
            );
        } catch(exp) {
            // Exception caught and error reported
            pause.resume();
            var e = new Error('There has been an error: ' + exp);
            e.status = 500;
            next(e);
        }
    };
};
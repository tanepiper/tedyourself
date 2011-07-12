module.exports = function (server) {
    
    return function(req, res, next) {
        // Pause the current request
        var pause = server.pauseReq(req);
        
        try {
            // Check an oauth nonce was returned
            var verifier = req.query.oauth_verifier;
            
            if (!verifier) {
                res.redirect('/');
                return
            }
    
            // Now we verify we are getting the correct user details and get their access
            // token and secret
            server.OAuthClient.getOAuthAccessToken(
                req.session.oauth_session_token,
                req.session.oauth_session_secret,
                verifier,
                function(err, access_token, access_secret, request) {
                    if (err) {
                        pause.resume();
                        
                        var e = new Error('OAuth Error: Please check your cookie settings and try again, or try another browser.');
                        e.status = err.statusCode;
                        
                        next(e);
                        return;
                    }
                    
                    try {
                        server.database.view('profile/by_oauth_token',
                            {key:access_token, include_docs:true},
                        function(err, view) {
                            
                            pause.resume();
                            
                            if (err) {
                                next(new Error('Error fetching results for oauth token search'));
                                return;
                            }
                            
                            if (view.rows.length > 0) {
                                // We have a user
                                req.session.user = new server.User(view.rows[0].doc);
                            } else {
                                req.session.user = new server.User({
                                    oauth_access_token: access_token
                                });
                                
                                // We don't store the secret, we get this from linkedin each time
                                req.session.oauth_token_secret = access_secret;
                            }
                            
                            if (req.session.user._id) {
                                res.redirect('/profile/' + req.session.user._id);
                            } else {
                                res.redirect('/ted-yourself');
                            }
                       });
                    } catch (exp) {
                        pause.resume();
                        var e = new Error('There has been an error: ' + exp);
                        e.status = 500;
                        next(e);
                    }
               }
            );
        } catch (exp) {
            pause.resume();
            var e = new Error('There has been an error: ' + exp);
            e.status = 500;
            next(e);
        }
    };
};
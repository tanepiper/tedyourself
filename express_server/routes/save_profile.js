module.exports = function(server) {

    return function(req, res, next) {
        try {
            // No user session, we need to redirect the user
            if (!req.session.user) {
                res.redirect('/');
                return;
            }
    
            var pause = server.pauseReq(req);
            
            var firstName = req.session.user.linkedin.firstName.trim().replace(/[^a-zA-Z 0-9]+/g,'');
            var lastName = req.session.user.linkedin.lastName.trim().replace(/[^a-zA-Z 0-9]+/g,'');
        
            var _id = (("" +
                firstName + '-' +
                lastName + '-' +
                req.session.user.details.job_title).trim().split(' ').join('-')
            ).toLowerCase();
        
            req.session.user._id = encodeURIComponent(_id);
            
            req.session.user.created = Date.now();
            
            server.BitlyLink.shorten('http://tedyourself.com/profile/' + req.session.user._id,
                function(err, result) {
                    
                    if (err) {
                        // We don't want this to hinder is, so just save the long url
                        req.session.user.profile_url = 'http://tedyourself.com/profile/' + req.session.user._id;
                    } else {
                        req.session.user.profile_url = result.data.url;
                    }
                    try {
                        server.database.save(req.session.user, function(err, ok) {
                            if (err) {
                                pause.resume();
                                next(new Error('There was an error saving this profile'));
                                return;
                            }
                        
                            pause.resume();
                            res.redirect('/profile/' + req.session.user._id);
                        });
                    } catch (exp) {
                        var e = new Error('There has been an error: ' + exp);
                        e.status = 500;
                        next(e);
                    }
            });
        } catch (exp) {
            var e = new Error('There has been an error: ' + exp);
            e.status = 500;
            next(e);
        }
    };
};
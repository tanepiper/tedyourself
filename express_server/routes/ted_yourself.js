module.exports = function(server) {
    
    /**
     * The ted_yourself route handles when a user logs in and has no existing
     * profile on the system.
     */
    return function(req, res, next) {
        
        // No user session, we need to redirect the user
        if (!req.session.user) {
            res.redirect('/');
            return;
        }
        
        try {
        
            // Pause the current request
            var pause = server.pauseReq(req);
            
            // Fetch the users profile
            server.OAuthClient.get(
                'http://api.linkedin.com/v1/people/~:(id,first-name,last-name,picture-url,summary,public-profile-url,num-connections,num-recommenders)?format=json',
                req.session.user.oauth_access_token,
                req.session.oauth_token_secret,
                function(err, data, request) {
                    if (err) {
                        pause.resume();
                        next(new Error('OAuth Error: ' + err));
                        return;
                    }
                    try {
                        // Parse the linkedin response
                        var linkedin;
                        try {
                            linkedin = JSON.parse(data);
                        } catch (exp) {
                            pause.resume();
                            next(exp);
                            return;
                        }
                        
                        if (!linkedin.pictureUrl) {
                            pause.resume();
                            var e = new Error("You don't have a profile image on your LinkedIn?  You are not worthy to Ted Yourself");
                            e.status = 1;
                            next(e);
                            return
                        }
                        
                        var long_bio;
                        if (linkedin.summary && linkedin.summary !== '') {
                            long_bio = linkedin.summary.replace(/\n/g, '<br />');
                        } else {
                            long_bio = server.ted_yourself.random_bio('long')
                        }
                        
                        // Extend the user object
                        server._.extend(req.session.user.linkedin, linkedin);
                        server._.extend(req.session.user.details, {
                            name        : linkedin.firstName + ' ' + linkedin.lastName,
                            job_title   : server.ted_yourself.generate_job_title(),
                            antoa       : server.ted_yourself.generate_antoa(linkedin),
                            short_bio   : server.ted_yourself.random_bio('short'),
                            long_bio    : long_bio
                        });
                        
                        // Fetch the users profile image
                        var user_image = server.request.get({uri: linkedin.pictureUrl});
                        
                        // Create a stream for the outfile of the users profile image
                        var out_file = server.fs.createWriteStream('/tmp/' + linkedin.id + '.jpg');
                        
                        // Error handler for an write error
                        out_file.on('error', function(err) {
                            pause.resume();
                            err.status = 500;
                            next(err);
                        });
                        
                        // When we know the file is written, we can continue
                        out_file.on('close', function() {
                            
                            // Small function to call imagemagic as a loop
                            var resizeImages = function(options, callback) {
                                server.imagemagick.resize(options, callback);
                            };
                            
                            // Options to create the two file sizes we need
                            var resize_options = [
                                {
                                    srcPath: '/tmp/' + linkedin.id + '.jpg',
                                    dstPath: '/tmp/' + linkedin.id + '-tiny.jpg',
                                    quality: 1.0,
                                    width: '39',
                                    height: '39',
                                    filter: 'Lagrange'
                                },
                                {
                                    srcPath: '/tmp/' + linkedin.id + '.jpg',
                                    dstPath: '/tmp/' + linkedin.id + '-small.jpg',
                                    quality: 1.0,
                                    width: '79',
                                    height: '79',
                                    filter: 'Lagrange'
                                },
                                {
                                    srcPath: '/tmp/' + linkedin.id + '.jpg',
                                    dstPath: '/tmp/' + linkedin.id + '-large.jpg',
                                    quality: 1.0,
                                    width: '159',
                                    height: '159',
                                    filter: 'Mitchell'
                                }
                            ];
                            
                            // Loop over each option and resize the images
                            server.async.forEach(resize_options, resizeImages, function(err) {
                                if (err) {
                                    pause.resume();
                                    next(err);
                                    return;
                                }
                                
                                // Once we're done, load the images as base64 encoded data
                                // to save as inline attachments in couchdb
                                req.session.user._attachments = {
                                    profile_tiny: {
                                        content_type: 'image/jpeg',
                                        data: server.fs.readFileSync('/tmp/' + linkedin.id + '-tiny.jpg', 'base64')
                                    },
                                    profile_small: {
                                        content_type: 'image/jpeg',
                                        data: server.fs.readFileSync('/tmp/' + linkedin.id + '-small.jpg', 'base64')
                                    },
                                    profile_large: {
                                        content_type: 'image/jpeg',
                                        data: server.fs.readFileSync('/tmp/' + linkedin.id + '-large.jpg', 'base64')
                                    }
                                };
                                
                                // Render the ted yourself page
                                res.render('ted_yourself', {
                                    pageTitle: 'TED Yourself Profiles | TEDGlobal 2011 Edinburgh | Generate profile for ' + req.session.user.details.name,
                                    metaTag: 'TED Yourself was conceived by digital agency Blonde in a moment of inspired copyright infringement. Find out more and gain intellectual superiority in seconds.',
                                    profile    : req.session.user,
                                    bodyClass: 'profile create-profile'
                                });
                            });
                        });
                        
                        
                        // Handle error getting the users image
                        user_image.on('error', function(err) {
                            pause.resume();
                            err.status = 500;
                            next(err);
                        });
                        
                        // Invoke fetching the image and writing to file
                        user_image.pipe(out_file);
                    } catch (exp) {
                        var e = new Error('There has been an error: ' + exp);
                        e.status = 500;
                        next(e);
                    }
                }
            );
        } catch (exp) {
            var e = new Error('There has been an error: ' + exp);
            e.status = 500;
            next(e);
        }
    };
};
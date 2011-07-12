module.exports = function(server) {
    
    return function(req, res, next) {
        try {
            var pause = server.pauseReq(req);
            
            server.database.get(req.params.id, function(err, profile) {
                if (err) {
                    pause.resume();
                    if (err.error !== 'not_found') {
                        next(new Error('There has been an error trying to load this profile'));
                    } else {
                        next();
                    }
                    return;
                }
                try {
                    // Next we need to get the latest 5 profiles
                    server.database.view('profile/by_created', {
                        descending:true,
                        limit:6,
                        include_docs: true
                    }, function(err, results) {
                        
                        // Check that we don't have this users key included in the results
                        for (var i = 0; i < results.rows.length; i++) {
                            if (results.rows[i].doc._id === profile._id)
                                results.rows.splice(i, 1);
                        }
                        // If the results did not include the user, just pop the last one off
                        if (results.rows.length === 6) {
                            results.rows.pop();
                        }
                        
                        pause.resume();
                    
                        res.render('profile', {
                            profile: profile,
                            other_profiles: results.rows,
                            pageTitle: "TED Yourself Profiles | TEDGlobal 2011 Edinburgh | Profile for " + profile.details.name + ' - ' + profile.details.job_title,
                            metaTag: "TED Yourself Profiles | TEDGlobal 2011 Edinburgh | Profile for " + profile.details.name + ' - ' + profile.details.job_title,
                            bodyClass: 'profile'
                        });
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
module.exports = function(server) {
    
    return function(req, res, next) {
        try {
            var pause = server.pauseReq(req);
            
            server.database.view('profile/by_antoa', {
                descending:true,
                limit:25,
                include_docs: true
            }, function(err, results) {
                
                pause.resume();
                
                if (err) {
                    next(new Error('Unable to get list by_antoa'));
                    return;
                }
    
                res.render('index', {
                    pageTitle: 'TED Yourself Profiles | TEDGlobal 2011 Edinburgh | Blonde Digital',
                    metaTag: 'View TED Yourself profiles then go from mediocre to magnificent with one click of the TED Yourself button.',
                    profiles: results.rows
                });
            });
        } catch (exp) {
            var e = new Error('There has been an error: ' + exp);
            e.status = 500;
            next(e);
        }
    };
};
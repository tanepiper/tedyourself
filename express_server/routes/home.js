module.exports = function(server) {
    
    return function(req, res, next) {
        
        var pause = server.pauseReq(req);
        
        
        try {
            server.database.view('profile/by_created', {
                descending:true,
                limit:25,
                include_docs: true
            }, function(err, results) {
                
                pause.resume();
                
                if (err) {
                    next(new Error('There has been an error connecting with the database'));
                    return;
                }
                
                res.render('index', {
                    pageTitle: 'TED Yourself | TEDGlobal 2011 Edinburgh | Blonde Digital',
                    metaTag: 'TED Yourself and gain intellectual superiority in seconds. Conceived by digital agency Blonde and dedicated to letting everyone know just how awesome you are.',
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
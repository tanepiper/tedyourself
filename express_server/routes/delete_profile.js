/**
 * Returns the route handler for deleting a profile.  When the user has confirmed
 * on the client side, this removes the record from the database and clears the users
 * session, then returns them to the homepage
 */
module.exports = function(server) {
    
    return function(req, res, next) {
        // Pause the incoming request
        var pause = server.pauseReq(req);
        
        try {
            // Pass the id and rev from the params to delete from couchdb
            server.database.remove(req.params.id, req.params.rev, function(err, ok) {
                
                // Resume the request
                pause.resume();
                
                // Show an error page
                if (err) {
                    next(new Error('There was an error deleting this profile'));
                    return;
                }
                
                // If no error, then delete the session and return to the homepage
                res.session = null;
                res.redirect('/');
            });
        } catch (exp) {
            // Exception caught and error reported
            pause.resume();
            var e = new Error('There has been an error: ' + exp);
            e.status = 500;
            next(e);
        }
    };
};
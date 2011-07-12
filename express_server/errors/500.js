module.exports = function(server) {
    
    return function(err, req, res, next) {
        res.render('500', {
            status: err.status || 500,
            error: err,
            pageTitle: err.message
        });
    };
};
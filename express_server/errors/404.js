module.exports = function(server) {
    
    return function(req, res, next) {
        res.render('404', {status: 404, url: req.url, pageTitle: 'The resource you are trying to access was not found.'});
    };
    
};
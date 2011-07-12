module.exports = function(server) {
    
    /**
     * Function returns sets up the express server with required middleware
     * and routes for pages
     */
    return function() {
        // Set server options
        server.server.set('view engine', 'jade');
        server.server.set('views', server.options.server.views);
        
        // Configure middleware
        server.server.use(server.express.bodyParser());
        server.server.use(server.express.cookieParser());
        server.server.use(server.express.session({secret: 'tedyourself'}));
        server.server.use(server.express.methodOverride());
        server.server.use(server.express.static(server.options.server.static));
        server.server.use(server.server.router);
        
        // Set up error pages
        server.server.use(require(__dirname + '/errors/404')(server));
        server.server.use(require(__dirname + '/errors/500')(server));      
        
        // Set up page routes
        server.server.get('/profile/:id', require(__dirname + '/routes/profile')(server));
        server.server.get('/delete-profile/:id/:rev', require(__dirname + '/routes/delete_profile')(server));
        server.server.get('/authorise', require(__dirname + '/routes/authorise')(server));
        server.server.get('/authorised', require(__dirname + '/routes/authorised')(server));
        server.server.get('/ted-yourself', require(__dirname + '/routes/ted_yourself')(server));
        server.server.get('/save-profile', require(__dirname + '/routes/save_profile')(server));
        server.server.get('/tediologists-by-antoa', require(__dirname + '/routes/by_antoa')(server));
        server.server.get('/about', require(__dirname + '/routes/about')(server));
        
        // Home is always last route
        server.server.get('/', require(__dirname + '/routes/home')(server));
    };
};
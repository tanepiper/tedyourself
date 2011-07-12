module.exports = function(server) {
    return function(req, res, next) {
        res.render('about', {
            layout: 'layout_about',
            pageTitle: 'About TED Yourself | Blonde Digital | TEDGlobal 2011',
            metaTag: 'TED Yourself was conceived by digital agency Blonde in a moment of inspired copyright infringement. Find out more and gain intellectual superiority in seconds.',
            bodyClass: 'about'
        });
    };
};
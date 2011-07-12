TED Yourself
============

What is TED Yourself?
---------------------

TED Yourself is an inspirational organisation, dedicated to letting everyone know just how awesome you are.

Squaring your I.Q by the length of your job title, TED Yourself lets you experience what making a profound
contribution to the human race feels like without actually having to lift a philanthropic finger.

TED Yourself is sponsored by digital agency [Blonde](http://blonde.net). Blonde created TED Yourself as an
irreverent celebration of TED Talks, which comes to the Edinburgh festival for the first time this summer.

![Blonde Digital](http://blonde.net/images/logo.gif) 

The site was built in [nodejs](http://nodejs.org), with [CouchDB](http://couchdb.org) as a database. We think nodejs
is a really powerful tool. To show you what it can do, we made TED Yourself open source. If you like what you've
seen, then get in touch to find out what Blonde can do for you.

To Run
------

Copy `config/settings.default.js` to `config/settings.js` and enter your settings.  Create a CouchDB database and create the
design document `_design/profile` from the file `config/database/design.profile.json`

Then in the command line type `node app.js` to run

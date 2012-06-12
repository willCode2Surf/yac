YAC: Yet another chat for Meteor
=================================

Yac is a pure Javascript one2many chat based on [Meteor](http://meteor.com).
As far I know, there are few examples of [Meteor](http://meteor.com) and [Backbone](http://backbonejs.org/) integration.
Hence, I built mine in order to play with views and routers.

[Meteor](http://meteor.com) is the web framework I have ever wanted! :P''' (slurp)
[Backbone](http://backbonejs.org/) is a cool Model View Controller framework for Javascript.

Credits
---------

* [Meteor Chat Room Tutorial](http://vimeo.com/40300075)
* [Meteor docs](http://docs.meteor.com/)
* [Stackoverflow](http://stackoverflow.com/questions/tagged/meteor)

Getting started
----------------

1. Install [Meteor](http://docs.meteor.com/#quickstart) and create a new app.
    <pre><code>
    $ curl install.meteor.com | /bin/sh
    $ meteor create yac
    </code></pre>
2. Copy this project files into the new directory (i.e. yac).
3. Install backbone.js package.
    <pre><code>
    $ meteor add backbone
    </code></pre>
4. Run meteor.
    <pre><code>
    $ cd yac
    $ meteor
    </code></pre>

About the app
--------------

Yac is a one2many chat, that is, a user (the admin) can chat with multiple users at the same time. 
Thus, there are two views (stranger and admin) to display different content depending on the url path (aka action in Backbone.js vocabulary).
A router chooses which view to display.

That's almost all. Have fun!

Copyright notice
-----------------

This code is release under [aGPL license](http://www.gnu.org/licenses/agpl-3.0.html).
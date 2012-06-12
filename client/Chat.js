//// client side


// create collections to store data
Messages = new Meteor.Collection('messages');
Users = new Meteor.Collection('users');

// utility functions to deal with UI events
/////  adapted from http://vimeo.com/40300075
var Ui = {
      events: {
		  // Returns an event_map key for attaching "ok/cancel" events to
		  // a text input (given by selector)
		  okcancel: function (selector) {
		    return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
		  }
	  },
	  // Creates an event handler for interpreting "escape", "return", and "blur"
	  // on a text field and calling "ok" or "cancel" callbacks.
	  make_okcancel_handler: function (options) {
	    var ok = options.ok || function () {};
	    var cancel = options.cancel || function () {};

	    return function (evt) {
	      if (evt.type === "keydown" && evt.which === 27) {
	        // escape = cancel
	        cancel.call(this, evt);
	      } else if (evt.type === "keyup" && evt.which === 13) {
	        // blur/return/enter = ok/submit if non-empty
	        var value = String(evt.target.value || "");
	        if (value)
	          ok.call(this, value, evt);
	        else
	          cancel.call(this, evt);
	      }
	    };
	  }
};

// display a clickable list of users
var UserListView = 	 Backbone.View.extend({
	initialize: function() {
	  _.bindAll(this, 'render');
	},
	template: function() {
		Template.users.users = function() {
			// display first the last active users
			return Users.find({}, {sort:{ updated_at:-1}}); 
		};
		Template.users.events = {
			// on click put the id of the selected user into the current section
		   	'click': function () {
		         Session.set("selected_user", this._id);
		     }
		};
		// show the id of the selected user
		Template.user.selected = function () {
		    return Session.equals("selected_user", this._id) ? "active" : '';
		};
		// return the user list
		return Meteor.ui.render(function() {
	        return Template.users(  );
	    });
	},
	render: function() {
		this.$el.html( this.template() );
	    return this;
	}	
});
	
// display a chat room	
var ChatView = 	 Backbone.View.extend({
	initialize: function() {
	  _.bindAll(this, 'render');
	},
	template: function() {
		// trick to reference the current object within closure
		var that = this;
		// a list of messages order by descending datetime
		Template.messages.messages = function(){
			if (that.options.chat() != undefined){
				return Messages.find( {chat:that.options.chat()}, {sort:{ created_at:-1}});
			}
			return new Array();
		};

		Template.messages.username = function(){
			return that.options.guest();
		};
		// add events to the input text field
		// create a new message when enter is hit
		Template.messageBox.events = {};
		Template.messageBox.events[
			Ui.events.okcancel('#messageBox')] = Ui.make_okcancel_handler({
				ok: function(text, event){
					    Messages.insert( {
							chat: that.options.chat(), // Session.get("selected_user")|| Session.get("user"), 
							name: that.options.author(), // Session.get("user") || 'Marco', 
							message:text,
							created_at: Date.now()
						} );
						event.target.value = "";
					}
			});		
		// return the chat template
		return Meteor.ui.render(function() {
	        return Template.messages(  );
	    });
	},
	render: function() {
		this.$el.html( this.template() );
	    return this;
	}	
});
	 	
// display a control panel for admin
// a control panel consists of a list of users and a chat room for the selected user	
var ControlPanelView = 	 Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');
    },
    template: function() {
        return Template.controlPanel();
    },
    render: function() {
	  $(this.el).html( this.template()  );
	  $(this.el).find('#current-chat')
	            .html( (new ChatView( 
						{ el: $(this.el).find('current-chat'),
						  guest: this.options.guest,
						  author: this.options.author,
						  chat: this.options.chat } )).template() );
	  $(this.el).find('#user-list')
				.html( (new UserListView( { el: $(this.el).find('#user-list') }) ).template() );
	  
      return this;
    }	
});

// display a view for guests/strangers
// only the chat room is displayed
var StrangerView = 	 Backbone.View.extend({
	
    initialize: function() {
      _.bindAll(this, 'render');
    },
    template: function() {
        return Template.strangerPanel();
    },
    render: function() {
	  $(this.el).html( this.template()  );
	  $(this.el).find('#current-chat')
	            .html( (new ChatView( 
						{ el: $(this.el).find('current-chat'),
						  guest: this.options.guest,
						  author: this.options.author,
						  chat: this.options.chat } )).template() );
	  
      return this;
    }	
});

// after the (empty) page is loaded
// views are injected into #content element
Meteor.startup(function () {
	// admin and stranger views are distinguished by their route
	var AppRouter = Backbone.Router.extend({
	        routes: {
	            "admin/:id": "getAdminPage",
	            "*actions": "defaultRoute" 
	        },
	        getAdminPage: function( id ) {
			  console.log("rendering admin view");
		 	  new ControlPanelView( 
					{ el: $("#content"), 
					  author: function(){ return "Marco"; }, 
					  guest: function() { return Session.get('selected_user')||'None';},
					  chat: function(){ return Session.get('selected_user');} }).render();
	        },
	        defaultRoute: function( actions ){
		        console.log("rendering stranger view");
				// remember the session user
				var user = Session.get("user");
				if ( !user ){
					var ts = Date.now();
					var id = Users.insert( {updated_at:ts, created_at:ts} );
					Session.set("user", id);
				}
				new StrangerView( 
					{ el: $("#content"),
					  author:function(){ return 'You'; },
					  guest: function(){ return 'Marco'; },
					  chat: function(){ return Session.get('user');} }).render();
	        }
	    });
	var router = new AppRouter;
	// start router
    Backbone.history.start();
	
});

	




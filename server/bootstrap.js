// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Users.find().count() === 0) {
    var timestamp = (new Date()).getTime();
    for (var i = 0; i < 10; i++) {
      var user_id = Users.insert({created_at: timestamp, updated_at: timestamp});
	  timestamp += 1; // ensure unique timestamp.
    }
  }
});
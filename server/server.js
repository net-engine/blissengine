Meteor.startup(function () {
  //Awards.remove({});
  Meteor.methods({
    username_autocomplete: function (query) {
      var users = Meteor.users.find( { username: new RegExp(query.term, 'i') },
        {
          fields: { username: 1 },
          limit: 5
        });
      var results = users.fetch();
      for (var i=0; i < results.length; i++){
        if (results[i]._id === this.userId){
          results.splice(i, 1);
          break;
        }
      }
      return results;
    },

    insert_award: function(award) {
      if (award.from !== this.userId){ return false; }
      if (award.from === award.to)   { return false; }
      if (award.from.length === 0)   { return false; }
      if (award.to.length === 0)     { return false; }
      if (award.why.length === 0)    { return false; }
      if (Meteor.users.findOne({ _id: award.to }) === undefined) { return false; }
      award.createdAt = new Date();
      Awards.insert(award);
    }
  });

  Awards.allow({
    insert: function (userId, award) {
      //return (award.from === Meteor.users.findOne({_id: userId}).username);
      return (award.from === userId);
    },
    remove: function (userId, award) {
      return (award.from === userId);
    }
  });

  Meteor.publish("awards", function () {
    return Awards.find({}, { limit: 100, sort: {createdAt: -1} });
  });

  Meteor.publish("users", function () {
    return Meteor.users.find({}, {  fields: { username: 1 }, sort: {username: -1} });
  });
});

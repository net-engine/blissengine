Awards = new Meteor.Collection("awards", {
  transform: function (doc) {
    doc.humanFrom = Meteor.users.findOne({_id: doc.from }).username;
    doc.humanTo   = Meteor.users.findOne({_id: doc.to }).username;
    return doc;
}});



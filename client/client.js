Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.subscribe("awards");
Meteor.subscribe("users");

Template.addAward.rendered = function () {
  $( ".username" ).autocomplete({
    source: function( request, response ) {
      Meteor.call("username_autocomplete", request, function (error, results) {
        var formatedResult = _.map(results, function(result){
          return {
              value : result._id,
              label : result.username
            };
        });
        response(formatedResult);
      } );
    },
    select: function( event, ui ) {
      $( ".username" ).val( ui.item.label );
      $( ".user_id").val( ui.item.value);
      return false;
    }
  });
};

Template.award.currentUserIdIs = function (from) {
  return (Meteor.userId() === from);
};

Template.award.events({
  'click .remove_award' : function () {
    Awards.remove(this._id);
  }
});

Template.addAward.events({
  'click .submit' : function () {
    var to   = $( ".user_id").val();
    var why  = $( ".why").val();
    Meteor.call("insert_award", {from: Meteor.userId(), to: to, why: why});
    $( ".user_id").val("");
    $( ".username").val("");
    $( ".why").val("");
  },

  'keydown textarea' : function (e) {
    if (e.keyCode === 13){
      var to   = $( ".user_id").val();
      var why  = $( ".why").val();
      Meteor.call("insert_award", {from: Meteor.userId(), to: to, why: why});
      $( ".user_id").val("");
      $( ".username").val("");
      $( ".why").val("");
    }
  }
});

Template.awards.awards = function(){
  return Awards.find({},{ sort: {createdAt: -1}});
};

Template.usersList.users = function(){
  return Meteor.users.find({});
};

(function ($) {

Task = Backbone.Model.extend({
name: null
});

Tasks = Backbone.Collection.extend({
initialize: function (models, options) {
this.bind("add", options.view.addFriendLi);
//Listen for new additions to the collection and call a view function if so
}
});

AppView = Backbone.View.extend({
el: $("body"),
initialize: function () {
this.tasks = new Tasks( null, { view: this });
//Pass it a reference to this view to create a connection between the two
},
events: {
"click #add-task":  "showPrompt",
},
showPrompt: function () {
var task_name = prompt("What task?");
var task_model = new Task({ name: task_name });
this.task.add( task_model );
},
addTaskLi: function (model) {
//The parameter passed is a reference to the model that was added
$("#tasks-list").append("<li>" + model.get('name') + "</li>");
//Use .get to receive attributes of the model
}
});

var appview = new AppView;

})(jQuery);

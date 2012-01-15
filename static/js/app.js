var task1, task2, task3, task4;

//$(function() {
  
  /**
   * Model: Task
   * name, date, importance
   */
  window.Task = Backbone.Model.extend({
    urlRoot: '/api/v1/task/',
  
    initialize: function() {
      console.log("New task: " + JSON.stringify(this.toJSON()));
    }
    
    , defaults: function() {
      return {
        date: new Date()
        , name: "New event"
        , importance: 0
      };
    }

  
  });
  
  /**
   * Collections: Calendar
   */
   
  window.Calendar = Backbone.Collection.extend({
	  //urlRoot: '/api/v1/calendar',
  
    initialize: function() {
      console.log("New calendar: " + JSON.stringify(this.toJSON()));
    }
  
    , model: Task
    
    , comparator: function(task) {
      return task.get("date");
    }
    
/*
    , before: function(thresholdDate) {
      return this.filter( function(task) {
        task.get('date') < thresholdDate;
      });
    }
*/
    
  
  });
  
  window.TaskView = Backbone.View.extend({
  
    tagName: "li"
    
    
  
  });
  task4 = new Task( { url: '1' } );
  task4.fetch({
	  success: function(model, response) {
	      console.log("Success!: " + model.toString() + "\n response: " + 
			  response);
	  }
	  , error: function(model, response) {
	      console.log("Failure. Model: " + model.toString() + "\n response: " + response);
	  }
});
  
  cal = new Calendar([task1, task2, task3]);

  
  
//});

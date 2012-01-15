var task1, task2, task3, task4, task4View, taskViews = [];

$(function() {
  
  /**
   * Model: Task
   * name, date, importance
   */
  window.Task = Backbone.Model.extend({
    urlRoot: '/api/v1/task/'
  
    , initialize: function() {
      console.log("New task: " + JSON.stringify(this.toJSON()));
      if (this.url) {
        console.log("URL provided: fetching");
        this.fetch({
      	  success: function(model, response) {
	          console.log("Success!: " + model.toString() + "\n response: " + 
               			   response);
      	  }
      	  , error: function(model, response) {
	           console.log("Failure. Model: " + model.toString() + "\n response: " + 
	                       response);
      	  }
        });     
      }
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
  
  
  
  /**
   * View: Task
   */
  window.TaskView = Backbone.View.extend({
    tagName: "div"
    , className: "task-item"
    
    , initialize: function() {
/*       _.bindAll(this, 'render', 'close'); */
/*       this.model.bind('change', this.render); */
      this.model.view = this;
      
/*
      this.id = "task-" + this.model.get('id');
      console.log(this.id + ' ' + this.model.get('name'));
      this.render();
      this.model.bind('change', function() {
        console.log('model: ' + this.model.get('name'));
        this.render();
      });
*/
    }
        
    , render: function() {
        var template = _.template( '<h3><%= name %></h3>', this.model.toJSON());
        $(this.el).html(template);
        return this;
    }
  
  });
  
  
  
 /*
 task4 = new Task( { url: '1' } );
  task4View = new TaskView({ model: task4 });
*/

  now = new Date();
 
  window.Day = Backbone.Collection.extend({

    model: Task,
    
    url: '/api/v1/task/?format=json&calendar_id=1&date='+ now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate(),
        
    parse: function(response) {
        return response.objects;
        },

    comparator: function(task){
        return task.get('priority');}
        
   });

  today = new Day();
  today.fetch();
  today.bind("reset", function() {
    console.log("done");
    today.each(function (task) {
      var view = new TaskView({ model: task });
      $("#app").append(view.render().el);
    });
  });

  
 /*
 window.CalView = Backbone.View.extend({
  
    el: $("#app")
    
    , initialize: function() {
      this.
    }
  
  });
*/
/*
  task4.fetch({
	  success: function(model, response) {
	      console.log("Success!: " + model.toString() + "\n response: " + 
			  response);
	  }
	  , error: function(model, response) {
	      console.log("Failure. Model: " + model.toString() + "\n response: " + response);
	  }});
*/



/*
Day.data = function(){ 
    Days = new Day();
    Days.fetch({async: false});
};
*/
    



/*  
  cal = new Calendar([task1, task2, task3]);
*/

      
  
});

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
      this.model.view = this;
      
    }
        
    , render: function() {
        var template = _.template( '<h3><%= name %></h3>', this.model.toJSON());
        $(this.el).html(template);
        return this;
    }
  
  });
  
  
  now = new Date();
  today = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();


  /* Abstract Task collection. */
  Tasks = Backbone.Collection.extend({

    model: Task,

    initialize: function(options) {
      this.fetch();
      this.bind("reset", function() {
        console.log("done");
        this.each(function (task) {
          var view = new TaskView({ model: task });
          $("#app").append(view.render().el);
        });
      });
    },
        
    parse: function(response) {
        return response.objects;
        },

    comparator: function(task){
        return task.get('priority');}
        
   });
 
  /* Tasks for Today */
  window.Day = Tasks.extend({
    url: '/api/v1/task/?calendar_id=1&date='+today,
   });

  window.Month = Tasks.extend({
    url: 'api/v1/task/?date__month='+(now.getMonth()+1),
    });

  window.Year = Tasks.extend({
    url: 'api/v1/task/?date__year='+now.getFullYear(),
    });


  today = new Day();
  month = new Month();
  year = new Year();


// required for saving
      Backbone.sync = function(method, model) {
  console.log(method + ": " + JSON.stringify(model));
  model.id = 1;
};
  
});

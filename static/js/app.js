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
  
/*
    tagName: "div"
    , className: "task-item"
    , template: _.template('<h3><% name %></h3>')
*/
    
    initialize: function() {
      this.render();
      this.model.bind('change', function() {
        console.log('model: ' + this.model.get('name'));
        this.render();
      });
    }
    
/*     , el: $("#app") */
    
    , render: function() {
/*       if (this.model) { */
        var template = _.template( '<h3><%= name %></h3>',
                                  { name: this.model.get('name') });
        this.el.html(template);
/*       $(this.el).html(this.template(this.model.toJSON())); */
/*       } */
    }
    
/*
    , setContent: function() {      
      var content = this.model.get('content');
      this.$('.todo-content').set("html", content);
      this.$('.todo-input').setProperty("value", content);
      
      if (this.model.get('done')) {
        this.$(".todo-check").setProperty("checked", "checked");
        $(this.el).addClass("done");
      } else {
        this.$(".todo-check").removeProperty("checked");
        $(this.el).removeClass("done");
      }
      
      this.input = this.$(".todo-input");
      this.input.addEvent('blur', this.close);
    },
*/
  
  });
  
  
  
  task4 = new Task( { url: '1' } );
  task4View = new TaskView({ model: task4, el: $("#app") });
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
 now = new Date();
 
window.Day = Backbone.Collection.extend({
    model: Task,
    url: '/api/v1/task/?format=json&calendar__id=1&date='+ now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate(),
    parse: function(response) {
        return response.objects;
        },

    comparator: function(task){
        return task.get('priority');}

 });

TaskView = Backbone.View.extend

Day.data = function(){ 
    Days = new Day();
    Days.fetch({async: false});
};
    



  
  cal = new Calendar([task1, task2, task3]);
*/

      
  
});

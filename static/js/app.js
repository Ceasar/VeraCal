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
 now = new Date();

Day = Backbone.Collection.extend({
    model: Task,
    url: '/api/v1/task/?format=json&calendar__id=1&date='+ now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate(),
    parse: function(response) {
        return response.objects;
        },

    comparator: function(task){
        return task.get('priority');}

 });

Month = Backbone.Collection.extend({
    model: Task,
    url: 'api/v1/task/?format=json&date__month='+(now.getMonth()+1),
    parse: function(response){
        return response.objects;
        },
    comparator: function(task){
        return task.get('priority');}

    });


Year = Backbone.Collection.extend({
    model: Task,
    url: 'api/v1/task/?format=json&date__year='+now.getFullYear(),
    parse: function(response){
        return response.objects;
        },
    comparator: function(task){
        return task.get('priority');}
    });


  
  cal = new Calendar([task1, task2, task3]);

      
  
//});

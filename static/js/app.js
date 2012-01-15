
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
        var templateText = '<h3><%= name %></h3>' +
                           '<span class="importance"><%= importance %></span>';
                           
        var template = _.template( templateText, this.model.toJSON());
        $(this.el).append(template);
        return this;
    }
  
  });
  
  


  /* Abstract Task collection. */
  Tasks = Backbone.Collection.extend({

    model: Task,

    initialize: function(options) {
      this.fetch();
    },
        
    parse: function(response) {
        return response.objects;
        },

    comparator: function(task){
        return task.get('priority');}
        
   });


  makeDate = function(year, month, day) {
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  };


  now = new Date();

  today = makeDate(now.getFullYear(), (now.getMonth() + 1), now.getDate());
  window.Day = Tasks.extend({
    url: '/api/v1/task/?calendar_id=1&date='+today,
   });

  week =  makeDate(now.getFullYear(), (now.getMonth() + 1), now.getDate() + 7);
  window.Week = Tasks.extend({
    url: '/api/v1/task/?calendar_id=1&date__gt='+today+'&date__lte='+week,
   });

  fortnight =  makeDate(now.getFullYear(), (now.getMonth() + 1), now.getDate() + 2 * 7);
  window.Fortnight = Tasks.extend({
    url: '/api/v1/task/?calendar_id=1&date__gt='+week+'&date__lte='+fortnight,
   });

  month = makeDate(now.getFullYear(), (now.getMonth() + 2), now.getDate());
  window.Month = Tasks.extend({
    url: '/api/v1/task/?calendar_id=1&date__gt='+fortnight+'&date__lte='+month,
    });

  quarter = makeDate(now.getFullYear(), (now.getMonth() + 4), now.getDate());
  window.Quarter = Tasks.extend({
    url: '/api/v1/task/?calendar_id=1&date__gt='+month+'&date__lte='+quarter,
    });

  year = makeDate(now.getFullYear() + 1, (now.getMonth() + 1), now.getDate());
  window.Year = Tasks.extend({
    url: '/api/v1/task/?calendar_id=1&date__gt='+quarter+'&date__lte='+year,
    });


  /* Collection Views  */
  TasksView = Backbone.View.extend({
    initialize: function() {
      var that = this;
      this._taskViews = [];
      this.bind("add", this.render);

      this.collection.bind("reset", function() {
        this.each(function(task) {
          var view = new TaskView({model: task});
          that._taskViews.push(new TaskView({
            model: task,
/*             tagName: 'li' */
          }));
        });
        that.render();
      });
    },

    render: function() {
      var that = this;
/*       $(this.el).empty(); */
      _(this._taskViews).each(function(dv) {
        $(that.el).append(dv.render().el);
      });
    }
  });



  dayView = new TasksView({
    collection: new Day(),
    el: $('#day')
  });
  dayView.render();

  weekView = new TasksView({
    collection: new Week(),
    el: $('#week')
  });
  weekView.render();

  fortnightView = new TasksView({
    collection: new Fortnight(),
    el: $('#two-weeks')
  });
  fortnightView.render();

  monthView = new TasksView({
    collection: new Month(),
    el: $('#month')
  });
  monthView.render();

  threeMonthView = new TasksView({
    collection: new Quarter(),
    el: $('#three-months')
  });
  threeMonthView.render();

  yearView = new TasksView({
    collection: new Year(),
    el: $('#year')
  });
  yearView.render();

  var getUrl = function(object) {
    if (!(object && object.url)) return null;
    return _.isFunction(object.url) ? object.url() : object.url;
  };

// required for saving

var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

Backbone.sync = function(method, model, options){
    var type = methodMap[method];
    var params = _.extend({
        type: type,
        dataType: 'json'
    }, options);

    if (!params.url){
        params.url = getUrl(model) || urlError();
    }

    if (Backbone.emulateJSON){
        params.contentType = 'application/json';
        params.data = params.data ? {model: params.data} : {};
    }

    if (Backbone.emulateHTTP){
        if(type === 'PUT' || type === 'DELETE'){
           if (Backbone.emulateJSON) params.data._method = type;
           params.type = 'POST';
           params.beforeSend = function (xhr){
               xhr.setRequestHeader('X-HTTP-Method-Override', type);
            };
         }
     }

    if (params.type !== 'GET' && ! Backbone.emulateJSON){
        params.prorcessData = false;
    }

    return $.ajax(params);
    };


$(function() {
    $('form').submit(function() {

        var new_task = new Backbone.Model({
        date: $('#date :input').val(),
        name: $('#name :input').val(),
        priority: $('priority :input').val()});

         new_task.save();

         date = new_task.get('date');

         if (date >= now) {
           if (date == now) {
             Day.add(new_task);
           } else if (date <= Date(week)) {
             Week.add(new_task);
           } else if (date <= Date(twoWeek)) {
             Fortnight.add(new_task);
           } else if (date <= Date(month)) {
             Month.add(new_task);
           } else if (date <= Date(quarter)) {
             Quarter.add(new_task);
           } else if (date <= Date(year)) {
             Year.add(new_task);
           }
         }
        return false;
    });

});

 
  
});


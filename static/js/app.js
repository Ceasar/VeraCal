
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

  /* Collection Views  */
  TasksView = Backbone.View.extend({
    initialize: function() {
      var that = this;
      this._taskViews = [];

      this.collection.bind("reset", function() {
        this.each(function(task) {
          var view = new TaskView({model: task});
          that._taskViews.push(new TaskView({
            model: task,
            tagName: 'li'
          }));
        });
        that.render();
      });
    },

    render: function() {
      var that = this;
      $(this.el).empty();


  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

      _(this._taskViews).each(function(dv) {
        $(that.el).append(dv.render().el);
      });
    }
  });



  dayView = new TasksView({
    collection: new Day(),
    el: $('#today')
  });
  dayView.render();

  monthView = new TasksView({
    collection: new Month(),
    el: $('#month')
  });
  monthView.render();

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





$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function() {
    $('form').submit(function() {
        var dict = $('form').serializeObject();
        var new_task = new Backbone.Model({
        date: toString(dict.date),
        name: toString(dict.name),
        priority: toString(dict.priority)});
        console.log("new_task =" + new_task);
         new_task.save();
        console.log(dict);
        
        return false;
    });

});

TaskView = Backbone.View.extend({
    el: $("div#app"),
    render: function() {
        $(thi.el).html(this.template(this.model.toJSON()));
   }
});     
//});

      Backbone.sync = function(method, model) {
  console.log(method + ": " + JSON.stringify(model));
  model.id = 1;
};
  
});


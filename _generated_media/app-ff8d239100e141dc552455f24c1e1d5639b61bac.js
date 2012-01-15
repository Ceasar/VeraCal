
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


  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };


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

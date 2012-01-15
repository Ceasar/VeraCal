var task1, task2, task3, task4, task4View, taskViews = [];
var myList = [];


$(function() {

  /**
   * Model: Task
   * name, date, importance
   */
  window.Task = Backbone.Model.extend({
    defaults: function() {
      return {
        date: new Date()
    , name: "New event"
    , importance: 0
      };
    }


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
    '<span class="importance"><%= priority %></span>';

  var template = _.template( templateText, this.model.toJSON());
  $(this.el).append(template);
  return this;
  }

  });




  /* Abstract Task collection. */
  Tasks = Backbone.Collection.extend({

    model: Task,

        localStorage: new Store('tasks'),

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
    importanceLevel: 0,
  });

  week =  makeDate(now.getFullYear(), (now.getMonth() + 1), now.getDate() + 7);
  window.Week = Tasks.extend({
    importanceLevel: 1,
  });

  fortnight =  makeDate(now.getFullYear(), (now.getMonth() + 1), now.getDate() + 2 * 7);
  window.Fortnight = Tasks.extend({
    importanceLevel: 2,
  });

  month = makeDate(now.getFullYear(), (now.getMonth() + 2), now.getDate());
  window.Month = Tasks.extend({
    importanceLevel: 3,
  });

  quarter = makeDate(now.getFullYear(), (now.getMonth() + 4), now.getDate());
  window.Quarter = Tasks.extend({
    importanceLevel: 4,
  });

  year = makeDate(now.getFullYear() + 1, (now.getMonth() + 1), now.getDate());
  window.Year = Tasks.extend({
    importanceLevel: 5,
  });


  /* Collection Views  */
  TasksView = Backbone.View.extend({
    initialize: function() {
                  var that = this;
                  this._taskViews = [];
                  this.collection.bind("add", this.render);

                  this.collection.bind("reset", function() {
                    this.each(function(task) {
                      console.log("Task: " + task.get('name') + " (" + task.get('priority') + ") [" + that.collection.importanceLevel + "]");
                      myList.push(task);
                      if (task.get('priority') >= that.collection.importanceLevel) {
                        var view = new TaskView({model: task});
                        that._taskViews.push(new TaskView({
                          model: task,
                          /*             tagName: 'li' */
                        }));
                      }
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
      date = $('#date :input').val();
      name = $('#name :input').val();
      priority = $('priority :input').val();

      if (date >= now) {
        if (date == now) {
          Day.create({date: date, name: name, priority: priority});
        } else if (date <= Date(week)) {
          Week.create({date: date, name: name, priority: priority});
        } else if (date <= Date(twoWeek)) {
          Fortnight.create({date: date, name: name, priority: priority});
        } else if (date <= Date(month)) {
          Month.create({date: date, name: name, priority: priority});
        } else if (date <= Date(quarter)) {
          Quarter.create({date: date, name: name, priority: priority});
        } else if (date <= Date(year)) {
          Year.create({date: date, name: name, priority: priority});
        }
      }
    });
  });
});


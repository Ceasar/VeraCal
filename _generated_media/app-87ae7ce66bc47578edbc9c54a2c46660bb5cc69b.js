$(function(){
  window.Task = Backbone.Model.extend({
    urlRoot: TASK_API
  });


  window.Tasks = Backbone.Collection.extend({
    urlRoot: TASK_API,
    model: Task,

    comparator: function(task) {
      return task.get('priority');
    }
  });



  window.TaskView = Backbone.View.extend({
    tagName: 'li',
    className: 'task',

    events: {},

    initialize: function() {
      this.model.bind('change', this.render, this);
    },

    render: function() {
              $(this.el).html(ich.taskTemplate(this.model.toJSON()));
              return this;
            }
  });



 window.DetailApp = Backbone.View.extend({
        events: {
            'click .home': 'home'
        },
        
        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        render: function(){
            $(this.el).html(ich.detailApp(this.model.toJSON()));
            return this;
        }                                        
    });


  window.InputView = Backbone.View.extend({
    events: {
              'click .task': 'createTask',
    'keypress #message': 'createOnEnter'
            },

    createOnEnter: function(e){
                     if((e.keyCode || e.which) == 13){
                       this.createTask();
                       e.preventDefault();
                     }

                   },

    createTask: function(){
                   var message = this.$('#message').val();
                   if(message){
                     this.collection.create({
                       message: message
                     });
                     this.$('#message').val('');
                   }
                 }

  });

  window.ListView = Backbone.View.extend({
    initialize: function(){
                  _.bindAll(this, 'addOne', 'addAll');

                  this.collection.bind('add', this.addOne);
                  this.collection.bind('reset', this.addAll, this);
                  this.views = [];
                },

    addAll: function(){
              this.views = [];
              this.collection.each(this.addOne);
            },

    addOne: function(task){
              var view = new TaskView({
                model: task
              });
              $(this.el).prepend(view.render().el);
              this.views.push(view);
              view.bind('all', this.rethrow, this);
            },

    rethrow: function(){
               this.trigger.apply(this, arguments);
             }

  });

  window.ListApp = Backbone.View.extend({
    el: "#app",

    rethrow: function(){
      this.trigger.apply(this, arguments);
    },

    render: function(){
              $(this.el).html(ich.listApp({}));
              var list = new ListView({
                collection: this.collection,
                  el: this.$('#tasks')
              });
              list.addAll();
              list.bind('all', this.rethrow, this);
              new InputView({
                collection: this.collection,
                  el: this.$('#input')
              });
            }        
  });


  window.Router = Backbone.Router.extend({
    routes: {
              '': 'list',
    ':id/': 'detail'
            },

    navigate_to: function(model){
                   var path = (model && model.get('id') + '/') || '';
                   this.navigate(path, true);
                 },

    detail: function(){},

    list: function(){}
  });

  $(function(){
    window.app = window.app || {};
    app.router = new Router();
    app.tasks = new Tasks();
    app.list = new ListApp({
      el: $("#app"),
      collection: app.tasks
    });
    app.detail = new DetailApp({
      el: $("#app")
    });
    app.router.bind('route:list', function(){
      app.tasks.maybeFetch({
        success: _.bind(app.list.render, app.list)                
      });
    });
    app.router.bind('route:detail', function(id){
      app.tasks.getOrFetch(app.tasks.urlRoot + id + '/', {
        success: function(model){
                   app.detail.model = model;
                   app.detail.render();                    
                 }
      });
    });

    app.list.bind('navigate', app.router.navigate_to, app.router);
    app.detail.bind('home', app.router.navigate_to, app.router);
    Backbone.history.start({
      pushState: true, 
      silent: app.loaded
    });
  });
})();

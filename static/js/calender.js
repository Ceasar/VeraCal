$(function(){


  window.Task = Backbone.Model.extend({
    defaults: function() {
                return {
                  done: false,
                  priority: 0
                };
              }
  });


  window.TaskList = Backbone.Collection.extend({
    model: Task,

    // Backbone sync is probably what we really want.
    localStorage: new Store("todos"),

    done: function() {
      return this.filter(function(task){ return task.get('done'); });
    },

    remaining: function() {
       return this.without.apply(this, this.done());
     },

    comparator: function(task) {
                 return task.get('priority');
               }

  });

  
  window.Tasks = new TaskList;


  window.TaskView = Backbone.View.extend({
    tagName: 'li',

    // Don't really get this line.
    template: _.tempalte($('#item-template').html()),

    events: {},

    initialize: function() {
    },

    render: function() {
              return this;
            },

    toggleDone: function() {
                  this.model.toggle();
                },

    edit: function() {
            $(this.el).addClass('editing');
            this.input.focus();
          },

    close: function() {
             this.model.save({text: this.input.val()});
             $(this.el).removeClass('editing');
           },

    updateOnEnter: function(e) {
                     if (e.keyCode === 13) this.close();
                   },

    remove: function() {
              $(this.el).remove();
            },

    clear: function() {
             this.model.destroy();
           }
  });


  window.AppView = Backbone.View.extend({
    el: $('#main'), // Change to high level dom element

    events: {},

    initialize: function() {
      this.input = this.$('#new-task');
    },

    addOne: function(task) {
              var view = new TaskView({model: task});
              this.$("#task-list").append(view.render().el);
            },

    addAll: function() {
              Tasks.each(this.addOne);
            },

    createOnEnter: function(e) {
                     var text = this.input.val();
                     if (!text || e.keyCode != 13) return;
                     Tasks.create({name: text});
                     this.input.val('');
                   },

    clearCompleted: function() {
                      _.each(Tasks.done(), function(task){ task.destroy() });
                      return false;
                    }
  });


  window.App = new AppView;

});

var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    // your code here
    this.set('like', !this.get('like'));
  }
});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // your code here
    // Default sort is by title, when you click like -> re-sort
      this.on('change:like', function(){
        console.log('Liked');
        console.log(this);
        this.sort();
      }, this);
  },

  comparator: 'title',

  sortByField: function(field) {

    // update the comparator to whatever field is selected (since collection is sorted by the comparator)
    // sort the collection
    this.comparator = field;
    // Sort by specific field.
    this.sort(field);
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    console.log('clicked', field);
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // your code here
    // When a movie's like is clicked, render the change
    this.model.on('change:like', function(){
        console.log('Render Ran');
        // this.model.render();
        this.render();

    }, this)
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // When the particular movie model is clicked, toggle the like
      this.model.toggleLike();
    // your code here
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // When the collection is sorted re-render the collection
    this.collection.on('sort', this.render, this);

  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});

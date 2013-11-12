/**
 * Comment form controller and view
 *
 * @class FormView
 * @extends Backbone.View
 * @author Bodnar Istvan <istvan@gawker.com>
 */
/*global Mustache, CommentView, CommentModel */
var FormView = Backbone.View.extend(
/** @lends FormView.prototype */
	{
		/**
		 * Html tag name of the container element that'll be created when initializing new instance.
		 * This container is then accessible via the this.el (native DOM node) or this.$el (jQuery node)
		 * variables.
		 * @type String
		 */
		tagName: 'div',
	
		/**
		 * CSS class name of the container element
		 * @type String
		 */
		className: 'commentform',
		
		/**
		 * The map of delegated event handlers
		 * @type Object
		 */
		events: {
			'click .submit': 'submit',
			'click .cancel': 'cancel'
		},

		/**
		 * View init method, subscribing to model and events
		 */
		initialize: function () {
			this.model.on('change', this.updateFields, this);
			this.model.on('destroy', this.remove, this);
			this.model.on('error', this.showError, this);
		},
		
		/**
		 * Render form element from a template using Mustache
		 * @returns {FormView} Returns the view instance itself, to allow chaining view commands.
		 */
		render: function () {
			var template = $('#form-template').text();
			var template_vars = {
				author: this.model.get('author'),
				text: this.model.get('text')
			};
			this.$el.html(Mustache.to_html(template, template_vars));
			return this;
		},
	
		/**
		 * Submit button click handler
		 * Sets new values from form on model, triggers a success event and cleans up the form
		 * @returns {Boolean} Returns false to stop propagation
		 */
		submit: function () {
		  var author = this.$el.find('.author').val();
			var text = this.$el.find('.text').val();
      // a little hack to validate the model since backbone validation
      // is kind of meh. also triggers validation error event
      if (!this.model._validate({author: author, text: text}, {validate: true})){
        return false;
      }

			// set values from form on model
			this.model.set({
				author: author,
				text: text
			});

			// set an id if model was a new instance
			// note: this is usually done automatically when items are stored in an API
			if (this.model.isNew()) {
				this.model.id = Math.floor(Math.random() * 1000);
			}
			
			// trigger the 'success' event on form, with the returned model as the only parameter
			this.trigger('success', this.model);
			
			// remove form view from DOM and memory
			this.remove();
			return false;
		},
		
		/**
		* Cancel button click handler
		* Cleans up form view from DOM
		* @returns {Boolean} Returns false to stop propagation
		*/
		cancel: function () {
			// clean up form, prompting to save if modal has changed or is unsaved
      var confirmed = this.dirty() ? confirm("You have unsaved changes. Are you sure?") : true;
      if (confirmed) this.remove();
			return false;
		},

    /**
     * Show the error message upon error
     */ 
    showError: function (model, error) {
      this.$el.find('.commenterror').empty().text( error ).fadeIn();
    },

		/**
		 * Update view if the model changes, helps keep two edit forms for the same model in sync
		 * @returns {Boolean} Returns false to stop propagation
		 */
		updateFields: function () {
			this.$el.find('.author').val(this.model.get('author'));
			this.$el.find('.text').val(this.model.get('text'));
			return false;
		},

    /**
     * Set the form as 'dirty' if out of sync with the associated model properties
		 * @returns {Boolean} Returns false to stop propagation
     */
    dirty: function () {
			var	text = this.$el.find('.text').val();
			var author = this.$el.find('.author').val();
      
      // Set the form as dirty if the model is out of sync with it
      if( !this.model.isNew()
          && ( !_.isEqual(this.model.get('text'), text) 
          || !_.isEqual(this.model.get('author'), author))) return true; 

      return false;
    },
		
		/**
		 * Override the default view remove method with custom actions
		 */
		remove: function () {
			// unsubscribe from all model events with this context
			this.model.off(null, null, this);
      
      // close modal
      $.modal.close();

			// delete container form DOM
			this.$el.remove();
			
			// call backbones default view remove method
			Backbone.View.prototype.remove.call(this);
		}
	}
);

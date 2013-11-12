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
      window.dispatcher.on('newComment', this.newCommentHandler, this);
      window.dispatcher.on('editComment', this.editCommentHandler, this);
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
			// set values from form on model
			this.model.set({
				author: this.$el.find('.author').val(),
				text: this.$el.find('.text').val()
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
      this.confirmedRemove();
			return false;
		},
    
    confirmedRemove: function(){
      var confirmed = this.dirty() ? confirm("You have unsaved changes. Are you sure?") : true;
      if (confirmed) this.remove();
    },

		/**
		* Handler for new comment cancel trigger, same as cancel but fires the 
    * newCommentReady event
		* Cleans up form view from DOM
		* @returns {Boolean} Returns false to stop propagation
		*/
    newCommentHandler: function(){
      this.confirmedRemove();
      window.dispatcher.trigger('newCommentReady');
      return false;
    },

		/**
		* Handler for new comment cancel trigger, same as cancel but fires the 
    * newCommentReady event
		* Cleans up form view from DOM
		* @returns {Boolean} Returns false to stop propagation
		*/
    editCommentHandler: function () {
      this.confirmedRemove();
      window.dispatcher.trigger('editCommentReady');
      return false;
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
      
			// unsubscribe from all dispatcher events with this context
			window.dispatcher.off(null, null, this);
			
			// delete container form DOM
			this.$el.remove();
			
			// call backbones default view remove method
			Backbone.View.prototype.remove.call(this);
		}
	}
);

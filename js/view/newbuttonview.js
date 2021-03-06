/**
 * New comment creation button
 *
 * @class NewButtonView
 * @extends Backbone.View
 * @author Bodnar Istvan <istvan@gawker.com>
 */
/*global CommentModel, FormView */
var NewButtonView = Backbone.View.extend(
/** @lends NewButtonView.prototype */
	{
		/**
		 * The map of delegated event handlers
		 * @type Object
		 */
		events: {
			'click': 'createComment'
		},
		
		/**
		 * Initialize view, make sure button has a comment collection to work with
		 */
		initialize: function () {
			if (this.collection === undefined) {
				throw 'NoCollectionDefined';
			}
		},
		
		/**
		 * Click event handler that first 
		 * FormView will handle internally new comment creation and existing comment editing.
		 * @returns {Boolean} Returns false to stop propagation
		 */
		createComment: function () {
			var comment = new CommentModel({
        author: $.sessionStorage.getItem('lastCommentAuthor')
      });
			// render form view right after new button
			var formview = new FormView({model: comment});
			this.$el.after(formview.render().$el);

      // render as modal
      formview.$el.modal();

			// add saved model to collection after form was submitted successfully
			formview.on('success', this.handleFormSuccess, this);
		
			// finally, return false to stop event propagation
			return false;
		},
		
		/**
		 * Method to handle FormView success event
		 * @param {CommentModel} model Model data returned by FormViews save request
		 */
		handleFormSuccess: function (model) {
			this.collection.add(model);
		},

	}
);

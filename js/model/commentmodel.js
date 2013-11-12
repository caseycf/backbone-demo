/**
 * Comment model
 * All methods should live here that change the state of a comment
 *
 * @class CommentModel
 * @extends Backbone.Model
 * @author Bodnar Istvan <istvan@gawker.com>
 */
/*global CommentModel */
var CommentModel = Backbone.Model.extend(
/** @lends CommentModel.prototype */
	{
		/**
		 * Sample method to change the text of a comment model
		 */
		reverseText: function () {
			if (this.has('text') && this.get('text').length > 0) {
				this.set('text', this.get('text').split('').reverse().join(''));
			}
		},

		/**
		 * Validate the comment model
     * @returns error message if the model is invalid 
		 */
    validate: function( attrs, options ) {
      var hasEmptyFields = _.some([attrs['author'], attrs['text']], function(val){
        return (typeof val === 'undefined' || _.isEmpty(val.trim()));
      });
      if (hasEmptyFields)
        return "You must include both an author and comment body.";
    }
	}
);

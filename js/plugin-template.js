;(function($) {
	$.plugin.defaults = {
		// Appearance
		width               : null,      // Override the default CSS width
		height              : null,      // Override the default CSS height

		// Navigation
		buildNavigation     : true      // If true, builds a list of anchor links to link to each panel
	};
	
	$.plugin = function(el, options) {

		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this;

		base.$el = $(el).addClass('plugin');

		// Add a reverse reference to the DOM object
		base.$el.data("plugin", base);

		base.init = function(){

			base.options = $.extend({},$.plugin.defaults, options);

			// Cache existing DOM elements for later
			base.$items   = base.$el.find('> li').addClass('panel');
		};

		base.goForward = function() {

		};

		// Trigger the initialization
		base.init();
	};

	$.fn.plugin = function(options) {

		// initialize the slider
		if ((typeof(options)).match('object|undefined')){
			return this.each(function(i){
				(new $.plugin(this, options));
			});

		// If options is a number, process as an external link to page #: $(element).plugin(#)
		} else if (/\d/.test(options) && !isNaN(options)) {
			return this.each(function(i) {
				var plugin = $(this).data('plugin');
				if (plugin) {
					var page = (typeof(options) == "number") ? options : parseInt($.trim(options),10); // accepts "  2  "
					// ignore out of bound pages
					if ( page < 1 || page > plugin.pages ) { return; }
					plugin.gotoPage(page);
				}
			});
		}
	};

})(jQuery);
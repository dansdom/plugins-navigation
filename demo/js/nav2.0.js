/*
	jQuery Navigation Plugin v2.0
	Copyright (c) 2011 Daniel Thomson
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php
*/

// Two possible nav effects so far: 'fade' and 'slide' - added the default setting which has no effect
// going to make a vertical menu as well as the horizontal menu I have already
// Going to make the right side subitems fall to the left of the dropdown
// Going to make a fixed width or 'auto' width option for the top level items

// Settings
// itemWidth     -    Integer; width of each individual nav item
// itemHeight    -    Integer; height of each individual nav item
// navEffect     -    "default","slide","fade"; two options at the moment. slide or fade. Default has no effect
// speed         -    Integer; the speed of the tranition effect
// vertical      -    Boolean; default is a horizontal menu with vertical dropdowns. true - the top row is vertical

// I think I will make the top level width to be auto, maybe even auto height. And then have a fixed width for all submenus
// v 1.0 - basic functionality
// v 2.0 - refactor for new architecture: https://github.com/dansdom/plugins-template-v2

(function ($) {
	// this ones for you 'uncle' Doug!
	'use strict';
	
	// Plugin namespace definition
	$.NavPlugin = function (options, element, callback)
	{
		// wrap the element in the jQuery object
		this.el = $(element);
		// this is the namespace for all bound event handlers in the plugin
		this.namespace = "navPlugin";
		// extend the settings object with the options, make a 'deep' copy of the object using an empty 'holding' object
		this.opts = $.extend(true, {}, $.NavPlugin.settings, options);
		this.init();
		// run the callback function if it is defined
		if (typeof callback === "function")
		{
			callback.call();
		}
	};
	
	// these are the plugin default settings that will be over-written by user settings
	$.NavPlugin.settings = {
		'myBgColor': 'red',
		'MyBorderColor': 'blue',
		'boxHeight': '60px'
	};
	
	// plugin functions go here
	$.NavPlugin.prototype = {
		init : function() {
			// going to need to define this, as there are some anonymous closures in this function.
			// something interesting to consider
			var myObject = this;
			
			// this seems a bit hacky, but for now I will unbind the namespace first before binding
			this.destroy();
			
			this.el.timer;
			this.el.toprow = this.el.children("li");
			this.el.submenu = this.el.children("li.toprow").children("ul");
			this.el.stack = this.el.find("li:has(ul)");

			// add classes to navigation items. If a submenu then add class "stack"
			this.addClasses();
			this.addCss();
    		// add style for hover states on top row, first submenu, then subsequent levels.
    		this.addTopRowEffect();
			this.addSubMenuEffect();
			// end of plugin stuff
			
		},
		// add classes to the menu items
		addClasses : function()
		{
			this.el.toprow.addClass("toprow");
			this.el.submenu.addClass("submenu");
			// add .stack class to all LI's that have a child UL
			this.el.stack.addClass("stack");
		},
		// add style to the list
		addCss : function()
		{
			  // set width and height for horizontal list
			this.el.css({"display":"inline"});
			this.el.find("li").css({"display": "block", width: this.opts.itemWidth + "px", height: this.opts.itemHeight + "px", "float": "left", "position": "relative"});
			this.el.find("li").find("a").css({height: (this.opts.itemHeight - 2) + "px", width: (this.opts.itemWidth - 2) + "px", "display": "block", "line-height": (this.opts.itemHeight - 2) + "px"});
			this.el.find("li").find("ul").css({"margin-left": "0px", "position": "absolute", "top": "-1px", "left": "0px", "display": "block", "height": "0px", "width": "0px"});
			this.el.stack.css({"position": "relative"});
			this.el.stack.find("ul").css({"position": "absolute", "top": "-1px", "left": "0px"});
			this.el.toprow.css({"float": "left"});
			this.el.toprow.find("ul").css({"margin-top": (this.opts.itemHeight+1) + "px"});
			this.el.toprow.find("ul").find("li").css({"position": "relative", "display":"none"});
			this.el.toprow.find("ul").find("li").find("ul").css({"left": this.opts.itemWidth + "px", "top": "0px", "position": "absolute", "margin-top": "0px"});
			this.el.toprow.find("ul").find("li").find("ul").find("li").css({"margin-top": "0px"});
			this.el.submenu.find("li").css({"display": "none"});
		},
		// add event handling for the top menu items
		addTopRowEffect : function()
		{
			var nav = this;
			this.el.children("li.toprow").bind('mouseover.' + this.namespace, function() {
				clearTimeout(nav.el.timer);
				$(this).addClass("hover");
				var hoverSublist = $(this).children("ul").children("li"),
					otherSublists = $(this).siblings("li").children("ul").children("li");
					
				// show this sublist and hide the other sublists
				if (nav.opts.navEffect == "slide")
				{
					hoverSublist.slideDown(nav.opts.speed);
					otherSublists.slideUp(nav.opts.speed);
				}
				else if (nav.opts.navEffect == "fade") // do fade effect
				{
					hoverSublist.css("display","block");
					otherSublists.fadeOut(nav.opts.speed);
				}
				else
				{
					hoverSublist.css("display","block");
					otherSublists.css("display","none");
				};
				hoverSublist.children("ul").css("display","none");
				return false;
			});
	
			this.el.children("li.toprow").bind('mouseout.' + this.namespace, function() {
				$(this).removeClass("hover");
				nav.setTimer();
				return false;
			});
		},
		// add event handling for submenu items
		addSubMenuEffect : function()
		{
			var nav = this;
			this.el.children("li.toprow").find("li").bind('mouseover.' + this.namespace, function() {
				clearTimeout(nav.el.timer);
				$(this).addClass("hover");
				$(this).children("ul").css("display","block");
				var hoverSublist = $(this).children("ul").children("li"),
					otherSublists = $(this).siblings("li").children("ul").children("li");
					
				// show this sublist and hide the other sublists
				if (nav.opts.navEffect == "slide")
				{
					hoverSublist.slideDown(nav.opts.speed);
					otherSublists.slideUp(nav.opts.speed);
				}
				else if (nav.opts.navEffect == "fade")  // do fade effect
				{
					hoverSublist.css("display","block");
					otherSublists.fadeOut(nav.opts.speed);
				}
				else
				{
					hoverSublist.css("display","block");
					otherSublists.css("display","none");
				};
				hoverSublist.children("ul").css("display","none");
				return false;
			 });
	
			this.el.find("li.toprow").find("li").bind('mouseout.' + this.namespace, function() {
				$(this).removeClass("hover");
				nav.setTimer();
				return false;
			});
		},
		// set navigation timer
		setTimer : function()
		{
			var nav = this;
			clearTimeout(this.el.timer);
			this.el.timer = setTimeout(function() {nav.hideNav()},500);
		},
		// hide navigation
		hideNav : function()
		{
			var sublists = this.el.find("li.toprow ul");
			if (this.opts.navEffect == "slide")
			{
				sublists.children("li").slideUp(this.opts.speed);
				sublists.children("ul").slideUp(this.opts.speed);
			}
			else if (this.opts.navEffect == "fade") // do fade effect
			{
				sublists.children("li").fadeOut(this.opts.speed);
				sublists.children("ul").fadeOut(this.opts.speed);
			}
			else
			{
				sublists.children("li").css("display","none");
				sublists.children("ul").css("display","none");
			};
		},
		option : function(args) {
			this.opts = $.extend(true, {}, this.opts, args);
		},
		destroy : function() {
			this.el.unbind("." + this.namespace);
		}
	};
	
	// the plugin bridging layer to allow users to call methods and add data after the plguin has been initialised
	// props to https://github.com/jsor/jcarousel/blob/master/src/jquery.jcarousel.js for the base of the code & http://isotope.metafizzy.co/ for a good implementation
	$.fn.navPlugin = function(options, callback) {
		// define the plugin name here so I don't have to change it anywhere else. This name refers to the jQuery data object that will store the plugin data
		var pluginName = "navPlugin",
			args;
		
		// if the argument is a string representing a plugin method then test which one it is
		if ( typeof options === 'string' ) {
			// define the arguments that the plugin function call may make 
			args = Array.prototype.slice.call( arguments, 1 );
			// iterate over each object that the function is being called upon
			this.each(function() {
				// test the data object that the DOM element that the plugin has for the DOM element
				var pluginInstance = $.data(this, pluginName);
				
				// if there is no data for this instance of the plugin, then the plugin needs to be initialised first, so just call an error
				if (!pluginInstance) {
					alert("The plugin has not been initialised yet when you tried to call this method: " + options);
					return;
				}
				// if there is no method defined for the option being called, or it's a private function (but I may not use this) then return an error.
				if (!$.isFunction(pluginInstance[options]) || options.charAt(0) === "_") {
					alert("the plugin contains no such method: " + options);
					return;
				}
				// apply the method that has been called
				else {
					pluginInstance[options].apply(pluginInstance, args);
				}
			});
			
		}
		// initialise the function using the arguments as the plugin options
		else {
			// initialise each instance of the plugin
			this.each(function() {
				// define the data object that is going to be attached to the DOM element that the plugin is being called on
				var pluginInstance = $.data(this, pluginName);
				// if the plugin instance already exists then apply the options to it. I don't think I need to init again, but may have to on some plugins
				if (pluginInstance) {
					pluginInstance.option(options);
					// initialising the plugin here may be dangerous and stack multiple event handlers. if required then the plugin instance may have to be 'destroyed' first
					//pluginInstance.init(callback);
				}
				// initialise a new instance of the plugin
				else {
					$.data(this, pluginName, new $.NavPlugin(options, this, callback));
				}
			});
		}
		
		// return the jQuery object from here so that the plugin functions don't have to
		return this;
	};

	// end of module
})(jQuery);

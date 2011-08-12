/*
	jQuery Navigation Plugin
	Copyright (c) 2011 Daniel Thomson
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php
*/

// Two possible nav effects so far: 'fade' and 'slide'


var menuTimer; // timer for the hide effect - I don't mind that's its a global
(function($){

	$.fn.navPlugin = function(config)
	{
		// config - default settings
		var settings = {
				   	  		'navWidth': 900,
							'itemWidth': 150,
							'itemHeight': 50,
							'navEffect': "slide",
							'speed': 500
					 };

		// if settings have been defined then overwrite the default ones
		// comments: 	true value makes the merge recursive. that is - 'deep' copy
		//				{} creates an empty object so that the second object doesn't overwrite the first object
		//				this emtpy takes object1, extends2 onto object1 and writes both to the empty object
		//				the new empty object is now stored in the var opts.
		var opts = $.extend(true, {}, settings, config);

		// iterate over each object that calls the plugin and do stuff
		this.each(function(){
			// do pluging stuff here

			// each box calling the plugin now has the variable name: myBox
			var myMenu = $(this);

			// add classes to navigation items. If a submenu then add class "stack"
			$.fn.navPlugin.addClasses(myMenu);
			$.fn.navPlugin.addCss(myMenu,opts);
    		     // add style for hover states on top row, first submenu, then subsequent levels.
    		     $.fn.navPlugin.addTopRowEffect(myMenu,menuTimer,opts);
    		     $.fn.navPlugin.addSubMenuEffect(myMenu,menuTimer,opts);
			// end of plugin stuff
		});

		// return jQuery object
		return this;
	}

	// plugin functions go here

	// add classes to the menu items
	$.fn.navPlugin.addClasses = function(myNav)
	{
		myNav.children("li").addClass("toprow");
    	     myNav.children("li.toprow").children("ul").addClass("submenu");
    	     // add .stack class to all LI's that have a child UL
    	     myNav.find("li:has(ul)").addClass("stack");
 	};
 	
 	// add style to the list
 	$.fn.navPlugin.addCss = function(myNav,opts)
 	{
		myNav.css({"display":"inline"});
		myNav.find("li").css({"display":"block",width:opts.itemWidth+"px",height:opts.itemHeight+"px","float":"left","position":"relative"});
		myNav.find("li").find("a").css({height:(opts.itemHeight-2)+"px",width:(opts.itemWidth-2)+"px","display":"block","line-height":(opts.itemHeight-2)+"px"});
		myNav.find("li").find("ul").css({"margin-left":"0px","position":"absolute","top":"-1px","left":"0px","display":"block","height":"0px","width":"0px"});
		myNav.find(".stack").css({"position":"relative"});
		myNav.find(".stack").find("ul").css({"position":"absolute","top":"-1px","left":"0px"});
		myNav.find(".toprow").css({"float":"left"});
		myNav.find(".toprow").find("ul").css({"margin-top":(opts.itemHeight+1)+"px"});
		myNav.find(".toprow").find("ul").find("li").css({"position":"relative","display":"none"});
		myNav.find(".toprow").find("ul").find("li").find("ul").css({"left":opts.itemWidth+"px","top":"0px","position":"absolute","margin-top":"0px"});
		myNav.find(".toprow").find("ul").find("li").find("ul").find("li").css({"margin-top":"0px"});
		myNav.find(".toprow").find(".submenu").find("li").css({"display":"none"});
	};
	


	// add event handling for the top menu items
    $.fn.navPlugin.addTopRowEffect = function(myNav,timer,opts)
	{
		myNav.children("li.toprow").mouseover(function() {
			clearTimeout(menuTimer);
        	     $(this).addClass("hover");
			if (opts.navEffect == "slide")
			{
				myNav.children("li.hover").children("ul").children("li").slideDown(opts.speed);
				//myNav.children("li.toprow:not(.hover)").children("ul").children("li").slideUp(opts.speed);
				myNav.children("li.toprow:not(.hover)").children("ul").children("li").css("display","none");
			}
			else // do fade effect
        	     {
				myNav.children("li.hover").children("ul").children("li").css("display","block");
				myNav.children("li.toprow:not(.hover)").children("ul").children("li").fadeOut(opts.speed);
			}
        	     myNav.children("li.hover").children("ul").children("li").children("ul").css("display","none");
        	     return false;
    	     });

     	myNav.children("li.toprow").mouseout(function() {
			$(this).removeClass("hover");
        	     $.fn.navPlugin.setTimer(myNav,timer,opts);
        	     return false;
    	     });

    };

	// add event handling for submenu items
    $.fn.navPlugin.addSubMenuEffect = function(myNav,timer,opts)
    {
		myNav.children("li.toprow").find("li").mouseover(function() {
			clearTimeout(menuTimer);
        	     $(this).addClass("hover");
        	     myNav.find("li.hover").children("ul").css("display","block");
			if (opts.navEffect == "slide")
			{
				myNav.find("li.hover").children("ul").children("li").slideDown(opts.speed);
				//$(this).siblings("li").children("ul").children("li").slideUp(opts.speed);
				$(this).siblings("li").children("ul").children("li").css("display","none");
			}
			else  // do fade effect
			{
				myNav.find("li.hover").children("ul").children("li").css("display","block");
				$(this).siblings("li").children("ul").children("li").fadeOut(opts.speed);
			}
  			myNav.find("li.hover").children("ul").children("li").children("ul").css("display","none");
        	     return false;
  	     });

      	myNav.find("li.toprow").find("li").mouseout(function() {
			$(this).removeClass("hover");
        	     $.fn.navPlugin.setTimer(myNav,timer,opts);
        	     return false;
    	     });
	};

	// set navigation timer
	$.fn.navPlugin.setTimer = function(myNav,timer,opts)
	{
		clearTimeout(menuTimer);
    	     menuTimer = setTimeout(function() {$.fn.navPlugin.hideNav(myNav,opts)},100);
	};

	// hide navigation
	$.fn.navPlugin.hideNav = function(myNav,opts)
	{
		if (opts.navEffect == "slide")
		{
			myNav.find("li.toprow ul").children("li").slideUp(opts.speed);
    		     myNav.find("li.toprow ul").children("ul").slideUp(opts.speed);
		}
		else // do fade effect
		{
			myNav.find("li.toprow ul").children("li").fadeOut(opts.speed);
			myNav.find("li.toprow ul").children("ul").fadeOut(opts.speed);
		};
	};

// end of module
})(jQuery);


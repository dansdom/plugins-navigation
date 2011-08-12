/*
	jQuery Navigation Plugin
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


(function($){

	$.fn.navPlugin = function(config)
	{
		// config - default settings
		var settings = {
							'itemWidth': 150,
							'itemHeight': 50,
							'navEffect': "defualt",
							'speed': 200,
							'vertical': false
					 };

		// if settings have been defined then overwrite the default ones
		// comments: 	true value makes the merge recursive. that is - 'deep' copy
		//				{} creates an empty object so that the second object doesn't overwrite the first object
		//				this emtpy takes object1, extends2 onto object1 and writes both to the empty object
		//				the new empty object is now stored in the var opts.
		var opts = $.extend(true, {}, settings, config);

		// iterate over each object that calls the plugin and do stuff
		this.each(function(){
			// each box calling the plugin now has the variable name: myBox
			var myMenu = $(this);
			myMenu.timer;
			myMenu.toprow = myMenu.children("li");
			myMenu.submenu = myMenu.children("li.toprow").children("ul");
			myMenu.stack = myMenu.find("li:has(ul)");

			// add classes to navigation items. If a submenu then add class "stack"
			$.fn.navPlugin.addClasses(myMenu);
			$.fn.navPlugin.addCss(myMenu,opts);
    		     // add style for hover states on top row, first submenu, then subsequent levels.
    		     $.fn.navPlugin.addTopRowEffect(myMenu,opts);
    		     $.fn.navPlugin.addSubMenuEffect(myMenu,opts);
			// end of plugin stuff
		});

		// return jQuery object
		return this;
	}

	// plugin public functions go here

	// add classes to the menu items
	$.fn.navPlugin.addClasses = function(myNav)
	{
		myNav.toprow.addClass("toprow");
    	     myNav.submenu.addClass("submenu");
    	     // add .stack class to all LI's that have a child UL
    	     myNav.stack.addClass("stack");
 	};
 	
 	// add style to the list
 	$.fn.navPlugin.addCss = function(myNav,opts)
 	{
          // set width and height for horizontal list
		myNav.css({"display":"inline"});
		myNav.find("li").css({"display":"block",width:opts.itemWidth+"px",height:opts.itemHeight+"px","float":"left","position":"relative"});
		myNav.find("li").find("a").css({height:(opts.itemHeight-2)+"px",width:(opts.itemWidth-2)+"px","display":"block","line-height":(opts.itemHeight-2)+"px"});
		myNav.find("li").find("ul").css({"margin-left":"0px","position":"absolute","top":"-1px","left":"0px","display":"block","height":"0px","width":"0px"});
		myNav.stack.css({"position":"relative"});
		myNav.stack.find("ul").css({"position":"absolute","top":"-1px","left":"0px"});
		myNav.toprow.css({"float":"left"});
		myNav.toprow.find("ul").css({"margin-top":(opts.itemHeight+1)+"px"});
		myNav.toprow.find("ul").find("li").css({"position":"relative","display":"none"});
		myNav.toprow.find("ul").find("li").find("ul").css({"left":opts.itemWidth+"px","top":"0px","position":"absolute","margin-top":"0px"});
		myNav.toprow.find("ul").find("li").find("ul").find("li").css({"margin-top":"0px"});
		myNav.submenu.find("li").css({"display":"none"});
	};

	// add event handling for the top menu items
    $.fn.navPlugin.addTopRowEffect = function(myNav,opts)
	{
		myNav.children("li.toprow").mouseover(function() {
			clearTimeout(myNav.timer);
        	     $(this).addClass("hover");
        	     var hoverSublist = $(this).children("ul").children("li");
        	     var otherSublists = $(this).siblings("li").children("ul").children("li");
               // show this sublist and hide the other sublists
			if (opts.navEffect == "slide")
			{
				hoverSublist.slideDown(opts.speed);
				otherSublists.slideUp(opts.speed);
			}
			else if (opts.navEffect == "fade") // do fade effect
        	     {
				hoverSublist.css("display","block");
				otherSublists.fadeOut(opts.speed);
			}
               else
               {
                    hoverSublist.css("display","block");
				otherSublists.css("display","none");
               };
        	     hoverSublist.children("ul").css("display","none");
        	     return false;
    	     });

     	myNav.children("li.toprow").mouseout(function() {
			$(this).removeClass("hover");
        	     $.fn.navPlugin.setTimer(myNav,opts);
        	     return false;
    	     });

    };

	// add event handling for submenu items
    $.fn.navPlugin.addSubMenuEffect = function(myNav,opts)
    {
		myNav.children("li.toprow").find("li").mouseover(function() {
			clearTimeout(myNav.timer);
        	     $(this).addClass("hover");
        	     $(this).children("ul").css("display","block");
        	     var hoverSublist = $(this).children("ul").children("li");
        	     var otherSublists = $(this).siblings("li").children("ul").children("li");
               // show this sublist and hide the other sublists
			if (opts.navEffect == "slide")
			{
				hoverSublist.slideDown(opts.speed);
				otherSublists.slideUp(opts.speed);
			}
			else if (opts.navEffect == "fade")  // do fade effect
			{
				hoverSublist.css("display","block");
				otherSublists.fadeOut(opts.speed);
			}
			else
			{
                hoverSublist.css("display","block");
				otherSublists.css("display","none");
            };
  			hoverSublist.children("ul").css("display","none");
        	     return false;
  	     });

      	myNav.find("li.toprow").find("li").mouseout(function() {
			$(this).removeClass("hover");
        	     $.fn.navPlugin.setTimer(myNav,opts);
        	     return false;
    	     });
	};

	// set navigation timer
	$.fn.navPlugin.setTimer = function(myNav,opts)
	{
		clearTimeout(myNav.timer);
    	     myNav.timer = setTimeout(function() {$.fn.navPlugin.hideNav(myNav,opts)},500);
	};

	// hide navigation
	$.fn.navPlugin.hideNav = function(myNav,opts)
	{
          var sublists = myNav.find("li.toprow ul");
		if (opts.navEffect == "slide")
		{
			sublists.children("li").slideUp(opts.speed);
    		sublists.children("ul").slideUp(opts.speed);
		}
		else if (opts.navEffect == "fade") // do fade effect
		{
			sublists.children("li").fadeOut(opts.speed);
			sublists.children("ul").fadeOut(opts.speed);
		}
          else
          {
          		sublists.children("li").css("display","none");
				sublists.children("ul").css("display","none");
          };
	};

// end of module
})(jQuery);


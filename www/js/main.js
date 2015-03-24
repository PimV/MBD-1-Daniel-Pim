var restaurants = [];

var currentItems = 1;
var initialItems = 10;
var perPage = 10;
var currentPage = 1;
var filter = "all";

$(document).ready(function () {
	$('#item-description').dotdotdot({height: 150, watch: "window"});
	
	$(document).on("scrollstop", checkScroll);
	
	$('#close-by-restaurants-button').on('click', function(e) {
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		$('.content-list').empty();
		filter = "close-by";
	});

	$('#all-restaurants-button').on('click', function(e) {
		$('.content-list').empty();
		filter = "all";
	});

	$('#item-list').bind('pagebeforeshow', function() {
		currentPage = 1;
		perPage = 10;
		if (filter === "close-by") {
			loadClosebyRestaurants(currentPage++, perPage);
		} else if (filter === "all") {
			loadRestaurants(currentPage++, perPage);
		}
	});

	$('#item-list').bind('pageshow', function() {				
		$('.content-list').listview('refresh');
	});
});

function loadRestaurants(pageNr, perPage) {
	if (!perPage) {
		perPage = 10;
	}
	
	if (!pageNr) {
		pageNr = 1;
	}
	
	$.ajax({
		type: "GET",
		data: {
			page: pageNr,
			per_page: perPage
		},
		url:       'https://api.eet.nu/venues/',
		dataType:  'json',
		success:   function (response, textStatus, jqXHR) {
			//Pagination
			var currentPage = response.pagination.current_page;
			var totalPages = response.pagination.total_pages;
			
			//Restaurants
			var results = response.results;
			restaurants = $.merge(restaurants, results);
			
			var items = "";
			$.each(results, function(index, element) {
				if (element.images.original.length < 1) {
					element.images.original.push("img/no-img.jpg");
				}
				items += '<li><a id="' + element.id + '"  href="#detail-page"><img class="ui-li-thumb" src="' + element.images.original[0] + '">' + element.name + '</a></li>';
			});
			results.items = items;
			$(".content-list").append(items).listview('refresh');
			attachListeners();
		}
	});
}

function loadClosebyRestaurants(pageNr, perPage) {
	if (!perPage) {
		perPage = 10;
	}
	
	if (!pageNr) {
		pageNr = 1;
	}
	https://api.eet.nu/venues?geolocation=51.55,5.7&sort_by=distance
	$.ajax({
		type: "GET",
		data: {
			page: pageNr,
			per_page: perPage,
			geolocation: window.localStorage.get("lat") + "," + window.localStorage.get("lon"),
			sort_by: "distance"
		},
		url:       'https://api.eet.nu/venues/',
		dataType:  'json',
		success:   function (response, textStatus, jqXHR) {
			//Pagination
			var currentPage = response.pagination.current_page;
			var totalPages = response.pagination.total_pages;
			
			//Restaurants
			var results = response.results;
			restaurants = $.merge(restaurants, results);
			
			var items = "";
			$.each(results, function(index, element) {
				if (element.images.original.length < 1) {
					element.images.original.push("img/no-img.jpg");
				}
				items += '<li><a id="' + element.id + '"  href="#detail-page"><img class="ui-li-thumb" src="' + element.images.original[0] + '">' + element.name + '</a></li>';
			});
			results.items = items;
			$(".content-list").append(items).listview('refresh');
			attachListeners();
		}
	});
}

function loadSingleRestaurant(id) {
	//TO-DO: Validate
	$.ajax({
		type: "GET",
		url:       'https://api.eet.nu/venues/' + id,
		dataType:  'json',
		success:   function (response, textStatus, jqXHR) {
				if (response.images.original.length < 1) {
					response.images.original.push("img/no-img.jpg");
				}
			loadDetailPage(response);
		}
	});
	
}

function attachListeners() {
	//Remove any click-listeners.sdf
	$('.content-list > li > a').off('click');
	
	//Attach new click-listeners
	$('.content-list > li > a').on('click', function() {
		//$(this).off('click');
		var id = $(this).attr('id');
		var type = $(this).attr('data-type');
		loadSingleRestaurant(id);
	});
}

function loadDetailPage(item) {
	$('#item-title').text(item.name);

	$('#item-description').text(item.description);
	$('#item-phonenumber').empty();
	$('#item-phonenumber').append('<a href="tel:' + item.telephone + '">' + item.telephone + '</a>');
	$('#item-img-container').empty();
	$('#item-img-container').append('<img style="border-style: groove;" src="' + item.images.original[0] + '" height="150" height="150">');
}

function checkScroll() {
    /* You always need this in order to target
       elements within active page */
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
 
        /* Viewport's height */
        screenHeight = $.mobile.getScreenHeight(),
 
        /* Content div - include padding too! */
        contentHeight = $(".ui-content", activePage).outerHeight(),
 
        /* Height of scrolled content (invisible) */
        scrolled = $(window).scrollTop(),
 
        /* Height of both Header & Footer and whether they are fixed
           If any of them is fixed, we will remove (1px)
           If not, outer height is what we need */
        header = $(".ui-header", activePage).outerHeight() - 1,
        footer = $(".ui-footer", activePage).outerHeight() - 1,
 
        /* Math 101 - Window's scrollTop should
           match content minus viewport plus toolbars */
        scrollEnd = contentHeight - screenHeight + header + footer;
 
    /* if (pageX) is active and page's bottom is reached
       load more elements  */
    if (activePage[0].id == "item-list" && scrolled >= scrollEnd) {
        /* run loadMore function */
        addMore();
		//loadRestaurants(currentPage++);
    }
}

function addMore(page) {
	$(document).off("scrollstop");
	
	$.mobile.loading("show" , {
		text: "Loading more elements...",
		textvisible: true
	});
	
	setTimeout(function() {
		//loadRestaurants(currentPage++)
		if (filter === "close-by") {
			loadClosebyRestaurants(currentPage++, perPage);
		} else if (filter === "all") {
			loadRestaurants(currentPage++, perPage);
		}
		
		attachListeners();	
		$.mobile.loading("hide");
		$(document).on("scrollstop", checkScroll);
	}, 500);
}



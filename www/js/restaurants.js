var restaurants = [];

var currentItems = 1;
var initialItems = 10;
var perPage = 10;
var currentPage = 1;
var filter;

$(document).ready(function () {

	
	$(document).on("scrollstop", checkScroll);
	
	$('#close-by-restaurants-button').on('click', function(e) {
		//Empty list
		$('.content-list').empty();
		currentPage = 1;
		perPage = 10;
		//Get geolocation information

		// Test purposes only
/*		window.localStorage.setItem("lat", "51.55");
		window.localStorage.setItem("lon", "5.7");
		window.localStorage.setItem("currentFilter", "close-by");*/
		

		navigator.geolocation.getCurrentPosition(onSuccess, onError);

		//Navigate to page
		$.mobile.pageContainer.pagecontainer("change", "#item-list");
		
	});

	$('#all-restaurants-button').on('click', function(e) {
		$('.content-list').empty();
		currentPage = 1;
		perPage = 10;
		window.localStorage.setItem("currentFilter", "all");
		$.mobile.pageContainer.pagecontainer("change", "#item-list");	
		
	});

	$('#item-list').bind('pagebeforeshow', function() {
		filter = window.localStorage.getItem("currentFilter");
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
				items += createListEntry(element);
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



	$.ajax({
		type: "GET",
		data: {
			page: pageNr,
			per_page: perPage,
			geolocation: window.localStorage.getItem("lat") + "," + window.localStorage.getItem("lon"),
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
				items += createListEntry(element);
			});
			results.items = items;
			$(".content-list").append(items).listview('refresh');
			attachListeners();
		}
	});
}

function createListEntry(element) {

	if (element.images.original.length < 1) {
			element.images.original.push("img/no-img.jpg");
		}
	element.distance = (element.distance / 1000).toFixed(1);

	var listEntry = '<li>' +
						'<a id="' + element.id + '"  href="#detail-page">' +										//anchor link
							'<img class="ui-li-thumb" src="' + element.images.original[0] + '">' + 					//image
							'<div>' + element.name + '</div>' +														//name
							'<div><small>Waardering: ' + createRatingIcons(element.rating) + '</small></div>';

	if (!isNaN(element.distance)) {
		listEntry += 		'<div><small>' + element.distance + ' km</small></div>';								//distance
	}
	listEntry +=	'</a>'+
				'</li>';
	return listEntry;

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

function createRatingIcons(itemRating) {
	if (itemRating === null) {
		return "-";
	}

	var starArray = [
		'<i class="fa fa-star-o" style="color: gold"></i>',
		'<i class="fa fa-star-o" style="color: gold"></i>',
		'<i class="fa fa-star-o" style="color: gold"></i>',
		'<i class="fa fa-star-o" style="color: gold"></i>',
		'<i class="fa fa-star-o" style="color: gold"></i>'
	];
	var stars = (itemRating / 10).toFixed(0);
	var halfstars = stars % 2;
	var fullstars = (stars - halfstars) / 2;
	
	var myString = "";
	
	for (var i = 0; i < 5; i++) {
		if (fullstars > 0) {
			fullstars--;
			starArray[i] = '<i class="fa fa-star" style="color: gold"></i>';
		} else if (halfstars > 0) {
			halfstars--;
			starArray[i] = '<i class="fa fa-star-half-o" style="color: gold"></i>';
		}
		
		myString += starArray[i];
	}

	return myString;
}

function dotdotdotCallback(isTruncated, originalContent) {
	if (!isTruncated) {
		$("a", this).remove();
	}
}


function loadDetailPage(item) {
	$('#item-title').text(item.name);
	$('#rating-value').html(createRatingIcons(item.rating));
	
	if (item.description === null) {
		$('#item-description').html("-");
	} else {
		$('#item-description').html(item.description + ' <a class="more" href="#">Lees verder...</a> <a class="less" href="#">Minder...</a>');
		$('#item-description').dotdotdot({height: 80, watch: true, after: "a.more", callback: dotdotdotCallback});
		$(window).resize();

		$('#item-description').on('click', 'a', function() {
			if ($(this).text() == "Lees verder...") {
				var div = $(this).closest('#item-description');
				div.trigger('destroy').find('a.more').hide();
				$('a.less', div).show();
			} else {
				$(this).hide();
				$(this).closest('#item-description').dotdotdot({height: 80, watch: true, after: "a.more", callback: dotdotdotCallback});
			}
		});
	}


	
	$('#item-phonenumber').empty();
	if (item.telephone) {
		$('#item-phonenumber').html('<a href="tel:' + item.telephone + '">' + item.telephone + '</a>');
	}

	$('#item-website').empty();
	if (item.website_url) {
		$('#item-website').html('<a href="' + item.website_url + '">' + item.website_url + '</a>');
	}
	
	$('#item-img-container').empty();
	$('#item-img-container').append('<img style="border-style: groove;" src="' + item.images.original[0] + '" height="100" height="100">');

	$('#item-short-info').html("Sterren: " + createRatingIcons(item.rating));
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



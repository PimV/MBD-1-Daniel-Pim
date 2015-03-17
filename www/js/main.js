$(document).ready(function () {
	$('#item-list').bind('pagebeforeshow', function() {
		$('.content-list').listview('refresh');
	});

	$('.type-container > a').on('click', function() {
		//Fill item-list
		loadListContent(this);
		
	});		
});

function loadListContent(anchor) {
	var type = $(anchor).attr('data-type');
	
	var data = retrieveDataByType(type);

	//Clear list
	$('.content-list').empty();
	
	//Append data
	$.each(data, function(index, element) {
		var listItem = '<li><a id="' + element.id + '"  data-type="' + element.type + '" href="#detail-page"><img class="ui-li-thumb" src="img/' + element.img + '">' + element.name + '</a></li>';
		$('.content-list').append(listItem);
	});	
	
	attachListeners();	
}

function attachListeners() {
	$('.content-list > li > a').on('click', function() {
		var id = parseInt($(this).attr('id'));
		var type = $(this).attr('data-type');
		var itemDescription = $('#item-description');
		var data = retrieveDataByType(type);
		var object = $.grep(data, function(e){ return e.id == id; });
		if (object) {
			loadDetailPage(object[0]);
		}
	});
}

function loadDetailPage(item) {
	$('#item-title').text(item.name);
	$('#item-description').text(item.description);
	
	$('#item-img-container').empty();
	$('#item-img-container').append('<img style="border-style: groove;" src="img/' + item.img + '" height="150" height="150">');
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
        addMore(activePage);
    }
}

function addMore(page) {
	$(document).off("scrollstop");
	
	$.mobile.loading("show" , {
		text: "Loading more elements...",
		textvisible: true
	});
	
	setTimeout(function() {
		var items = '';
		var last = $("li" , page).length;
		var cont = last + 5;
		
		for (var i = last; i < cont; i++) {
			items += '<li><a id="' + (9000+i) + '"  data-type="unknown" href="#detail-page"><img class="ui-li-thumb" src="img/no-img.jpg">Element' + i + ' after scroll.</a></li>';
		}
		$(".content-list").append(items).listview('refresh');
		$.mobile.loading("hide");
		$(document).on("scrollstop", checkScroll);
	}, 500);
}

function retrieveDataByType(type) {
	var data;
	switch(type) {
		case 'movie':
			data = moviesData;
			break;
		case 'tv-show':
			data = showsData;
			break;
		case 'cartoon':
			data = cartoonsData;
			break;
		default:
			data = [];
			break;
	}
	return data;
}

$(document).on("scrollstop", checkScroll);


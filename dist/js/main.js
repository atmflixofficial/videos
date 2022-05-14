var edit_link = 'https://video.portal.irahulsaini.com/wp-admin/post.php?post=';
var is_admin = getCookie('is_admin');
var pagination_config = {
	per_page: per_page,
	range: 2,
	first: true,
	last: true,
	full_tag_open: '<ul class="pagination justify-content-center">',
	full_tag_close: '</ul>',
	num_tag_open: '<li class="page-item">',
	num_tag_close: '</li>',
	first_link: '<i class="fa fa-angle-double-left"></i>',
	last_link: '<i class="fa fa-angle-double-right"></i>',
	prev_link: '<i class="fa fa-angle-left"></i>',
	next_link: '<i class="fa fa-angle-right"></i>',
	first_tag_open: '<li class="page-item">',
	first_tag_close: '</li>',
	last_tag_open: '<li class="page-item">',
	last_tag_close: '</li>',
	next_tag_open: '<li class="page-item">',
	next_tag_close: '</li>',
	prev_tag_open: '<li class="page-item">',
	prev_tag_close: '</li>',
	curr_tag_open: '<li class="page-item active"><a href="javascript:void(0)" class="page-link" ">',
	curr_tag_close: '</a></li>'
}
window.addEventListener('load', function () {
	if (check_pwd() == false) {
		$('.site-wrapper').html('<h3 class="text-center my-3">Please Complete Password Verification</h3>')
		return false
	}
})
$('.current_url').val(window.location.href);
$('.contact-form').submit(function (e) {
	e.preventDefault();
	var form = $(this);
	var $btn = $('.btn-submit', form);
	var btn_val = $btn.html();
	var $response = $('.response', form);
	$response.html('<i class="fa fa-sync fa-spin"></i>');
	$btn.attr('disabled', 1);
	$.ajax({
		url: 'https://api.weforit.com/insert?type=lead',
		data: $(this).serializeArray(),
		type: 'post',
		success: function (r) {
			if (r.status == 'success') {
				$response.html('<div class="alert alert-success mt-2">Thank You! Your Message has been Sent.</div>')
				$btn.html(btn_val);
			} else {
				$response.html('<div class="alert alert-danger">' + r.message + '</div>');
				$btn.removeAttr('disabled').html(btn_val);
			}
		},
		error: function () {
			$response.html('<div class="alert alert-danger mt-2">Unable to Connect Server, Please try again later</div>')
			$btn.removeAttr('disabled');
		}
	})
});

function param(name) {
	return (location.search.split(name + '=')[1] || '').split('&')[0];
}

function url2param(url){
	var param = {};
	if(!url){
		return param;
	}
	url = url.split('?');
	if(!url[1]){
		return param;
	}
	url = url[1].split('&');
	if(url && url.length >0 ){
		for(i=0;i<url.length;i++){
			var p = url[i].split('=');	
			param[p[0]] = p[1];
		}
		return param;
	}
	return param;
}

function pagination(total, page, page_url, per_page) {
	var config = pagination_config,
		start = 1,
		end = '',
		active = '',
		next = '',
		previous = '',
		params = {};
	if (!total)
		return '';

	if(!page_url){
		page_url = window.location.href;
	}
	params = url2param(window.location.href);
	if (!per_page || per_page == 'undefined') {
		per_page = config.per_page;
	}

	if (per_page > total)
		return '';

	if (!page || page < 1)
		page = 1;

	total_page = Math.ceil(total / per_page);

	start = page - config.range;
	end = parseInt(page) + parseInt(config.range);

	if (start < 1)
		start = 1;

	if (end > total_page)
		end = total_page;

	links = new Array();
	for (i = start; i <= end; i++) {
		//link = url + 'page=' + i;
		params.page = i;
		link = page_url + '?'+$.param(params);
		if (i == page) {
			links.push(config.curr_tag_open + i + config.curr_tag_close);
		} else {
			links.push(config.num_tag_open + '<a class="page-link" href="' + link + '">' + i + '</a>' + config.num_tag_close);
		}
		link = '';
	}
	if (page < total_page) {
		var n = parseInt(page) + parseInt(1);
		params.page = n;
		url = page_url + '?'+$.param(params);
		var link = '<a class="page-link" href="' + url + '">' + config.next_link + '</a>';
		next = config.next_tag_open + link + config.next_tag_close;
	}
	if (page > 1) {
		var n = parseInt(page) - parseInt(1);
		params.page = n;
		url = page_url + '?'+$.param(params);
		var link = '<a class="page-link" href="' + url +'">' + config.prev_link + '</a>';
		previous = config.prev_tag_open + link + config.prev_tag_close;
	}

	if (config.last === true && page < total_page) {
		params.page = total_page;
		url = page_url + '?'+$.param(params);
		var link = '<a class="page-link" href="' + url + '">' + config.last_link + '</a>';
		last = config.last_tag_open + link + config.last_tag_close;
	} else {
		last = '';
	}
	if (config.first === true && page > 1) {
		params.page = 1;
		url = page_url + '?'+$.param(params);
		var link = '<a class="page-link" href="' + url + '">' + config.first_link + '</a>';
		first = config.first_tag_open + link + config.first_tag_close;
	} else {
		first = '';
	}
	links = config.full_tag_open + first + previous + "\n" + links.join("\n") + "\n" + next + last + config.full_tag_close;
	return links;
}

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function getGet(p) {
	var url = new URL(window.location.href);
	var q = url.searchParams.get(p);
	return q == null ? '' : q;
}

function get_post(id) {
	if (!id || id == '') {
		id = getGet('v');
	}
	if (!id || id == '') {
		window.location.href = '/video-not-found';
	}
	var api_url = api_base + 'posts/' + id + '?_embed';
	$.get(api_url, function (d) {
		console.log(d)
		if (!d || !d.id) {
			window.location.href = '/video-not-found';
		}
		var player = 0;
		var title = d.title.rendered;
		var desc = d.content.rendered;
		var embed = d.metadata.embed;
		var play = d.metadata.play;
		var thumb = d._embedded['wp:featuredmedia'][0].source_url;
		var cat = d.categories;
		var video = '';
		document.title = title + '- Atmflix';
		if (embed) {
			video += '<div class="embed">' + embed + '</div>';
		} else if (play) {
			video += '<div class="atmplayer"><video data-poster="' + thumb + '" id="player" controls crossorigin playsinline> <source src="' + play + '" type="video/mp4"><a href="' + play + '" download>Download</a> </video></div>';
			player = 1;
		}
		if (!desc || desc == '') {
			desc = 'For Latest Update, Please join us on WhatsApp and Telegram Channel';
		}
		if (is_admin == 1) {
			title += '<a href="' + edit_link + d.id + '&action=edit" target="_blank" class="ms-3 edit-post-single edit-post"><i class="far fa-edit"></i></a>'
		}
		//hide current post anywhere in page
		video += '<style>.v' + d.id + '{display:none!important}</style>';
		$('#video_play').html(video);
		$('#video-title').html(title);
		$('#desc').html(desc);
		if (cat.length > 0) {
			get_posts('#related_posts', {
				'category': cat[Math.floor(Math.random() * cat.length)],
				'per_page': 16,
				'cols': 4,
				'order': 'DESC',
				'orderby': 'date'
			});
		}
		if (player == 1) {
			const player = new Plyr('#player', {
				'ratio': '16:9'
			});
		}

	}).fail(function () {
		window.location.href = '/video-not-found';
	})

}
function fetch_category_data(callback){


	var api_url = api_base;
	api_url += 'categories/' + '?_embed&per_page=100';
	$.ajax({
		url: api_url,
		type: 'get',
		dataType: 'json',
		success: function (d, s, r) {
			var total = r.getResponseHeader('X-WP-Total');
			if (d.length > 0) {
				var rows = d;
				var cats = [];
				$.each(rows, function (k, v) {
					if (v.count > 0) {
						var cat = {
							'name' : v.name,
							'thumb': v.description,
							'count': v.count,
						};
						cats.push(cat)
					}

				});
				if(callback){
					callback()
				}
			}
		}
	});

}
function get_categories(output, opt) {
	var perpage = per_page,
		page = 1,
		category = '',
		nav = false,
		cols = 4,
		order = '';
	if (opt.per_page > 0) {
		perpage = opt.per_page;
	}
	if (opt.page > 1) {
		page = opt.page;
	} else {
		page = getGet('page') > 1 ? getGet('page') : 1;
	}
	if (opt.query && opt.query.length > 0) {
		query = opt.query;
	}
	if (opt.category) {
		category = opt.category;
	}
	if (opt.nav === true) {
		nav = true;
	}
	if (opt.cols > 0) {
		cols = opt.cols;
	}

	var api_url = api_base;
	api_url += 'categories/' + '?_embed&per_page=' + perpage + '&page=' + page;
	$.ajax({
		url: api_url,
		type: 'get',
		dataType: 'json',
		success: function (d, s, r) {
			var total = r.getResponseHeader('X-WP-Total');
			if (d.length > 0) {
				var rows = d;
				var html = '<div class="row">';
				$.each(rows, function (k, v) {
					if (v.count > 0) {
						html += output_category(v, cols);
					}

				});
				html += '</div>';

				if (nav === true) {
					html += pagination(total, page, app_url + 'p/categories.html?', perpage);
				}

				$(output).html(html);
			} else {
				$(output).html('No data found')
			}
		},
		error: function () {
			$(output).html('failed to load data, please refresh page and try again')
		}
	});
}

function get_posts(output, opt, callback) {
	// /wp-json/wp/v2/posts?filter[meta_key]=duration&filter[orderby]=meta_value_num&order=asc
	var params = {},
		perpage = per_page,
		page = 1,
		query = '',
		category = '',
		nav = false,
		cols = 4,
		order = '',
		orderby = '';
	if (opt.per_page > 0) {
		perpage = opt.per_page;
	}
	if (opt.page > 1) {
		page = opt.page;
	}
	if (opt.query && opt.query.length > 0) {
		query = opt.query;
	}
	if (opt.category) {
		category = opt.category;
	}
	if (opt.nav === true) {
		nav = true;
	}
	if (opt.cols > 0) {
		cols = opt.cols;
	}
	if(opt.order){
		order = opt.order;
	}
	if(opt.orderby){
		orderby = opt.orderby;
	}
	params['per_page'] = perpage;
	params['page'] = page;
	if (order && orderby) {
		if(orderby == 'duration'){
			params['filter[meta_key]'] = 'duration';
			params['filter[orderby]'] = 'meta_value_num';
		}else{
			params['filter[orderby]'] = orderby;
		}
		params['order'] = order;	
		//order = '&filter[orderby]=' + orderby + '&order=' + order;
	}
	var api_url = api_base;
	if (query) {
		params['search'] = query;
		//api_url += 'search/' + '?_embed&per_page=' + perpage + '&page=' + page + '&search=' + query + order;
		api_url += 'search/';
	} else {
		api_url += 'posts/';
		//api_url += 'posts/' + '?_embed&per_page=' + perpage + '&page=' + page;
	}
	if (category) {
		params['categories'] = category;
		//api_url += '&categories=' + category;
	}
	api_url = api_url + '?' + $.param(params) + '&_embed';
	$.ajax({
		url: api_url,
		type: 'get',
		dataType: 'json',
		success: function (d, s, r) {
			var total = r.getResponseHeader('X-WP-Total');
			if (d.length > 0) {
				var rows = d;
				var html = '<div class="row g-0">';
				$.each(rows, function (k, v) {
					if (query) {
						html += output_post(v._embedded.self[0], cols);
					} else {
						html += output_post(v, cols);
					}

				});
				html += '</div>';

				if (nav === true) {
					if (category) {
						html += pagination(total, page, 'p/categories.html', per_page);
					} else {
						html += pagination(total, page, app_url + 'p/videos.html', per_page);
					}

				}
				if (callback) {
					callback({
						'total': total
					});
				}
				$(output).html(html);
			} else {
				$(output).html('No data found')
			}
		},
		error: function () {
			$(output).html('failed to load data, please refresh page and try again')
		}
	});

}

function output_thumbs(t) {
	if (!t || t == '') {
		return '';
	}
	var t = t.split(';');
	var th = [];
	for (i = 0; i < t.length; i++) {
		if (i == 0) {
			th.push('<img class="featured" src="' + t[i] + '"/>');
		} else {
			th.push('<img src="' + t[i] + '"/>');
		}
	}
	return th.join('');
}

function sec2hour(s) {
	return new Date(s * 1000).toISOString().substr(11, 8);

}


function output_post(v, cols) {
	var thumb = '',
		duration = 0;
	if (v.metadata && v.metadata.thumbs) {
		thumb = v.metadata.thumbs[0];
	}
	if (v.metadata && v.metadata.duration) {
		duration = v.metadata.duration[0];
	}
	if (!cols || cols == '' || cols == '0' || cols == 0) {
		cols = 4;
	}
	var col = 'col-6 col-sm-6 col-md-5 col-lg-2';
	if (cols == 1) {
		col = 'col-12';
	} else if (cols == 2) {
		col = 'col-6';
	} else if (cols == 3) {
		col = 'col-6 col-md-4';
	} else if (cols == 4) {
		col = 'col-6 col-sm-6 col-md-3';
	} else if (cols == 6) {
		col = 'col-6 col-sm-6 col-md-3 col-lg-2';
	}
	var html = '<div class="' + col + ' video-item-col v' + v.id + '"><a href="' + edit_link + v.id + '&action=edit" data-id="' + v.id + '" target="_blank" class=" edit-post"><i class="far fa-edit"></i></a><a href="/p/watch.html?v=' + v.id + '" class="video-list-item" title="' + v.title.rendered + '">';
	html += '<div class="image">' + output_thumbs(thumb) + '<div class="video-meta"><span class="duration"><i class="fa fa-clock me-1"></i>' + sec2hour(duration) + '</span></div></div>';
	html += '<div class="title" >' + v.title.rendered + '</div>';
	html += '</a></div>';
	return html;
}

function output_category(v, cols) {
	var thumb = '',
		count = 0;
	if (v.description) {
		thumb = v.description;
	}
	if (v.count) {
		count = v.count;
	}
	if (!cols || cols == '' || cols == '0' || cols == 0) {
		cols = 4;
	}
	var col = 'col-6 col-sm-6 col-md-5 col-lg-2';
	if (cols == 1) {
		col = 'col-12';
	} else if (cols == 2) {
		col = 'col-6';
	} else if (cols == 3) {
		col = 'col-6 col-md-4';
	} else if (cols == 4) {
		col = 'col-6 col-sm-6 col-md-3';
	} else if (cols == 6) {
		col = 'col-6 col-sm-6 col-md-3 col-lg-2';
	}
	var html = '<div class="' + col + ' category-item-col pb-3 category_' + v.id + '"><div class="category-item"><a href="/p/category.html?name=' + v.slug + '">';
	html += '<div class="category-meta"><span class="title">' + v.name + '</span> <span class="count">' + count + ' Videos</span></div>';
	if (thumb) {
		html += '<img src="' + thumb + '"/>';
	}
	html += '</a></div></div>';
	return html;
}
var pwd_modal = new bootstrap.Modal(document.getElementById('modal_password'), {})

function check_pwd() {
	var c = getCookie('password');
	if (c != 1 || c != '1') {
		pwd_modal.show();
		return false;
	}
	//if admin password then show edit icon
	//var is_admin = getCookie('is_admin');
	if (is_admin == 1 || is_admin == '1') {
		$('head').append('<style>.edit-post{display:inline-block;}</style>');
	}

	return true;
}
$('#password_confirm').submit(function (e) {
	e.preventDefault();
	var pwd = $('#get_pwd').val();
	if (pwd == 'atmflix' || pwd == 'admin@control') {
		setCookie('password', 1, 0.3);
		pwd_modal.hide();
		if (pwd == 'control@admin#portal') {
			setCookie('is_admin', 1, 1);
		}
		window.location.href = window.location.href;

		return true;
	}
	$('#modal_password .password-error').show();


});
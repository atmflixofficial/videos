$('.current_url').val(window.location.href);
$('.contact-form').submit(function(e){
	e.preventDefault();
	var form = $(this);
	var $btn = $('.btn-submit',form);
	var btn_val = $btn.html();
	var $response = $('.response',form);
	$response.html('<i class="fa fa-sync fa-spin"></i>');
	$btn.attr('disabled',1);
	$.ajax({
		url:base_url+'/api/contact',
		data:$(this).serializeArray(),
		type:'post',
		success:function(r){
			if(r == 1){
				$response.html('<div class="alert alert-success mt-2">Thank You! Your Message has been Sent.</div>')
				window.location = base_url + '/thank-you/';
			}else{
				if(r){
					$response.html('<div class="alert alert-danger mt-2"><strong>Error: </strong>'+r+'</div>')
				}else{
					$response.html('<div class="alert alert-danger mt-2">Unable to Send Message, Please try again later</div>')
				}
				
				$btn.removeAttr('disabled');
			}
		},
		error:function(){
			$response.html('<div class="alert alert-danger mt-2">Unable to Connect Server, Please try again later</div>')
			$btn.removeAttr('disabled');
		}
	})
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
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

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}
function getGet(p){
	var url = new URL(window.location.href);
	var q = url.searchParams.get(p);
	return q==null?'':q;
}
function get_posts(output){
	if(page == null || !page){
		page = 1;
	}
	if(check_pwd() == false){
		$(output).html('<h1 class="text-center my-3">Please Complete Password Verification</h1>')
		return false
	}

	var api_url = api_base;
	if(query){
		api_url += 'search/'+'?_embed&per_page='+per_page+'&category='+category+'&page='+page+'&search='+query;
	}else{
		api_url += 'posts/'+'?_embed&per_page='+per_page+'&category='+category+'&page='+page;
	}
	$.get(api_url,function(d){
		
		if(d.length > 0){
			var rows = d;
			var html = '<div class="row">';
			$.each(rows,function(k,v){
				if(query){
					html += output_post(v._embedded.self[0]);	
				}else{
					html += output_post(v);
				}
				
			});
			html += '</div>';
			$(output).html(html);
		}
	});

}

function output_thumbs(t){
	if(!t || t==''){
		return '';
	}
	var t = t.split(';');
	var th = [];
	for(i=0;i<t.length;i++){
		if(i==0){
			th.push('<img class="featured" src="'+t[i]+'"/>');
		}else{
			th.push('<img src="'+t[i]+'"/>');	
		}
	}
	return th.join('');
}

function sec2hour(s){
	return new Date(s * 1000).toISOString().substr(11, 8);

}	


function output_post(v){
	var thumb='',duration=0;
	if(v.metadata && v.metadata.thumbs){
		thumb = v.metadata.thumbs[0];
	}
	if(v.metadata && v.metadata.duration){
		duration = v.metadata.duration[0];
	}
	var html = '<div class="col-6 col-sm-6 col-md-4 col-lg-2 pe-2 pb-4"><a href="/p/watch.html?v='+v.id+'" class="video-list-item" title="'+v.title.rendered+'">';
	html += '<div class="image">'+output_thumbs(thumb)+'<div class="video-meta"><span class="duration"><i class="fa fa-clock me-1"></i>'+sec2hour(duration)+'</span></div></div>';
	html += '<div class="title" >'+v.title.rendered+'</div>';
	html += '</a></div>';
	return html;
}	
var pwd_modal = new bootstrap.Modal(document.getElementById('modal_password'), {})

function check_pwd(){
	if(getCookie('password') != 1 || getCookie('password') != '1'){
		pwd_modal.show();
		return false;
	}
	return true;
}
$('#password_confirm').submit(function(e){
	e.preventDefault();
	if($('#get_pwd').val() == 'fuck'){
		setCookie('password',1,24);
		pwd_modal.hide();

		window.location.href = window.location.href;
		return true;
	}
	$('#modal_password .password-error').show();

	
})
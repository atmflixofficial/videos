var playing = '';
var salt = '123';
var is_admin = false;


window.addEventListener('load', function () {
    if (check_pwd() == false) {
        $('.content-wrapper').html('<h3 class="text-center my-3">Please Complete Password Verification</h3>')
        return false
    }
});
init_videos();

$('.navbar-toggler').on('click',function(e){
    e.preventDefault();
    $('.navbar-collapse').toggleClass('active')
})
$('.sidebar-toggler').on('click',function(e){
    e.preventDefault();
    $('.sidebar').toggleClass('active')
})
$('.search-toggler').on('click',function(e){
    e.preventDefault();
    $('.mobile-search').toggleClass('active')
})

$('#password_confirm').submit(function (e) {
    e.preventDefault();
    var pwd = $('#get_pwd').val(), ap = 'admin@control';
    if (pwd == 'atmflix'+'@'+salt || pwd == ap) {
        setCookie('password', 1, 0.3);
        pwd_modal.hide();
        if (pwd == ap) {
            setCookie('is_admin', 1, 1);
        }
        window.location.href = window.location.href;

        return true;
    }
    $('#modal_password .password-error').show();


});
function get(name) {
  return (location.search.split(name + '=')[1] || '').split('&')[0];
}
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
var count = 0;
if(categories.length > 0){
    $(shuffle(categories)).each(function(k,v){
        if(count == 5){
            return true;
        }
        var item = '<div class="d-flex align-items-center mb-2"><div class="image"><img src="https://atmreel.b-cdn.net/images/thumbs/'+v.name+'.jpg"/></div><div class="content w-100 mx-2"><div class="name fw-bold">'+v.name+'</div><div class="small text-muted">'+v.count+' vClips</div></div><div class="link"><a href="'+v.url+'" class="btn btn-primary btn-sm">Explore</a></div></div>';
        $('#explore .item_list').append(item);
        count++;
    });
}
$(shuffle(trendings)).each(function(k,v){
    var item = '<div class="d-flex align-items-center mb-2"><div class="image"><img src="'+v.image+'"/></div><div class="content w-100 mx-2"><div class="name">'+v.title+'</div></div><div class="link"><a href="'+v.url+'" class="btn btn-primary btn-sm rounded-circle"><i class="fa fa-play-circle"></i></a></div></div>';
    $('#trending .item_list').append(item);
    count++;
});
function explore_categories(){
    var html = '';
    $(shuffle(categories)).each(function(k,v){
        var item = '<div class="col-md-6 pb-2"><div class="p-1 d-flex align-items-center h-100 border"><div class="image"><img src="https://atmreel.b-cdn.net/images/thumbs/'+v.name+'.jpg"/></div><div class="content w-100 mx-2"><div class="name fw-bold">'+v.name+'</div><div class="small text-muted">'+v.count+' vClips</div></div><div class="link"><a href="'+v.url+'" class="btn btn-primary btn-sm">Explore</a></div></div></div>';
        html += item;
        count++;
    });
    return html;
}
function related_post(){
    if(post_category.length < 1){
        $('#category_info .item_list').html('We don\'t have some more data in this category. Please come back and check again!')
        return false;
    }
    
    $(shuffle(post_category)).each(function(i,d){
        $('#category_info h6').css('backgroundImage','url("https://atmreel.b-cdn.net/images/thumbs/'+d+'.jpg")');
        $('#category_info h6 span').append(' in '+d)
        $.get('/feeds/posts/default/-/'+encodeURI(d)+'?alt=json',function(response){
            var posts = response.feed.entry;
            $('#category_info .item_list').html(' ');
            $(shuffle(posts)).each(function(k,v){
                var html = $(v.content['$t']);
                var title = v.title['$t'];
                var $div = $('<div></div>');
                $div.html(html);
                var image = $('img',$div,0).attr('src');
                
                var link = v.link[4].href;
                var item = '<div class="d-flex align-items-center mb-2"><div class="image" style="min-width:80px"><img style="min-width:80px" class="w-100 rounded-0" src="'+image+'"/></div><div class="content w-100 mx-2"><div class="name">'+title+'</div></div><div class="link"><a href="'+link+'" class="btn btn-primary btn-sm rounded-circle"><i class="fa fa-play-circle"></i></a></div></div>';
                $('#category_info .item_list').append(item);
                if(k === 5){
                    $('#category_info .item_list').append('<div class="text-center mt-3"><a class="btn btn-sm btn-primary" href="/search/label/'+d+'">View More</a></div>');
                    return false;
                }
            })
            
        })
        return false;
    });
}
$(document).ready(function(){
    var query = get('q');
    if(query){
        $('[name="q"]').val(decodeURI(query.replace(/\+/g,' ')));
    }
    $.appear('.btn-load-more');
    $('.btn-load-more').on('appear',function(e,$a){
        $(this).trigger('click')
    }) 
})
$('#index .btn-load-more').on('click',function(e){
    e.preventDefault();
    var href = $(this).attr('href');
    var $loader = $(this);
    var loader_value = $loader.html();
    $loader.attr('disabled',1).html('Loading...').addClass('disabled');
    
    $.ajax({
        url:href,
        type:'get',
        success:function(response){
            if(!response){
                return;
            }
            var data = $('#main .videos-row',$(response)).html();

            $('#main .videos-row').append(data);
            init_videos();
            href = $('#index .btn-load-more',$(response)).attr('href');
            if(href == 'javascript:void(0)'){
                $($loader.parent()).html('That\'s all we have!')
            }
            $loader.removeAttr('disabled').html(loader_value).removeClass('disabled').attr('href',href)
            
        }
    })
});
function init_videos(){
    $('.video-item-col').each(function(k,v){
        var img = $('img',v).attr('src');
        var duration = $('img',v).attr('data-duration');
        var vid_src = $('img',v).attr('data-video');;
        var video = '<video muted="muted" loop="loop"><source data-src="'+vid_src+'" type="video/mp4"/></video>';
        $('.image',v).html(video+'<img class="featured" src="'+img+'"><div class="video-meta"><span class="duration"><i class="fa fa-clock me-1"></i>'+sec2hour(duration)+'</span></div>');
    });
    //const players = Array.from(document.querySelectorAll('.video-item-col video')).map((p) => new Plyr(p));
}

$( ".video-item-col" ).mouseover(function(){
    $('video source',this).attr('src',$('video',this).attr('data-src')).addClass('active');
    $('video',this).trigger('play');
}).mouseout(function() {
    $('video',this).trigger('stop');
    $('video source',this).attr('src','').removeClass('active');
});
function init_single_video(){
    $('.single-item').each(function(k,v){
         if($('video source',this).attr('src')){
             return true;
         }
         var src = $('.video-player img',v).attr('data-video');
         var poster = $('.video-player img',v).attr('src');
         $('.video-player',v).html('<video controls muted poster="'+poster+'" preload="metadata" loop><source type="video/mp4" src="'+src+'"/></video>');
    });
    const players = Array.from(document.querySelectorAll('.single-item video')).map((p) => new Plyr(p));
}
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
}


function sec2hour(s) {
    if(!s || s.length < 1){
        return '';
    }
    return new Date(s * 1000).toISOString().substr(11, 8);
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
var pwd_modal = new bootstrap.Modal(document.getElementById('modal_password'), {})

function check_pwd() {
    //return true;
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
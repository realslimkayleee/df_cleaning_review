(function(window, document){"use strict";// app url
var original_data = {};
var data_storage = {};
var data_bio = {};
var last_key = {};
var current_position = {};
var $grid;

var originalFetch =
  typeof window.fetch === 'function' &&
  /\[native code\]/.test(Function.prototype.toString.call(window.fetch))
    ? window.fetch.bind(window)
    : getNativeFetch();

var env_urls = skGetEnvironmentUrls('instagram-feed');
var app_url = env_urls.app_url;
var app_backend_url = env_urls.app_backend_url;
var app_file_server_url = env_urls.app_file_server_url;
var sk_img_url = env_urls.sk_img_url;
var sk_app_url = env_urls.sk_app_url;
var sk_api_url = env_urls.sk_api_url;
// loading animation
var el = document.getElementsByClassName('sk-instagram-feed')[0];
if(el==undefined){
    var el = document.getElementsByClassName('dsm-instagram-feed')[0];
    el.className = "sk-instagram-feed";
}
var embed_id = document.getElementsByClassName("sk-instagram-feed")[0].getAttribute("data-embed-id");
el.innerHTML = "<div class='first_loading_animation' style='text-align:center; width:100%;'><img src='" + app_url + "images/ripple.svg' class='loading-img' alt='' aria-hidden='true' style='width:auto !important; float:none !important; text-align:center !important; border:none !important;' /></div>";


// load css
loadCssFile(app_url + "instagram-feed/styles.css?v=" + (new Date()).getTime());
loadCssFile(app_url + "libs/js/swiper/swiper.min.css");
loadCssFile(app_url + "libs/js/swiper/swiper.css");
loadCssFile(app_url + "libs/js/magnific-popup/magnific-popup.css");

loadCssFile("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");

function loadCssFile(filename){

    var fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);

    if(typeof fileref!="undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileref)
    }
}


/******** Load jQuery if not present *********/
// dolceriaalba = 20442/sk
if ((window.jQuery === undefined 
    || window.jQuery.fn.jquery !=='2.1.1') 
    && !window.location.href.includes('dolceriaalba')
    && !window.location.href.includes('pantheonsite')
    && !window.location.href.includes('alabamaag')
    && !window.location.href.includes('lagoo.ch')
    && !window.location.href.includes('zaferinadigital.com')
    && !window.location.href.includes('lakeshoreapartments')
    && !window.location.href.includes('littlewolfcanineacademy.com')
    && !window.location.href.includes('norwaydivemallorca.com')
    && !window.location.href.includes('dykkebazaar')
    && !window.location.href.includes('reisebazaar')
    && !window.location.href.includes('clubecnn')
) {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js");
    if (script_tag.readyState) {
        script_tag.onreadystatechange = function () { // For old versions of IE
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                scriptLoadHandler();
            }
        };
    } else {
        script_tag.onload = scriptLoadHandler;

    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    scriptLoadHandler();
}



function loadScript(url, callback){

    /* Load script from url and calls callback once it's loaded */
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", url);

    if (typeof callback !== "undefined"){
        if (scriptTag.readyState) {
        /* For old versions of IE */
            scriptTag.onreadystatechange = function(){
            if (this.readyState === 'complete' || this.readyState === 'loaded') {
                callback();
            }
        };
        } else {
            scriptTag.onload = callback;
        }
    }
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
}

function isScriptLoaded(src) {
    return jQuery('div[src="' + src + '"]').length > 0;
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {

    if (isScriptLoaded(app_url+'instagram-feed/widget.js')) {
        return;
     }

     var script_loaded_element = jQuery('<div src="'+app_url+'instagram-feed/widget.js">');
     jQuery("body").append(script_loaded_element);

    if (window.location.href.includes('lusgold')) {
        var widget_id = jQuery(".sk-instagram-feed").attr("data-embed-id");
        jQuery(".sk-instagram-feed").remove();
        jQuery('#main').prepend("<div class='sk-instagram-feed' data-embed-id='"+widget_id+"'></div>");
    }
    loadScript(app_url + "libs/js/magnific-popup/jquery.magnific-popup.js", function(){
        loadScript(app_url + "libs/js/website_test_fix.js?v=2", function(){
            loadScript(app_url + "libs/js/masonry/masonry4.2.2.min.js", function(){
                loadScript(app_url + "libs/js/swiper/swiper.min.js", function(){
                    // Restore $ and window.jQuery to their previous values and store the
                    // new jQuery in our local jQuery variable
                    //$ = jQuery = window.jQuery.noConflict(true);
                    // initialize pop up plugin
                    initManificPopupPlugin(jQuery);
                    main();
                });
            });
        });
    });
}function applyMasonry(sk_instagram_feed){
    // $grid = jQuery('.sk-ig-all-posts').masonry({ 
    //     itemSelector: '.sk-instagram-feed-item',
    //      columnWidth: '.sk-instagram-feed-item-sizer',
    //      percentPosition: true,
    //      transitionDuration: 0
    // }); 

    var embed_id = getDsmEmbedId(sk_instagram_feed);
    var $grid = $(`div[data-embed-id="${embed_id}"] .sk-ig-all-posts`);
    if ($grid.length) {
        $grid.masonry({
            itemSelector: '.sk-instagram-feed-item',
            columnWidth: '.sk-instagram-feed-item-sizer',
            percentPosition: true,
            transitionDuration: 0
        });
    }
}

function observeMasonryItems(sk_instagram_feed) {
    const embed_id = getDsmEmbedId(sk_instagram_feed);

    const host = sk_instagram_feed?.find
        ? sk_instagram_feed[0] || sk_instagram_feed // jQuery-ish
        : sk_instagram_feed;

    const wrapper =
        (host?.querySelector && host.querySelector(`div[data-embed-id="${embed_id}"] .sk-ig-all-posts`)) ||
        document.querySelector(`div[data-embed-id="${embed_id}"] .sk-ig-all-posts`);

    if (!wrapper) return;

    let msnry = null;
    function applyMasonryForWrapper() {
        if (!wrapper.isConnected) return;

        if (msnry) {
            msnry.reloadItems();
            msnry.layout();
            return;
        }

        msnry = new Masonry(wrapper, {
            itemSelector: '.sk-instagram-feed-item',
            columnWidth: '.sk-instagram-feed-item-sizer',
            percentPosition: true,
            transitionDuration: 0
        });
    }

    let resizeTimeout;
    const debounceRealign = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            applyMasonryForWrapper();
        }, 100);
    };

    const resizeObserver = new ResizeObserver(debounceRealign);
    const observed = new WeakSet();

    const observeItems = () => {
        if (!wrapper.isConnected) return;
            wrapper.querySelectorAll('.sk-instagram-feed-item').forEach(item => {
            if (!observed.has(item)) {
                observed.add(item);
                resizeObserver.observe(item);
            }
        });
    };
    observeItems();
    applyMasonryForWrapper();

    const mutationObserver = new MutationObserver(() => {
        if (!wrapper.isConnected) {
            cleanup();
            return;
        }
        observeItems();
        debounceRealign();
    });
    mutationObserver.observe(wrapper, { childList: true, subtree: true });

    const removalObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.removedNodes) {
                if (node === wrapper || (node.nodeType === 1 && node.contains(wrapper))) {
                    cleanup();
                    return;
                }
            }
        }
    });

    if (wrapper.parentNode) {
        removalObserver.observe(wrapper.parentNode, { childList: true });
    }

    function cleanup() {
        clearTimeout(resizeTimeout);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        removalObserver.disconnect();
    }
}
  
function fixMasonry(){
    for(var i = 0; i <= 20; i++){
        setTimeout(function() { applyMasonry(); }, 500*i);
    }
 }

function abbreviateNumber(number) {
    
    var decimal_places = Math.pow(10, 1);
    var abreviation = ["K", "M", "B"];

    for (var i = abreviation.length - 1; i >= 0; i--) {
        var size = Math.pow(10, (i + 1) * 3);
        if (size <= number) {
            var number = Math.round(number * decimal_places / size) / decimal_places;
            if((number == 1000) && (i < abreviation.length - 1)) {
                number = 1;
                i++;
            }
            number += abreviation[i];
            break;
        }
    }
    return number;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function formatLikes(num) {
  if (num >= 1_000_000) {
    return Math.floor(num / 1_000_000) + "M";
  } else if (num >= 10_000) {
    return Math.floor(num / 1_000) + "K";
  }
  return num.toString();
}

function getDsmEmbedId(sk_instagram_feed){
    var embed_id = sk_instagram_feed.attr('embed-id');
    if(embed_id==undefined){ embed_id = sk_instagram_feed.attr('data-embed-id'); }
    return embed_id;
}

function getDsmSetting(sk_instagram_feed, key){
    return sk_instagram_feed.find("." + key).text();
}


function replaceContentWithLinks (html) {
    if(html.hasClass("linked")){
        return;
    }
    html.addClass("linked");

    var text = html.html();
    if(text){

        text = text.replace(/(\r\n|\n\r|\r|\n)/g, " <br> ");
        text = text.replace('#',' #');
        text = text.replace('>@','> @');
        var splitted_text = text.split(' ');
        if(splitted_text && splitted_text.length > 0){
            jQuery.each(splitted_text,function(key, value){
                
                if(value.charAt(0) == "#"){
                    var original_text = value.replace('#','');
                    text = text.replace(' '+value,' <a target="_blank" href="https://instagram.com/explore/tags/'+original_text+'">'+value+'</a>');
                }
                else if(value.length == 1){
                    // do not convert
                }
                else if(value.charAt(0) == "@"){
                    var original_text = value.replace('@','');
                    if(original_text == "djsammy86"){
                        text = text.replace(' '+value,' <a target="_blank" href="https://twitter.com/'+original_text+'">'+value+'</a>');
                    }
                    else if(value.includes('!')){
                        value = value.replace('!','');
                        original_text = original_text.replace('!','');
                        text = text.replace(' '+value,' <a target="_blank" href="https://instagram.com/'+original_text+'">'+value+'</a>');
                    }
                    else{
                        text = text.replace(' '+value,' <a target="_blank" href="https://instagram.com/'+original_text+'">'+value+'</a>');
                    }
                    
                }
                else if(value.indexOf('www') != -1 && value.indexOf('href') == -1 && value.indexOf('src') == -1){
                    var original_text = value.replace('@','');
                    text = text.replace(' '+value,' <a target="_blank" href="'+original_text+'">'+original_text+'</a>');
                }
                else if(value.indexOf('https') != -1 && value.indexOf('href') == -1 && value.indexOf('src') == -1){
                    var original_text = value.replace('@','');
                    text = text.replace(' '+value,' <a target="_blank" href="'+original_text+'">'+original_text+'</a>');
                }
            });
        }
        html.html(text);
    }
}

function openLinkTab(sk_instagram_feed){
    var container = sk_instagram_feed && sk_instagram_feed.length
        ? sk_instagram_feed
        : jQuery('.sk-instagram-feed').first();
    var open_link = container.find('.open_link_in_new_tab').text() == 1 ? "_blank" : "_parent";
    return open_link;
}


function readFreshContent(clicked_element){

    var code = clicked_element.attr('data-code');
    var data_type = clicked_element.attr('data-type');
    var video_url = clicked_element.attr('video-url');

    if(jQuery(document).width() > 700){
        var sk_loading_image_height = jQuery('.ig_media').height();
        console.log(sk_loading_image_height)
        
        jQuery('.sk_popup_column').height(sk_loading_image_height);
    }

    if(!code || code == "" || code.length < 1){
        return 0;
    }
    var sk_instagram_feed=jQuery('.sk-instagram-feed');
    var embed_id = getDsmEmbedId(sk_instagram_feed);
    var feed_item_container = jQuery('.sk-media-post-container-'+code).find('.sk_popup_column_media');
    var read_one_url=app_url + "embed/instagram-feed/widget_read_one_json.php?code=" + code+"&embed_id="+embed_id;
    if(feed_item_container.hasClass('data-loaded')){
        initializeSwiperSingleSLider();
        return;
    }
      
    if(feed_item_container.find('.swiper-container').length == 0){
        var thumbnail_src = feed_item_container.find('.sk-image-sizer').attr('src');
        var video_thumbnail_src = clicked_element.find('.sk-img-sizer').attr('src');
        var post_items="<div class='sk_loading_image' style='height:100%;'>";

        
        if(data_type == 'video' && video_url && !video_url.includes('.jpg')){
            if(video_url!=""){ 
                if (thumbnail_src && thumbnail_src != undefined && thumbnail_src != null) {
                    post_items += `
                        <div class="sk-thumb-wrapper" style="position:relative; display:block; width:100%; height: 100%;">
                            <img src="${thumbnail_src}" class="ig_media sk-img-preloader"
                                alt="Video thumbnail for Instagram post"
                                style="height:auto; vertical-align:middle; object-fit:contain; width:100%;">

                            <a href="https://www.instagram.com/p/${code}" target="_blank" aria-label="Play video on Instagram (opens in a new tab)" rel="noopener noreferrer">
                                <i class="fa fa-play-circle sk-play-btn"
                                style="display:none; position:absolute; top:50%; left:50%;
                                        transform:translate(-50%, -50%); font-size:64px;
                                        color:white; opacity:0.85; cursor:pointer; z-index:10;">
                                </i>
                            </a>
                        </div>
                    `;
                }
                post_items+="<p class='sk-loader' style='font-size:90px;'><i class='fa fa-spinner fa-pulse' aria-hidden='true'></i></p>";
                post_items+="<video class='ig_media sk-ig-video' style='width:100%; height: 100%; display:none;' poster='"+thumbnail_src+"' controls>";
                    post_items+="<source src='" + video_url + "' type='video/mp4'>";
                    post_items+="Your browser does not support HTML5 video.";
                post_items+="</video>";
            }
        }
        else{ 
            if(clicked_element.find(".sk-ig-icon.sk-ig-icon--carousel").length > 0) {
                post_items += "<a data-toggle='tooltip' data-placement='top' title='View on Instagram' aria-label='View carousel on Instagram (opens in a new tab)' class='sk-ig-icon sk-ig-icon--carousel sk-ig-icon-popup' target='_blank' rel='noopener noreferrer' href='https://www.instagram.com/p/" + code + "'><i class='fa fa fa-files-o' aria-hidden='true'></i></a>";
            } 
            else if (clicked_element.find(".sk-ig-icon.sk-ig-icon--video").length > 0 && getDsmSetting(sk_instagram_feed, "show_play_icon") == 1) {
                post_items += `<a data-toggle='tooltip' data-placement='top' title='View on Instagram' aria-label="View video on Instagram (opens in a new tab)" class='sk-ig-icon sk-ig-icon--video sk-ig-icon-popup' target='_blank' rel='noopener noreferrer' href='https://www.instagram.com/p/${code}'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" focusable="false">
                    <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
                    </svg>
                </a>`;
            }
            if (data_type == 'video') {
                post_items+="<img src='" + video_thumbnail_src + "' class='ig_media' alt='Video thumbnail for Instagram post' style='height:auto;    vertical-align: middle;object-fit: contain;'>";
            } else {
                post_items+="<img src='" + thumbnail_src + "' class='ig_media' alt='Instagram post image' style='height:auto;    vertical-align: middle;object-fit: contain;'>";
            }
        }
            
        post_items+="</div>";   
        feed_item_container.find('.sk-image-sizer').hide();
        feed_item_container.html(post_items);

        loadVideo();

    }
 
    
    setTimeout(function(){
        initializeSwiperSingleSLider();
    },100);
    
    feed_item_container.addClass('data-loaded');
}

async function compressedImage(sk_instagram_feed,posts){
    var new_data = [];
    for (let item of posts) {
        if (item && item.image_url) {
            await originalFetch(item.image_url)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                item.image_url = url;
                new_data.push(item);
            });
        }
        else{
            new_data.push(item);
        }
    }
    if(new_data && new_data.length){
        return new_data;
    }
    return posts;
}
function loadVideo() {
    if (jQuery('.ig_media').attr('src') == 'undefined') {
        jQuery('.sk-img-preloader').attr(
            'src',
            'https://w0.peakpx.com/wallpaper/310/869/HD-wallpaper-black-screen-space.jpg'
        );
    }

    var $video  = jQuery('.sk-ig-video');
    var $source = $video.find('source');
    var $img    = jQuery('.sk-img-preloader');
    var $loader = jQuery('.sk-loader');
    var $playBtn = jQuery('.sk-play-btn');

    let videoError = false;
    function handleError() {
        console.log('Video failed to load (expired / 403)');
        videoError = true;

        $loader.hide();
        $video.hide();
        $img.show();
        $playBtn.show();
    }


    $video.one('error', handleError);
    $source.one('error', handleError);

    if ($video[0]) $video[0].load();

    setTimeout(() => {
        $loader.hide();
        if (!videoError) {
            jQuery('.sk-loader, .sk-img-preloader, .sk-play-btn, .sk-thumb-wrapper').css({ display: 'none' });
        } else {
            $img.show();
            $playBtn.show();
        }
    }, 2000);

    if (jQuery(document).width() > 700) {
        var box_hight = jQuery('.mfp-container').height();
        var height_align = (box_hight * 7) / 100;
        jQuery('.sk-ig-video').css({ display: 'block' });
        jQuery('.sk_popup_column').css({ display: 'block' });
        jQuery('.ig_media').css({ display: 'block' });
        jQuery('.mfp-wrap').animate({ opacity: 1 }, 1000);
    }
}


function getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

function moderationTabFeature(sk_instagram_feed, setting_turnon_preapproval_posts, posts) {
    
    var preapproved_posts = "do_not_show_anything";
    var excluded_posts = "";
    var exclude_users = "";
    if (setting_turnon_preapproval_posts == 1) {
        preapproved_posts = getDsmSetting(sk_instagram_feed, "preapproved_posts");
    }

    if (getDsmSetting(sk_instagram_feed, "excluded_posts") != "") {
        excluded_posts = getDsmSetting(sk_instagram_feed, "excluded_posts");
    }
    else if (getDsmSetting(sk_instagram_feed, "exclude_users") != "") {
        exclude_users = getDsmSetting(sk_instagram_feed, "exclude_users");
    }

    var new_posts_list = [];
    for (let item of posts) {

        if (typeof item != 'undefined') {

            if (setting_turnon_preapproval_posts == 1) {
                if (preapproved_posts.indexOf(item.code) != -1) {

                    new_posts_list.push(item);
                }
            }
            else {

                if (setting_turnon_preapproval_posts == 0 && excluded_posts.indexOf(item.code) != -1) {
                  
                }
                else if (setting_turnon_preapproval_posts == 0 && exclude_users && exclude_users.indexOf(item.owner_id) != -1) {

                }
                else {
                    new_posts_list.push(item);
                }
            }


        }
    };
    if (setting_turnon_preapproval_posts == 1 && new_posts_list.length === 0) {
        new_posts_list = posts;
    }
    return new_posts_list;
}

function HashtagFilter(data_storage,hashtag){
    var new_posts_lists = [];
    hashtag = "#"+hashtag;
    jQuery.each(data_storage,function(index, value){
        if(value.pic_text_raw && value.pic_text_raw.toLowerCase().indexOf(hashtag.toLowerCase()) != -1){
            new_posts_lists.push(value);
        }
        else if(value.post_id && value.post_id.indexOf(hashtag) != -1){
            new_posts_lists.push(value);
        }
    });

    return new_posts_lists;
}

function replaceHttpToLink(content)
{
   var exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
   var element_content=content.replace(exp_match, '<a class="href_status_trigger hide-link" target="_blank" href="$1">$1</a>');
   var new_exp_match =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
   var new_content=element_content.replace(new_exp_match, '$1<a class="href_status_trigger hide-link" target="_blank" href="http://$2">$2</a>');
   return new_content;
}

function sortPostsBy(sk_instagram_feed, data) {

var order_by = getDsmSetting(sk_instagram_feed, 'order_by');

var new_posts_list = [];
    if(data){
        switch(order_by) {
            case '0':
                data.sort(function(a, b) {
                    return new Date(b.date_time_posted) - new Date(a.date_time_posted);
                });
                new_posts_list = data;
              break;
            case '1':
                const pinned = data.filter(p => Number(p.is_pinned) === 1).sort((a, b) => {
                    const aHashtags = Number(a.hashtag_count || 0);
                    const bHashtags = Number(b.hashtag_count || 0);
                    return bHashtags - aHashtags;
                });
                const unpinned = data.filter(p => !Number(p.is_pinned)).sort((a, b) => new Date(b.date_time_posted) - new Date(a.date_time_posted));
                new_posts_list = [...pinned, ...unpinned];
                break;
            default:
                data.sort(function(a, b) {
                    return new Date(b.date_time_posted) - new Date(a.date_time_posted);
                });
                new_posts_list = data;
                break;
        }
    }


return new_posts_list;
}

function changeVersion(sk_instagram_feed, posts) {
    var new_posts_list = [];

    if (!Array.isArray(posts)) {
        return [];
    }

    for (let item of posts) {
        if (typeof item !== 'undefined') {
            if (item.image_url) {
                item.image_url = updateUrl(sk_instagram_feed, item.image_url);
            }

            if (item.thumbnail_url) {
                item.thumbnail_url = updateUrl(sk_instagram_feed, item.thumbnail_url);
            }

            new_posts_list.push(item);
        }
    }

    return new_posts_list;
}

function updateUrl(sk_instagram_feed, url) {
    var widget_version = getDsmSetting(sk_instagram_feed, "widget_version");

    if (url) {
        if (url.includes('?v=')) {
            url = url.substring(0, url.indexOf('?v=')); 
            return url + "?v=" + widget_version;
        } else {
            if (url.includes('?nocache=')) {
                url = url.substring(0, url.indexOf('?nocache=')); 
                return url + "?nocache=" + (new Date()).getTime();
            }
            return url + "?nocache=" + (new Date()).getTime();
        }
    }
    return url;
}

function sortByPinned(posts) {
    const prioritized = posts
        .filter(item => item.is_pinned == 1)
        .sort((a, b) => parseInt(a.order) - parseInt(b.order));
    
    const nonPrioritized = posts.filter(item => Number(item.is_pinned) !== 1);
    return [...prioritized, ...nonPrioritized];
}



function getNativeFetch() {
  if (typeof window.fetch === 'function' &&
      /\[native code\]/.test(window.fetch.toString())) {
    return window.fetch.bind(window);
  }
  
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'about:blank';
  document.documentElement.appendChild(iframe);

  const fetch = iframe.contentWindow.fetch.bind(window);

  iframe.remove();
  return fetch;
}

function timeAgo(dateInput) {
    const now = new Date();
    const postDate = new Date(dateInput);

    const diffMs = now - postDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays >= 1) {
        return diffDays + " " + (diffDays === 1 ? "day" : "days") + " ago";
    }

    if (diffHours >= 1) {
        return diffHours + " " + (diffHours === 1 ? "hour" : "hours") + " ago";
    }

    if (diffMinutes >= 1) {
        return diffMinutes + " " + (diffMinutes === 1 ? "minute" : "minutes") + " ago";
    }

    return "just now";
}

function formatDateMMM(dateInput) {
    const date = new Date(dateInput);

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}function loadBioInformation(sk_instagram_feed, data) {

    // settings
    var show_profile_picture = sk_instagram_feed.find('.show_profile_picture').text();
    var show_profile_username = sk_instagram_feed.find('.show_profile_username').text();
    var show_profile_follow_button = sk_instagram_feed.find('.show_profile_follow_button').text();
    var show_profile_posts_count = sk_instagram_feed.find('.show_profile_posts_count').text();
    var show_profile_follower_count = sk_instagram_feed.find('.show_profile_follower_count').text();
    var show_profile_following_count = sk_instagram_feed.find('.show_profile_following_count').text();
    var show_profile_name = sk_instagram_feed.find('.show_profile_name').text();
    var show_profile_description = sk_instagram_feed.find('.show_profile_description').text();
    var show_profile_website = sk_instagram_feed.find('.show_profile_website').text();

    // text settings
    var posts_text = sk_instagram_feed.find('.posts_text').text();
    var followers_text = sk_instagram_feed.find('.followers_text').text();
    var following_text = sk_instagram_feed.find('.following_text').text();
    var follow_text = sk_instagram_feed.find('.follow_text').text();

    var media_count = data.bio.media ? formatNumber(data.bio.media) : 0;
        media_count = data.bio.posts_count ? formatNumber(data.bio.posts_count) : media_count;

    var follows_count = data.bio.follows ? formatNumber(data.bio.follows) : 0;
        follows_count = data.bio.following_count ? formatNumber(data.bio.following_count) : follows_count;

    var followed_by_number = data.bio.followed_by ? formatNumber(data.bio.followed_by) : 0;
        followed_by_number = data.bio.followers_count ? formatNumber(data.bio.followers_count) : followed_by_number;

    var post_items = "";

    if (
        show_profile_picture == 0 && show_profile_username == 0 && show_profile_follow_button == 0
        && show_profile_posts_count == 0 && show_profile_follower_count == 0 && show_profile_following_count == 0
        && show_profile_name == 0 && show_profile_description == 0 && show_profile_website == 0
    ) {
        // do not display buttons
    } else {


        var is_slider_layout = "";
        if(getDsmSetting(sk_instagram_feed,'layout') == 3){
            is_slider_layout = "sk-slider-layout-info";
        }
        post_items += "<div class='instagram-user-root-container "+is_slider_layout+"'>";
            var width = "style='width:100%;'";
            data.bio.username = data.bio.username ? data.bio.username : getDsmSetting(sk_instagram_feed,'username');
            if (show_profile_picture == 1) {
                var width = "";
                const picSrc = data.bio.user_profile;
                post_items += "<div class='sk-instagram-profile-pic_container'>";
                post_items += `
                    <img crossorigin="anonymous"
                        src="${updateUrl(sk_instagram_feed, picSrc)}"
                        alt="${htmlEntities('Profile picture for @' + (data.bio.username || 'Instagram user'))}"
                        onerror="this.onerror=null;this.src='${app_url}/images/fb-default.jpg'">
                `;
                post_items += "</div>";
            }
            post_items += "<div class='sk-ig-profile-info ' " + width + ">";
                post_items += "<div class='sk-ig-profile-info-container' " + width + ">";
                post_items += "<div class='sk_ig_feed_username_follow'>";
                if (show_profile_username == 1) {
                    post_items += "<a class='href_status_trigger' href='https://www.instagram.com/" + data.bio.username + "/' target='" + openLinkTab(sk_instagram_feed) + "'><p class='sk-ig-profile-usename' style='color:rgb(85, 85, 85);'>@" + data.bio.username;
                    if (data.bio.is_verified) {
                        post_items+="<svg class='sk-ww-is-verified' aria-label='Verified' color='rgb(0, 149, 246)' fill='rgb(0, 149, 246)' height='18' role='img' viewBox='0 0 40 40' width='18'><title>Verified</title><path d='M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z' fill-rule='evenodd'></path></svg>";
                    }
                    post_items+="</p></a>";
                }

                post_items += "</div>";

                if ((media_count != 0 && show_profile_posts_count == 1) || (followed_by_number != 0 && show_profile_follower_count == 1) || (follows_count != 0 && show_profile_following_count == 1)) {
                    post_items += "<div class='sk-ig-profile-counts'>";

                    if (media_count != 0 && show_profile_posts_count == 1) {
                        post_items += "<span class='sk-ig-profile-count-item' title='" + media_count + "'><span class='f-w-b'>" + media_count + "</span> " + posts_text + "</span>";
                    }

                    if (followed_by_number != 0 && show_profile_follower_count == 1) {
                        post_items += "<span class='sk-ig-profile-count-item' title='" + followed_by_number + "'><span class='f-w-b'>" + followed_by_number + "</span> " + followers_text + "</span>";
                    }

                    if (follows_count != 0 && show_profile_following_count == 1) {
                        post_items += "<span class='sk-ig-profile-count-item' title='" + follows_count + "'><span class='f-w-b'>" + follows_count + "</span> " + following_text + "</span>";
                    }

                    post_items += "</div>";
                }
                if (show_profile_name == 1 || show_profile_description == 1 || show_profile_website == 1 || show_profile_follow_button == 1) {
                    post_items += "<div class='sk-ig-profile-bio-container'>";
                    if (show_profile_name == 1 && data.bio.full_name) {
                        post_items += "<strong>" + data.bio.full_name + "</strong>";
                    }
                    if (show_profile_description == 1 && data.bio.biography) {
                        data.bio.biography = data.bio.biography.replace(/href="\/+/g, 'href="https://instagram.com/');
                        post_items += "<b> &bull;</b> <span class='sk-ig-profile-bio'>" + data.bio.biography + "</span>";
                    }
                    post_items += "</div>";
                    if (show_profile_website == 1 && data.bio.website_link) {
                        var display_url = data.bio.website;
                        if(data.bio.username == "tacosupply"){
                            display_url = "linktr.ee/mcdevitttacosupply";
                        }
                        post_items += `
                            <div>
                                <a class="bio-website" href="${data.bio.website_link}" target="${openLinkTab(sk_instagram_feed)}">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="15" height="15" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 bio-icon">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                    </svg>
                                    ${display_url}
                                </a>
                            </div>
                        `;
                    } else if (show_profile_website == 1 && data.bio.external_url) {
                        var display_url = data.bio.external_url;
                        if(data.bio.username == "tacosupply"){
                            display_url = "linktr.ee/mcdevitttacosupply";
                        }
                        post_items += `
                            <div>
                                <a class="bio-website" href="${data.bio.external_url}" target="${openLinkTab(sk_instagram_feed)}">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="15" height="15" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 bio-icon">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                    </svg>
                                    ${display_url}
                                </a>
                            </div>
                        `;
                    } else if (show_profile_website == 1 && data.bio.website_url) {
                        var display_url = data.bio.website_url;
                        if(data.bio.username == "tacosupply"){
                            display_url = "linktr.ee/mcdevitttacosupply";
                        }
                        post_items += `
                            <div>
                                <a class="bio-website" href="${data.bio.website_url}" target="${openLinkTab(sk_instagram_feed)}">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="15" height="15" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 bio-icon">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                    </svg>
                                    ${display_url}
                                </a>
                            </div>
                        `;
                    }
                }
                post_items += "</div>";
            post_items += "</div>";
            if(show_profile_follow_button==1){
                post_items += "<button type='button' onclick=\"window.open('https://www.instagram.com/" + data.bio.username + "/');\" class='instagram-user-container'>";
                post_items += "<span class='ig-icon'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'><path d='M4.68673 0.0559501C3.83553 0.0961101 3.25425 0.23195 2.74609 0.43163C2.22017 0.63659 1.77441 0.91163 1.33089 1.35675C0.887373 1.80187 0.614253 2.24795 0.410733 2.77467C0.213773 3.28395 0.080333 3.86571 0.042733 4.71739C0.00513298 5.56907 -0.00318703 5.84283 0.000972972 8.01531C0.00513297 10.1878 0.014733 10.4601 0.056013 11.3135C0.096653 12.1646 0.232013 12.7457 0.431693 13.254C0.636973 13.78 0.911693 14.2256 1.35697 14.6692C1.80225 15.1129 2.24801 15.3854 2.77601 15.5892C3.28481 15.7859 3.86673 15.92 4.71825 15.9572C5.56977 15.9945 5.84385 16.0032 8.01569 15.999C10.1875 15.9948 10.461 15.9852 11.3143 15.9448C12.1675 15.9043 12.7456 15.768 13.2541 15.5692C13.78 15.3635 14.2259 15.0892 14.6693 14.6438C15.1127 14.1984 15.3856 13.752 15.589 13.2249C15.7861 12.7161 15.92 12.1342 15.957 11.2833C15.9943 10.4294 16.0031 10.1568 15.9989 7.98459C15.9947 5.81243 15.985 5.54011 15.9445 4.68699C15.904 3.83387 15.7685 3.25451 15.569 2.74587C15.3634 2.21995 15.089 1.77467 14.6439 1.33067C14.1987 0.88667 13.752 0.61387 13.2251 0.41099C12.716 0.21403 12.1344 0.0797901 11.2829 0.0429901C10.4314 0.00619009 10.1573 -0.00324991 7.98465 0.000910089C5.81201 0.00507009 5.54001 0.0143501 4.68673 0.0559501ZM4.78017 14.518C4.00017 14.4841 3.57665 14.3545 3.29441 14.246C2.92065 14.102 2.65441 13.928 2.37313 13.6494C2.09185 13.3708 1.91905 13.1036 1.77313 12.7307C1.66353 12.4484 1.53153 12.0254 1.49505 11.2454C1.45537 10.4024 1.44705 10.1492 1.44241 8.01339C1.43777 5.87755 1.44593 5.62475 1.48289 4.78139C1.51617 4.00203 1.64657 3.57803 1.75489 3.29595C1.89889 2.92171 2.07233 2.65595 2.35153 2.37483C2.63073 2.09371 2.89713 1.92059 3.27041 1.77467C3.55233 1.66459 3.97537 1.53371 4.75505 1.49659C5.59873 1.45659 5.85153 1.44859 7.98705 1.44395C10.1226 1.43931 10.376 1.44731 11.22 1.48443C11.9994 1.51835 12.4235 1.64747 12.7053 1.75643C13.0792 1.90043 13.3453 2.07339 13.6264 2.35307C13.9075 2.63275 14.0808 2.89819 14.2267 3.27227C14.337 3.55339 14.4679 3.97627 14.5047 4.75643C14.5448 5.60011 14.5539 5.85307 14.5578 7.98843C14.5616 10.1238 14.5541 10.3774 14.5171 11.2204C14.4831 12.0004 14.3538 12.4241 14.2451 12.7067C14.1011 13.0803 13.9275 13.3467 13.6482 13.6276C13.3688 13.9086 13.1027 14.0817 12.7293 14.2276C12.4477 14.3376 12.0242 14.4688 11.2451 14.5059C10.4015 14.5456 10.1487 14.5539 8.01233 14.5585C5.87601 14.5632 5.62401 14.5545 4.78033 14.518M11.3019 3.72427C11.3022 3.91415 11.3589 4.09968 11.4646 4.25738C11.5704 4.41508 11.7206 4.53788 11.8961 4.61023C12.0717 4.68259 12.2647 4.70126 12.4509 4.66389C12.6371 4.62651 12.808 4.53476 12.942 4.40025C13.076 4.26573 13.1671 4.09449 13.2038 3.90819C13.2405 3.72189 13.2212 3.52888 13.1482 3.35359C13.0751 3.1783 12.9518 3.0286 12.7937 2.92342C12.6356 2.81823 12.4499 2.76229 12.26 2.76267C12.0055 2.76318 11.7615 2.86477 11.5819 3.04509C11.4022 3.22542 11.3015 3.46972 11.3019 3.72427ZM3.89233 8.00795C3.89681 10.2768 5.73937 12.1118 8.00769 12.1075C10.276 12.1032 12.1123 10.2608 12.108 7.99195C12.1037 5.72315 10.2607 3.88763 7.99201 3.89211C5.72337 3.89659 3.88801 5.73947 3.89233 8.00795ZM5.33329 8.00507C5.33225 7.47764 5.48763 6.96175 5.77979 6.52263C6.07194 6.08352 6.48775 5.74089 6.97462 5.53809C7.4615 5.33529 7.99759 5.28142 8.51508 5.38329C9.03258 5.48516 9.50824 5.7382 9.88193 6.11041C10.2556 6.48262 10.5105 6.95728 10.6145 7.47437C10.7184 7.99145 10.6666 8.52775 10.4658 9.01542C10.2649 9.5031 9.92391 9.92026 9.48595 10.2142C9.04799 10.508 8.53272 10.6655 8.00529 10.6665C7.65508 10.6672 7.30816 10.599 6.98433 10.4656C6.66051 10.3323 6.36612 10.1364 6.118 9.88928C5.86987 9.64213 5.67286 9.34852 5.53822 9.02523C5.40358 8.70193 5.33394 8.35528 5.33329 8.00507Z' fill='currentColor'/></svg></span>" + follow_text;
                post_items += "</button>";
            }
        post_items += "</div>";
    }

    return post_items;
}


async function loadFeed(sk_instagram_feed) {
    var embed_id = getDsmEmbedId(sk_instagram_feed);
    // settings
    var show_load_more_button = sk_instagram_feed.find('.show_load_more_button').text();

    // text settings
    var load_more_posts_text = sk_instagram_feed.find('.load_more_posts_text').text();
    var turnon_preapproval_posts = getDsmSetting(sk_instagram_feed, "turnon_preapproval_posts");
    var predefined_search_keyword = getDsmSetting(sk_instagram_feed, "predefined_search_keyword");

    var data = original_data[embed_id];

    if(data.user_info && data.user_info.show_feed == false){
        sk_instagram_feed.prepend(data.user_info.message);
        sk_instagram_feed.find('.loading-img').hide();
        sk_instagram_feed.find('.first_loading_animation').hide();
        sk_instagram_feed.find('.sk_fb_events_options').hide();
    }
    else if(!data.bio && !data.posts){
        generateSolutionMessage(sk_instagram_feed, embed_id);
        return;
    }
    else if(!data.bio.username && data.posts.length < 1){
        generateSolutionMessage(sk_instagram_feed, embed_id);
        return;
    }
    else {
        var post_items = "<div class='sk-ww-ig-feed-container'>";
        data_bio[embed_id] = {};
        if(data.bio && data.bio.username){
            data.bio.user_profile = data.bio.user_profile ? data.bio.user_profile : data.bio.profile_sk_img;
            post_items += loadBioInformation(sk_instagram_feed, data);
        }
        
        

        data_storage[embed_id] = data.posts;
        if (data_storage[embed_id] && data.posts) {
            data_storage[embed_id] = moderationTabFeature(sk_instagram_feed, turnon_preapproval_posts, data_storage[embed_id]);
            data_storage[embed_id] = sortPostsBy(sk_instagram_feed, data_storage[embed_id]);
            data_storage[embed_id] = sortByPinned(data_storage[embed_id]);
        }
        if(predefined_search_keyword != ""){
            data_storage[embed_id] = HashtagFilter(data_storage[embed_id], predefined_search_keyword);
        }
        if(embed_id == 68772){
            // data_storage[embed_id] = await compressedImage(sk_instagram_feed,data_storage[embed_id]);
        }
        
        if(data.posts && data.posts.length == 0 || data.bio && data.posts == null){
            post_items += "<div class='sk-no-item-found'>No posts yet.</div>";
        }
        else if(getDsmSetting(sk_instagram_feed,'layout') == 3){
            last_key[embed_id] = data_storage[embed_id].length;
            post_items +=loadSliderLayout(sk_instagram_feed, data);
        }
        else {
            var data_position = 0;
            post_items += "<div class='sk-ig-all-posts'>";
                post_items+="<div class='sk-instagram-feed-item-sizer' style='width:50%;'></div>";
                var enable_button = false;
                last_key[embed_id] = parseInt(getDsmSetting(sk_instagram_feed,'post_count'));
                if (data_storage[embed_id].length > 0) {
                    for (var i = 0; i < last_key[embed_id]; i++) {
                        if(typeof data_storage[embed_id][i] != 'undefined'){
                            post_items+=getFeedItem(data_storage[embed_id][i],sk_instagram_feed, data_position);
                            data_position++;
                        }
                    }
                } else {
                    post_items += `
                        <div class="sk-ig-no-posts">
                            <h4>No Posts Found</h4>
                        </div>    
                    `;
                }
                if(data_storage[embed_id].length > last_key[embed_id]){
                    enable_button = true;
                }

            post_items += "</div>";

            if (enable_button && show_load_more_button == 1) {
                post_items += "<div class='sk-ig-bottom-btn-container'>";
                    post_items += "<button type='button' class='sk-ig-load-more-posts'>" + load_more_posts_text + "</button>";
                post_items += "</div>";
            }
        }
        
        post_items += skGetBranding(sk_instagram_feed, data.user_info);
        sk_instagram_feed.append(post_items);
        if (data.bio && data.bio.username) {
            var identifier = data.bio.username;
            var image_path = sk_img_url + "images/instagram-profile/" + identifier + ".jpg";
            var profile_image = data.bio.user_profile ? data.bio.user_profile : image_path;
            sk_instagram_feed.find(".sk-popup-profile-image").attr("src", profile_image);
            sk_instagram_feed.find('div[data-image="'+identifier+'"]').css({
                "background-image": "url(" + profile_image + ")"
            }).attr({
                "role": "img",
                "aria-label": "Profile picture for @" + identifier
            });
        }

        if (getDsmSetting(sk_instagram_feed, 'layout') == 2) {
            observeMasonryItems(sk_instagram_feed);
        }

        if(getDsmSetting(sk_instagram_feed,'layout') == 3){
            data_storage[embed_id] = data.posts;
            skLayoutSliderSetting(sk_instagram_feed);
            applyCustomUi(jQuery, sk_instagram_feed);
        }

        post_items += "</div>";
    }

    
    // must not trigger the video 20437/sk_widgets
    sk_instagram_feed.find('video').trigger('pause');
    jQuery(document).on('click','#ModalClose-newsletter-popup',function(){
        jQuery('video').trigger('pause');
        setTimeout(function(){ jQuery('video').trigger('pause'); },50);
    });
    jQuery(document).on('click','newsletter-popup button',function(){
        jQuery('video').trigger('pause');
        setTimeout(function(){ jQuery('video').trigger('pause'); },50);
    });

    const bioEl = jQuery('.sk-ig-profile-bio');

    if (bioEl.length && !bioEl.html().includes('</a>')) {
        replaceContentWithLinks(bioEl);
    } else {
        bioEl.find('a').each(function() {
            if (!jQuery(this).attr('target')) {
                jQuery(this).attr('target', '_blank');
            }
        });
    }

    applyCustomUi(jQuery, sk_instagram_feed);
    setTimeout(function(){
        applyCustomUi(jQuery, sk_instagram_feed);
    }, 500);

    sk_increaseView(data.user_info);
}

function removeTvCodeTemp(code){
    code = code.replace('https:/www.instagram.com/tv/','');
    code = code.replace('https:/www.instagram.com/tv/','');
    code = code.replace('/','');
    return code;
}
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function feedItemImageAlt(val, slideIndex, slideTotal) {
    var uname = val.owner_username;
    if (!uname && typeof data_bio !== 'undefined' && typeof embed_id !== 'undefined' && data_bio[embed_id]) {
        uname = data_bio[embed_id].username;
    }
    uname = uname || 'Instagram user';
    var caption = (val.pic_text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (caption.length > 100) {
        caption = caption.substring(0, 97) + '...';
    }
    var base = caption ? caption : ('Instagram post photo by @' + uname);
    if (typeof slideTotal === 'number' && slideTotal > 1 && typeof slideIndex === 'number') {
        base = 'Image ' + (slideIndex + 1) + ' of ' + slideTotal + ': ' + base;
    }
    return htmlEntities(base);
}
function getFeedItem(val,sk_instagram_feed, data_position) {
    if (!val.code) {
        val.code = val.shortcode;
    }
    val.code = removeTvCodeTemp(val.code);
    var view_on_instagram_text = getDsmSetting(sk_instagram_feed, "view_on_instagram_text");
    var character_limit = getDsmSetting(sk_instagram_feed, "character_limit");
    var show_icons = getDsmSetting(sk_instagram_feed, "show_icons");
    var links_clickable = getDsmSetting(sk_instagram_feed, "links_clickable");
    var follow_text = sk_instagram_feed.find('.follow_text').text();
    var use_45_ratio = sk_instagram_feed.find('.use_45_ratio').text();

    var post_items = "";
    var post_title_hover = "";
    if (getDsmSetting(sk_instagram_feed, "show_post_hover_title") && val.pic_text) {
        var pic_text = htmlEntities(val.pic_text);
        post_title_hover = "title=\"" + pic_text + "\"";
    }

    var height_auto_class = '';
    if (getSkSetting(sk_instagram_feed,'layout') == 2) {
        height_auto_class = 'sk-h-auto';
    }   
    post_items += "<div profile-pic-url='"+data_bio[embed_id].profile_pic_url_hd+"' class='"+height_auto_class+" sk-instagram-feed-item ' " + post_title_hover + " data-link='" + val.link + "' data-code = '" + val.code + "' data-type='" + val.pic_type + "' video-url='"+val.video_url+"'  data-position='"+data_position+"' data-username='"+data_bio[embed_id].username+"'><img onerror='handleImageError(this)' data-image='" + val.code + "' class='sk-img-sizer' src='" + val.image_url + "' alt='' aria-hidden='true' style='display: none;width:100%;' />";

    if (val.pic_type == "video" && getDsmSetting(sk_instagram_feed, "show_play_icon") == 1) {
        post_items += "<div class='sk-ig-icon sk-ig-icon--video'>";
        post_items += "<img src='" + app_url + "images/video.svg' class='sk-ig-icon__svg' alt='' aria-hidden='true' />";
        post_items += "</div>";
    }
    else if (val.pic_type == "carousel" && getDsmSetting(sk_instagram_feed, 'show_carousel_icon') == 1) {
        post_items += "<span class='sk-ig-icon sk-ig-icon--carousel'>";
        post_items += "<img src='" + app_url + "images/carousel.svg' class='sk-ig-icon__svg' alt='' aria-hidden='true' />";
        post_items += "</span>";
    }

    // show on load
    post_items += "<div class='sk-ig-post-hover display-none'>";
        if(val.pic_like_count_formatted && parseInt(val.pic_like_count_formatted) > 0 && getDsmSetting(sk_instagram_feed, "show_likes_count") == 1){
            const likes = parseInt(val.pic_like_count_formatted, 10) >= 10000 ?  formatLikes(parseInt(val.pic_like_count_formatted, 10)) : formatNumber(parseInt(val.pic_like_count_formatted, 10)); 
            post_items += "<span class='m-r-15px'>";
            post_items += "<img src='" + app_url + "images/heart.svg' class='sk-ig-icon-svg sk-ig-icon-heart' alt='' aria-hidden='true' /> <span class='sk-like-count'>" + likes + "</span>";
            post_items += "</span>";
        }
        if(val.pic_comment_count_formatted && getDsmSetting(sk_instagram_feed, "show_comments") == 1){
            const comments = parseInt(val.pic_comment_count_formatted, 10) >= 10000 ?  formatLikes(parseInt(val.pic_comment_count_formatted, 10)) : formatNumber(parseInt(val.pic_comment_count_formatted, 10))
            post_items += "<span>";
            post_items += "<img src='" + app_url + "images/comment.svg' class='sk-ig-icon-svg sk-ig-icon-comment' alt='' aria-hidden='true' /> <span class='sk-comment-count'>" + comments + "</span>";
            post_items += "</span>";
        }
    post_items += "</div>";

    post_items += "<div class='sk-ig-post-img "+(use_45_ratio == 1 ? 'sk-ig-post-img-45' : '')+"' data-image='" + val.code + "' role='img' aria-label=\"" + feedItemImageAlt(val) + "\" style='background-size:cover; background-position:center; background-image:url(" + val.image_url + Math.floor(Date.now() / 1000) % 1000 + ");'></div>";
    

    if (getDsmSetting(sk_instagram_feed, "post_item_type") == 1) {
        post_items += "<div class='sk-ig-caption-container' style='background-color:#fff;'>";
            if (getDsmSetting(sk_instagram_feed, "show_likes_count") == 1 && parseInt(val.pic_like_count_formatted) > 0) {
                post_items += "<span class='sk-ig-feed-m-r-15px'>";
                post_items += "<img src='" + app_url + "images/heart.svg' class='sk-ig-icon-svg sk-ig-icon-heart' alt='' aria-hidden='true' /> " + val.pic_like_count_formatted;
                post_items += "</span>";
            }
            if (val.pic_comment_count_formatted && getDsmSetting(sk_instagram_feed, "show_comments") == 1) {
                post_items += "<span class='sk-ig-feed-m-r-15px'>";
                post_items += "<img src='" + app_url + "images/comment.svg' class='sk-ig-icon-svg sk-ig-icon-comment' alt='' aria-hidden='true' /> " + val.pic_comment_count_formatted;
                post_items += "</span>";
            }

            if(getDsmSetting(sk_instagram_feed, "show_ago_value") == 1){                
                post_items += "<span class='sk-ig-feed-m-r-15px sk-ago-data'>";
                    post_items += timeAgo(val.date_time_posted);
                post_items += "</span>";
            }
            
            var new_pic_text = val.pic_text ? val.pic_text : '';
            var more_text = getDsmSetting(sk_instagram_feed,'more_text') ? getDsmSetting(sk_instagram_feed,'more_text') : "more";
            if(new_pic_text && new_pic_text.length > character_limit && character_limit > 0){
                new_pic_text = new_pic_text.substring(0, character_limit) + "<a>... "+more_text+"</a>";
            }
            new_pic_text = new_pic_text.replace(/(\r\n|\n\r|\r|\n)/g, " <br> ");
            post_items += "<div class='sk-ig-caption'>";
            if (getDsmSetting(sk_instagram_feed,'show_ig_icon') == 1) {
                post_items +=
                    "<a " +
                        "class='sk-view-on-ig-link float-right' " +
                        "data-code='" + val.code + "' " +
                        "href='" + val.link + "' " +
                        "target='_blank' " +
                        "rel='noopener noreferrer' " +
                        "aria-label='View on Instagram (opens in a new tab)'" +
                    ">";
                        post_items += "<img src='" + app_url + "images/ig-icon.svg' class='sk-ig-icon-instagram' alt='' aria-hidden='true' />";
                post_items += "</a>";
            }
            if(val.owner_username && getDsmSetting(sk_instagram_feed,'show_post_username') == 1){
                post_items += "<span class='href_status_trigger_container'>";
                    post_items += "<label class='sk-ig-informative-username'>" + val.owner_username + " </label>";
                post_items += "</span>";
            }
            if(new_pic_text){
                post_items += "<span class='href_status_trigger_container sk-ig-feed-m-t-10px sk-ig-pic-text sk-ig-text-" + val.code + "'>";
                    post_items += new_pic_text;
                post_items += "</span>";
            }
            post_items += "</div>";

        post_items += "</div>";
    }

    // show in pop up
    var show_info_container = getDsmSetting(sk_instagram_feed, "show_popup_profile_picture") == 1 || getDsmSetting(sk_instagram_feed, "show_pop_up_username") == 1 ||
        getDsmSetting(sk_instagram_feed, "show_popup_follow_link") == 1 || getDsmSetting(sk_instagram_feed, "show_description") == 1 || getDsmSetting(sk_instagram_feed, "show_view_on_twitter_link") == 1 ||
        getDsmSetting(sk_instagram_feed, "show_likes_count") == 1 || getDsmSetting(sk_instagram_feed, "show_comments_count") == 1;
    var margin_auto_image = "style='margin: 0px auto !important;'";
    var display_inline_grid = "style='display: inline-grid !important;'";
    var spinner_left = "style='left: 46.5% !important;'";
    if (show_info_container == 1) {
        margin_auto_image = "";
        display_inline_grid = "";
        spinner_left = "";
    }
    post_items += "<div class='white-popup mfp-hide sk-pop-ig-post' data-type=" + val.pic_type + " data-code=\"" + val.code + "\">";
    post_items += "<div style='width:100%; height: 100%;'>";
    post_items += "<div class='sk_popup_row sk-media-post-container-" + val.code + "' " + display_inline_grid + ">";
    post_items += "<div class='sk_popup_column sk_popup_column_media' " + margin_auto_image + ">";
    if (val.pic_type == 'video') {
        if(original_data[embed_id].settings 
            && original_data[embed_id].settings.long_lived_user_access_token 
            && (!val.video_url || !val.video_url.includes('.jpg'))
        ){
            post_items += "<div class='swiper-slide'>";
            post_items += "<video  class='ig_media' controls>";
            post_items += "<source src='" + val.video_url + "'>";
            post_items += "</video>";
            post_items += "</div>";
        }
        else{
            if (getDsmSetting(sk_instagram_feed, "show_play_icon") == 1) {
                post_items += "<div onclick=\"window.open('https://www.instagram.com/p/" + val.code + "/');\" class='sk-ig-icon sk-ig-icon--video'><img src='" + app_url + "images/video.svg' class='sk-ig-icon__svg' alt='' aria-hidden='true' /></div>";
            }
            post_items += "<img onerror='handleImageError(this)' data-image='" + val.code + "' img-url='" + val.image_url + "' src='" + val.image_url + "' class='ig_media sk-image-sizer' alt='" + feedItemImageAlt(val) + "' />";
        }
        
    }
    else if (val.pic_type == 'carousel' && val.children && val.children.length > 0 && val.sk_images && val.sk_images.length > 0) {
        post_items += '<div class="swiper-container swiper-container-single" >';
            post_items += '<div class="swiper-wrapper sk_loading_carousel">';
                val.children.forEach(function (element, index) {
                    if (index === 0 && val.image_url && element.media_type == "IMAGE") {
                        post_items += "<div class='swiper-slide'><img onerror='handleImageError(this)' src='" + val.image_url + "' class='ig_media' alt='" + feedItemImageAlt(val, index, val.children.length) + "' style='height:auto; vertical-align: middle;object-fit: contain;'/></div>";
                    } 
                    else if(element.media_type == "IMAGE"){
                        if (val.sk_images[index]) {
                            post_items += "<div class='swiper-slide'><img onerror='handleImageError(this)' src='" + val.sk_images[index] + "' class='ig_media' alt='" + feedItemImageAlt(val, index, val.children.length) + "' style='height:auto; vertical-align: middle;object-fit: contain;'/></div>";
                        } 
                    }
                    else if (element.media_type == "VIDEO"){
                        if (element.sk_url) {
                            post_items += "<div class='swiper-slide'><video src='" + element.sk_url + "' class='ig_media' controls></video></div>";
                        } else {
                            post_items += "<div class='swiper-slide'><video src='" + element.media_url + "' class='ig_media' controls></video></div>";
                        }
                    }
                    
                });
            post_items += '</div>';
            post_items += '<div class="swiper-pagination"></div>';
            post_items += "<a href='#' class='swiper-button-next-single' aria-label='Next slide'>";
                post_items += "<i class='mfp-arrow mfp-arrow-right' aria-hidden='true'></i>";
            post_items += "</a>";

            post_items += "<a href='#' class='swiper-button-prev-single' aria-label='Previous slide'>";
                post_items += "<i class='mfp-arrow mfp-arrow-left' aria-hidden='true'></i>";
            post_items += "</a>";
        post_items += '</div>';
    }
    else{
        if(val.pic_type == 'carousel'){
            post_items += "<span onclick=\"window.open('https://www.instagram.com/p/" + val.code + "/');\" class='sk-ig-icon sk-ig-icon--carousel'><img src='" + app_url + "images/carousel.svg' class='sk-ig-icon__svg' alt='' aria-hidden='true' /></span>";
        }
        post_items += "<img onerror='handleImageError(this)' data-image='" + val.code + "' img-url='" + val.image_url + "' src='" + val.image_url + "' class='ig_media sk-image-sizer' alt='" + feedItemImageAlt(val) + "' />";
    }
    post_items += "</div>";
    if (show_info_container == 1) {
        post_items += "<div class='sk_popup_column' >";
            post_items += "<div class='sk_popup_column_spacer'>";
                var sk_popup_column_body_height = 90;
                if(getDsmSetting(sk_instagram_feed, "show_popup_profile_picture") == 1
                    || getDsmSetting(sk_instagram_feed, "show_pop_up_username") == 1
                    || getDsmSetting(sk_instagram_feed, "show_popup_follow_link") == 1){

                    sk_popup_column_body_height = 100;

                    post_items += "<div class='sk_popup_column_user'>";
                        if (getDsmSetting(sk_instagram_feed, "show_popup_profile_picture") == 1 && original_data[embed_id].bio.user_profile) {
                            post_items += "<img onerror='handleImageError(this)' class='sk-popup-profile-image' src='"+original_data[embed_id].bio.user_profile+"' data-image='"+original_data[embed_id].bio.username+"' alt='"+htmlEntities('Profile picture for @' + original_data[embed_id].bio.username)+"' />";
                        } else if (getDsmSetting(sk_instagram_feed, "show_popup_profile_picture") == 1 && original_data[embed_id].bio.profile_pic_url) {
                            post_items += "<img onerror='handleImageError(this)' class='sk-popup-profile-image' src='"+original_data[embed_id].bio.profile_pic_url+"' data-image='"+original_data[embed_id].bio.username+"' alt='"+htmlEntities('Profile picture for @' + original_data[embed_id].bio.username)+"' />";
                        }
                        post_items += "<p>";
                        if (getDsmSetting(sk_instagram_feed, "show_pop_up_username") == 1) {
                            post_items += "<a class='href_status_trigger sk-instagram-feed-username' href='https://www.instagram.com/" + val.owner_username + "/' target='" + openLinkTab(sk_instagram_feed) + "'><span><b>" + val.owner_username + "</b></span></a><br>";
                        }
                        if (getDsmSetting(sk_instagram_feed, "show_ago_value") == 1 && val.date_time_posted) {
                            var formattedDate = formatDateMMM(val.date_time_posted);
                            post_items += "<span class='sk-popup-post-date'>";
                                post_items += timeAgo(val.date_time_posted);
                            post_items += " • " + formattedDate;
                            post_items += "</span>";
                        }
                        post_items += "</p>";
                        if (getDsmSetting(sk_instagram_feed, "show_popup_follow_link") == 1) {
                            
                            post_items += "<span class='sk-instagram-feed-follow-link-container'>";
                            post_items += "<a class='href_status_trigger sk-instagram-feed-follow-link' href='https://www.instagram.com/" + val.owner_username + "/' target='" + openLinkTab(sk_instagram_feed) + "'>" + follow_text + "</a>";
                            post_items += "</span>";

                        }
                    post_items += "</div>";
                }
                
                post_items += "<div class='sk_popup_column_body'>";
                    if (getDsmSetting(sk_instagram_feed, "show_description") == 1) {
                        post_items += "<div class='sk_popup_column_body_content sk_popup_column_body_content_" + val.code + "'>";
                        post_items +=  val.pic_text == null ? "" : val.pic_text;
                        post_items += "</div>";
                    }
                post_items += "</div>";

                post_items += "<div class='sk_popup_column_footer'>";
                    
                if (getDsmSetting(sk_instagram_feed, "show_likes_count") == 1 || getDsmSetting(sk_instagram_feed, "show_comments") == 1) {
                    post_items += "<div class='sk-reaction-container'>";
                    if (parseInt(val.pic_like_count_formatted) > 0 && getDsmSetting(sk_instagram_feed, "show_likes_count") == 1) {
                        post_items += "<span>";
                        post_items += "<img src='" + app_url + "images/heart.svg' class='sk-ig-icon-svg sk-ig-icon-heart' alt='' aria-hidden='true' /> <span class='sk-like-count'>" + formatNumber(val.pic_like_count_formatted) + "</span>";
                        post_items += "</span>";
                    }
                    if (parseInt(val.pic_comment_count_formatted) > 0 && getDsmSetting(sk_instagram_feed, "show_comments") == 1) {
                        post_items += "<span>";
                        post_items += "<img src='" + app_url + "images/comment.svg' class='sk-ig-icon-svg sk-ig-icon-comment' alt='' aria-hidden='true' /> <span class='sk-comment-count'>" + formatNumber(val.pic_comment_count_formatted) + "</span>";
                        post_items += "</span>";
                    }
                    post_items += "</div>";
                }
                    
                    if (links_clickable == 1) {
                        if (getDsmSetting(sk_instagram_feed, "show_view_on_twitter_link") == 1) {
                            post_items += "<span class='sk-ig-pop-up-icon'>";
                            post_items += "<a class='href_status_trigger' style='display: inline-table;' href='" + val.link + "' target='" + openLinkTab(sk_instagram_feed) + "'>";
                            post_items += "<i class='line_break'></i>";
                            if (show_icons == 1) {
                                post_items += "<img src='" + app_url + "images/ig-icon.svg' class='sk-ig-icon-instagram' alt='' aria-hidden='true' />";
                            }

                            post_items += `<span class="view-on-ig-text">${view_on_instagram_text}</span>`;
                            post_items += "</a>";
                            post_items += "</span>";
                        }
                    }
                post_items += "</div>";
            post_items += "</div>";
        post_items += "</div>";
    }
    post_items += "</div>";
    post_items += "</div>";
    post_items += "</div>";

    post_items += "</div>";
    return post_items;
}

function alignSpinner(jQuery, sk_instagram_feed) {

    // hover
    var hover_width = sk_instagram_feed.find('.sk-instagram-feed-item').width();

    sk_instagram_feed.find('.sk-ig-post-hover .fa').css({
        'height': hover_width + 'px',
        'line-height': hover_width + 'px'
    });
}


function requestFeedData(sk_instagram_feed){
    var embed_id=getDsmEmbedId(sk_instagram_feed);

    var json_url=app_file_server_url + embed_id + ".json?nocache=" + (new Date()).getTime();

    // get feed
    jQuery.getJSON(json_url, function(data){
        original_data[embed_id] = data;
        if (!original_data[embed_id] || !original_data[embed_id].bio || original_data[embed_id].bio == null)
            original_data[embed_id].bio = {};
        if(data && data.bio && (data.bio.media || data.bio.posts_count)) {
            loadFeed(sk_instagram_feed);
        }
        else{
            if(original_data[embed_id] && original_data[embed_id].user_info && !widgetValidation(sk_instagram_feed, original_data[embed_id])){
                return;
            }
            generateSolutionMessage(sk_instagram_feed, embed_id);
        }
    }).fail(function(e){
        generateSolutionMessage(sk_instagram_feed, embed_id);
    });

}
function hidePopUp(){
    if(jQuery.magnificPopup){
      jQuery.magnificPopup.close();
    }
}

function showDsmInstagramFeedPopUp(jQuery, content_src, clicked_element){
    jQuery('.sk_selected_ig_post').removeClass('sk_selected_ig_post');

    // activate selected post
    clicked_element.addClass('sk_selected_ig_post');
    var sk_instagram_feed=clicked_element.closest('.sk-instagram-feed');

    hidePopUp();
    
    if(typeof jQuery.magnificPopup === "undefined")
        initManificPopupPlugin(jQuery);

    jQuery.magnificPopup.open({
        items: { src: content_src },
        fixedContentPos: true,
        'type' : 'inline',
        callbacks: {
            open: function() {
                jQuery(".mfp-wrap").animate({opacity: 0}, 1);
                if (jQuery('.mfp-content .sk_popup_column_body_content').hasClass("linked") == false) {
                    replaceContentWithLinks(jQuery('.mfp-content .sk_popup_column_body_content'));
                }
                jQuery('.mfp-content .sk_popup_column_body_content').addClass("linked");
                var post_html="";
                var prev_disabled = "disabled";
                var next_disabled = "disabled";

                if(clicked_element.next().length > 0 && clicked_element.next().hasClass("sk-instagram-feed-item") == true){
                    next_disabled = "";
                    
                }
                if(clicked_element.prev().length > 0 && clicked_element.prev().hasClass("sk-instagram-feed-item") == true){
                    prev_disabled = "";
                   
                }
                let btnClass = prev_disabled  ? "prev_sk_ig_feed_post display-none" : 'prev_sk_ig_feed_post';
                post_html+="<button class='"+btnClass+"'"+prev_disabled+">";
                    post_html+="<i class='fa fa-chevron-left sk_prt_4px' aria-hidden='true'></i>";
                post_html+="</button>";

                btnClass = next_disabled  ? "next_sk_ig_feed_post display-none" : 'next_sk_ig_feed_post';
                post_html+="<button class='"+btnClass+"'"+next_disabled+">";
                    post_html+="<i class='fa fa-chevron-right sk_plt_4px' aria-hidden='true'></i>";
                post_html+="</button>";

                jQuery('.mfp-content').prepend(post_html);
                
                var white_popup = jQuery('.mfp-content').find('.white-popup');

                // if post details is not present 
                if(white_popup.find('.sk_popup_column').length == 1){
                    white_popup.find('.sk_popup_row').css('display','block');
                    white_popup.find('.sk_popup_row').css('height','auto');
                    white_popup.find('.sk_popup_column').css('width','100%');
                    white_popup.find('.sk_popup_column .fa-spinner').css('top','45%');
                    white_popup.find('.sk_popup_column .ig_media').css('height','auto');
                    white_popup.find('.sk_popup_column .ig_media').css('width','100%');
                }

                if (getDsmSetting(sk_instagram_feed, "layout") == 1 || getDsmSetting(sk_instagram_feed, "layout") == 2) {
                    $('html').css('margin-right', '');
                }

                // apply font settings
                white_popup.find('.sk_popup_column_body_content').css('font-size',getDsmSetting(sk_instagram_feed, "details_font_size")+'px');
                var line_height = parseInt(getDsmSetting(sk_instagram_feed, "details_font_size")) + 4;
                white_popup.find('.sk_popup_column_body_content').css({
                    "font-size" : getDsmSetting(sk_instagram_feed, "details_font_size")+'px',
                    "line-height" : line_height + "px"
                });
                white_popup.find('.sk-instagram-feed-username').css('font-size',getDsmSetting(sk_instagram_feed, "details_font_size")+'px');
                white_popup.find('.sk_popup_column_user').css('font-size',getDsmSetting(sk_instagram_feed, "details_font_size")+'px');
                white_popup.find('.sk_popup_column_footer').css('font-size',getDsmSetting(sk_instagram_feed, "details_font_size")+'px');
                
                setTimeout(function(){

                    //white_popup.find('.sk_popup_column_body').mouseover(function() {
                    //    var sk_popup_column_body_height  = jQuery(this).height();
                    //    var sk_popup_column_body_content_height  = jQuery(this).find('.sk_popup_column_body_content').height();
                    //    if(sk_popup_column_body_height < sk_popup_column_body_content_height){
                    //        jQuery(this).css({
                    //            'overflow' : 'hidden scroll'
                    //        });
                    //    }
                        
                    //}).mouseout(function() {
                    //    jQuery(this).css({
                    //        'overflow' : 'hidden'
                    //    });
                    //});

                    
                    // popup colors
                    white_popup.find('.sk_popup_column_user span').css({
                        'font-size' : getDsmSetting(sk_instagram_feed,'details_font_size'),
                    });
                    white_popup.css({
                        'background' : getDsmSetting(sk_instagram_feed,'pop_up_bg_color'),
                        'color' : getDsmSetting(sk_instagram_feed,'pop_up_font_color'),
                        'font-size' : getDsmSetting(sk_instagram_feed,'details_font_size'),
                    });
                    white_popup.find('.sk_popup_column,.sk_popup_column_body_content').css({
                        'color' : getDsmSetting(sk_instagram_feed,'pop_up_font_color'),
                        'font-size' : getDsmSetting(sk_instagram_feed,'details_font_size'),
                    });
                    white_popup.find('.sk_popup_column a').css({
                        'color' : getDsmSetting(sk_instagram_feed,'pop_up_link_color'),
                    });

                    // popup height
                    var H = white_popup.find('.sk_popup_column').height();

                    initializeSwiperSingleSLider(clicked_element);

                    var video_slide = jQuery('.mfp-content .sk-pop-ig-post .swiper-slide:first video.ig_media');

                    if(jQuery('.mfp-content .sk-pop-ig-post video.ig_media').get(0)!==undefined && video_slide.length){
                        video_slide.get(0).play();
                    }
                    
                    jQuery('.mfp-content').find(".mfp-close").remove();
                    jQuery('.mfp-content').prepend('<button title="Close (Esc)" type="button" class="mfp-close" style="right: 0px;">✖</button>');
                    jQuery('.mfp-content').find(".mfp-close").css({
                        "right" : parseInt(jQuery('.mfp-content').find(".white-popup").css("marginRight"))+"px"
                    });

                    if(sk_instagram_feed.width() <= 820){
                        jQuery('.mfp-content').find(".mfp-close").css({
                            "right" : parseInt(jQuery('.mfp-content').find(".white-popup").css("marginRight"))+"px"
                        });
                    }
                    jQuery(".mfp-wrap").css({ height: "0%" });
                                
                    setTimeout(function () {
                        jQuery(".mfp-wrap").animate({opacity: 1}, 100);
                        jQuery(".mfp-wrap").css({ height: "100%" });
                        
                    }, 5);
                },50);
            },
            close: function() {
                jQuery(".prev_sk_ig_feed_post, .next_sk_ig_feed_post").remove();
                jQuery('video').each(function() {
                    jQuery(this)[0].pause();
                });
            }
        }
    });
}
function initializeSwiperSingleSLider(clicked_element){
    var singleSwiper = new Swiper('.swiper-container-single.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        effect : 'fade',
        autoplay: 3000,

        loop: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next-single',
            prevEl: '.swiper-button-prev-single',
        },
    });
    
    singleSliderLayout();
    setTimeout(function(){
        singleSliderLayout();
    },1000);
    setTimeout(function(){
        singleSliderLayout();
    },2000);

    jQuery('.swiper-button-next-single').click({swiper:singleSwiper},skSliderSingleNextClickEvent);
    jQuery('.swiper-button-prev-single').click({swiper:singleSwiper},skSliderSinglePrevClickEvent);

    // play video
    if(jQuery('.mfp-content .swiper-slide-active video.carousel-video').get(0)!==undefined){
        jQuery('.mfp-content .swiper-slide-active video.carousel-video').get(0).play();
    }
}
function skSliderSingleNextClickEvent(){
    jQuery('.mfp-content .sk_popup_column .ig_media').css('width','100%');
    jQuery('video').each(function() {
        jQuery(this)[0].pause();
    });
    if(jQuery('.mfp-content .swiper-slide-active video.carousel-video').get(0)!==undefined){
        jQuery('.mfp-content .swiper-slide-active video.carousel-video').get(0).play();
    }
}
function skSliderSinglePrevClickEvent(){
    jQuery('.mfp-content .sk_popup_column .ig_media').css('width','100%');
    jQuery('video').each(function() {
        jQuery(this)[0].pause();
    });
    if(jQuery('.mfp-content .swiper-slide-active video.carousel-video').get(0)!==undefined){
        jQuery('.mfp-content .swiper-slide-active video.carousel-video').get(0).play();
    }
}
function singleSliderLayout(){
    var height = jQuery('.swiper-container-single img,.sk_loading_image img,.sk_loading_video video').innerHeight();
    
    if(jQuery('.mfp-content .sk_loading_image').length){
        
        height = jQuery('.mfp-content .sk_loading_image').height();
        jQuery('.mfp-content .sk_loading_image img').height(height);
    }
    var type = jQuery('.white-popup').attr('data-type');
    var mfp_content = jQuery('.white-popup');
    var media_container = jQuery('.mfp-content .sk-media-post-pop-up');
    var media_height = media_container.find('img').height();
    if(media_container.find('img').length == 0){
        media_height = media_container.find('video').height();
    }
    if(type !='picture'){

        media_container.css('height',media_height +'px');
    }
    media_container.css('height',media_height +'px');
    

    var _h = jQuery('.white-popup').find('.sk_popup_row:first').height();
    if(media_container.find('.swiper-slide-active').length > 0){
        var height = media_container.find('.swiper-slide-active img,.swiper-slide-active video').height();
        var height = _h;
        media_container.css('height',height +'px');
        mfp_content.find('.sk-popup-container').css('height',height +'px');
        mfp_content.find('.sk-media-post-container').css('height',height +'px');
        mfp_content.find('.swiper-container').css('height',height +'px');
        mfp_content.find('.swiper-wrapper').css('height',height +'px');
        mfp_content.find('.swiper-slide').css('height',height +'px');
        mfp_content.find('.sk_loading_image img').css('height', 'auto');
    }
}
        function loadSliderLayout(sk_instagram_feed, data) {
        var column_count = getDsmSetting(sk_instagram_feed,'column_count');
        var post_count = getDsmSetting(sk_instagram_feed,'post_count');
        var mobile_column_count = getDsmSetting(sk_instagram_feed, "mobile_column_count");

        if (column_count && column_count == 0) {
            column_count = 3;
        }
        if (mobile_column_count && mobile_column_count == 0) {
            mobile_column_count = 1;
        }

        if (jQuery(document).width() <= 769) {
            column_count = mobile_column_count ? parseInt(mobile_column_count) : 1;
        }

        if (jQuery(document).width() > 500) {
            if (window.location.href.includes("iframe/242046")) {
                column_count = getDsmSetting(sk_instagram_feed,'column_count');
            }
        }

        column_count = parseInt(column_count);

        var post_items=  "<div class='sk-slider-container' style='display: block;position: relative;'>";

            post_items+="<button type='button' class='swiper-button-next ' style='pointer-events: all;'>";
                post_items+="<i class='sk-arrow sk-arrow-right'></i>";
            post_items+="</button>";
            
            post_items+="<button type='button' class='swiper-button-prev' style='pointer-events: all;'>";
                post_items+="<i class='sk-arrow sk-arrow-left'></i>";
            post_items+="</button>";

            post_items+=  "<div class='swiper-container swiper-layout-slider'>";
                
                post_items+=  "<div class='swiper-wrapper'>";
                    var data_position = 0;
                    var data_slider = data_storage[embed_id];
                    data_slider = data_slider.slice(0, post_count);

                    var pages = Math.ceil(data_slider.length/column_count);
                    
                    if (data_slider.length > 0) {
                        for(var slide = 1; slide <= pages; slide++){
                            post_items+=  "<div class='swiper-slide' >";
                                post_items += "<div class='sk-ig-all-posts'>";
                                    var slide_data = getPaginationResult(sk_instagram_feed,data_slider,slide,column_count);
                                    jQuery.each(slide_data, function(key, val){
                                        if(typeof val != 'undefined')
                                        post_items+=getFeedItem(val, sk_instagram_feed, data_position);
                                        data_position++;
                                    });
    
                                post_items += "</div>";
                            post_items += "</div>";
                        }
                    } else {
                        post_items += `
                            <div class="sk-ig-no-posts">
                                <h4>No Posts Found</h4>
                            </div>    
                        `;
                    }
                post_items+=  "</div>";
                
            post_items+=  "</div>";
        post_items+=  "</div>";

        return post_items;
    }

    function getPaginationResult(sk_instagram_feed, post_data, page, column_count){
        var start = 0;
        var end = parseInt(column_count);
        var multiplicand = page - 1;
        var return_post_data = [];


        if(page != 1){
            start = multiplicand * end;
            end = start + end;
        }
        if((end - 1) > post_data.length){
            end = post_data.length;
        }
        for(var i = start; i < end; i++){
            return_post_data.push(post_data[i]);
        }
        return return_post_data;
    }

    

    function skLayoutSliderSetting(sk_instagram_feed){
        var autoplay = false;
        var loop = false;
        if(getDsmSetting(sk_instagram_feed, "autoplay") == 1){
            var delay = getDsmSetting(sk_instagram_feed, "delay") * 1500;
            autoplay = {delay: delay};
            loop = true;
        }
        
        var swiper = new Swiper('.sk-instagram-feed .swiper-layout-slider.swiper-container', {
            loop: loop,
            autoplay: autoplay,
            navigation: {
                nextEl: '.sk-instagram-feed .swiper-button-next',
                prevEl: '.sk-instagram-feed .swiper-button-prev',
            },
        });

        if(getDsmSetting(sk_instagram_feed, "autoplay") == 1){
            sk_instagram_feed.find(".swiper-container").hover(function() {
                (this).swiper.autoplay.stop();
            }, function() {
                (this).swiper.autoplay.start();
            });
        }
    }
    
    function skLayoutSliderArrowUI(sk_instagram_feed){

        var arrow_background_color = getDsmSetting(sk_instagram_feed, "arrow_background_color");
        var arrow_color = getDsmSetting(sk_instagram_feed, "arrow_color");
        var arrow_opacity = getDsmSetting(sk_instagram_feed, "arrow_opacity");

        // Apply Opacity
        sk_instagram_feed.find(".swiper-button-prev i,.swiper-button-next i")
        .mouseover(function(){
            jQuery(this).css({
              "opacity":"1",
              "border-color":arrow_background_color,
            });

        }).mouseout(function(){
            jQuery(this).css({
                "border-color": arrow_color,
                "opacity":arrow_opacity
            });
        });

        sk_instagram_feed.find(".swiper-button-prev i,.swiper-button-next i").css({
            "border-color": arrow_color,
            "opacity":arrow_opacity,
            "color": arrow_color 
        });

        // Get the height
        var feed_h = sk_instagram_feed.find('.sk-instagram-feed-item .sk-ig-post-img').innerHeight();
        // position button to center
        var feed_h_2 = feed_h / 2;
        sk_instagram_feed.find(".swiper-button-prev,.swiper-button-next").css({
            "top":feed_h_2 +"px"
        });
    }
    
    


// make widget responsive
function makeResponsive(jQuery, sk_instagram_feed){
    var sk_instagram_feed_width = sk_instagram_feed.width();

    /* smartphones, iPhone, portrait 480x320 phones */
    if(sk_instagram_feed_width<=320){

    }

    /* portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide. */
    else if(sk_instagram_feed_width<=481){
    }

    /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
    else if(sk_instagram_feed_width<=641){
    }

    /* tablet, landscape iPad, lo-res laptops ands desktops */
    else if(sk_instagram_feed_width<=961){

    }

    /* big landscape tablets, laptops, and desktops */
    else if(sk_instagram_feed_width<=1025){

    }

    /* hi-res laptops and desktops */
    else if(sk_instagram_feed_width<=1281){

    }
    /* wider screen */
    else if(sk_instagram_feed_width>1281){

    }
    
    if(getDsmSetting(sk_instagram_feed, "post_item_type") == 1){

        if (getDsmSetting(sk_instagram_feed, 'column_count') == 1) {
            sk_instagram_feed.find('.sk-ig-post-img').css({
                'background-size' : 'contain',
                'background-repeat' : 'no-repeat'
            })
        }

        var thisH = 0;
        var maxHeight = 0;
        jQuery(".sk-instagram-feed-item").each(function(){
            thisH = jQuery(this).outerHeight(true);
            if (thisH > maxHeight) { maxHeight = thisH; }
        });
        jQuery(".sk-instagram-feed-item ").height(maxHeight);
    }
}
function skChangeImageRatio(sk_instagram_feed,column_count,margin_between_images ){
    var masonry_width = "100%";
    if(column_count == 4){
        masonry_width = "25%";
    }
    if(column_count == 3){
        masonry_width = "33.3%";
    }
    if(column_count == 2){
        masonry_width = "50%";
    }

    sk_instagram_feed.find(".sk-instagram-feed-item-sizer").css({"width" : masonry_width});

    sk_instagram_feed.find('.sk-img-sizer').each(function(index, element){
        var _H = jQuery(element).height() + "px";

        jQuery(element).closest('.sk-instagram-feed-item').css({
            'width' : masonry_width,
            'height' : _H,
        });
        var sk_feed_item_w = jQuery(element).closest('.sk-instagram-feed-item').width() - (margin_between_images * 2);
        jQuery(element).closest('div').css({ 
            'width' : sk_feed_item_w,
            'height' : 'auto'
        });
        var sk_feed_item_h = parseInt(jQuery(element).closest('div .sk-instagram-feed-item').find('.sk-ig-post-img').height());
        sk_feed_item_h = sk_feed_item_h < 100 ? 350 : sk_feed_item_h;

        var post_id = jQuery(element).closest('.sk-instagram-feed-item').attr("data-code");

        jQuery(element).closest('div').css({ 
            'height' : sk_feed_item_h+'px',
        });

      
        jQuery(element).closest('.sk-instagram-feed-item').find('.sk-ig-post-hover').css({ 
            'width' : sk_feed_item_w,
            'line-height' : sk_feed_item_h,
            'height' : sk_feed_item_h
        });

        jQuery(element).closest('.sk-instagram-feed-item').find('.sk-ig-post-img').css({ 
            'width' : '100%',
        });

        if(post_id == "CjJGWSrI4pc" && jQuery(document).width() > 500){
            sk_feed_item_h = 453;
        } else if(post_id == "CjJGWSrI4pc" && jQuery(document).width() <= 500){
            sk_feed_item_h = 253;
        }
        jQuery(element).closest('.sk-instagram-feed-item').css({
            'height' : sk_feed_item_h,
            'margin' : margin_between_images + 'px'
        });
    });
    
    var this_height = sk_instagram_feed.find('.sk-ig-post-img').height();
    sk_instagram_feed.find('.sk-ig-post-img').each(function(index, element){ 
        jQuery(element).css('height', (this_height + Math.floor(Math.random() * 100)) + 'px');

        var post_id = jQuery(element).attr("data-code");

        if(post_id == "CjJGWSrI4pc" && jQuery(document).width() > 500){
            jQuery(element).css({ 
                'height' : "403px",
            });
        } else if(post_id == "CjJGWSrI4pc" && jQuery(document).width() <= 500){
            jQuery(element).css({ 
                'height' : "203px",
            });
        }
    });
    // fixMasonry(sk_instagram_feed);
    

}function applyCustomUi(jQuery, sk_instagram_feed){

    // hide 'loading animation' image
    sk_instagram_feed.closest("div.lp-element").css('height','auto'); // QF: https://www.reality-reboot.com/
    sk_instagram_feed.find(".loading-img").hide();


    

    // check if first page
    var feed_width_item =sk_instagram_feed.find('.sk-instagram-feed-item').width();
    // feed width
    var sk_instagram_feed_width = feed_width_item == 0 ? sk_instagram_feed.outerWidth(true).toFixed(0) : sk_instagram_feed.outerWidth(true).toFixed(0) - 8;
    // change height to normal
    var sk_instagram_post_container_width = sk_instagram_feed.find('.sk-ig-all-posts').width();

    // container width
    sk_instagram_feed.css({ 
        'height' : 'auto',
        'display' : 'block'
    });

    if(getDsmSetting(sk_instagram_feed, "layout") == 3){
        sk_instagram_feed_width = sk_instagram_feed.find('.sk-ig-all-posts').width();
        sk_instagram_feed.find('.sk-ww-ig-feed-container').css({
            'padding-bottom' : '10px'
        });
    }

    var column_count = getDsmSetting(sk_instagram_feed,'column_count');
    var mobile_column_count = getDsmSetting(sk_instagram_feed, "mobile_column_count");

    if (column_count && column_count == 0) {
        column_count = 3;
    }
    if (mobile_column_count && mobile_column_count == 0) {
        mobile_column_count = 1;
    }

    if (jQuery(document).width() <= 769) {
        column_count = mobile_column_count ? parseInt(mobile_column_count) : 1;
    }

    column_count = parseInt(column_count);


    /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
    /* || sk_instagram_feed_width<=641*/

    // size settings
    var border_size=0;
    var space_between_images = parseFloat(getDsmSetting(sk_instagram_feed, 'space_between_images'));
    var margin_between_images = parseFloat(parseFloat(space_between_images).toFixed(2) / 2);
    var scroll_width = getScrollbarWidth();
    
    var pic_width = parseFloat((sk_instagram_post_container_width / column_count) - (space_between_images/column_count));
    pic_width = parseFloat(pic_width);
    const aspectRatioWidth = 4;
    const aspectRatioHeight = 5;

    var pic_height = pic_width;

    if (getDsmSetting(sk_instagram_feed, "use_45_ratio") == 1)  {
        pic_height = (pic_width * aspectRatioHeight) / aspectRatioWidth;
    }
    else{
        pic_height = pic_height + 100;
    }

    // font & color settings
    var font_family=sk_instagram_feed.find('.font_family').text();
    var details_bg_color=sk_instagram_feed.find('.details_bg_color').text();
    var details_font_color=sk_instagram_feed.find('.details_font_color').text();
    var details_link_color=sk_instagram_feed.find('.details_link_color').text();
    var details_link_hover_color=sk_instagram_feed.find('.details_link_hover_color').text();
    var button_bg_color=sk_instagram_feed.find('.button_bg_color').text();
    var button_text_color=sk_instagram_feed.find('.button_text_color').text();
    var button_hover_bg_color=sk_instagram_feed.find('.button_hover_bg_color').text();
    var button_hover_text_color=sk_instagram_feed.find('.button_hover_text_color').text();

    setTimeout(function(){ sk_instagram_feed.find('.sk-instagram-feed-item').css('background-image','none'); },500);
    setTimeout(function(){ sk_instagram_feed.find('.sk-instagram-feed-item').css('background-image','none'); },1000);

    if(getSkSetting(sk_instagram_feed,'layout') == 1){
        sk_instagram_feed.find('.sk-ig-all-posts').css({
            'padding' : '3px'
        });
    }

    if(getSkSetting(sk_instagram_feed,'layout') == 2){
        setTimeout(function(){
            skChangeImageRatio(sk_instagram_feed, column_count, margin_between_images);
        },500);
      
    }   
    else{
        sk_instagram_feed.find('.sk-instagram-feed-item').css({
            'width' : pic_width - 4 + 'px',
            'padding' : border_size
        });
    }
       

    // profile username
    var profile_username=getDsmSetting(sk_instagram_feed, "title_all_caps")==1 ? "uppercase" : "normal";
    sk_instagram_feed.find('.sk-ig-profile-usename').css({
        'text-transform' : profile_username,
        'font-size' : getDsmSetting(sk_instagram_feed, "title_font_size") + 'px'
    });

    // default text
    var profile_username=getDsmSetting(sk_instagram_feed, "details_all_caps")==1 ? "uppercase" : "normal";
    sk_instagram_feed.find('.sk-ig-profile-info').css({
        'text-transform' : profile_username,
        'font-size' : getDsmSetting(sk_instagram_feed, "details_font_size") + 'px'
    });
    var post_content_padding = parseInt(getDsmSetting(sk_instagram_feed, 'post_content_padding'));
    post_content_padding = post_content_padding ? post_content_padding : 30;

    if (sk_instagram_feed_width < 520) {
        post_content_padding -= 10;
    }

    sk_instagram_feed.find('.sk-ig-caption').css({
        'font-size' : getDsmSetting(sk_instagram_feed, "details_font_size") + 'px',
        'padding' : post_content_padding + 'px'
    });

    sk_instagram_feed.find('.sk-ago-data').css({
        'font-size' : getDsmSetting(sk_instagram_feed, "details_font_size") + 'px'
    });

    sk_instagram_feed.find('.sk_popup_column_spacer').css({
        'padding' : post_content_padding + 'px'
    });

    
    sk_instagram_feed.find('.sk_popup_column_footer').css({
        'bottom' : post_content_padding + 'px'
    });
    

    

    jQuery('.sk-ig-post-meta').css({
        'text-transform' : profile_username
    });

    // hover
    var hover_width=sk_instagram_feed.find('.sk-instagram-feed-item').width() || Math.floor(pic_width) || 0;
    var hover_height=sk_instagram_feed.find('.sk-ig-post-img').height();

    if(getDsmSetting(sk_instagram_feed, "show_post_hover")==1){
        sk_instagram_feed.find('.sk-ig-post-hover').css({
            'width' : hover_width + 'px',
            'margin' : 0,
            'padding' : 0,
            'line-height' : hover_width + 'px',
        });
    }else{
        sk_instagram_feed.find('.sk-ig-post-hover').css({
            'width' : hover_width + 'px',
            'height' : hover_width + 'px',
            'margin' : 0,
            'padding' : 0,
            'line-height' : hover_width + 'px',
            'background-color' : 'rgba(0, 0, 0, 0)',
            'display' : 'none'
        });
    }

    // fix hover height
    setTimeout(function(){
        // hover    
        var hover_height=sk_instagram_feed.find('.sk-ig-post-img').height();

        if(getDsmSetting(sk_instagram_feed, "show_post_hover")==1){
            sk_instagram_feed.find('.sk-ig-post-hover').css({
                'line-height' : hover_height + 'px',
            });
        }else{
            sk_instagram_feed.find('.sk-ig-post-hover').css({
                'height' : hover_height + 'px',
                'line-height' : hover_height + 'px'
            });
        }
    },500);

    // grid (1), masonry (2) and carousel (3): the card holds image + description,
    // so the hover overlay must cover the image only (not the description).
    // Override the CSS height:100% per item with each item's own image height.
    var clampHoverToImage = function () {
        sk_instagram_feed.find('.sk-instagram-feed-item').each(function () {
            var image_height = jQuery(this).find('.sk-ig-post-img').height();
            if (image_height > 0) {
                jQuery(this).find('.sk-ig-post-hover').each(function () {
                    this.style.setProperty('height', image_height + 'px', 'important');
                    this.style.setProperty('line-height', image_height + 'px', 'important');
                });
            }
        });
    };
    clampHoverToImage();
    // re-run after layout settles (masonry sizes its items via setTimeout)
    setTimeout(clampHoverToImage, 500);
    setTimeout(clampHoverToImage, 1000);

    sk_instagram_feed.find('.sk-ig-post-hover .fa').css({
        'height' : hover_width + 'px',
        'line-height' : hover_width + 'px'
    });

    sk_instagram_feed.find('.sk-ig-profile-usename').css({
        'width' : '100%',
    });

    // resize the actual image as well
    sk_instagram_feed.find('.sk-instagram-feed-item .sk-ig-post-img').css({
        'width' : pic_width - 6 + 'px',
        'height' : pic_height + 'px',
    });
    

    if (getDsmSetting(sk_instagram_feed, 'post_item_type') == 1) {
        sk_instagram_feed.find('.sk-instagram-feed-item .sk-ig-post-img').css({
            'border-top-left-radius' : '8px',
            'border-top-right-radius' : '8px',
            'border-bottom-left-radius' : '0',
            'border-bottom-right-radius' : '0',
        });
    }

    sk_instagram_feed.find('.sk-instagram-feed-item, .sk-ig-post-img').css({
        'border-radius' : getDsmSetting(sk_instagram_feed, 'post_border_radius'),
    });

    if (getDsmSetting(sk_instagram_feed, 'disable_posts') == 1) {
        sk_instagram_feed.find('.sk-instagram-feed-item').css({
            "cursor" : "unset"
        });
    }
    

    // apply font family
    sk_instagram_feed.css({
        'font-family' : font_family,
        'background-color' : details_bg_color
    });

    var widget_padding = getDsmSetting(sk_instagram_feed, 'widget_padding');
    sk_instagram_feed.css({
        'padding' : (widget_padding !== '' && widget_padding !== null && widget_padding !== undefined) ? widget_padding : '24px'
    });

    console.log(getDsmSetting(sk_instagram_feed, 'show_widget_border'))

    if(getDsmSetting(sk_instagram_feed, 'show_widget_border') == 1){
        sk_instagram_feed.css({
            'border' : '2px solid #E5E5E5'
        });
    } else {
        sk_instagram_feed.css({
            'border' : 'none'
        });
    }

    // pop up settings
    jQuery('.sk-pop-ig-post').css({
        'font-family' : font_family
    });

    // details
    sk_instagram_feed.find('.instagram-user-root-container,.sk-ig-profile-usename,.sk-ig-caption, .sk-instagram-feed-item, .sk-ago-data').css({
        'color' : details_font_color
    });

    // details link
    sk_instagram_feed.find('.instagram-user-root-container a,.sk-ig-caption a').css({
        'color' : details_link_color
    });

    sk_instagram_feed.find(".instagram-user-root-container a").mouseover(function() {
        jQuery(this).css({'color' : details_link_hover_color});
    }).mouseout(function() {
        jQuery(this).css({'color' : details_link_color});
    });

    sk_instagram_feed.find(".sk-ig-profile-bio").css({
        "white-space": "pre-line"
        
    });

    sk_instagram_feed.find(".sk-ig-bottom-btn-container").css({
        "display": "block",
        "overflow": "hidden",
        "margin": "0",
        
    });
    // buttons
    var margin_bottom_sk_ig_load_more_posts=space_between_images/2;
    if(margin_bottom_sk_ig_load_more_posts==0){
        margin_bottom_sk_ig_load_more_posts=3;
    }

    sk_instagram_feed.find(".sk-ig-load-more-posts, .sk-ig-bottom-follow-btn").css({
        'margin-bottom' : margin_bottom_sk_ig_load_more_posts + 'px',
    });

    sk_instagram_feed.find(".instagram-user-container, .sk-ig-load-more-posts, .sk-ig-bottom-follow-btn")
        .css({
        'background-color' : button_bg_color,
        'border-color' : button_bg_color,
        'color' : button_text_color
        });

    sk_instagram_feed.find(".instagram-user-container, .sk-ig-load-more-posts, .sk-ig-bottom-follow-btn")
        .mouseover(function(){
        jQuery(this).css({
            'background-color' : button_hover_bg_color,
            'border-color' : button_hover_bg_color,
            'color' : button_hover_text_color
        });
        }).mouseout(function(){
        jQuery(this).css({
            'background-color' : button_bg_color,
            'border-color' : button_bg_color,
            'color' : button_text_color
        });
    });

    // bottom buttons container
    var padding_sk_ig_bottom_btn_container=margin_between_images;
    if(padding_sk_ig_bottom_btn_container==0){
        padding_sk_ig_bottom_btn_container=5;
    }
    sk_instagram_feed.find(".sk-ig-bottom-btn-container").css({
        'padding' : padding_sk_ig_bottom_btn_container + 'px'
    });

    // remove customer class style
    jQuery('.sk-instagram-feed').removeClass('col-sm-3');

    // jQuery(".prev_sk_ig_feed_post, .next_sk_ig_feed_post")
    // .mouseover(function(){
    //     jQuery(".prev_sk_ig_feed_post, .next_sk_ig_feed_post").attr("style", "opacity: 1;");
    // }).mouseout(function(){
    //     jQuery(".prev_sk_ig_feed_post, .next_sk_ig_feed_post").attr("style", "opacity: 0.3;");
    // });
    // .sk-fb-event-item
    sk_instagram_feed.find('.sk-fb-event-item, .sk_powered_by').css({ 
        'margin-bottom' : getDsmSetting(sk_instagram_feed, "space_between_events") + 'px' 
    });

    applyPopUpColors(sk_instagram_feed);

    // reset container width to 100% after sk
    if(sk_instagram_feed.width() > 550){
        sk_instagram_feed.css({ 
            'width' : '100%',
            'display' : 'block'
        });
    }

    if(getDsmSetting(sk_instagram_feed, "layout") == 3){
        var all_post_container_width = sk_instagram_feed.find('.sk-ig-all-posts').width();
        sk_instagram_feed.find('.swiper-container').css({
            'width' : all_post_container_width,
        });
    }

    if(getDsmSetting(sk_instagram_feed,'layout') == 3){
        skLayoutSliderArrowUI(sk_instagram_feed);
        setTimeout(
            function() {
                skLayoutSliderArrowUI(sk_instagram_feed);
        }, 500);
        setTimeout(
            function() {
                skLayoutSliderArrowUI(sk_instagram_feed);
        }, 800);

        /* Arrow positioning handled by CSS for outside placement on mobile */
    }

    // apply custom css
    jQuery('head').append('<style type="text/css">' + getDsmSetting(sk_instagram_feed, "custom_css")  + '</style>');
    makeResponsive(jQuery, sk_instagram_feed);

    sk_instagram_feed.find('.sk-instagram-feed-item-sizer').css({
        'display': 'none'
    });

    sk_instagram_feed.find('.sk-ig-all-posts').css({
        'display': 'grid',
        'grid-template-columns': 'repeat(' + column_count + ', 1fr)',
        'gap': space_between_images + 'px'
    });

    sk_instagram_feed.find('.sk-instagram-feed-item, .sk-ig-post-img').css({
        'width': '100%',
    });

    var sk_layout = getDsmSetting(sk_instagram_feed, 'layout');
    var custom_post_height = parseInt(getDsmSetting(sk_instagram_feed, 'post_height'));
    if ((sk_layout == 1 || sk_layout == 3) && custom_post_height > 0) {
        var card_height = custom_post_height < 100 ? 100 : custom_post_height;
        sk_instagram_feed.find('.sk-instagram-feed-item').each(function () {
            var item = jQuery(this);
            // wrap the content once so the scroll lives inside the card; the card
            // stays overflow:hidden so its rounded corners are never ruined.
            if (item.children('.sk-ig-card-scroll').length === 0) {
                item.children().wrapAll('<div class="sk-ig-card-scroll"></div>');
            }
            item.css({ 'height': card_height + 'px', 'overflow': 'hidden' });
            item.children('.sk-ig-card-scroll').css({ 'height': card_height + 'px' });
        });

        if (!document.getElementById('sk-ig-scrollable-style')) {
            jQuery('head').append(
                '<style type="text/css" id="sk-ig-scrollable-style">' +
                // scrollbar space is reserved at all times so hovering never
                // shifts the content width; the bar is just hidden until hover.
                '.sk-ig-card-scroll{position:relative;box-sizing:border-box;height:100%;overflow-y:scroll;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:transparent transparent;}' +
                '.sk-instagram-feed-item:hover .sk-ig-card-scroll{scrollbar-color:rgba(0,0,0,0.25) transparent;}' +
                '.sk-ig-card-scroll::-webkit-scrollbar{width:6px;}' +
                '.sk-ig-card-scroll::-webkit-scrollbar-track{background:transparent;}' +
                '.sk-ig-card-scroll::-webkit-scrollbar-thumb{background-color:transparent;border-radius:6px;}' +
                '.sk-instagram-feed-item:hover .sk-ig-card-scroll::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,0.25);}' +
                '.sk-instagram-feed-item:hover .sk-ig-card-scroll::-webkit-scrollbar-thumb:hover{background-color:rgba(0,0,0,0.4);}' +
                '</style>'
            );
        }
    }

    setTimeout(function(){
        if(getDsmSetting(sk_instagram_feed, "links_clickable") == 0){
            sk_instagram_feed.find('.href_status_trigger').removeAttr('href');
            sk_instagram_feed.find('.href_status_trigger_container').find('a').removeAttr('href');
        }
    }, 500);

}

function applyPopUpColors(popup_container){
    var pop_up_bg_color = popup_container.find('.pop_up_bg_color').text();
    var pop_up_font_color = popup_container.find('.pop_up_font_color').text();
    var pop_up_link_color = popup_container.find('.pop_up_link_color').text();
    var details_font_size = popup_container.find('.details_font_size').text();

    popup_container.find('.sk-popup-container').css({
        'font-size':details_font_size,
        'color':pop_up_font_color,
        'background':pop_up_bg_color
    });

    popup_container.find('.white-popup a').css({
        'color':pop_up_link_color
    });


    var sk_media_post_pop_up = jQuery('.mfp-s-ready .sk-media-post-pop-up .ig_media').innerHeight();


    var sk_popup_user_container = jQuery('.mfp-s-ready .sk-popup-user-container').innerHeight();
    var sk_ig_feed_m_t_3px = jQuery('.mfp-s-ready .sk-ig-feed-m-t-3px').innerHeight();


    var sk_ig_pic_text = sk_media_post_pop_up - sk_popup_user_container - sk_ig_feed_m_t_3px -110;

    jQuery('.mfp-s-ready .sk-ig-pic-text').css('line-height',' 1.5'); 

    if(jQuery(window).innerWidth() >= 700) {
       jQuery('.mfp-s-ready .sk-ig-pic-text').css('max-height',sk_ig_pic_text);
    } 
    else{
       jQuery('.mfp-s-ready .sk-ig-pic-text').css('max-height','70000');
    }            
}
function getWidgetLayoutWidth(widget) {
    const rw = widget.getBoundingClientRect().width;
    if (rw >= 2) {
        return rw;
    }
    if (widget.offsetWidth >= 2) {
        return widget.offsetWidth;
    }
    let el = widget.parentElement;
    for (let depth = 0; el && depth < 8; depth++) {
        const pw = el.getBoundingClientRect().width;
        if (pw >= 2) {
            return pw;
        }
        el = el.parentElement;
    }
    return window.innerWidth;
}

function getMediaColumn(widget,widgetState,settings){
    let columns;
    const innerWidth = getWidgetLayoutWidth(widget);

    let tablet_size = 767;
    if (widget.parentElement && widget.parentElement.id === 'embed-code-container') {
        tablet_size = 1500;
    }
    if (innerWidth <= 575) {
        columns = widgetState.column_count_small;
    } else if (innerWidth <= tablet_size) {
        columns = Number(settings.column_count) > 2 ? widgetState.column_count_medium : Number(settings.column_count) || 1;
    } else {
        columns =
            Number(settings.column_count) || widgetState.column_count_large || 3;
    }
    if (innerWidth <= 1250 && Number(settings.column_count) > 3) {
        columns = Math.min(columns, 3);
    }
    columns = Math.max(1, Math.min(12, parseInt(columns, 10) || 1));
    return columns;
}
function getMediaColumnCarousel(widget,widgetState,settings){
    let columns;
    const innerWidth = getWidgetLayoutWidth(widget);

    let tablet_size = 900;
    if (widget.parentElement && widget.parentElement.id === 'embed-code-container') {
        tablet_size = 1500;
    }

    if (innerWidth <= 520) {
        columns = widgetState.column_count_small;
    } else if (innerWidth <= tablet_size) {
        columns = widgetState.column_count_medium;
    } else {
        columns =
        Number(settings.column_count) || widgetState.column_count_large || 3;
    }
    if (Number(settings.column_count) < columns) {
        columns = Number(settings.column_count);
    }
    if (innerWidth <= 1250 && Number(settings.column_count) > 3) {
        columns = Math.min(columns, 3);
    }
    return columns;
}
async function skIncreaseView(widgetState) {
    const solution_info = widgetState.widget_data.user_info;
    // track only customer status [1,6,7]
    if (solution_info && solution_info.status && ![1, 6, 7].includes(parseInt(solution_info.status))) {
        return false;
    }
    try {
        // Destructure necessary values from widgetState and widget_data
        const user_id = solution_info.user_id;
        const status = solution_info.status;
        // Get or generate a unique ID
        const widgetId = solution_info.embed_id;
        var sk_views_url = "https://views.sociablekit.com/";
        if(document.URL.includes("local")){
            sk_views_url = "https://localtesting.com/WidgetAnalytics/views/";
        }

        const uniqueId = sessionStorage.getItem('unique_id') || generateUniqueId();

        if (!sessionStorage.getItem('unique_id')) {
            sessionStorage.setItem('unique_id', uniqueId);
        }

        const ipAddress = uniqueId;

        // Prepare payload for tracking views
        const payload = {
            widgetId,
            userId: user_id,
            viewsCount: 1,
            url: getCurrentUrl(),
            ipAddress,
            status,
        };

        // Send tracking data to the server
        const trackResponse = await fetch(sk_views_url + 'track-widget-views.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // Parse and log the server response
        const responseData = await trackResponse.json();
        console.log('Server Response:', responseData);
    } catch (error) {
        // Log errors with contextual information
        console.error('Error in renderViews:', error);
    }
}

function isTooDarkColor(hexColor) {
    let r, g, b;

    if (hexColor.startsWith('#')) {
        r = parseInt(hexColor.substr(1, 2), 16);
        g = parseInt(hexColor.substr(3, 2), 16);
        b = parseInt(hexColor.substr(5, 2), 16);
    }

    if (hexColor.indexOf('rgb') !== -1) {
        const rgbValues = getRGB(hexColor);
        [r, g, b] = rgbValues;
    }

    b = isNaN(b) ? 0 : b;

    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    return yiq < 60;
}

function getRGB(rgbstr) {
    return rgbstr.substring(4, rgbstr.length-1)
        .replace(/ /g, '')
        .replace('(', '')
        .split(',');
}

function getTutorialLinkNew(userInfo) {
    const d = new Date(userInfo.createdAt);
    const date = d.getDate();
    let tutorialLink = "";
    if (userInfo.solution_name) {
        let slug = slugifyString(userInfo.solution_name);
        tutorialLink = "https://www.sociablekit.com/tutorials/embed-" + slug + "-website/";
        if (userInfo.website_builder) {
            slug = slug + "-" + slugifyString(userInfo.website_builder);
            tutorialLink = "https://www.sociablekit.com/tutorials/embed-" + slug + "/";
        }
    }

    if (date % 5 !== 0) {
        switch (userInfo.type) {
            case 4:
                tutorialLink = "https://www.sociablekit.com/tutorials/embed-facebook-feed-website/";
                break;
            case 5:
                tutorialLink = "https://www.sociablekit.com/tutorials/embed-instagram-feed-website/";
                break;
            case 33:
                tutorialLink = "https://www.sociablekit.com/tutorials/embed-linkedin-feed-website/";
                break;
            case 16:
                tutorialLink = "https://www.sociablekit.com/tutorials/embed-youtube-playlist-website/";
                break;
        }
    }
 
    return tutorialLink;
}

function getTutorialLink(userInfo) {
    let tutorialLink = "";

    if (userInfo.solution_name) {
        let slug = slugifyString(userInfo.solution_name);
        tutorialLink = "https://www.sociablekit.com/tutorials/embed-" + slug + "-website/";

        if (userInfo.website_builder) {
            slug = slugifyString(userInfo.website_builder);
            tutorialLink = "https://www.sociablekit.com/tutorials/embed-" + slug;
        }
    }

    if (userInfo.type === 9) {
        tutorialLink = "https://www.sociablekit.com/sync-facebook-page-events-to-google-calendar/";
    } else if (userInfo.type === 26) {
        tutorialLink = "https://www.sociablekit.com/how-to-sync-facebook-group-events-to-google-calendar-on-website/";
    }

    if (tutorialLink && !tutorialLink.endsWith("/")) {
        tutorialLink += "/";
    }

    const linkedinWidgets = [33, 34, 44, 58, 75, 99, 100, 103];
    const facebookWidgets = [1, 4, 9, 10, 11, 36, 38, 43, 12, 24, 26, 49, 2, 8, 3, 18, 19, 28, 30, 61];
    const threadsWidgets = [110];

    if (linkedinWidgets.includes(userInfo.type) && userInfo.embed_id % 2 === 1) {
        let websiteBuilder = userInfo.website_builder ? slugifyString(userInfo.website_builder) : "website";
        tutorialLink = "https://www.sociablekit.com/tutorials/embed-linkedin-feed-" + websiteBuilder + "/";
    } else if (facebookWidgets.includes(userInfo.type) && userInfo.embed_id % 2 === 1) {
        let websiteBuilder = userInfo.website_builder ? slugifyString(userInfo.website_builder) : "website";
        tutorialLink = "https://www.sociablekit.com/tutorials/embed-facebook-feed-" + websiteBuilder + "/";
    } else if (threadsWidgets.includes(userInfo.type) && userInfo.embed_id % 2 === 0) {
        let websiteBuilder = userInfo.website_builder ? slugifyString(userInfo.website_builder) : "website";
        tutorialLink = "https://www.sociablekit.com/tutorials/embed-threads-" + websiteBuilder + "/";
    }

    if (userInfo.type === 5 && userInfo.embed_id % 2 === 1) {
        tutorialLink = tutorialLink.replace("profile", "feed");
    }

    return tutorialLink;
}
const errorCSS = `
:root {
    --sk-primary: #1972f5;
    --sk-text-light: #ffffff;
    --sk-radius: 12px;
    --sk-padding: 30px;
    --sk-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Error Container */
.sk_error_message {
    font-family: var(--sk-font);
    font-size: 16px;
    line-height: 24px;
    background-color: var(--sk-primary);
    color: var(--sk-text-light);
    padding: var(--sk-padding);
    border-radius: var(--sk-radius);
    box-sizing: border-box;
}

/* Ensure children inherit cleanly */
.sk_error_message * {
    font-family: inherit;
    box-sizing: inherit;
}

/* Links */
.sk_error_message a {
    color: var(--sk-text-light);
    text-decoration: underline;
    font-weight: 500;
    transition: opacity 0.2s ease;
}

.sk_error_message a:hover {
    opacity: 0.85;
}

/* Lists */
.sk_error_message ul {
    padding-left: 18px;
    margin: 10px 0 0;
}

.sk_error_message li {
    margin-bottom: 6px;
}

/* Headings */
.sk_error_message h4 {
    margin: 0 0 10px;
    font-size: 17px;
    font-weight: 600;
}

/* Paragraphs */
.sk_error_message p {
    margin: 10px 0;
}

/* Empty Jobs State */
.sk-jobs-none {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    text-align: center;
}

.sk-jobs-none p {
    font-weight: 600;
    font-size: 18px;
    margin: 0;
}

/* Responsive */
@media (max-width: 480px) {
    .sk_error_message {
        padding: 16px;
        font-size: 14px;
    }

    .sk_error_message h4 {
        font-size: 16px;
    }

    .sk-jobs-none p {
        font-size: 16px;
    }
}

.sk_error_message{
    font-family: Inter, Arial, Helvetica, sans-serif !important;
    font-size: 16px;
    line-height: 30px;
    background-color: #DCEBFE;
    color: #404040;
    padding: 20px 45px;
    border-radius: 16px;
    max-width: 770px;
    padding: 32px;
}

.sk_error_message * {
    font-family: Inter, Arial, Helvetica, sans-serif !important;
}

.sk_error_header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 24px;
}

.sk_error_message_text {
    padding: 24px;
    margin: 0 !important;
    padding-top: 0;
}

.sk_error_header h4 {
    font-size: 30px;
    font-weight: 600;
    color: #0C1736;
    margin-left: 16px;
    letter-spacing: -1px;
    line-height: 1.2;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.sk_error_message a{
    color: #1559EA !important;
    text-decoration: underline !important;
    font-weight: normal !important;
}

.sk_error_message_loader {
    width: 58px;
    height: 58px;
    animation: spin 2s linear infinite;
}

.sk-jobs-none {
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.sk-jobs-none p {
    font-weight: bold;
    font-size: 21px;
    color: inherit;
    font-family: "Arial";
}

.sk_error_progress_label {
    font-size: 14px;
    color: #404040;
    margin-bottom: 10px;
    font-weight: 600;
}

.sk_error_progress_bar {
    width: 100%;
    height: 22px;
    background-color: #BEDBFE;
    border-radius: 55px;
}

@keyframes fill {
    from {
        width: 0;
    }
    to {
        width: 70%%;
    }
}

.sk_error_progress_bar_fill {
    height: 100%;
    background-color: #1447E6;
    animation: fill 1s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 55px;
}

.sk_error_progress_bar_fill_text {
    font-size: 16px;
    color: #fff;
    font-weight: 500;
}

.sk_error_estimation {
    display: flex;
    align-items: center;
    font-size: 18px;
    margin-top: 10px;
    color: #404040;
    margin-bottom: 10px;
    font-weight: 500;
}

.sk_error_estimation span {
    width: 18px;
    height: 18px;
    margin-right: 5px;
    display: inline-flex;
}

.sk_error_estimation img {
    width: 100%;
    height: 100%;
}

.sk_error_status {
    display: flex;
    flex-direction: column;
}

.sk_error_status > p {
    font-size: 14px;
    color: #404040;
    margin-bottom: 10px;
    font-weight: 600;
}

.sk_error_status_row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 20px;
}

.sk_error_status_row > p {
    line-height: 1;
    margin: 0;
    padding: 0;
}

.sk_error_status_row img {
    margin-right: 10px;
    width: 18px;
    height: 18px;
}

.sk_error_status_row > div {
    display: flex;
    align-items: center;
    
}

.sk_error_connection img {
    margin-left: 2px;
    width: 16px;
    height: 16px;
}

.sk_error_connection {
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;
    color: #149041;
}

.sk_error_fetching {
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;
    color: #1559EA;
}

.sk_error_final {
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;
    color: #A3A3A3;
    margin-bottom: 0 !important;
}

.sk_error_fetching img {
    animation: spin 2s linear infinite;
}

.sk_error_footer {
    margin-top: 32px !important;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-top: 1px solid #BEDBFE;
    padding-top: 32px !important;
    padding-top: 0px;
}

.sk_error_footer p {
    font-size: 16px;
    color: #404040;
    line-height: 20px;
    margin: 0 !important;
}

.sk_error_footer button {
    background: none;
    border: none;
    color: #1559EA;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    margin: 0;
    padding: 0;
}

.sk_error_footer button:hover {
    cursor: pointer;
    color:rgb(94, 134, 222);
}

@media (max-width: 768px) {
    .sk_error_message {
        padding: 2rem;
    }
    .sk_error_header {
        flex-direction: column;
        align-items: flex-start;
        padding: 0;   
    }
    .sk_error_header h4 {
        padding: 0;
        margin: 0;
        margin-top: 1rem;
    }
    .sk_error_message_text {
        padding: 0;
    }
    .sk_error_footer {
        padding-top: 1rem;
        border-top: 1px solid #BEDBFE;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .sk_error_footer p {
        text-align: left;
        margin: 0;
        padding: 0;
    }
}
`;

function injectStylesOnce() {
    if (!document.getElementById('sk-error-style')) {
        const style = document.createElement('style');
        style.id = 'sk-error-style';
        style.textContent = errorCSS;
        document.head.appendChild(style);
    }
}

function getTutorialLink(user_info) {
    if (user_info.type == 9) {
        return "https://www.sociablekit.com/sync-facebook-page-events-to-google-calendar/";
    }
    if (user_info.type == 26) {
        return "https://www.sociablekit.com/how-to-sync-facebook-group-events-to-google-calendar-on-website/";
    }
    if (user_info.solution_name) {
        return 'https://www.sociablekit.com/tutorials/embed-' + slugifyString(user_info.solution_name) + '-website/';
    }
    return "#";
}

function generateBlueMessage(_sk, user_info) {
    const tutorialLink = getTutorialLink(user_info);

    // ❌ Widget does not exist
    if (user_info.widget_status == 1) {
        return '<div class="sk_error_message">' +
            '<p style="text-align:center;margin:1rem;">The widget does not exist. If you think this is a mistake, please contact support.</p>' +
            '</div>';
    }

    // ❌ Feed disabled
    if (!user_info.show_feed) {
        if (user_info.message) return user_info.message;

        return '<ul class="sk_error_message">' +
            '<li><a href="' + tutorialLink + '" target="_blank">' + user_info.solution_name + ' powered by SociableKIT</a></li>' +
            '<li>If you’re the owner of this website or SociableKIT account used, we found some errors with your account.</li>' +
            '<li>Please login your SociableKIT account to fix it.</li>' +
            '</ul>';
    }

    // ❌ Invalid solution
    if (!user_info.solution_name && !user_info.type && !user_info.start_date) {
        return '<p class="sk_error_message">The SociableKIT solution does not exist. If you think this is a mistake, please contact support.</p>';
    }

    let sk_app_images = "https://sociablekit.com/app/images/";
    if(document.URL.includes("local")){
        sk_app_images = "https://localtesting.com/SociableKIT_App/images/";
    }

    let social_platform = user_info.solution_name?.split(" ")?.[0] || user_info.category_name;

    // ⏳ Syncing state
    let sk_error_message = '<div class="sk_error_message">' +
        '<div style="display: inline-flex;width:100%;">' +
            '<div>' +
                '<div class="sk_error_header">' +
                    '<img class="sk_error_message_loader" src="' + sk_app_images + 'loader-2.svg" alt="SociableKIT Spinner">' +
                    '<h4>Syncing your ' + user_info.solution_name + ' widget.</h4>' +
                '</div>' +
                '<p class="sk_error_message_text">We\'re currently syncing your <a href="' + tutorialLink + '" target="_blank">' + user_info.solution_name + ' widget</a>. This usually takes a few minutes. We appreciate your patience while we make sure everything is up to date.</p>' +
                '<p class="sk_error_progress_label">PROGRESS</p>' +
                '<div class="sk_error_progress_bar">' +
                    '<div class="sk_error_progress_bar_fill" style="width: 70%;"><span class="sk_error_progress_bar_fill_text">70%</span></div>' +
                '</div>' +
                '<div class="sk_error_estimation"><span><img src="' + sk_app_images + 'clock.svg" alt="Clock"> </span>A couple of minutes remaining</div>' +
                    '<div class="sk_error_status">' +
                        '<p>SYNC PROGRESS</p>' +
                        '<div class="sk_error_connection sk_error_status_row">' +
                            '<div><img src="' + sk_app_images + 'success.svg" alt="Successful Process">Connected to ' + social_platform + '</div>' +
                            '<p>Done</p>' +
                        '</div>' +
                        '<div class="sk_error_fetching sk_error_status_row">' +
                            '<div><img src="' + sk_app_images + 'current.svg" alt="Current process"> </span>Fetching Data</div>' +
                            '<p>In Progress</p>' +
                        '</div>' +
                        '<div class="sk_error_final sk_error_status_row">' +
                            '<div><img src="' + sk_app_images + 'waiting.svg" alt="Waiting Process"> </span>Finalizing  sync</div>' +
                            '<p></p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="sk_error_footer">' +
                        '<span><img src="' + sk_app_images + 'support.svg" alt="Support"> </span>' +
                        '<p>If you think there is a problem, <button>Chat with support</button> here. we will solve it for you.</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    return sk_error_message;
}

function generateExtraTips(_sk, user_info) {
    switch (user_info.type) {
        case 5:
            const username = getDsmSetting(_sk, 'username');
            return '<li>Make sure your Instagram account <a href="https://www.instagram.com/' + username + '" target="_blank"><b>@' + username + '</b></a> is connected.</li>';
        case 22:
        case 39:
            return '<li>Make sure you selected the correct Google Place or the <a href="https://www.sociablekit.com/how-to-identify-google-place-id/" target="_blank"><b>Google Place ID</b></a> is correct.</li>';
        case 101:
            return '<li>Make sure you have <a href="https://www.sociablekit.com/add-sociablekit-as-your-contact-on-whatsapp/" target="_blank"><b>added SociableKIT as your contact on WhatsApp</b></a>.</li>';
        default:
            return '<li>Please make sure that the <b>Source ID/Username</b> you entered is correct.</li>';
    }
}

function handleSupportButtonClick() {
    if((document.URL.includes("localtesting.com") && !document.URL.includes("localtesting.com/SociableKIT_Widgets")) || document.URL.includes("sociablekit.com")){
        $crisp.push(['do', 'chat:open'])
        return;
    } 

    window.open('https://www.sociablekit.com/support/', '_blank');
}

function generateSolutionMessage(container, embed_id, sk_api_url) {
injectStylesOnce();

    fetchEmbedInfo(embed_id, sk_api_url)
        .then((data) => {
            if (Boolean(data.encoded) && data.type == "33") {
                container.innerHTML =
                    '<div class="sk-jobs-none">' +
                    '<p>No posts yet.</p>' +
                    '<p>Please try again later.</p>' +
                    '</div>';
                return;
            }

            container.innerHTML = generateBlueMessage(container, data);
            const supportButton = container.querySelector('.sk_error_footer button');
            if(supportButton){
                supportButton.addEventListener('click', handleSupportButtonClick);
            }
        })
        .catch(console.error);
}

async function fetchEmbedInfo(embed_id, sk_api_url) {
    let jsonUrl = sk_api_url + "api/user_embed/info/" + embed_id;
    
    try {
        const response = await fetch(jsonUrl, { method: "GET" });
        const data = response.json();
        return data;
    } catch (err) {
        throw Error("Failed to fetch embed info")
    }

}

function slugifyString(str){

    if (typeof str === 'string' && str !== null) {
        str = str.replace(/^\s+|\s+$/g, '');
    } else {
        str = '';
    }

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}

function skGetEnvironmentUrls(folder_name) {
    // auto detect live and dev version
    var scripts = document.getElementsByTagName("script");
    var scripts_length = scripts.length;
    var search_result = -1;
    var other_result = -1;
    var app_url = "https://widgets.sociablekit.com/";
    var app_backend_url = "https://api.accentapi.com/v1/";
    var app_file_server_url = "https://data.accentapi.com/feed/";
    var sk_app_url = "https://sociablekit.com/app/";
    var sk_api_url = "https://api.sociablekit.com/";
    var sk_img_url = "https://data-image.sociablekit.com/";
    var sk_clicks_url = "https://clicks.sociablekit.com/";
    var sk_scrolls_url = "https://scrolls.sociablekit.com/";
    var sk_views_url = "https://views.sociablekit.com/";
    var sk_fb_sync_url = "https://facebook-sync.sociablekit.com/";
    var sk_yt_syc_url = "https://youtube-sync.sociablekit.com/";
    for (var i = 0; i < scripts_length; i++) {
        var src_str = scripts[i].getAttribute('src');
        if (src_str != null) {
            var other_folder = "";
            if (folder_name == 'facebook-page-playlists') {
                other_folder = 'facebook-page-playlist';
            } else if (folder_name == 'linkedin-page-posts') {
                other_folder = 'linkedin-page-post';
            } else if (folder_name == 'linkedin-profile-posts') {
                other_folder = 'linkedin-profile-post';
            } else if (folder_name == 'facebook-hashtag-posts') {
                other_folder = 'facebook-hashtag-feed';
            } else if (folder_name == 'facebook-page-events') {
                other_folder = 'facebook-events';
            } else if (folder_name == 'facebook-page-posts') {
                other_folder = 'facebook-feed';
                if (document.querySelector(".sk-ww-facebook-feed")) {
                    var element = document.getElementsByClassName("sk-ww-facebook-feed")[0];
                    element.classList.add("sk-ww-facebook-page-posts");
                }
            }
            other_result = src_str.search(other_folder);
            search_result = src_str.search(folder_name);
            // app-dev found if greater than or equal to 1
            if (search_result >= 1 || other_result >= 1) {
                var src_arr = src_str.split(folder_name);
                app_url = src_arr[0];

                // replace if displaysocialmedia.com
                app_url = app_url.replace("displaysocialmedia.com", "sociablekit.com");
                // get app backend url
                if (app_url.search("local") >= 1) {
                    app_backend_url = "http://localhost:3000/v1/";
                    app_url = "https://localtesting.com/SociableKIT_Widgets/";
                    app_file_server_url = "https://localtesting.com/SociableKIT_FileServer/feed/";
                    sk_app_url = "https://localtesting.com/SociableKIT/";
                    sk_api_url = "http://127.0.0.1:8000/";
                    sk_img_url = "https://localtesting.com/SociableKIT_Data_Image/";
                    sk_fb_sync_url = "https://localtesting.com/SociableKIT_Facebook_Sync/";
                    sk_scrolls_url = "https://localtesting.com/WidgetAnalytics/scrolls/";
                    sk_views_url = "https://localtesting.com/WidgetAnalytics/views/";
                    sk_clicks_url = "https://localtesting.com/WidgetAnalytics/clicks/";
                    sk_yt_syc_url = "https://localtesting.com/SociableKIT_YouTube_Sync/";
                } else {
                    app_url = "https://widgets.sociablekit.com/";
                    sk_scrolls_url = "https://scrolls.sociablekit.com/";
                    sk_views_url = "https://views.sociablekit.com/";
                    sk_clicks_url = "https://clicks.sociablekit.com/";
                }
            }
        }
    }

    var current_host = (window.location.hostname || "").toLowerCase();
    if (
        current_host === "localtesting.com"
    ) {
        app_file_server_url = "https://localtesting.com/SociableKIT_FileServer/feed/";
    }

    return {
        "app_url": app_url,
        "app_backend_url": app_backend_url,
        "app_file_server_url": app_file_server_url,
        "sk_api_url": sk_api_url,
        "sk_app_url": sk_app_url,
        "sk_img_url": sk_img_url,
        "sk_scrolls_url": sk_scrolls_url,
        "sk_views_url": sk_views_url,
        "sk_clicks_url": sk_clicks_url,
        "sk_yt_syc_url" : sk_yt_syc_url,
        "sk_fb_sync_url": sk_fb_sync_url
    };
}

function getEnvironmentUrls(widgetState, key) {
    const env_urls = skGetEnvironmentUrls(key);
    widgetState.app_url = env_urls.app_url;
    widgetState.app_backend_url = env_urls.app_backend_url;
    widgetState.app_file_server_url = env_urls.app_file_server_url;
    widgetState.sk_img_url = env_urls.sk_img_url;
    widgetState.sk_app_url = env_urls.sk_app_url;
    widgetState.sk_api_url = env_urls.sk_api_url;
    widgetState.sk_clicks_url = env_urls.sk_clicks_url;
    widgetState.sk_scrolls_url = env_urls.sk_scrolls_url;
    widgetState.sk_views_url = env_urls.sk_views_url;
    widgetState.sk_yt_syc_url = env_urls.sk_yt_syc_url;
}

function renderClick(widget,widgetState){
    // Add event listener for all clickable elements in the widget
    const { sk_clicks_url,widget_data } = widgetState;
    const { solution_info, settings, user_info } = widget_data;
    let user_id =
        (solution_info && solution_info.user_id) ||
        (settings && settings.user_id) ||
        (user_info && user_info.user_id);

    // track only customer status [1,6,7]
    if (solution_info && solution_info.status && ![1, 6, 7].includes(parseInt(solution_info.status))) {
        return false;
    }

    widget.addEventListener('click', (event) => {
        const target = event.target;
        let elementType = '';
        let elementContent = '';

        // Determine the type and content of the clicked element
        elementType = target.tagName.toLowerCase(); // Use the tag name as the element type

        // Get meaningful content based on the tag type or attributes
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
            elementContent = target.innerText.trim() || target.getAttribute('href') || 'Unnamed Element';
        } else if (target.tagName === 'IMG') {
            elementContent = target.getAttribute('alt') || target.getAttribute('src') || 'Unnamed Image';
        } else if (target.tagName === 'VIDEO' || target.tagName === 'AUDIO') {
            elementContent = target.getAttribute('src') || 'Unnamed Media';
        } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            elementContent = target.value || 'Unnamed Input';
        } else {
            elementContent = (target.innerText ? target.innerText.trim() : '') || target.className || ('Unnamed ' + elementType);
        }
        // Get the widgetId from the widget container
        const widgetId = widget.getAttribute('data-embed-id');

        if (elementType) {
            // Send click data to the backend
            fetch(sk_clicks_url+'track-widget-click.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    widgetId: widgetId,
                    userId: user_id,
                    url: getCurrentUrl(),
                    elementType,
                    elementContent,
                }),
            })
                .then((response) => response.json())
                .then((data) => console.log('Click logged:', data))
                .catch((error) => console.error('Error logging click:', error));
        }
    });
}
function renderScroll(widget,widgetState){

    // Add event listener for all clickable elements in the widget
    const { sk_scrolls_url,widget_data } = widgetState;
    const { solution_info, settings, user_info } = widget_data;
    let user_id =
        (solution_info && solution_info.user_id) ||
        (settings && settings.user_id) ||
        (user_info && user_info.user_id);

    // track only customer status [1,6,7]
    if (solution_info && solution_info.status && ![1, 6, 7].includes(parseInt(solution_info.status))) {
        return false;
    }
    
    let scrollCount = 0;
    let scrollTimeout;
    let uniqueId = null;
    const widgetId = widget.getAttribute('data-embed-id');

    // Save unique ID to sessionStorage to keep it persistent
    try {
        uniqueId = sessionStorage.getItem('unique_id') || generateUniqueId();
        if (!sessionStorage.getItem('unique_id')) {
            sessionStorage.setItem('unique_id', uniqueId);
        }
    } catch (e) {
        uniqueId = generateUniqueId();
    }
    
    // Scroll event listener
    window.addEventListener('scroll', () => {
        scrollCount++;
        // Clear the previous timeout and set a new one
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(sendScrollData, 2000); // Send data 1 second after scrolling stops
    });
    
    // Send scroll data to the server
    function sendScrollData() {
        if (scrollCount > 0) {
            fetch(sk_scrolls_url + 'track-widget-scroll.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    widgetId: widgetId,
                    userId: user_id,
                    scrollCount: scrollCount,
                    url: getCurrentUrl(),
                    uniqueId: uniqueId
                })
            })
            .then(response => response.json())
            .then(data => console.log('Scroll Server Response:', data))
            .catch(error => console.error('Error:', error));
    
            // Reset scroll count after sending
            scrollCount = 0;
        }
    }
}
// Function to generate a unique ID (fallback for unique identification)
function generateUniqueId() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in "Y-m-d" format
    return 'USER:' + (Math.random().toString(36).substr(2, 16)).toUpperCase() + currentDate; // Concatenate the date to the unique ID
}
async function renderViews(widget, widgetState) {
    const embedId = widgetState?.embedId;
    if (!embedId) return;

    window.__skViewsTracked ??= new Set();
    window.__skViewsInflight ??= new Set();

    if (window.__skViewsTracked.has(embedId)) return;

    if (window.__skViewsInflight.has(embedId)) return;
    window.__skViewsInflight.add(embedId);

    try {
        window.__skViewsTracked.add(embedId);

        // Destructure necessary values from widgetState and widget_data
        const { sk_views_url, widget_data } = widgetState;
        const { solution_info, settings, user_info } = widget_data;

        let user_id =
            (solution_info && solution_info.user_id) ||
            (settings && settings.user_id) ||
            (user_info && user_info.user_id);

        let status =
            (solution_info && solution_info.status) ||
            (settings && settings.status) ||
            (user_info && user_info.status);

        // track only customer status [1,6,7]
        if (solution_info && solution_info.status && ![1, 6, 7].includes(parseInt(solution_info.status))) {
            return false;
        }

        // Get or generate a unique ID
        let uniqueId = null;
        const widgetId = widget.getAttribute('data-embed-id');

        // Save unique ID to localStorage if not already present
        try {
            uniqueId = sessionStorage.getItem('unique_id') || generateUniqueId();
            if (!sessionStorage.getItem('unique_id')) {
                sessionStorage.setItem('unique_id', uniqueId);
            }
        } catch (e) {
            uniqueId = generateUniqueId();
        }

        const ipAddress = uniqueId;
        
        // Prepare payload for tracking views
        const payload = {
            widgetId,
            userId: user_id,
            viewsCount: 1,
            url: getCurrentUrl(),
            ipAddress,
            status,
        };

        // Send tracking data to the server
        const trackResponse = await fetch(sk_views_url + 'track-widget-views.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // Parse and log the server response
        const responseData = await trackResponse.json();
        console.log('Views Server Response:', responseData);
    } catch (error) {
        // Log errors with contextual information
        console.error('Error in renderViews:', error);
    }
    finally {
        window.__skViewsInflight.delete(embedId);
    }
}

function skLoader(container) {
    const loaderHTML =
        '<div class=\'sk-widget-loader\' style=\'text-align:center; width:100%; height:auto;\'>' +
        '<svg xmlns="http://www.w3.org/2000/svg" style="margin: auto; display: block; shape-rendering: auto;" width="138px" height="138px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
        '<circle cx="50" cy="50" fill="none" stroke="#1F67ED" stroke-width="5" r="23" stroke-dasharray="108.38 38.13">' +
        '<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.6s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
        '</circle>' +
        '</svg>' +
        '</div>';

    const showLoader = () => {
        const loader = container.querySelector('.sk-widget-loader');
        if (!loader) {
            container.insertAdjacentHTML('afterbegin', loaderHTML);
        }
    }

    // use { offset } to adjust timing of when to remove loader
    // Used in widgets with additional setTimeout (eg. fb-page-events)  
    const hideLoader = ({ offset } = {}) => {
        const loader = container.querySelector('.sk-widget-loader');
        if (loader) {
            if (offset) {
                setTimeout(() => {
                    loader.style.display = 'none';
                }, offset)
            } else {
                loader.style.display = 'none';
            }
        }
    }

    return { showLoader, hideLoader };
}

function addLoader(widget, widgetState) {
    widget.insertAdjacentHTML('beforeend',
        '<div class=\'first_loading_animation\' style=\'text-align:center; width:100%;\'><img src=\'' + widgetState.sk_app_url + 'images/loader.svg\' class=\'loading-img\' style=\'width:auto !important; display: inline-block !important;\' /></div>'
    )
}

async function sendGchatAlert(payload, widgetState) {
    const { sk_app_url, widget_data } = widgetState;
    const { embed_id } = widget_data.solution_info;

    let baseUrl = "https://alert.sociablekit.com/google-alert.php";
    const localIdentifiers = ["localhost", "127.0.0.1", "localtesting"];

    if (localIdentifiers.some(id => window.location.hostname.includes(id))) {
        baseUrl = "https://localtesting.com/Codalify_Alerts/google-alert.php";
    }

    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.text();
        return result;
    } catch (error) {
        console.error("Error sending GChat alert:", error);
    }
}

function fixMasonryListener(widget, widgetState, realignMasonry) {
    const wrapper = widget.querySelector('.sk-posts-masonry, .sk-events-masonry');
    if (!wrapper) return;


    let resizeTimeout;


    const debounceRealign = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            realignMasonry(widget, widgetState);
        }, 100);
    };

    const resizeObserver = new ResizeObserver(() => debounceRealign());

    const observeItems = () => {
        wrapper.querySelectorAll('.sk-post-item').forEach(item => {
            resizeObserver.observe(item);
        });
    };

    const mutationObserver = new MutationObserver(() => {
        observeItems(); // re-observe new items
        debounceRealign(); // optional: realign immediately on DOM change
    });

    // Observe container width/height changes
    resizeObserver.observe(wrapper);

    // Observe existing items
    observeItems();

    // Watch for added/removed items
    mutationObserver.observe(wrapper, {
        childList: true,
        subtree: true
    });
}

function layoutOrderedMasonryItems(widget, widgetState, options = {}) {
    const wrapperSelector = options.wrapperSelector || '.sk-events-masonry, .sk-posts-masonry';
    const itemSelector = options.itemSelector || '.sk-event-item, .sk-post-item';
    const masonry = widget.querySelector(wrapperSelector);
    if (!masonry) return;

    const { settings } = widgetState.widget_data;
    const columns = typeof options.getColumns === 'function'
        ? options.getColumns(widget, widgetState)
        : getMediaColumn(widget, widgetState, settings);

    widget.style.setProperty("--column-count", columns);

    const items = Array.from(masonry.querySelectorAll(itemSelector));
    if (!items.length) {
        masonry.style.height = "0px";
        return;
    }

    const gap = options.gap != null
        ? options.gap
        : Math.max(16, parseInt(getComputedStyle(widget).getPropertyValue("--space-between-events"), 10) || 16);

    const width = masonry.getBoundingClientRect().width;
    const columnWidth = columns > 1 ? (width - (columns - 1) * gap) / columns : width;
    const columnHeights = Array(columns).fill(0);

    items.forEach((item) => {
        item.style.position = "absolute";
        item.style.width = columnWidth + "px";
        item.style.left = "0";
        item.style.top = "0";
    });

    items.forEach((item, index) => {
        const columnIndex = index % columns;
        item.style.top = columnHeights[columnIndex] + "px";
        item.style.left = columns > 1 ? columnIndex * (columnWidth + gap) + "px" : "0px";
        item.style.transform = "";
        item.style.opacity = "";
        columnHeights[columnIndex] += item.offsetHeight + gap;
    });

    masonry.style.height = Math.max(...columnHeights) + "px";
}

/**
 * Similar to fixMasonryListener, but keeps the order of the original events
 * Doesn't re-order elements by height
 * Check eventbrite-events/new/widget/masonry.php for usage
 */
function fixOrderedMasonryListener(widget, widgetState, options = {}) {
    const wrapperSelector = options.wrapperSelector || '.sk-events-masonry, .sk-posts-masonry';
    const itemSelector = options.itemSelector || '.sk-event-item, .sk-post-item';
    const wrapper = widget.querySelector(wrapperSelector);
    if (!wrapper) return;

    if (typeof widgetState.orderedMasonryCleanup === 'function') {
        widgetState.orderedMasonryCleanup();
    }

    let resizeTimeout;
    let isLayouting = false;
    const observedItems = new WeakSet();

    const relayout = () => {
        if (isLayouting) return;
        isLayouting = true;
        layoutOrderedMasonryItems(widget, widgetState, options);
        requestAnimationFrame(() => {
            isLayouting = false;
        });
    };

    const debounceRealign = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(relayout, 100);
    };

    const resizeObserver = new ResizeObserver(() => {
        debounceRealign();
    });

    const observeItems = () => {
        wrapper.querySelectorAll(itemSelector).forEach((item) => {
            if (!observedItems.has(item)) {
                resizeObserver.observe(item);
                observedItems.add(item);
            }
        });
    };

    const mutationObserver = new MutationObserver((mutations) => {
        const hasChildChanges = mutations.some((mutation) => mutation.type === 'childList');
        if (!hasChildChanges) return;
        observeItems();
        debounceRealign();
    });

    resizeObserver.observe(wrapper);
    observeItems();

    mutationObserver.observe(wrapper, {
        childList: true,
        subtree: false,
    });

    widgetState.orderedMasonryCleanup = () => {
        clearTimeout(resizeTimeout);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
        widgetState.orderedMasonryCleanup = null;
    };
}

function observeImages(img, callback) {
  if (img.tagName === 'IMG') {
    if (img.complete) {
      callback()
    } else {
      img.addEventListener('load', callback);
    }
  }
};

function debounceGlobal(func, delay) {
    let timeoutId;
    return function (...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

function fixMasonryGlobal(widget, widgetState) {
    const timeouts = [0, 1000, 3000, 5000, 8000, 10000];

    timeouts.forEach(delay => {
        setTimeout(() => realignMasonry(widget, widgetState), delay);
    });
}

function decodeHtmlEntities(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

function initUpdatePreview(widget, widgetState, renderLayout, applySettings, classNames = {}) {
    const {
        body = '.sk-posts-body',
        header = '.sk-posts-header',
        footer = '.sk-posts-footer'
    } = classNames;

    window.addEventListener("previewDataUpdated", (event) => {
        const previewData = event.detail.previewData;
        widgetState.widget_data.settings = {
            ...widgetState.widget_data.settings,
            ...previewData.settings,
        };

        if (widget) {
            widget.innerHTML = "";
        }

        widgetState.hasBeenEdited = true

        renderLayout(widget, widgetState);
        applySettings(widget, widgetState);

        const postsBody = widget.querySelector(body);
        if (postsBody) postsBody.style.visibility = "visible";

        const postsHeader = widget.querySelector(header);
        if (postsHeader) postsHeader.style.visibility = "visible";

        const postsFooter = widget.querySelector(footer);
        if (postsFooter) postsFooter.style.visibility = "visible";

        if (window.location.pathname.includes('widgets/update')) {
            // class for determining if the widget has re-rendered
            widget.classList.add('--sk-disable-anim'); 
        }
    });
}

function renderedCharCount(htmlString) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  const renderedText = tempDiv.textContent || tempDiv.innerText || "";
  return renderedText.length;
}

function getCurrentUrl() {
    const isInIframe = window.self !== window.top;
    let embedUrl = isInIframe ? (document.referrer || window.location.href) : window.location.href;
    embedUrl = (embedUrl || "").split('?')[0];
    return embedUrl;
}

function applyImageFallback(img, sources) {
    const validSources = sources.filter(Boolean);
    if (!img || validSources.length === 0) return;

    let index = 0;

    img.src = validSources[index];

    img.onerror = () => {
        index++;

        if (index < validSources.length) {
            img.src = validSources[index];
        } else {
            img.onerror = null;
        }
    };
}

function decodeFontString(font) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = font;
    return textarea.value;
}

function isSafeFont(font) {
    const decodedFont = decodeFontString(font);

    var web_safe_fonts = [
        "Arial",
        "Inherit",
        "Impact, Charcoal, sans-serif",
        "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
        "Century Gothic, sans-serif",
        "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
        "Verdana, Geneva, sans-serif",
        "Copperplate, 'Copperplate Gothic Light', fantasy",
        "'Courier New', Courier, monospace",
        "Georgia, Serif"
    ];

    return web_safe_fonts.indexOf(decodedFont) !== -1;
}

function getTwitchPlayerParents() {
    console.log('getTwitchPlayerParents');
    let parentDomain = "";
    try {
        const hostname = new URL(window.location.href).hostname || "";
        const parts = hostname.split(".").filter(Boolean);
        if (parts.length >= 2) {
            parentDomain = parts.slice(-2).join(".");
        } else {
            parentDomain = hostname;
        }
    } catch (e) {
        parentDomain = "";
    }

    const wwwParentDomain = parentDomain ? "www." + parentDomain : "";

    return Array.from(new Set([
        "widgets.sociablekit.com",
        "www.widgets.sociablekit.com",
        "sociablekit.com",
        "www.sociablekit.com",
        "da.sociablekit.com",
        "www.twitch.tv",
        "twitch.tv",
        "twitchmetrics.net",
        "www.twitchmetrics.net",
        parentDomain,
        wwwParentDomain,
        "www.takingitpersonally.net",
        "www.globalmusicradio.co.uk",
        "sites.google.com",
        "gstatic.com",
        "www.gstatic.com",
        "www.thetadpoleexperiment.org",
        "thetadpoleexperiment.org",
        "www.aquaticgenlab.com",
        "www.gnosisgod.com",
        "www.lovepuppygames.com",
        "882023065-atari-embeds.googleusercontent.com",
        "localhost",
    ].filter(Boolean)));
}function skGetBranding(sk, widgetState) {

    let userInfo = "";
    let widgetSettings = "";

    if(widgetState.widget_data){
        userInfo = widgetState.widget_data.user_info;
        widgetSettings = widgetState.widget_data.settings;
    }
    else{
        var embed_id = "";
        if (sk && typeof sk.attr === "function") {
            embed_id = sk.attr("embed-id") || sk.attr("data-embed-id") || "";
        }
        if (!embed_id && sk && sk.getAttribute) {
            embed_id = sk.getAttribute("embed-id") || sk.getAttribute("data-embed-id") || "";
        }
        if (typeof original_data === "undefined" || !original_data) {
            return '';
        }
   
        
        let originalData = original_data?.[embed_id] ?? original_data;
        if(original_data.settings){
            userInfo = original_data.user_info;
            widgetSettings = original_data.settings;
        }
        else if(originalData.settings){
            userInfo = originalData.user_info;
            widgetSettings = originalData.settings;
        }
    }

    // if the widget already has the branding link, return empty string
    // JS Check
    if (sk && sk.querySelector && sk.querySelector('.sk_branding') !== null) {
        return "";
    }
    // Jquery Check
    if (sk && sk.find && sk.find('.sk_branding').length > 0) {
        return "";
    }

    // if the widget does not have the user info, return empty string
    if (!userInfo) return "";

    // if the widget will show the branding link
    if (
        userInfo.show_branding === 1 ||
        userInfo.show_branding === "true" ||
        userInfo.show_branding === true
    ) {
        const fontFamily = widgetSettings.font_family;
        let linkColor = widgetSettings.details_link_color || "rgb(52, 128, 220)";
        const detailsBgColor = widgetSettings.details_bg_color;

        let widget_type_slug = slugifyStringBranding(userInfo.solution_name);
        let website_builder_slug = slugifyStringBranding(userInfo.website_builder || 'website');

        // list supported website builders
        const supportedBuilders = [
            "wordpress",
            "wix",
            "squarespace",
            "google-sites",
            "shopify",
            "sharepoint",
            "webflow",
            "godaddy",
            "weebly",
            "adobe-portfolio",
            "html"
        ];
        let website_builder_for_link = "website";
        for (let b of supportedBuilders) {
            if (website_builder_slug.includes(b)) {
                website_builder_for_link = website_builder_slug;
                break;
            }
        }

        // resolve the display name and slug once, keeping the per-network overrides
        // these apply to all link types (product, tutorial, free)
        let widget_type_name_for_link = userInfo.solution_name;
        if (widget_type_slug.includes("linkedin")) {
            widget_type_slug = "linkedin-feed";
            widget_type_name_for_link = "LinkedIn Feed";
        } else if (widget_type_slug.includes("facebook")) {
            widget_type_slug = "facebook-feed";
            widget_type_name_for_link = "Facebook Feed";
        } else if (widget_type_slug.includes("instagram")) {
            widget_type_slug = "instagram-feed";
            widget_type_name_for_link = "Instagram Feed";
        } else if (widget_type_slug === "x" || widget_type_slug.includes("twitter")) {
            widget_type_slug = "x-feed";
            widget_type_name_for_link = "X Feed";
        } else if (widget_type_slug.includes("tiktok")) {
            widget_type_slug = "tiktok-feed";
            widget_type_name_for_link = "TikTok Feed";
        }

        // is the website builder one we have a dedicated tutorial for
        const builderIsSupported = supportedBuilders.includes(website_builder_slug);

        // determine the last digit of the widget id (embed_id), with a safe default
        let widgetIdStr = String(userInfo.embed_id ?? embed_id ?? "");
        let lastDigit = parseInt(widgetIdStr.slice(-1), 10);
        if (isNaN(lastDigit)) lastDigit = 0; // safe default -> product page

        // build the candidate destinations
        const productUrl = "https://www.sociablekit.com/" + widget_type_slug + "-widget/";
        const tutorialUrl = builderIsSupported
            ? "https://www.sociablekit.com/tutorials/embed-" + widget_type_slug + "-" + website_builder_for_link + "/"
            : "https://www.sociablekit.com/tutorials/embed-" + widget_type_slug + "-website/";
        const freeUrl = "https://www.sociablekit.com/free-widgets/free-" + widget_type_slug + "-widget-website/";

        // pick the link and anchor text based on the last digit of the widget id
        let linkUrl, tutorial_link_text;
        if (lastDigit <= 2) {
            linkUrl = productUrl;
            tutorial_link_text = widget_type_name_for_link + " Widget by SociableKIT";
        } else if (lastDigit <= 4) {
            linkUrl = productUrl;
            tutorial_link_text = "SociableKIT " + widget_type_name_for_link + " Widget";
        } else if (lastDigit <= 8) {
            linkUrl = tutorialUrl;
            tutorial_link_text = builderIsSupported
                ? "Embed " + widget_type_name_for_link + " on " + userInfo.website_builder + " with SociableKIT"
                : "Embed " + widget_type_name_for_link + " on your website with SociableKIT";
        } else {
            linkUrl = freeUrl;
            tutorial_link_text = "Free " + widget_type_name_for_link + " Widget by SociableKIT";
        }
        userInfo.tutorial_link = linkUrl;
        
        // build CSS
        let sk_branding_css = "margin-top:20px; padding:10px; display:block !important; text-align:center; text-decoration: none !important; color:#555; font-family:" + fontFamily + "; font-size:15px; visibility: visible;";
        let tutorial_link_css = "text-underline-position:under; color:" + linkColor + ";font-size:15px;display:block !important;";
        
        // build the branding HTML
        let html =
            "<div class='sk_branding' style='" + sk_branding_css + "'>" +
                "<a class='tutorial_link --custom-branding' href='" + userInfo.tutorial_link + "' target='_blank' style='" + tutorial_link_css + "'>"
                    + tutorial_link_text +
                "</a>" +
            "</div>";

        // return the branding HTML
        return html;
    }

    return "";
}

function slugifyStringBranding(str) {
    str = str.replace(/^\s+|\s+$/g, "");

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    // Remove invalid chars
    str = str
        .replace(/[^a-z0-9 -]/g, "")
        // Collapse whitespace and replace by -
        .replace(/\s+/g, "-")
        // Collapse dashes
        .replace(/-+/g, "-");

    return str;
}function loadGoogleFont(font_family){
    // add here the requested font
    var web_safe_fonts = [
        "Inherit", "Impact, Charcoal, sans-serif", "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
        "Century Gothic, sans-serif", "'Lucida Sans Unicode', 'Lucida Grande', sans-serif", "Verdana, Geneva, sans-serif",
        "Copperplate, 'Copperplate Gothic Light', fantasy", "'Courier New', Courier, monospace", "Georgia, Serif"
    ];
    if(!web_safe_fonts.includes(font_family)){ 
        try {
            loadCssFile("https://fonts.googleapis.com/css?family=" + font_family); 
        } catch (error) {
            
        }
        
    }
    
}

function readableNumber(number){
    number= parseInt(number);
    number = number ? number.toLocaleString("en-US") : 0;
    return number;
}

function addDescriptiveTagAttributes(_sk, add_to_img = true){
    _sk.find('a').each(function(i,v){
        var title = jQuery(v).text();
        if(!jQuery(v).attr('title')){
            jQuery(v).attr('title',title);
        }
    });

    if (add_to_img) {
        _sk.find('img').each(function(i,v){
            var src = jQuery(v).attr('src');
            jQuery(v).attr('alt','Post image');
        });
    }
}

function getClientId(){
    var _gaCookie = document.cookie.match(/(^|[;,]\s?)_ga=([^;,]*)/);
    if(_gaCookie) return _gaCookie[2].match(/\d+\.\d+$/)[0];
}

function getSkEmbedId(sk_class) {
    var embed_id = sk_class.attr('embed-id');
    if (embed_id == undefined) { embed_id = sk_class.attr('data-embed-id'); }
    return embed_id;
}

function getSkSetting(sk_class, key) {
    if (typeof skIsHTMLElement === "function" && skIsHTMLElement(sk_class)) {
        var el = sk_class.querySelector("div." + key);
        return el ? (el.textContent || "").trim() : "";
    }
    return sk_class.find("div." + key).text();
}

function setCookieSameSite() {
    document.cookie = "AC-C=ac-c;expires=Fri, 31 Dec 2025 23:59:59 GMT;path=/;HttpOnly;SameSite=Lax";
}

//setCookieSameSite();

function getIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");

    // If IE, return version number.
    if (Idx > 0)
        return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));

    // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./))
        return 11;
    else
        return 0; //It is not IE
}

function isSafariBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
            return 0; // Chrome
        } else {
            return 1; // Safari
        }
    }
}

function loadIEScript(url) {

    /* Load script from url and calls callback once it's loaded */
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", url);

    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
}

function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}

function generateUniqueId() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in "Y-m-d" format
    return 'USER:' + (Math.random().toString(36).substr(2, 16)).toUpperCase() + currentDate; // Concatenate the date to the unique ID
}

async function sk_increaseView(solution_info) {
    // track only customer status [1,6,7]
    if (solution_info && solution_info.status && ![1, 6, 7].includes(parseInt(solution_info.status))) {
        return false;
    }
    try {
        // Destructure necessary values from widgetState and widget_data
        const user_id = solution_info.user_id;
        const status = solution_info.status;
        // Get or generate a unique ID
        const widgetId = solution_info.embed_id;
        var sk_views_url = "https://views.sociablekit.com/";
        if(app_url.includes('local')){
            sk_views_url = "https://localtesting.com/WidgetAnalytics/views/";
        }
        
        const uniqueId = sessionStorage.getItem('unique_id') || generateUniqueId();

        if (!sessionStorage.getItem('unique_id')) {
            sessionStorage.setItem('unique_id', uniqueId);
        }

        const ipAddress = uniqueId;

        // Prepare payload for tracking views
        const payload = {
            widgetId,
            userId: user_id,
            viewsCount: 1,
            url: getCurrentUrl(),
            ipAddress,
            status,
        };

        // Send tracking data to the server
        const trackResponse = await fetch(`${sk_views_url}track-widget-views.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        // Parse and log the server response
        const responseData = await trackResponse.json();
        console.log('Server Response:', responseData);
        
    } catch (error) {
        // Log errors with contextual information
        console.error('Error in renderViews:', error);
    }
}

function isTooDarkColor(hexcolor) {
    
    var r = parseInt(hexcolor.substr(1, 2), 16);
    var g = parseInt(hexcolor.substr(3, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    
    if (hexcolor.indexOf('rgb') != -1) {
        let rgbstr = hexcolor;
        let v = getRGB(rgbstr);
        r = v[0];
        g = v[1];
        b = v[2];
    }
    b = isNaN(b) ? 0 : b;
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    // Return new color if to dark, else return the original
    if (yiq < 60) {
    }
    else {
    }

    return yiq < 60 ? true : false;
}

function linkify(html) {
    var temp_text = html.split("https://www.").join("https://");
    temp_text = temp_text.split("www.").join("https://www.");
    
    var exp = /((href|src)=["']|)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return temp_text.replace(exp, function () {
        return arguments[1] ?
            arguments[0] :
            "<a href=\"" + arguments[3] + "\">" + arguments[3] + "</a>"
    });
}

function skGetEnvironmentUrls(folder_name) {
    // auto detect live and dev version
    var scripts = document.getElementsByTagName("script");
    var scripts_length = scripts.length;
    var search_result = -1;
    var other_result = -1;
    var app_url = "https://widgets.sociablekit.com/";
    var app_backend_url = "https://api.accentapi.com/v1/";
    var app_file_server_url = "https://data.accentapi.com/feed/";
    var sk_app_url = "https://sociablekit.com/app/";
    var sk_api_url = "https://api.sociablekit.com/";
    var sk_img_url = "https://images.sociablekit.com/";
    var sk_fb_sync_url = "https://facebook-sync.sociablekit.com/";
    var sk_yt_syc_url = "https://youtube-sync.sociablekit.com/";
    var sk_widget_sync_url = "https://widget-sync.sociablekit.com/";
    var sk_clicks_url = "https://clicks.sociablekit.com/";
    var sk_scrolls_url = "https://scrolls.sociablekit.com/";
    for (var i = 0; i < scripts_length; i++) {
        var src_str = scripts[i].getAttribute('src');
        if (src_str != null) {
            var other_folder = "";
            if (folder_name == 'facebook-page-playlists') {
                other_folder = 'facebook-page-playlist';
            }
            else if (folder_name == 'linkedin-page-posts') {
                other_folder = 'linkedin-page-post';
            }
            else if (folder_name == 'linkedin-profile-posts') {
                other_folder = 'linkedin-profile-post';
            }
            else if (folder_name == 'facebook-hashtag-posts') {
                other_folder = 'facebook-hashtag-feed';
            }
            else if (folder_name == 'facebook-page-events') {
                other_folder = 'facebook-events';
            }
            else if (folder_name == 'facebook-page-posts') {
                other_folder = 'facebook-feed';
                if (document.querySelector(".sk-ww-facebook-feed")) {
                    var element = document.getElementsByClassName("sk-ww-facebook-feed")[0];
                    element.classList.add("sk-ww-facebook-page-posts");
                }
            }
            other_result = src_str.search(other_folder);
            search_result = src_str.search(folder_name);
            // app-dev found if greater than or equal to 1
            if (search_result >= 1 || other_result >= 1) {
                var src_arr = src_str.split(folder_name);
                app_url = src_arr[0];

                // replace if displaysocialmedia.com
                app_url = app_url.replace("displaysocialmedia.com", "sociablekit.com");
                // get app backend url
                if (app_url.search("local") >= 1) {
                    app_backend_url = "http://localhost:3000/v1/";
                    app_url = "https://localtesting.com/SociableKIT_Widgets/";
                    app_file_server_url = "https://localtesting.com/SociableKIT_FileServer/feed/";
                    sk_app_url = "https://localtesting.com/SociableKIT_App/";
                    sk_api_url = "http://127.0.0.1:8000/";
                    sk_img_url = "https://localtesting.com/SociableKIT_Images/";
                    sk_fb_sync_url = "https://localtesting.com/SociableKIT_Facebook_Sync/";
                    sk_yt_syc_url = "https://localtesting.com/SociableKIT_YouTube_Sync/";
                    sk_scrolls_url = "https://localtesting.com/WidgetAnalytics/scrolls/";
                    sk_clicks_url = "https://localtesting.com/WidgetAnalytics/clicks/";
                    sk_widget_sync_url = "https://localtesting.com/SociableKIT_Widget_Sync/";
                }
                else {
                    app_url = "https://widgets.sociablekit.com/";
                }
            }
        }
    }

    return {
        "app_url": app_url,
        "app_backend_url": app_backend_url,
        "app_file_server_url": app_file_server_url,
        "sk_api_url": sk_api_url,
        "sk_app_url": sk_app_url,
        "sk_img_url" : sk_img_url,
        "sk_fb_sync_url" : sk_fb_sync_url,
        "sk_yt_syc_url" : sk_yt_syc_url,
        "sk_scrolls_url": sk_scrolls_url,
        "sk_clicks_url" : sk_clicks_url,
        "sk_widget_sync_url" : sk_widget_sync_url
    };
}

function changeBackSlashToBR(text) {
    if (text) {

        for (var i = 1; i <= 10; i++) {
            text = text.replace('\n', '</br>');
        }
    }
    return text;
}

function sKGetScrollbarWidth() {

    // Creating invisible container
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    var inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    var scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}
function isValidURL(url) {
    const urlPattern = /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return urlPattern.test(url);
}

async function showUrlData(element, url,post_id, type="", show_thumbnail=1) {
    element.hide();
    var check_url = url && url.includes('&') ? encodeURIComponent(url) : url;
    var free_data_url = app_file_server_url.replace("feed/", "get_fresh_url_tags.php") + '?post_id='+post_id+'&url='+check_url;
    var read_one_url = app_file_server_url.replace("feed", "url-tags") + post_id + ".json";
    if(jQuery('.sk_version').text()){
        read_one_url+="?v="+jQuery('.sk_version').text();
    }
    
    fetch(read_one_url, { method: 'get', cache:'no-cache' })
    .then(async response => {
        
        if (response.ok) {
            let data = await response.json();
            if (data && data.status && data.status == 418) {
                displayUrlData(data, element, type, show_thumbnail, post_id); // to have content in the feed: display thumbnail first before request
                data = await jQuery.ajax(free_data_url);
            }
            return data;
        }
        else{
            response = await jQuery.ajax(free_data_url);
            displayUrlData(response, element, type, show_thumbnail, post_id);
            return response;
        }
    })
    .then(async response => {
        if (response != undefined) {
            displayUrlData(response, element, type, show_thumbnail, post_id);
        } else {
            response = await jQuery.ajax(free_data_url);
            displayUrlData(response, element, type, show_thumbnail, post_id);
        }
    }).catch(async error => {
        var data = await jQuery.ajax(free_data_url);
        displayUrlData(data, element, type, show_thumbnail, post_id);
    });
}

function applyImageFallback(img, sources) {
    const validSources = sources.filter(Boolean);
    if (!img || validSources.length === 0) return;

    let index = 0;

    img.src = validSources[index];

    img.onerror = () => {
        index++;

        if (index < validSources.length) {
            img.src = validSources[index];
        } else {
            img.onerror = null;
        }
    };
}

async function displayUrlData(response, element, type, show_thumbnail=1, post_id) {
    var meta_holder = jQuery(element);
    var html = "";
    if (!response || response.error) {
        if(meta_holder.html()){
            meta_holder.show();
        }
        return;
    }
    if (response.message && response.message == "Data not available. Please try again.") {
        return;
    }
    
    if (response.messages && response.messages.length > 0 && 
        response.messages[0] == "PDF files that are over 10Mb are not supported by Google Docs Viewer") {
        var data = response.url;
        if(response.url){
            data = response.url.replace("https://", "").split("/");
        }
        if(data.length > 0){
            if(data.length > 1){
                response.title = data[data.length - 1];
            }
            response.description = data[0].replace("www.", "");
        }
    }

    if (post_id == "7059257055500492800") {
        response.url += "?id=122630";
    }
    if ((response.title && response.title.includes("NCBI - WWW Error Blocked Diagnostic")) || 
           (response.messages && response.messages[1] && response.messages[1].includes("profile badges")) || 
           (response.messages && response.messages[0] && response.messages[0].includes("profiles except the badge"))) {
        html += "<a href='" + meta_holder.data('link') + "' link-only target='_blank'>";
            html += "<div class='sk-link-article-container' style='background: #eeeeee;color: black !important; font-weight: bold !important; border-radius: 2px; border: 1px solid #c3c3c3; box-sizing: border-box; word-wrap: break-word;'>";
            if (show_thumbnail == 1) {
                html += "<image alt='No alternative text description for this image' class='sk-link-article-image sk_post_img_link' onerror='this.style.display=\"none\"' src='" + meta_holder.data('image') + "'/>";
            }

            if ((response.title && response.title.includes("NCBI - WWW Error Blocked Diagnostic")) || 
                (response.messages && response.messages[1] && response.messages[1].includes("profile badges")) || 
                (response.messages && response.messages[0] && response.messages[0].includes("profiles except the badge"))) {
                html += "<div class='sk-link-article-title' style='padding: 8px;'>" + meta_holder.data('title') + "</div>";
            }
            html += "</div>";
        html += "</a>";
    }
    else{
        html += "<a href='" + response.url + "' link-only target='_blank' style='text-decoration: none;'>";
            html += "<div class='sk-link-article-container' style='background: #eeeeee;color: black !important; font-weight: bold !important; border-radius: 2px; border: 1px solid #c3c3c3; box-sizing: border-box; word-wrap: break-word;'>";
                let attr_thumbnail = meta_holder.attr("data-img");
                let imgSources = [];

                if (show_thumbnail == 1 && response.thumbnail_url) {
                    if (!response.thumbnail_url.includes("err.ch")) {
                        imgSources.push(response.thumbnail_url);
                    }
                    if (attr_thumbnail && attr_thumbnail.length > 0) {
                        imgSources.push(attr_thumbnail);
                    }
                } else if (attr_thumbnail && attr_thumbnail.length > 0) {
                    imgSources.push(attr_thumbnail);
                }

                if (imgSources.length > 0) {
                    html += "<img alt='No alternative text description for this image' class='sk-link-article-image sk_post_img_link' data-img-sources='" + imgSources.join('|') + "' src='" + imgSources[0] + "'/>";
                }

                if (response.title) {
                    html += "<div class='sk-link-article-title' style='padding: 8px;'>" + response.title + "</div>";
                }
                else if (response.url && response.url.indexOf(".pdf") != -1) {
                    html += response.html;
                }
                if (type && type == 6) {
                    if (response.description && response.description.length > 0) {
                        response.description = response.description.length > 140 ? response.description.substring(0, 140) + ' ...' : response.description;
                    }
                }
                if(response.description && response.description.indexOf("[vc_row]") !== -1 && response.url){

                    var pathArray = response.url.split( '/' );
                    var protocol = pathArray[0];
                    if(pathArray.length > 2){
                        var host = pathArray[2];
                        var url = protocol + '//' + host;
                        html+="<div class='sk-link-article-description' style='padding: 8px;color: grey;font-weight: 100;font-size: 14px;'>" + url + "</div>";
                    }
                }
                else if (response.description && response.description.indexOf("fb_built") == -1 && response.description != "null") {
                    if(response.url){
                        var domain = new URL(response.url).hostname;
                        response.description = domain;
                    }
                    html += "<div class='sk-link-article-description' style='padding: 8px;color: #000000;font-weight: 100;font-size: 14px;'>" + response.description + "</div>";
                }
                else if(response.url && response.url.includes('instagram.com/p/')){
                    html += "<image style='padding: 8px;' alt='No alternative text description for this image' class='sk-ig-default' onerror='this.style.display=\"none\"' src='https://i1.wp.com/sociablekit.com/wp-content/uploads/2019/01/instagram.png'/>";
                    html += "<div class='sk-link-article-description' style='padding: 8px;margin-left:15%;color: #000000;font-weight: 600;font-size: 14px;'>View this post in instagram</div>";
                    html += "<div class='sk-link-article-description' style='padding: 0px 8px ;margin-left:15%;margin-bottom:10px;color: #000000;font-weight: 100;font-size: 10px;'>"+response.url+"</div>";
                }
            html += "</div>";
        html += "</a>";
    }

    
    meta_holder.html(html);

    meta_holder.find('img.sk-link-article-image.sk_post_img_link[data-img-sources]').each(function() {
        var sources = (this.dataset.imgSources || '').split('|').map(function(s) { return s.trim(); }).filter(Boolean);
        applyImageFallback(this, sources);
    });
    
    meta_holder.css('display', 'block');
    meta_holder.css('margin-bottom', '15px');
    meta_holder.find('.sk-ig-default').closest('.sk-link-article-container').css('display', 'inline-block');
    meta_holder.find('.sk-ig-default').closest('.sk-link-article-container').css('width', '100%');
    meta_holder.find('.sk-ig-default').css('width', '20%');
    meta_holder.find('.sk-ig-default').css('float', 'left');
    applyMasonry();
}

window.handleImageError = function(element) {
    if (!element.dataset.fallbackUsed && element.dataset.realUrl) {
        element.src = element.dataset.realUrl;
        element.dataset.fallbackUsed = "true";
    } else {
        element.style.display = 'none';
    }
};

// Slugify a string
function slugifyString(str){

    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '') 
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-') 
    // Collapse dashes
    .replace(/-+/g, '-'); 

    return str;
}

function getTutorialLinkNew(user_info){
    const d = new Date(user_info.created_at);
    let date = d.getDate()
    var tutorial_link = "";
    if(user_info.solution_name){
        var slugify_string = slugifyString(user_info.solution_name);
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-"+ slugify_string +"-website/";
        if(user_info.website_builder){
            tutorial_link = "https://www.sociablekit.com/tutorials/embed-"+ slugify_string;
            slugify_string = slugifyString(user_info.website_builder);
            tutorial_link = tutorial_link+"-"+slugify_string+"/";
        }
    }

    if(date % 5 == 0) {
        // no need to change
    }
    else if(user_info.type == 4){
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-facebook-feed-website/ ";
    }
    else if(user_info.type == 5){
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-instagram-feed-website/";
    }
    else if(user_info.type == 33){
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-linkedin-feed-website/";
    }
    else if(user_info.type == 16){
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-youtube-playlist-website/";
    }
    return tutorial_link;
}

function getTutorialLink(user_info){
    var tutorial_link = "";
    if(user_info.solution_name){
        var slugify_string = slugifyString(user_info.solution_name);
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-"+ slugify_string +"-website/";
        if(user_info.website_builder){
            tutorial_link = "https://www.sociablekit.com/tutorials/embed-"+ slugify_string;
            slugify_string = slugifyString(user_info.website_builder);
            tutorial_link = tutorial_link+"-"+slugify_string;
        }
    } 
    if(user_info.type == 9){
        tutorial_link = "https://www.sociablekit.com/sync-facebook-page-events-to-google-calendar/";
    }
    else if(user_info.type == 26){
        tutorial_link = "https://www.sociablekit.com/how-to-sync-facebook-group-events-to-google-calendar-on-website/";
    }

    if(tutorial_link && tutorial_link.endsWith("/") == false){
        tutorial_link = tutorial_link + "/";
    }
    var linkedin_widgets = [33, 34, 44, 58, 75, 99, 100, 103];
    var facebook_widgets = [1, 4, 9, 10, 11, 36, 38, 43, 12, 24, 26, 49, 2, 8, 3, 18, 19, 28, 30, 61];
    var threads_widgets = [110];

    if(linkedin_widgets.includes(user_info.type) && user_info.embed_id % 2 == 1){
        var website_builder = "website";
        if(user_info.website_builder){
            website_builder = slugifyString(user_info.website_builder);
        }
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-linkedin-feed-" + website_builder + "/";
    }
    else if(facebook_widgets.includes(user_info.type) && user_info.embed_id % 2 == 1){
        var website_builder = "website";
        if(user_info.website_builder){
            website_builder = slugifyString(user_info.website_builder);
        }
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-facebook-feed-" + website_builder + "/";
    }
    else if(threads_widgets.includes(user_info.type) && user_info.embed_id % 2 == 0){
        var website_builder = "website";
        if(user_info.website_builder){
            website_builder = slugifyString(user_info.website_builder);
        }
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-threads-" + website_builder + "/";
    }

    if(user_info.type == 5  && user_info.embed_id % 2 == 1){
        tutorial_link = tutorial_link.replace("profile", "feed");
    }

    return tutorial_link;
}

function getRGB(rgbstr) {
    return rgbstr.substring(4, rgbstr.length-1)
         .replace(/ /g, '')
         .replace('(', '')
         .split(',');
}
  

function freeTrialEndedMessage (solution_info) {
    var sk_error_message = "<div class='sk_trial_ended_message'>";
        sk_error_message+="Customized feed is powered by <strong><a href='https://www.sociablekit.com/' target='_blank'>SociableKIT</a></strong>.<br>";
        sk_error_message+="If you're the owner of this website, your 7-day Free Trial has ended.<br>";
        sk_error_message+="If you want to continue using our services, please <strong><a target='_blank' href='https://www.sociablekit.com/app/users/subscription/subscription'>subscribe now</a></strong>.";
        sk_error_message+="</div>";
    return sk_error_message;
}
function privateFBGroupMessage () {
    var sk_error_message = "<div class='sk_trial_ended_message'>";
        sk_error_message+="<h2>The Facebook group is private, it must be <a target='_blank' href='https://www.facebook.com/community/using-key-groups-tools/understanding-your-privacy-settings/'>public</a>.</h2>";
        sk_error_message+="</div>";
    return sk_error_message;
}

function isFreeTrialEnded(start_date){
    var start_date = new Date(start_date);
    var current_date = new Date();
    var difference = current_date.getTime() - start_date.getTime();
    difference = parseInt(difference / (1000 * 60 * 60 * 24));
    
    return difference > 7 ? true : false;
}

function unableToLoadSKErrorMessage(solution_info, additional_error_messages) {
    var sk_error_message ="<ul class='sk_error_message'>";
            sk_error_message += "<li><a href='"+solution_info.embed_id+"' target='_blank'>Customized "+solution_info.solution_name+" feed by SociableKIT</a></li>";
            console.log(solution_info);
            sk_error_message +="<li>Unable to load " + solution_info.solution_name + ".</li>";
            for(var i = 0; i < additional_error_messages.length; i++){
                sk_error_message += additional_error_messages[i];
            }
            sk_error_message +="<li>If you think there is a problem, <a target='_blank' href='https://go.crisp.chat/chat/embed/?website_id=2e3a484e-b418-4643-8dd2-2355d8eddc6b'>chat with support here</a>. We will solve it for you.</li>";
        sk_error_message +="</ul>";

    return sk_error_message;
}


function widgetValidation(_sk, data){
    if(data.user_info){
        var user_info = data.user_info;
        user_info.trial_ended = false;
        user_info.show_feed = true;
        if(user_info.status == 7 && user_info.cancellation_date){
            // canceled or to cancel feed must show
            data.user_info.show_feed = true;
        }
        else if(user_info.status ==  2 || user_info.status ==  10){
            user_info.show_feed = true;
        }
        // do not show feed
        if (user_info.type == 43 || user_info.type == 38 || user_info.type == 50) {
            data.user_info.show_branding = true;
        }
         
        else if(!user_info.show_feed){
            data.user_info.show_branding = true;
        }
        else if (user_info.widget_status == 1) {
            data.user_info.show_branding = true;
        }
        else if (user_info.status == 0) {
            data.user_info.show_branding = true;
        }
        return user_info.show_feed;
    }
}

function generateBlueMessage(_sk,user_info){
    var tutorial_link = "";
    var sk_error_message = "";
    if(user_info.solution_name){
        var slugify_string = slugifyString(user_info.solution_name);
        tutorial_link = "https://www.sociablekit.com/tutorials/embed-"+ slugify_string +"-website/";
    }
    if(user_info.type == 9){
        tutorial_link = "https://www.sociablekit.com/sync-facebook-page-events-to-google-calendar/";
    }
    else if(user_info.type == 26){
        tutorial_link = "https://www.sociablekit.com/how-to-sync-facebook-group-events-to-google-calendar-on-website/";
    } 
    if (user_info.widget_status == 1) {
        var sk_error_message  = "<div class='sk_error_message'>";
                sk_error_message  += "<p style='text-align: center !important; margin: 1rem'> The widget does not exist. If you think this is a mistake, please contact support</a></p>";
            sk_error_message  += "</div>";
        return sk_error_message;
    }
    if(user_info.show_feed == false) {
        if(!user_info.message || user_info.message == ""){
            var sk_error_message  = "<ul class='sk_error_message'>";
                sk_error_message  += "<li><a href='"+ tutorial_link +"' target='_blank'>"+user_info.solution_name+" powered by SociableKIT</a></li>";
                sk_error_message  += "<li>If you’re the owner of this website or SociableKIT account used, we found some errors with your account.</li>";
                sk_error_message  += "<li>Please login your SociableKIT account to fix it.</li>";
            sk_error_message  += "</ul>";
            user_info.message = sk_error_message;
        }
        sk_error_message = user_info.message;
    }
    else if (user_info.solution_name == null && user_info.type == null && user_info.start_date == null) {
        sk_error_message ="<p class='sk_error_message'>";
        sk_error_message+="The SociableKIT solution does not exist. If you think this is a mistake, please contact support.";
        sk_error_message+="</p>";
    }
    else{
        sk_error_message ="<div class='sk_error_message'>";
            sk_error_message +="<div style='display: inline-flex;width:100%;'>";
                sk_error_message +="<div>";
                sk_error_message += "<h4>SociableKIT is currently syncing your <a href='"+tutorial_link+"' target='_blank'>"+user_info.solution_name+" widget.</a></h4>";

                sk_error_message += `
                <svg height="20" style="width: 100%; border-radius: 55px !important; overflow: hidden;">
                <rect x="0" y="0" width="480" height="20" fill="#f0f0f0" rx="10" ry="10" />
                <pattern id="stripes" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect x="0" y="0" width="10" height="20" fill="#007bff" />
                </pattern>
                <rect id="progressBar" x="0" y="0" width="0" height="20" fill="url(#stripes)" rx="10" ry="10">
                    <animate attributeName="width" attributeType="XML" from="0" to="480" dur="2s" repeatCount="indefinite" />
                </rect>
                </svg>`;
                sk_error_message += "<p>While waiting there are a few things you need to know:</p>";
                    sk_error_message +="<ul>";
                        sk_error_message +="<li>It usually takes only a few minutes. We appreciate your patience.</li>";
                        sk_error_message +="<li>We will notify you via email once your "+user_info.solution_name+" feed is ready.</li>";
                        if(user_info.type == 5){
                            sk_error_message += "<li>Make sure your instagram account <a target='_blank' href='https://www.instagram.com/"+getDsmSetting(_sk,'username')+"' target='_blank'><b>@"+getDsmSetting(_sk,'username')+"</b></a> is connected.</li>";
                        }
                        else if(user_info.type == 22 || user_info.type == 39){
                            sk_error_message +="<li>Please make sure that you selected the correct Google Place or that the <a href='https://www.sociablekit.com/how-to-identify-google-place-id/' target='blank'><b> Google Place ID </b></a> you entered is correct.</li>";
                        }
                        else if(user_info.type == 101){
                            sk_error_message +="<li>Please make sure that you have <a href='https://www.sociablekit.com/add-sociablekit-as-your-contact-on-whatsapp/' target='blank'><b> added SociableKIT as your contact on WhatsApp</b></a>.</li>";
                        }
                        else{
                            sk_error_message +="<li>Please make sure that the <b> Source ID/Username </b> you enter is correct.</li>";
                        }
                        sk_error_message +="<li>If you think there is a problem, <a target='_blank' href='https://go.crisp.chat/chat/embed/?website_id=2e3a484e-b418-4643-8dd2-2355d8eddc6b'>chat with support here</a>. We will solve it for you.</li>";
                    sk_error_message+="</ul>";
                sk_error_message +="</div>";
            sk_error_message+="</div>";
        sk_error_message+="</div>";
    }
    return sk_error_message;
}

function generateSolutionMessage(_sk, embed_id){
    var json_url = sk_api_url + "api/user_embed/info/" + embed_id;
    fetch(json_url)
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.type == 1 && data.encoded == true) {
                loadEvents(_sk);
            } else if (data.type == 44 && data.encoded == true) {
                loadFeed(_sk);
            } else if (data.type == 27 && data.encoded == true) {
                loadFeed(_sk);
            } else if (data.type == 58 && data.encoded == true) {
                var no_data_text =
                    typeof skWidgetQueryText === "function"
                        ? skWidgetQueryText(_sk, ".no_data_text")
                        : _sk.find(".no_data_text").text();
                if (typeof skWidgetSetHtml === "function" && typeof skIsHTMLElement === "function" && skIsHTMLElement(_sk)) {
                    skWidgetSetHtml(_sk, "<div style='padding: 20px;text-align: center;'>" + no_data_text + "</div>");
                } else {
                    _sk.html("<div style='padding: 20px;text-align: center;'>" + no_data_text + "</div>");
                }
            } else if (data.type == 67 && data.encoded == true) {
                loadEvents(_sk);
            } else if ((data.type == 12 || data.type == 26 || data.type == 24 || data.type == 49) && data.encoded == true) {
                if (typeof skWidgetSetHtml === "function" && typeof skIsHTMLElement === "function" && skIsHTMLElement(_sk)) {
                    skWidgetSetHtml(_sk, privateFBGroupMessage());
                } else {
                    _sk.html(privateFBGroupMessage());
                }
            } else {
                var sk_error_message = generateBlueMessage(_sk, data);
                if (typeof skWidgetHideSelector === "function" && typeof skIsHTMLElement === "function" && skIsHTMLElement(_sk)) {
                    skWidgetHideSelector(_sk, ".first_loading_animation");
                    skWidgetSetHtml(_sk, sk_error_message);
                } else {
                    _sk.find(".first_loading_animation").hide();
                    _sk.html(sk_error_message);
                }
            }
        })
        .catch(function (e) {
            console.log(e);
        });
}

function copyInput(copy_button, copy_input){

	// orig button label
	var copy_button_orig_html=copy_button.html();

	// select contents
	copy_input.select();

	try {

		// copy content
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';

		if(msg=='successful'){

			// change button html
			copy_button.html("<i class='fa fa-clipboard'></i> Copied!");

			// button go back to orig html
			setTimeout(function(){
				copy_button.html(copy_button_orig_html);
			}, 3000);

		}

		else{ alert('Copying text command was ' + msg + '.'); }
	}

	catch (err) { alert('Oops, unable to copy.'); }
}

function getDefaultLinkedInPageProfilePicture(profile_picture){
    if(profile_picture && profile_picture.indexOf("data:image/gif") != -1) {
        profile_picture = "https://gmalcilk.sirv.com/iamge.JPG";
    }
    return profile_picture;
}

function detectedSKDashboard() {
    let parent_url = (window.location != window.parent.location) ? document.referrer : document.location.href;
    if (parent_url && (parent_url.indexOf("sociablekit.com") != -1 || parent_url.indexOf("local") != -1)) {
        return true;
    }
    return false;
}

function getSKDashboardPremiumTrialMessage() {
    var sk_error_message = "";
    sk_error_message += "<ul class='sk_error_message'>";
    sk_error_message += "<li>Your 7-days premium trial has ended.</li>";
    sk_error_message += "<li>Please purchase a <a href='https://www.sociablekit.com/app/users/subscription/subscription?action=subscribe_now'>SociableKIT subscription plan</a> ";
    sk_error_message += "to save your widget customizations, save time with automatic sync, enjoy priority support, and get a 50% discount on any annual plans. Don’t miss out!</li>";
    sk_error_message += "<li>You may also choose to <a href='https://help.sociablekit.com/en-us/article/how-to-activate-the-free-plan-1l3o0nt/'>activate the free plan</a> if you don't need our premium features.</li>";
    sk_error_message += "</ul>";
    return sk_error_message;
}

function getSocialIcon(category)
{
    var post_items = '';
    if (category.indexOf("Facebook") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='24' height='28' viewBox='0 0 24 28'><path d='M19.5 2c2.484 0 4.5 2.016 4.5 4.5v15c0 2.484-2.016 4.5-4.5 4.5h-2.938v-9.297h3.109l0.469-3.625h-3.578v-2.312c0-1.047 0.281-1.75 1.797-1.75l1.906-0.016v-3.234c-0.328-0.047-1.469-0.141-2.781-0.141-2.766 0-4.672 1.687-4.672 4.781v2.672h-3.125v3.625h3.125v9.297h-8.313c-2.484 0-4.5-2.016-4.5-4.5v-15c0-2.484 2.016-4.5 4.5-4.5h15z'></path></svg>";
    }
    else if (category.indexOf("Instagram") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='24' height='28' viewBox='0 0 24 28'><path d='M16 14c0-2.203-1.797-4-4-4s-4 1.797-4 4 1.797 4 4 4 4-1.797 4-4zM18.156 14c0 3.406-2.75 6.156-6.156 6.156s-6.156-2.75-6.156-6.156 2.75-6.156 6.156-6.156 6.156 2.75 6.156 6.156zM19.844 7.594c0 0.797-0.641 1.437-1.437 1.437s-1.437-0.641-1.437-1.437 0.641-1.437 1.437-1.437 1.437 0.641 1.437 1.437zM12 4.156c-1.75 0-5.5-0.141-7.078 0.484-0.547 0.219-0.953 0.484-1.375 0.906s-0.688 0.828-0.906 1.375c-0.625 1.578-0.484 5.328-0.484 7.078s-0.141 5.5 0.484 7.078c0.219 0.547 0.484 0.953 0.906 1.375s0.828 0.688 1.375 0.906c1.578 0.625 5.328 0.484 7.078 0.484s5.5 0.141 7.078-0.484c0.547-0.219 0.953-0.484 1.375-0.906s0.688-0.828 0.906-1.375c0.625-1.578 0.484-5.328 0.484-7.078s0.141-5.5-0.484-7.078c-0.219-0.547-0.484-0.953-0.906-1.375s-0.828-0.688-1.375-0.906c-1.578-0.625-5.328-0.484-7.078-0.484zM24 14c0 1.656 0.016 3.297-0.078 4.953-0.094 1.922-0.531 3.625-1.937 5.031s-3.109 1.844-5.031 1.937c-1.656 0.094-3.297 0.078-4.953 0.078s-3.297 0.016-4.953-0.078c-1.922-0.094-3.625-0.531-5.031-1.937s-1.844-3.109-1.937-5.031c-0.094-1.656-0.078-3.297-0.078-4.953s-0.016-3.297 0.078-4.953c0.094-1.922 0.531-3.625 1.937-5.031s3.109-1.844 5.031-1.937c1.656-0.094 3.297-0.078 4.953-0.078s3.297-0.016 4.953 0.078c1.922 0.094 3.625 0.531 5.031 1.937s1.844 3.109 1.937 5.031c0.094 1.656 0.078 3.297 0.078 4.953z'></path></svg>";
    }
    else if (category.indexOf("Linkedin") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='24' height='28' viewBox='0 0 24 28'><path d='M3.703 22.094h3.609v-10.844h-3.609v10.844zM7.547 7.906c-0.016-1.062-0.781-1.875-2.016-1.875s-2.047 0.812-2.047 1.875c0 1.031 0.781 1.875 2 1.875h0.016c1.266 0 2.047-0.844 2.047-1.875zM16.688 22.094h3.609v-6.219c0-3.328-1.781-4.875-4.156-4.875-1.937 0-2.797 1.078-3.266 1.828h0.031v-1.578h-3.609s0.047 1.016 0 10.844v0h3.609v-6.062c0-0.313 0.016-0.641 0.109-0.875 0.266-0.641 0.859-1.313 1.859-1.313 1.297 0 1.813 0.984 1.813 2.453v5.797zM24 6.5v15c0 2.484-2.016 4.5-4.5 4.5h-15c-2.484 0-4.5-2.016-4.5-4.5v-15c0-2.484 2.016-4.5 4.5-4.5h15c2.484 0 4.5 2.016 4.5 4.5z'></path></svg>";
    }
    else if (category.indexOf("Youtube") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><path d='M11.109 17.625l7.562-3.906-7.562-3.953v7.859zM14 4.156c5.891 0 9.797 0.281 9.797 0.281 0.547 0.063 1.75 0.063 2.812 1.188 0 0 0.859 0.844 1.109 2.781 0.297 2.266 0.281 4.531 0.281 4.531v2.125s0.016 2.266-0.281 4.531c-0.25 1.922-1.109 2.781-1.109 2.781-1.062 1.109-2.266 1.109-2.812 1.172 0 0-3.906 0.297-9.797 0.297v0c-7.281-0.063-9.516-0.281-9.516-0.281-0.625-0.109-2.031-0.078-3.094-1.188 0 0-0.859-0.859-1.109-2.781-0.297-2.266-0.281-4.531-0.281-4.531v-2.125s-0.016-2.266 0.281-4.531c0.25-1.937 1.109-2.781 1.109-2.781 1.062-1.125 2.266-1.125 2.812-1.188 0 0 3.906-0.281 9.797-0.281v0z'></path></svg>";
    }
    else if (category.indexOf("Google") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='24' height='28' viewBox='0 0 24 28'><path d='M12 12.281h11.328c0.109 0.609 0.187 1.203 0.187 2 0 6.844-4.594 11.719-11.516 11.719-6.641 0-12-5.359-12-12s5.359-12 12-12c3.234 0 5.953 1.188 8.047 3.141l-3.266 3.141c-0.891-0.859-2.453-1.859-4.781-1.859-4.094 0-7.438 3.391-7.438 7.578s3.344 7.578 7.438 7.578c4.75 0 6.531-3.406 6.813-5.172h-6.813v-4.125z'></path></svg>";
    }
    else if (category.indexOf("Twitter") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='26' height='28' viewBox='0 0 26 28'><path d='M25.312 6.375c-0.688 1-1.547 1.891-2.531 2.609 0.016 0.219 0.016 0.438 0.016 0.656 0 6.672-5.078 14.359-14.359 14.359-2.859 0-5.516-0.828-7.75-2.266 0.406 0.047 0.797 0.063 1.219 0.063 2.359 0 4.531-0.797 6.266-2.156-2.219-0.047-4.078-1.5-4.719-3.5 0.313 0.047 0.625 0.078 0.953 0.078 0.453 0 0.906-0.063 1.328-0.172-2.312-0.469-4.047-2.5-4.047-4.953v-0.063c0.672 0.375 1.453 0.609 2.281 0.641-1.359-0.906-2.25-2.453-2.25-4.203 0-0.938 0.25-1.797 0.688-2.547 2.484 3.062 6.219 5.063 10.406 5.281-0.078-0.375-0.125-0.766-0.125-1.156 0-2.781 2.25-5.047 5.047-5.047 1.453 0 2.766 0.609 3.687 1.594 1.141-0.219 2.234-0.641 3.203-1.219-0.375 1.172-1.172 2.156-2.219 2.781 1.016-0.109 2-0.391 2.906-0.781z'></path></svg>";
    }
    else if (category.indexOf("Twitch") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><path d='M14 6.781v6.781h-2.266v-6.781h2.266zM20.219 6.781v6.781h-2.266v-6.781h2.266zM20.219 18.656l3.953-3.969v-12.422h-18.656v16.391h5.094v3.391l3.391-3.391h6.219zM26.437 0v15.828l-6.781 6.781h-5.094l-3.391 3.391h-3.391v-3.391h-6.219v-18.094l1.703-4.516h23.172z'></path></svg>";
    }
    else if (category.indexOf("Yelp") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='24' height='28' viewBox='0 0 24 28'><path d='M12.078 20.609v1.984c-0.016 4.406-0.016 4.562-0.094 4.766-0.125 0.328-0.406 0.547-0.797 0.625-1.125 0.187-4.641-1.109-5.375-1.984-0.156-0.172-0.234-0.375-0.266-0.562-0.016-0.141 0.016-0.281 0.063-0.406 0.078-0.219 0.219-0.391 3.359-4.109 0 0 0.016 0 0.938-1.094 0.313-0.391 0.875-0.516 1.391-0.328 0.516 0.203 0.797 0.641 0.781 1.109zM9.75 16.688c-0.031 0.547-0.344 0.953-0.812 1.094l-1.875 0.609c-4.203 1.344-4.344 1.375-4.562 1.375-0.344-0.016-0.656-0.219-0.844-0.562-0.125-0.25-0.219-0.672-0.266-1.172-0.172-1.531 0.031-3.828 0.484-4.547 0.219-0.344 0.531-0.516 0.875-0.5 0.234 0 0.422 0.094 4.953 1.937 0 0-0.016 0.016 1.313 0.531 0.469 0.187 0.766 0.672 0.734 1.234zM22.656 21.328c-0.156 1.125-2.484 4.078-3.547 4.5-0.359 0.141-0.719 0.109-0.984-0.109-0.187-0.141-0.375-0.422-2.875-4.484l-0.734-1.203c-0.281-0.438-0.234-1 0.125-1.437 0.344-0.422 0.844-0.562 1.297-0.406 0 0 0.016 0.016 1.859 0.625 4.203 1.375 4.344 1.422 4.516 1.563 0.281 0.219 0.406 0.547 0.344 0.953zM12.156 11.453c0.078 1.625-0.609 1.828-0.844 1.906-0.219 0.063-0.906 0.266-1.781-1.109-5.75-9.078-5.906-9.344-5.906-9.344-0.078-0.328 0.016-0.688 0.297-0.969 0.859-0.891 5.531-2.203 6.75-1.891 0.391 0.094 0.672 0.344 0.766 0.703 0.063 0.391 0.625 8.813 0.719 10.703zM22.5 13.141c0.031 0.391-0.109 0.719-0.406 0.922-0.187 0.125-0.375 0.187-5.141 1.344-0.766 0.172-1.188 0.281-1.422 0.359l0.016-0.031c-0.469 0.125-1-0.094-1.297-0.562s-0.281-0.984 0-1.359c0 0 0.016-0.016 1.172-1.594 2.562-3.5 2.688-3.672 2.875-3.797 0.297-0.203 0.656-0.203 1.016-0.031 1.016 0.484 3.063 3.531 3.187 4.703v0.047z'></path></svg>";
    }
    else if (category.indexOf("Vimeo") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><path d='M26.703 8.094c-0.109 2.469-1.844 5.859-5.187 10.172-3.469 4.484-6.375 6.734-8.781 6.734-1.484 0-2.734-1.375-3.75-4.109-0.688-2.5-1.375-5.016-2.063-7.531-0.75-2.734-1.578-4.094-2.453-4.094-0.187 0-0.844 0.391-1.984 1.188l-1.203-1.531c1.25-1.109 2.484-2.234 3.719-3.313 1.656-1.469 2.922-2.203 3.766-2.281 1.984-0.187 3.187 1.156 3.656 4.047 0.484 3.125 0.844 5.078 1.031 5.828 0.578 2.594 1.188 3.891 1.875 3.891 0.531 0 1.328-0.828 2.406-2.516 1.062-1.687 1.625-2.969 1.703-3.844 0.141-1.453-0.422-2.172-1.703-2.172-0.609 0-1.234 0.141-1.891 0.406 1.25-4.094 3.641-6.078 7.172-5.969 2.609 0.078 3.844 1.781 3.687 5.094z'></path></svg>";
    }
    else if (category.indexOf("Trust") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path fill='#00b67a' d='M16 23.952l6.952-1.761 2.905 8.952zM32 12.381h-12.239l-3.761-11.524-3.761 11.524h-12.239l9.905 7.143-3.761 11.524 25.856-18.667z'></path></svg>";
    }
    else if (category.indexOf("Spot") != -1) {
        post_items+="<svg class='sk-social-icon' version='1.1' xmlns='http://www.w3.org/2000/svg' width='24' height='28' viewBox='0 0 24 28'><path d='M17.609 18.906c0-0.438-0.172-0.609-0.469-0.797-2.016-1.203-4.359-1.797-6.984-1.797-1.531 0-3 0.203-4.484 0.531-0.359 0.078-0.656 0.313-0.656 0.812 0 0.391 0.297 0.766 0.766 0.766 0.141 0 0.391-0.078 0.578-0.125 1.219-0.25 2.5-0.422 3.797-0.422 2.297 0 4.469 0.562 6.203 1.609 0.187 0.109 0.313 0.172 0.516 0.172 0.391 0 0.734-0.313 0.734-0.75zM19.109 15.547c0-0.422-0.156-0.719-0.547-0.953-2.391-1.422-5.422-2.203-8.563-2.203-2.016 0-3.391 0.281-4.734 0.656-0.5 0.141-0.75 0.484-0.75 1s0.422 0.938 0.938 0.938c0.219 0 0.344-0.063 0.578-0.125 1.094-0.297 2.406-0.516 3.922-0.516 2.969 0 5.672 0.781 7.625 1.937 0.172 0.094 0.344 0.203 0.594 0.203 0.531 0 0.938-0.422 0.938-0.938zM20.797 11.672c0-0.578-0.25-0.875-0.625-1.094-2.703-1.578-6.406-2.312-9.938-2.312-2.078 0-3.984 0.234-5.688 0.734-0.438 0.125-0.844 0.5-0.844 1.156 0 0.641 0.484 1.141 1.125 1.141 0.234 0 0.453-0.078 0.625-0.125 1.516-0.422 3.156-0.578 4.797-0.578 3.25 0 6.625 0.719 8.797 2.016 0.219 0.125 0.375 0.187 0.625 0.187 0.594 0 1.125-0.469 1.125-1.125zM24 14c0 6.625-5.375 12-12 12s-12-5.375-12-12 5.375-12 12-12 12 5.375 12 12z'></path></svg>";
    }
    return post_items;
}

function isFontAwesomeLoaded() {
    var span = document.createElement('span');

    span.className = 'fa';
    span.style.display = 'none';
    document.body.insertBefore(span, document.body.firstChild);
    var font = css(span, 'font-family');
    if (font.indexOf("fontawesome") == -1) {
      // add a local fallback
        return false;
    }
    document.body.removeChild(span);
    return true;
}

function css(element, property) {
    let font =  window.getComputedStyle(element, null).getPropertyValue(property);
    if (font) {
        font = font.toLowerCase();
        return font.replace(/' '/g, "");
    }
    return 'na';
}

function addCustomCSS(cssRules) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = cssRules;
    document.head.appendChild(style);
}

// Fix issues in most old UI widgets where the carousel arrows are doubled
window.addEventListener("DOMContentLoaded", () => {
    addCustomCSS(`
        .swiper-button-next::after,
        .swiper-button-prev::after {
            content: "" !important;
            display: none;
        }
    `);
});

function convertFieldsToNumbers(obj, fields) {
    fields.forEach(field => {
        if (obj.hasOwnProperty(field)) {
            const num = Number(obj[field]);
            if (!isNaN(num)) {
                obj[field] = num;
            }
        }
    });
}

function renderClick(widget,widget_data){
    widget = widget[0];
    // Add event listener for all clickable elements in the widget
    const { solution_info, settings, user_info } = widget_data;
    let user_id =
        (solution_info && solution_info.user_id) ||
        (settings && settings.user_id) ||
        (user_info && user_info.user_id);

    var sk_clicks_url = "https://clicks.sociablekit.com/";
    if(app_url.includes('localtesting.com')){
        sk_clicks_url = "https://localtesting.com/WidgetAnalytics/clicks/";
    } 

    // track only customer status [1,6,7]
    if (solution_info && solution_info.status && ![1, 6, 7].includes(parseInt(solution_info.status))) {
        return false;
    }
    widget.addEventListener('click', (event) => {
        const target = event.target;
        let elementType = '';
        let elementContent = '';

        // Determine the type and content of the clicked element
        elementType = target.tagName.toLowerCase(); // Use the tag name as the element type

        // Get meaningful content based on the tag type or attributes
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
            elementContent = target.innerText.trim() || target.getAttribute('href') || 'Unnamed Element';
        } else if (target.tagName === 'IMG') {
            elementContent = target.getAttribute('alt') || target.getAttribute('src') || 'Unnamed Image';
        } else if (target.tagName === 'VIDEO' || target.tagName === 'AUDIO') {
            elementContent = target.getAttribute('src') || 'Unnamed Media';
        } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            elementContent = target.value || 'Unnamed Input';
        } else {
            elementContent = (target.innerText ? target.innerText.trim() : '') || target.className || `Unnamed ${elementType}`;
        }
        // Get the widgetId from the widget container
        const widgetId = widget.getAttribute('data-embed-id');

        if (elementType) {
            // Send click data to the backend
            fetch(sk_clicks_url+'track-widget-click.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    widgetId: widgetId,
                    userId: user_id,
                    url: getCurrentUrl(),
                    elementType,
                    elementContent,
                }),
            })
                .then((response) => response.json())
                .then((data) => console.log('Click logged:', data))
                .catch((error) => console.error('Error logging click:', error));
        }
    });
}
function renderScroll(widget,widget_data){
    widget = widget[0];
    // Add event listener for all clickable elements in the widget
    const { solution_info, settings, user_info } = widget_data;
    let user_id =
        (solution_info && solution_info.user_id) ||
        (settings && settings.user_id) ||
        (user_info && user_info.user_id);

    var sk_scrolls_url = "https://scrolls.sociablekit.com/";
    if(app_url.includes('localtesting.com')){
        sk_scrolls_url = "https://localtesting.com/WidgetAnalytics/scrolls/";
    } 

    // track only customer status [1,6,7]
    if (solution_info && solution_info.status && ![1, 6, 7].includes(parseInt(solution_info.status))) {
        return false;
    }
    
    let scrollCount = 0;
    let scrollTimeout;
    const uniqueId = sessionStorage.getItem('unique_id') || generateUniqueId(); // Get or generate unique ID
    const widgetId = widget.getAttribute('data-embed-id');

    // Save unique ID to sessionStorage to keep it persistent
    if (!sessionStorage.getItem('unique_id') ) {
        sessionStorage.setItem('unique_id', uniqueId);
    }
    
    // Scroll event listener
    window.addEventListener('scroll', () => {
        scrollCount++;
        // Clear the previous timeout and set a new one
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(sendScrollData, 2000); // Send data 1 second after scrolling stops
    });
    
    // Send scroll data to the server
    function sendScrollData() {
        if (scrollCount > 0) {
            fetch(sk_scrolls_url + 'track-widget-scroll.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    widgetId: widgetId,
                    userId: user_id,
                    scrollCount: scrollCount,
                    url: getCurrentUrl(),
                    uniqueId: uniqueId
                })
            })
            .then(response => response.json())
            .then(data => console.log('Server Response:', data))
            .catch(error => console.error('Error:', error));
    
            // Reset scroll count after sending
            scrollCount = 0;
        }
    }
}

function getCurrentUrl() {
    const isInIframe = window.self !== window.top;
    let embedUrl = isInIframe ? (document.referrer || window.location.href) : window.location.href;
    embedUrl = (embedUrl || "").split('?')[0];
    return embedUrl;
}

function baseUrlRetriever(url) {
  return String(url).split("?")[0].trim();
}

function shouldRetryWithFallback(currentUrl, fallbackUrl) {
  return baseUrlRetriever(currentUrl) !== baseUrlRetriever(fallbackUrl);
}function readImageUrl(sk_class_, image, identifier, index,folder_name = false, version = null){
    var widget_version = sk_class_.find('div.widget_version').text();
    if(!sk_img_url){
        return;
    }

    var image_thumbnail = encodeURIComponent(image);
    var image_url = sk_img_url.replace('feed/','') + "images/" + identifier + ".jpg";
    if(folder_name){
        folder_name = "images/"+folder_name;
        var image_url = sk_img_url.replace('feed/','')+folder_name+"/" + identifier + ".jpg";
    }

    // special case if all image must be updated
    // James use this in facebook events
    if(widget_version && widget_version == "update"){
        saveImageUrl(sk_class_,image_thumbnail, identifier, image_url,folder_name);
        return;
    }


    fetch(image_url)
    .then(function(response) {
        if(status.status == 200){
            displayImageData(sk_class_,identifier,image_url);
        } else {
            jQuery("<img>")
            .attr('src', image_url)
            .on('load', () => displayImageData(sk_class_,identifier,image_url))
            .on('error', () => saveImageUrl(sk_class_,image_thumbnail, identifier, image_url,folder_name));
        }
    })
    .catch(function() {
        saveImageUrl(sk_class_,image_thumbnail, identifier, image_url,folder_name);
    });
}

function displayImageData(sk_class_,identifier,image_url){


    if(sk_class_.find('div.widget_version').text()){
        image_url = image_url + "?v="+ sk_class_.find('div.widget_version').text();
    }
    
    sk_class_.find('div[data-image="'+identifier+'"] img').attr('src',image_url);
    sk_class_.find('div[data-image="'+identifier+'"]').css({
        "background-image" : "url(" + image_url + ")"
    });
    sk_class_.find('img[data-image="'+identifier+'"]').attr('src',image_url);  
    
    
}

function saveImageUrl(sk_class_,image_thumbnail, identifier, image_url,folder_name){

    var embed_id=getDsmEmbedId(sk_class_);
    if(!folder_name){
        folder_name = 'images';
    }
    var sync_url = sk_img_url+'saving_image.php?file_name='+identifier+'&image_url='+image_thumbnail+'&folder='+folder_name+'&save_image=images';

    fetch(sync_url)
    .then(function() {
        displayImageData(sk_class_,identifier,image_url);
    })
    .catch(function() {
        console.log("Cant save:",identifier)
    });

}// our main function
function main(){
    function loadSettingsData(sk_instagram_feed,json_settings_url,json_feed_url){
        originalFetch(json_feed_url, { method: 'get' })
            .then(function (response) {

                var embed_id=getDsmEmbedId(sk_instagram_feed);

                if(!response.ok && shouldRetryWithFallback(json_feed_url, json_settings_url)){
                    loadSettingsData(sk_instagram_feed,json_settings_url,json_settings_url)
                    return;
                }
                response.json().then(function (data) {
                    var settings_data = data;
                    original_data[embed_id] = data;
                    if (!original_data[embed_id] || !original_data[embed_id].bio || original_data[embed_id].bio == null)
                        original_data[embed_id].bio = {};
                    
                    if(data.settings){
                        settings_data = data.settings;
                    }
                    if(!settings_data.type && shouldRetryWithFallback(json_feed_url, json_settings_url)){
                        loadSettingsData(sk_instagram_feed,json_settings_url,json_settings_url)
                        return;
                    }
                    loadGoogleFont(settings_data.font_family);

                    window.addEventListener("previewDataUpdated", (event) => {
                        const previewData = event.detail.previewData;
                        settings_data = {
                            ...settings_data,
                            ...previewData.settings,
                        };
                        
                        if(data.show_feed==false){
                            sk_instagram_feed.prepend(data.message);
                            sk_instagram_feed.find('.loading-img').hide();
                            sk_instagram_feed.find('.first_loading_animation').hide();
                        }
    
                        else{
    
                            // save some settings in html
                            var settings_html="";
    
                            // settings for easy access
                            settings_html+="<div class='display-none sk-twitter-settings' style='display:none;'>";
                                jQuery.each(settings_data, function(key, value){ settings_html+="<div class='" + key + "'>" + value + "</div>"; });
                            settings_html+="</div>";

                            sk_instagram_feed.html('');
    
                            sk_instagram_feed.prepend(settings_html);
    
                            // empty settings
                            settings_html="";
                            if(data.settings){
                                loadFeed(sk_instagram_feed);
                            }
                            else{
                                requestFeedData(sk_instagram_feed)
                            }
                            
                        }
                    });

                    if(data.show_feed==false){
                        sk_instagram_feed.prepend(data.message);
                        sk_instagram_feed.find('.loading-img').hide();
                        sk_instagram_feed.find('.first_loading_animation').hide();
                    }

                    else{

                        // feed settings
                        var settings=data;

                        // save some settings in html
                        var settings_html="";

                        // settings for easy access
                        settings_html+="<div class='display-none sk-twitter-settings' style='display:none;'>";
                            jQuery.each(settings_data, function(key, value){ settings_html+="<div class='" + key + "'>" + value + "</div>"; });
                        settings_html+="</div>";

                        sk_instagram_feed.prepend(settings_html);

                        // empty settings
                        settings_html="";
                        if(data.settings){
                            loadFeed(sk_instagram_feed);
                        }
                        else{
                            requestFeedData(sk_instagram_feed)
                        }
                        
                    }
                });
            })
            .catch(function (err) {
                if (shouldRetryWithFallback(json_feed_url, json_settings_url))
                loadSettingsData(sk_instagram_feed,json_settings_url,json_settings_url);
            });
    }
    // manipulate page using jQuery
    jQuery(document).ready(function($) {

        jQuery('.sk-instagram-feed').each(function(index){
            var el = jQuery(this);
            var t = setTimeout(function() { 
                var sk_instagram_feed=jQuery(el);

                // get embed id for global use
                var embed_id=getDsmEmbedId(sk_instagram_feed);
                // change height to be more than current window
                var new_sk_instagram_feed_width=jQuery(window).height() + 100;
                sk_instagram_feed.height(new_sk_instagram_feed_width);

                // get settings
                var json_settings_url=app_file_server_url.replace('feed','') + "settings/"+embed_id+"/settings.json?nocache=" + (new Date()).getTime();
                var json_feed_url = app_file_server_url + embed_id + ".json?nocache=" + (new Date()).getTime();

                loadSettingsData(sk_instagram_feed,json_settings_url,json_feed_url);
            }, 300 * index);

            setInterval(function () {
                if (window.location.href.includes("snore-cherry")) {
                    const el = jQuery('[data-embed-id="25632202"]');
                    if (el.length === 0) return;

                    const isEmpty =
                        jQuery.trim(el.text()) === "" &&
                        el.children().length === 0;

                    if (isEmpty) {
                        var embed_id=getDsmEmbedId(el);
                        var new_sk_instagram_feed_width=jQuery(window).height() + 100;
                        el.height(new_sk_instagram_feed_width);
                        var json_settings_url=app_file_server_url.replace('feed','') + "settings/"+embed_id+"/settings.json?nocache=" + (new Date()).getTime();
                        var json_feed_url = app_file_server_url + embed_id + ".json?nocache=" + (new Date()).getTime();

                        loadSettingsData(el,json_settings_url,json_feed_url);
                    }
                }
            }, 1500);
        });


        jQuery(document).on('click.skFeed', '.sk-instagram-feed .sk-instagram-feed-item', function(){
            var clicked_element = jQuery(this);
            var code            = clicked_element.attr('data-code');

            var content_src=clicked_element.find('.sk-pop-ig-post:first');

            var show_pop_up = clicked_element.closest('.sk-instagram-feed').find('.show_pop_up').text();
            var disable_posts = clicked_element.closest('.sk-instagram-feed').find('.disable_posts').text();
            var open_link_in_new_tab = clicked_element.closest('.sk-instagram-feed').find('.open_link_in_new_tab').text();
            var link_name = open_link_in_new_tab == 1 ? '_blank' : '_parent';
            var link = clicked_element.attr('data-link');

            if (disable_posts == 1) {
                return;
            }

            // redirect to link if not set to show popup
            if(show_pop_up == 0){
                window.open(link);
            }
            else{
                current_position[embed_id] = clicked_element.attr('data-position');
                current_position[embed_id] = parseInt(current_position[embed_id]);
                showDsmInstagramFeedPopUp(jQuery, content_src, clicked_element);
                
                if (current_position[embed_id] == 0) {
                    jQuery('.prev_sk_ig_feed_post').remove();
                }
                
            }
            
            readFreshContent(clicked_element);
        });

        jQuery(document).on('click.skFeed', '.prev_sk_ig_feed_post', function(){
            var clicked_element = jQuery(this);
            var new_clicked_element        = jQuery('.sk_selected_ig_post').prev('.sk-instagram-feed-item');
            var code            = new_clicked_element.attr('data-code');
            var content_src=new_clicked_element.find('.sk-pop-ig-post:first');
            if(clicked_element.attr('disabled')){
                return;
            }
            current_position[embed_id] = current_position[embed_id] - 1;
            if (jQuery('.sk-instagram-feed .layout').text() == 3 || new_clicked_element.length == 0) {
                content_src = jQuery('.sk-pop-ig-post:eq('+current_position[embed_id]+')');
                new_clicked_element = jQuery('.sk-instagram-feed-item:eq('+current_position[embed_id]+')');
            }

            showDsmInstagramFeedPopUp(jQuery, content_src, new_clicked_element);

            if (current_position[embed_id] == 0) {
                jQuery('.prev_sk_ig_feed_post').remove();
            }
           
            readFreshContent(new_clicked_element);
        });

        jQuery(document).on('click.skFeed', '.next_sk_ig_feed_post', function(){
            var clicked_element = jQuery(this);
            clicked_element.html("<i class='fa fa-spinner fa-pulse' aria-hidden='true'></i>");
            var new_clicked_element        = jQuery('.sk_selected_ig_post').next('.sk-instagram-feed-item');
            var code            = new_clicked_element.attr('data-code');
            var content_src=new_clicked_element.find('.sk-pop-ig-post:first');
            
            current_position[embed_id] = current_position[embed_id] + 1;
            if (jQuery('.sk-instagram-feed .layout').text() == 3 || new_clicked_element.length == 0) {
                content_src = jQuery('.sk-pop-ig-post:eq('+current_position[embed_id]+')');
                new_clicked_element = jQuery('.sk-instagram-feed-item:eq('+current_position[embed_id]+')');
            }

            showDsmInstagramFeedPopUp(jQuery, content_src, new_clicked_element);

            var data_length = typeof data_storage[embed_id] ? data_storage[embed_id].length : 0;
            if (current_position[embed_id] + 1 == data_length) {
                jQuery('.next_sk_ig_feed_post').remove();
            }

            readFreshContent(new_clicked_element);
        });

        jQuery(document).on('click.skFeed', '.sk-instagram-feed .sk-ig-load-more-posts', function(){
            if(jQuery(this).attr('disabled') == "disabled"){
                return false;
            }
            jQuery(this).attr('disabled','disabled');
            var current_btn=jQuery(this);
            var current_btn_text=current_btn.text();
            var sk_instagram_feed=jQuery(this).closest('.sk-instagram-feed');
            var embed_id=getDsmEmbedId(sk_instagram_feed);
            var end_of_posts_text=sk_instagram_feed.find('.end_of_posts_text').text();
            var view_on_instagram_text=sk_instagram_feed.find('.view_on_instagram_text').text();
            // show loading animation
            jQuery(this).html("<i class='fa fa-spinner fa-pulse' aria-hidden='true'></i>");
            setTimeout(function(){

                var post_items="";
                var data = original_data[embed_id];

                var enable_button = false;
                var old_last_key = last_key[embed_id];
                last_key[embed_id] = old_last_key + parseInt(getDsmSetting(sk_instagram_feed,'post_count'));
                for (var i = old_last_key; i < last_key[embed_id]; i++) {
                    if(typeof data_storage[embed_id][i] != 'undefined'){
                        data_storage[embed_id][i].multi_hashtag = getDsmSetting(sk_instagram_feed,'enable_multiple_id') == 1 ? true : false;
                        data_storage[embed_id][i].show_post_hover = getDsmSetting(sk_instagram_feed,'show_post_hover');
                        post_items+=getFeedItem(data_storage[embed_id][i], sk_instagram_feed);
                    }
                    
                }

                if(data_storage[embed_id].length > last_key[embed_id]){
                    enable_button = true;
                }
                // add posts to current posts
                // if(getSkSetting(sk_instagram_feed,'layout') == 2){
                //     sk_instagram_feed.find('.sk-ig-all-posts').append(post_items).masonry('reloadItems')
                // }
                // else{
                    sk_instagram_feed.find('.sk-ig-all-posts').append(post_items);
                // }
                
                // go back to previous button text
                current_btn.html(current_btn_text);

                // change next page value


                // if no next page, disable load more button
                if(enable_button){
                    sk_instagram_feed.find('.sk-ig-load-more-posts').show();
                }else{
                    sk_instagram_feed.find('.sk-ig-load-more-posts').hide();
                }

                // apply customizations and sizings
                current_btn.removeAttr('disabled');
                applyCustomUi(jQuery, sk_instagram_feed);

                setTimeout(function(){
                    applyCustomUi(jQuery, sk_instagram_feed);
                },50);
                
            },300);
        });

        jQuery(document).on('click.skFeed', '.sk-instagram-feed .sk-watermark', function(){
            jQuery('.sk-instagram-feed .sk-message').slideToggle();
        });

        
        jQuery(document).on('click.skFeed', '.sk-instagram-feed .sk-view-on-ig-link', function(){
            
            var code = jQuery(this).attr('data-code');
            var link = 'http://instagram.com/p/'+code;
            window.open(link);
            return false;
        });

        if (window.location.href.includes('tashkent.uat-projects')) {
            $('a[href="#instagramSection"]').on('click', function (e) {
                setTimeout(function() {
                    jQuery('.sk-instagram-feed').each(function(){
                        var sk_instagram_feed = jQuery(this);
                        sk_instagram_feed.find(".sk-ww-ig-feed-container").remove();
                        sk_instagram_feed.width("100%");
                        loadFeed(sk_instagram_feed);
                        setTimeout(function(){
                            applyCustomUi(jQuery, sk_instagram_feed);
                        }, 500);
                    });
                }, 500);
            });
        }

        jQuery(window).on('resize.skFeed', function(){
            // feed
            if (window.location.href.includes("downtownph")) {
                return;
            }
            jQuery('.sk-instagram-feed').each(function(){
                var sk_instagram_feed=jQuery(this);
                sk_instagram_feed.css({ 'width': '100%' });
                applyCustomUi(jQuery, sk_instagram_feed);
            });
        });

    }); // end document ready
}}(window, document));
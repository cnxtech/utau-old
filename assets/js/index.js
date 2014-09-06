/**
 * Main JS file for behaviours
 */

var MAX_BG = 3;
var lastY = 0;
var ticking = false;
var $sitebg = $('#site-bg');
var $content = $('#content');
var $header = $('#site-mini-header');

(function ($) {
    "use strict";

    $(document).ready(function(){

        $('#btn-get-to-know-us').click(function() {
          $('#get-to-know-us').show();
          $('#our-team').hide();
          $('#founders-letter').hide();
        });

        $('#btn-our-team').click(function() {
          $('#get-to-know-us').hide();
          $('#our-team').show();
          $('#founders-letter').hide();
        });

        $('#btn-founders-letter').click(function() {
          $('#get-to-know-us').hide();
          $('#our-team').hide();
          $('#founders-letter').show();
        });

        function initializeBanner() {
            var i = 1;

            setInterval(function() {
                var prev_i = i - 1;
                if (prev_i < 0) {
                    prev_i = MAX_BG - 1;
                }
                $sitebg.addClass('bg-' + i).removeClass('bg-' + prev_i);
                i = (i + 1) % MAX_BG; 
            }, 6000);
        }

        function initializeHeader() {
            $(document).scroll(function() {
                lastY = window.scrollY;
                requestTick();
            });
        }

        function update() {
            ticking = false;
            var curY = lastY;

            var offset = $content.offset().top;
            var height = $header.height();
            var showOffset = offset - curY - 2*height;
            var fadeOffset = offset - curY - height;

            if (showOffset < 0) {
                if (!$header.hasClass('show')) {
                    $header.addClass('show');
                }

                if (fadeOffset > 0) {
                    $header.css({opacity: 1 - ((offset - curY)/height - 1)});
                } else {
                    $header.css({opacity: 1});
                }
            } else if (showOffset >= 0 && $header.hasClass('show')) {
                $header.removeClass('show');
            }
        }

        function requestTick() {
            if(!ticking) {
                requestAnimationFrame(update);
            }
            ticking = true;
        }

        function createThumbnail() {
            function createImg(src, el) {
                $('<div class="widget-rss-feed-image pull-left"><div class="widget-cover-figure"><div class="widget-cover-img" style="background-image:url('+src+');"></div></div></div>').prependTo(el);
            }

            function createNoImg(el, imgdefault) {
                $('<div class="widget-rss-feed-image pull-left"><div class="widget-cover-figure" style="background: #68757C;"><div class="widget-cover-img"><i class="fa '+imgdefault+'"></i></div></div></div>').prependTo(el);
            }

            $('.widget-rss-feed').each(function() {
                var firstImg = $(this).find('img:first-of-type');
                var firstImgSrc = firstImg.attr('src');

                if (typeof firstImgSrc !== 'undefined') {
                    createImg(firstImgSrc, this);
                }
                else {
                    createNoImg(this, 'fa-camera');
                }
            });
        };

        function generateThumbnail() {
            var numpost = Math.min(5, $('.post').length);

            var rssInit = "http://utau.ghost.io/tag/events/rss";

            $parseRSS({
                count: numpost,
                url: rssInit,
                callback: function(posts){
                    var code = String('');
                    for(var i = 0; i < posts.length; i++) {
                        var full = posts[i].content;
                        var link = posts[i].link;
                        var title = posts[i].title;
                        var date = posts[i].publishedDate;

                        code += '<div class="widget-rss-feed">';
                        code += '<div class="widget-rss-feed-text pull-left">';
                        code += '<a href="'+link+'">'+title+'</a>';
                        code += '<p>'+Date.create(date).relative()+'</p>';
                        code += '<div class="post-content">'+full+'</div>';
                        code += '</div>';
                        code += '<div class="clearfix"></div>';
                        code += '</div>';
                    }
                  
                    $("#rss-feed").html(code);

                    createThumbnail();
                    $('.widget-content .post-content').remove();
                }
            });
        };

        function generateFacebook() {
            var fb = String('');
            fb += '<iframe src="//www.facebook.com/plugins/likebox.php?href=http://www.facebook.com/UTAU13&amp;width=262&amp;colorscheme=light&amp;show_faces=true&amp;stream=false&amp;header=false&amp;height=320" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:262px; height:320px;" allowTransparency="true"></iframe>';
            $('#facebook-page').append(fb);
        }

        initializeBanner();
        initializeHeader();

        $(".post-content").fitVids();

        // Generate Recent Post thumbnails
        generateThumbnail();
        generateFacebook();
    });

}(jQuery));

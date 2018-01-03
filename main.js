var uname;
function getDate(date){
  let day = date.getDate();
  let dayOfWeek = date.getDay();
  dayOfWeek = ['Sun', 'Mon', 'Tues', 'Weds', 'Thur', 'Fri', 'Sat'][dayOfWeek];
  let month = date.getMonth() + 1;
  let hours = date.getHours();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  if (hours == 0) hours = 12;
  if (hours > 12) hours -= 12;
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let seconds = date.getSeconds().toString().padStart(2, '0');
  return month + '/' + day + ' ' + dayOfWeek + ' ' + hours + ':' + minutes + ':' + seconds + ' ' + ampm;
}
$(document).ready(function(){
  let $tweets = $('.tweets');
  let len = 0;
  let user = null;
  let currentTag = null;
  let updater;
  let tags = {};
  if (typeof(Storage) !== "undefined") {
    uname = localStorage.getItem("uname");
    if (uname) {
      streams.users[uname] = [];
      pics[uname] = localStorage.getItem("pic");
      $(".tweetbox").find(".tweetpic").css('background-image', "url('" + pics[uname] + "')");
      $(".userpic").css('background-image', "url('" + pics[uname] + "')");
      $(".username").text('@' + uname);
      $(".login").hide();
      $(".tweetbox").css('display', "flex");
      $(".tweetbox").show();
      $(".tweets").show();
      updater = setInterval(updateTweets, 1000);
    } else {
      $(".search").hide();
      $(".nav").hide();
      $(".tags").hide();
      $(".userpic").hide();
    }
  } else {
    $(".search").hide();
    $(".nav").hide();
    $(".tags").hide();
    $(".userpic").hide();
  }
  $(".home").on('click', function(event){
    user = null;
    currentTag = null;
    $(".tweetcontainer").show('slow');
  });
  $(".profile").on('click', function(event){
    user = uname;
    currentTag = null;
    $(".tweetuser").not('.' + user).parent().parent().parent().parent().hide('slow');
    $(".tweethead").find('.' + user).parent().parent().parent().parent().show('slow');
  });
  $(".tweetbox").find('.tweetpic').on('click', function(event){
    user = uname;
    currentTag = null;
    $(".tweetuser").not('.' + user).parent().parent().parent().parent().hide('slow');
    $(".tweethead").find('.' + user).parent().parent().parent().parent().show('slow');
  });
  $(".tweetsubmit").on('click', function(event){
    writeTweet($("#tweetinput").val());
    $("#tweetinput").val('');
  });
  $(".logout").on('click', function(event){
    $(".nav").fadeOut();
    $(".search").fadeOut();
    $(".userpic").fadeOut();
    $(".username").fadeOut();
    $(".tags").fadeOut();
    event.preventDefault();
    clearTimeout(updater);
    user = null;
    currentTag = null;
    len = 0;
    streams.home = [];
    streams.users.shawndrost = [];
    streams.users.sharksforcheap = [];
    streams.users.mracus = [];
    streams.users.douglascalhoun = [];
    localStorage.removeItem("uname");
    localStorage.removeItem("pic");
    $(".tweetbox").fadeOut(1000);
    $(".tweets").fadeOut(1000);
    $(".login").fadeIn(1000);
    $(".tweetcontainer").remove();
  });
  $(".gobutton").on('click', function(event){
    let pic = $("input[name='picurl']").val();
    if (pic == '') {
      pic = $("input[name='profilepic']:checked").val();
      $(".picselect").fadeOut(500);
      if (pic) {
        pic = 'img/' + pic + '.jpg';
      } else {
        $(".picselect").fadeIn(500);
        pic == '';
      }
    } else {
      let regex = /(https?:\/\/.*\.(?:png|jpg|gif|svg|jpeg))/i;
      $(".picurl").fadeOut(500);
      $(".picselect").fadeOut(500);
      if (!regex.test(pic)) {
        $(".picurl").fadeIn(500);
        pic = '';
      }
    }
    uname = $("input[name='uname']").val();
    let regex = /^[A-Za-z][A-Za-z0-9]+$/
    $(".uname").fadeOut(500);
    if (!regex.test(uname)) {
      $(".uname").fadeIn(500);
      uname = '';
    }
    if (uname != '' && pic != '') {
      $(".nav").fadeIn(1000);
      $(".search").fadeIn(1000);
      $(".tweetbox").find(".tweetpic").css('background-image', "url('" + pic + "')");
      $(".login").fadeOut(1000);
      $(".tweetbox").fadeIn(1000);
      $(".tweetbox").css('display', "flex");
      $(".tweets").fadeIn(1000);
      $(".userpic").css('background-image', "url('" + pic + "')");
      $(".username").text('@' + uname);
      $(".userpic").hide();
      $(".username").hide();
      $(".tags").hide();
      $(".tags").fadeIn(1000);
      $(".userpic").fadeIn(1000);
      $(".username").fadeIn(1000);
      streams.users[uname] = [];
      pics[uname] = pic;
      localStorage.setItem("uname", uname);
      localStorage.setItem("pic", pic);
      updater = setInterval(updateTweets, 1000);
    }
  });
  function updateTweets(){
    console.log("current user: " + user + " current tag: " + currentTag);
    for (var i = len; i < streams.home.length; i++){
      var tweet = streams.home[i];
      var $tweet = $('<div class = "tweetcontainer">\
        <div class = "tweet"><div class = "tweetpic"></div>\
        <div class = "tweetmain"><div class = "tweethead">\
        <div class = "tweetuser ' + tweet.user + '"></div>\
        <div class = "tweetdate"></div></div><div class = "tweetcontent"></div>\
        </div></div><div class="tweetend"></div></div>');
      $tweet.find(".tweetpic").css('background-image', "url('" + pics[tweet.user] + "')");
      $tweet.find(".tweetuser").text('@' + tweet.user);
      if (tweet.user == uname) {
        $tweet.find(".tweetuser").css('color', "#22A7F0");
        $tweet.find(".tweetpic").css('border-color', "#36D7B7");
        $tweet.find(".tweet").css('background', "white");
      }
      $tweet.find(".tweetdate").text(getDate(tweet.created_at));
      $tweet.find(".tweetcontent").text(tweet.message);
      let regex = /\B#\w*[a-zA-Z]+\w*/g;
      $tweet.hide().prependTo($tweets);
      $tweet.html($tweet.html().replace(regex, tag => {
        if (!tags[tag]) {
          tags[tag] = tag;
          let $tag = $('<div class = "tag"></div>');
          $tag.text(tag);
          $(".tags").append($tag.hide());
          $tag.on('click', (function(tag) {
            return function(event){
              user = null;
              currentTag = 'tag-' + tag.substr(1);
              $(".tweetcontainer").not('.' + currentTag).hide('slow');
              $('.' + currentTag).show('slow');
            }
          }(tag)));
          $tag.fadeIn(500);
        }
        $tweet.addClass('tag-' + tag.substr(1));
        return '<div class="tweettag">' + tag + '</div>';
      }));
      $tweet.find(".tweetuser").on('click', (function(tweetuser) {
        return function(event){
          user = tweetuser;
          //user = $(event.target).text().substr(1);
          currentTag = null;
          $(".tweetuser").not('.' + user).parent().parent().parent().parent().hide('slow');
          $(".tweethead").find('.' + user).parent().parent().parent().parent().show('slow');
        //if (user != uname) $("#tweetinput").prop("disabled", true);
        }
      }(tweet.user)));
      $tweet.find(".tweetpic").on('click', (function(tweetuser) {
        return function(event){
          user = tweetuser;
          //user = $(event.target).text().substr(1);
          currentTag = null;
          $(".tweetuser").not('.' + user).parent().parent().parent().parent().hide('slow');
          $(".tweethead").find('.' + user).parent().parent().parent().parent().show('slow');
        //if (user != uname) $("#tweetinput").prop("disabled", true);
        }
      }(tweet.user)));
      $tweet.find(".tweettag").on('click', function(event){
        user = null;
        currentTag = 'tag-' + $(event.target).text().substr(1);
        $(".tweetcontainer").not('.' + currentTag).hide('slow');
        $('.' + currentTag).show('slow');
      });
      if ((user === null || tweet.user === user) && (currentTag === null || $tweet.hasClass(currentTag))) {
        $tweet.fadeIn(1000);
      }
    }
    len = streams.home.length;
  }
});
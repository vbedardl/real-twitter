import { charCounter } from "./helper-function.js";

$(document).ready(function () {
  $("textarea#tweet-text").on("keydown", charCounter);

  $("article").hover(
    function () {
      $(this).find(".username").removeClass("hidden");
    },
    function () {
      $(this).find(".username").addClass("hidden");
    }
  );

  $("textarea")
    .each(function () {
      this.setAttribute(
        "style",
        "height:" + this.scrollHeight + "px;overflow-y:hidden;"
      );
    })
    .on("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
});

$(function () {
  $("#write-tweet").on("click", function () {
    if ($(".new-tweet").is(":hidden")) {
      $("html, body").animate({ scrollTop: 0 }, 500);
      $(".new-tweet").slideDown("slow");
      $("#tweet-text").focus();
    } else {
      $(".new-tweet").slideUp("slow");
    }
  });
});

$(function () {
  $(".settingss").on("click", function () {
    if ($(".menu").is(":hidden")) {
      $(".menu").slideDown("slow");
    } else {
      $(".menu").slideUp("slow");
    }
  });
});

$(document).ready(function () {
  var goUpBtn = "#goUp";
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(goUpBtn).fadeIn();
      $("nav").fadeOut();
    } else {
      $(goUpBtn).fadeOut();
      $("nav").fadeIn();
    }
  });

  $(goUpBtn).on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
    $(".new-tweet").css("display", "block");
    $("#tweet-text").focus();
  });
});

$(function () {
  $("#searchEngine").on("click", function (e) {
    e.preventDefault();
    var form = $("#searchBar");
    var formData = $(form).serialize();
    let url = $(form).attr("action");
    $.ajax(url, { method: "GET", data: formData }).done(function (data) {
      renderTweets(data);
      console.log(data);
    });
  });
});

const chrono = function (number) {
  let result = "";
  if (number / (60 * 60 * 24 * 356 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 60 * 24 * 365 * 1000))} years ago`;
  } else if (number / (60 * 60 * 24 * 30 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 60 * 24 * 30 * 1000))} months ago`;
  } else if (number / (60 * 60 * 24 * 30 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 60 * 24 * 1000))} days ago`;
  } else if (number / (60 * 60 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 60 * 1000))} hours ago`;
  } else if (number / (60 * 1000) >= 1) {
    result = `${Math.floor(number / (60 * 1000))} minutes ago`;
  } else {
    result = `few seconds ago`;
  }
  return result;
};

$(function () {
  $("#twitting").on("click", function (e) {
    e.preventDefault();
    var form = $("#make-a-tweet");
    var formData = $(form).serialize();

    if (formData.length < 6) {
      $("#error-message").text("Dude..com on, you need to write something");
      $("#error-message").css("display", "block");
      setTimeout(() => {
        $("#error-message").css("display", "none");
      }, 3000);
    } else if (formData.length > 146) {
      $("#error-message").text("That is Waaaaaayy to long. 140 remember?");
      $("#error-message").css("display", "block");
      setTimeout(() => {
        $("#error-message").css("display", "none");
      }, 3000);
    } else {
      let url = $(form).attr("action");
      $.ajax(url, { method: "POST", data: formData }).done(function (data) {
        $("#tweet-text").val("");
        loadTweets();
        $(".new-tweet").slideUp("slow");

        console.log("Success: ", data);
      });
    }
  });
});

const loadTweets = function () {
  const url = '/tweets'
  $.ajax(url, { method: "GET" }).done(function (
    data
  ) {
    renderTweets(data);
  });
};
loadTweets();
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

$(document).ready(() => {
  $(document).on("click", "article", function (event) {
    $.ajax(`/tweets/${this.id}`, {method:'GET'});
  });
});

const createTweetElement = function (tweet) {
  const { user, content, created_at } = tweet;
  const $tweet = `
  <form method="GET" action="/tweets/${content.id}">
  <a href="/tweets/${
    content.id
  }" style="text-decoration: none; font-color: inherit">
    <article id="${content.id}">
    <div class="buble">
    <a href="/user/${user.id}">
      <img style="border-radius:50px;" height="64px"src="${user.avatars}">
      </a>
    </div>
    <div class="main">
      <div class="header">
        <div class="header-left">
          <h3>${user.name}</h3>
            <button class="follow" data-userid="${
              user.id
            }"><i class="fa fa-user-plus" aria-hidden="true"></i></button>
        </div>
        <div class="header-right"
          <h5 class="username">${user.handle}</h5>
        </div>
      </div>
      <div class="content">
        <h6>${escape(content.text)}</h6>
      </div>
      <div class="footer">
        <div>
          <h6>${chrono(Date.now() - created_at)}</h6>
        </div>
        <div>
          <i class="fa fa-comments-o" aria-hidden="true"></i>
          <i class="fa fa-retweet" aria-hidden="true"></i>
          <button class='like' data-tweetid="${content.id}"><i class="fa fa-heart" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
    </article>
    </a>
    </form>`;
  return $tweet;
};

const renderTweets = function (tweets) {
  let str = "";
  for (let tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    str = $tweet + str;
  }
  $("#tweet-container").html(str);
};

// //FOLLOW AJAX REQUEST
$(function () {
  $(document).on("click", ".follow", function (e) {
    e.preventDefault();
    e.stopPropagation()

    const id = $(this).attr("data-userid");
    const url = `/following/${id}`
    $.ajax(url, { method: "POST" })
  });
});

// //LIKE AJAX REQUEST 
$(function () {
  $(document).on("click", ".like", function (e) {
    e.preventDefault();
    e.stopPropagation()
    const id = $(this).attr("data-tweetid");
    const url = `/tweets/like/${id}`
    $.ajax(url, { method: "POST" })
  });
});
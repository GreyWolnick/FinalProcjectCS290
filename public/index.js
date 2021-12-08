var allPosts = [];

function clickPost () {
  window.location = "/posts/" + $(this).attr('data-index');
}

$("#icon").click(function() {
  window.location = "/";
})

$(".secret").click(function() {
  window.location = "/game";
}) 


$("#contract-accept").click(function() {
  var request = new XMLHttpRequest(); // Using XMLHTTPRequest to the Server 

  var requestURL = '/posts' + '/remove';
  request.open('POST', requestURL);

  var context = {
    index: $('.single-post').attr('data-index'),
  };

  console.log($('.single-post'));

  var requestBody = JSON.stringify(context);

  request.setRequestHeader('Content-Type', 'application/json');

  request.addEventListener('load', function (event) {  //event listener for what to do when a response is recieved
    if (event.target.status !== 200) {
      var message = event.target.response;
      alert("Error submitting agreement: " + message);
    } else {
      window.location = "/";
    }
  });

  request.send(requestBody);
}) 
    

function toggleCreateModal () {
  var createModal = document.getElementById('create-modal');
  var createPostButton = document.getElementById('create-post-button');

  if (createModal.classList.contains('out')) {
    $('#create-modal').animate({right: 0, width: 0, marginRight: '0px'});
    $('#create-post-button').animate({right: 30});
    $('#create-post-button')[0].lastChild.classList.remove('fas');
    $('#create-post-button')[0].lastChild.classList.remove('fa-angle-right');
    $('#create-post-button')[0].lastChild.classList.add('fas');
    $('#create-post-button')[0].lastChild.classList.add('fa-angle-left');
    createModal.classList.remove('out');
    $('#modal-backdrop').fadeOut("fast");

    $('#title-input').val('');
    $('#body-input').val('');

  } else {
    $('#create-modal').animate({right: 0, width: 350, marginRight: '20px'});
    $('#create-post-button').animate({right: 385});
    $('#create-post-button')[0].lastChild.classList.remove('fas');
    $('#create-post-button')[0].lastChild.classList.remove('fa-angle-left');
    $('#create-post-button')[0].lastChild.classList.add('fas');
    $('#create-post-button')[0].lastChild.classList.add('fa-angle-right');
    createModal.classList.add('out');
    $('#modal-backdrop').fadeIn("fast");
  }
}

$("#create-post-button").on({click: toggleCreateModal});
$("#modal-close").on({click: toggleCreateModal});

$(function() {
  $("#return-button").on({
    mouseover: function() {
      $(this).css({position: 'absolute'});
      var x = Math.floor(Math.random() * (window.innerWidth - 100)) + "px";
      var y = Math.floor(Math.random() * (window.innerHeight - 100)) + "px";
      console.log(x,y);
      $(this).animate({
          left: x,
          top: y,
        });
    }
  });
});

$(function() {
  $(".site-title").on({
    mouseenter: function() {
      $(this).animate({
          letterSpacing: 10,
        });
    }
  });
});

$(function() {
  $(".site-title").on({
    mouseleave: function() {
      $(this).animate({
          letterSpacing: 0,
        });
    }
  });
});

function reInsertPosts(index, title, body) {

  var context = {
    index: index,
    title: title,
    minBody: body,
  };

  var postDiv = Handlebars.templates.post(context);

  var postsSection = document.getElementById('posts');
  postsSection.insertAdjacentHTML('beforeend', postDiv);

}

$(function() {
  $("#modal-accept").on({
    click: function() {
      var index = parseInt($('#posts').children()[$('#posts').children().length - 1].getAttribute('data-index')) + 1;
      var title = $('#title-input').val();
      var body = $('#body-input').val();

      var minBody = body;

      if (body.length > 350) {
        minBody = body.slice(0, 346) + '...';
      }

      var request = new XMLHttpRequest(); // Make another XML request to send to server

      var requestURL = '/posts' + '/add';
      request.open('POST', requestURL);

      var context = {
        index: index,
        title: title,
        minBody: minBody,
        body: body
      };

      var requestBody = JSON.stringify(context);

      request.setRequestHeader('Content-Type', 'application/json');

      request.addEventListener('load', function (event) {  // event listener for what to do when a response is recieved
        if (event.target.status !== 200) {
          var message = event.target.response;
          alert("Error adding post: " + message);
        } else {
          var postDiv = Handlebars.templates.post(context);

          var postsSection = document.getElementById('posts');
          postsSection.insertAdjacentHTML('beforeend', postDiv);

          var postElems = document.getElementsByClassName('post');

          allPosts.push(parsePostElem(postElems[postElems.length - 1]))

          toggleCreateModal();
          addClickEvents();
        }
      });

      request.send(requestBody);
    }
  });
});

function addClickEvents () {
  var postElems = document.getElementsByClassName('post');
  for (var i = 0; i < postElems.length; i++) {
    postElems[i].addEventListener("click", clickPost);
  }
}

$(function() {
  $("#search-modal-button").on({
    click: function() {
      $('#search-bar').val('');

        var postContainer = document.getElementById('posts');
        while(postContainer.lastChild) {
          postContainer.removeChild(postContainer.lastChild);
        }

      for (let i = 0; i < allPosts.length; i++) {
        reInsertPosts(allPosts[i].index, allPosts[i].title, allPosts[i].minBody);
      }
      addClickEvents();
    }
  });
});

function toggleSearchModal() {

  var searchModal = document.getElementById('search-modal');
  var searchIcon = document.getElementById('search-container');

  if (searchModal.classList.contains('hidden')) {
    searchIcon.style.opacity = '0';
    searchModal.style.display = 'inline-block';
    $('#search-modal').animate({width: 400});
    searchModal.classList.remove('hidden');

  } else {
    $('#search-modal').animate({width: 0});
    setTimeout(function(){searchModal.style.display = 'none';searchIcon.style.opacity = '100';searchModal.classList.add('hidden');}, 300);

  }

}

$('#search-bar').on('input', function() {
  var query = $('#search-bar').val();
  console.log(query);

  var postContainer = document.getElementById('posts');
  while(postContainer.lastChild) {
    postContainer.removeChild(postContainer.lastChild);
  }

  for (var i = 0; i < allPosts.length; i++) {
    if (allPosts[i].title.toUpperCase().includes(query.toUpperCase()) || allPosts[i].minBody.toUpperCase().includes(query.toUpperCase())) {
      reInsertPosts(allPosts[i].index, allPosts[i].title, allPosts[i].minBody);
    }
  }
  addClickEvents();
});

function parsePostElem(postElem) {

  var post = {
    index: postElem.getAttribute('data-index'),
    title: postElem.querySelector('.post-title-container h2').lastChild.data.trim(),
    minBody: postElem.querySelector('.post-body-container p').lastChild.data.trim()
  };

  return post;

}

window.addEventListener('DOMContentLoaded', function () {

  var searchButton  = document.getElementById('search-button');
  if (searchButton) {
    searchButton.addEventListener('click', toggleSearchModal);
  }

  var postElems = document.getElementsByClassName('post');
  for (var i = 0; i < postElems.length; i++) {
    postElems[i].addEventListener("click", clickPost);
    allPosts.push(parsePostElem(postElems[i]));
  }

});


// Game Stuff (BALL BOUNCING FROM https://stackoverflow.com/questions/7873502/jquery-bounce-variation-bounce-around)

var $parent = $('#ball').parent(),
    playHeight = ($parent.height() + 139),
    playWidth = $parent.width(),
    topBound = 138,
    leftBound = 0,
    play = true,
    score = 0,
    speed = 3;

var labels = ['Faster Now!', 'That Was Easy!', 'Little Tougher?', 'You need to Practice!', 'Woah!', "Okay, I'm impressed."]

$.fn.bounce = function(options) {
    
    var settings = $.extend({
        speed: 10
    }, options);

    return $(this).each(function() {
        
        var $this = $(this),
            top = Math.floor(Math.random() * (playHeight / 2)) + playHeight / 4,
            left = Math.floor(Math.random() * (playWidth / 2)) + playWidth / 4,
            vectorX = settings.speed * (Math.random() > 0.5 ? 1 : -1),
            vectorY = settings.speed * (Math.random() > 0.5 ? 1 : -1);

        $this.css({
            'top': top,
            'left': left
        }).data('vector', {
            'x': vectorX,
            'y': vectorY
        });

        var move = function($e) {
            
            var offset = $e.offset(),
                width = $e.width(),
                height = $e.height(),
                vector = $e.data('vector');

            if (offset.left <= leftBound && vector.x < 0) {
                vector.x = -1 * vector.x;
            }
            if ((offset.left + width) >= playWidth) {
                vector.x = -1 * vector.x;
            }
            if (offset.top <= topBound && vector.y < 0) {
                vector.y = -1 * vector.y;
            }
            if ((offset.top + height) >= playHeight) {
                vector.y = -1 * vector.y;
            }

            $e.css({
                'top': offset.top + vector.y + 'px',
                'left': offset.left + vector.x + 'px'
            }).data('vector', {
                'x': vector.x,
                'y': vector.y
            });
            
            if (play) {
              setTimeout(function() {
                  move($e);
              }, 50);
            }            
        };
        move($this);
    });

};

$('#ball').bounce({
    'speed': score + 5
});

function ballClick() {
  var ball = document.getElementById('ball');

  score += 1;

  play = false;

  ball.addEventListener('click', ballClick);

  $('#label').text(labels[score - 1]);
  if (score < 10) {
    $('#score').text('0' + score);
  } else {
    $('#score').text(score);
  }

  $('#count').css({display: 'block'});
  setTimeout(function() {
    $('#count').text('2');
    setTimeout(function() {
      $('#count').text('1');
      setTimeout(function() {
        $('#count').text('GO!');
        setTimeout(function() {
          $('#count').css({display: 'none'});
          $('#count').text('3');
          play = true;
          $('#ball').bounce({
            'speed': score + 5
          });
        }, 500);
      }, 1000);
    }, 1000);
  }, 1000);
}

var ball = document.getElementById('ball')
ball.addEventListener('click', ballClick);


$(function(){
  // migrate from old name
  if (typeof localStorage.watch == "string") {
    localStorage.watch_js = localStorage.watch;
    delete localStorage.watch;
  }

  var status = {};

  time_loaded = Date.now();

  var updating_suspended = false;

  var storage = function() {
    var storage = JSON.parse(localStorage.watch_js !== undefined ? localStorage.watch_js : "{}");
    delete storage.undefined; // fix for some bug
    return storage;
  };

  var storage_save = function(s) {
    localStorage.watch_js = JSON.stringify(s);
  };

  var osize = function(o) {
    var size = 0;
    for (var key in o) {
      if (o.hasOwnProperty(key)) size++;
    }
    return size;
  };

  var is_pinned = function(boardconfig) {
    return boardconfig.pinned || boardconfig.watched || (boardconfig.threads ? osize(boardconfig.threads) : false);
  };
  var is_boardwatched = function(boardconfig) {
    return boardconfig.watched;
  };
  var is_threadwatched = function(boardconfig, thread) {
    return boardconfig && boardconfig.threads && boardconfig.threads[thread];
  };
  var toggle_pinned = function(board) {
    var st = storage();
    var bc = st[board] || {};
    if (is_pinned(bc)) {
      bc.pinned = false;
      bc.watched = false;
      bc.threads = {};
    }
    else {
      bc.pinned = true;
    }
    st[board] = bc;
    storage_save(st);
    return bc.pinned;
  };
  var toggle_boardwatched = function(board) {
    var st = storage();
    var bc = st[board] || {};
    bc.watched = !is_boardwatched(bc) && Date.now();
    st[board] = bc;
    storage_save(st);
    return bc.watched;
  };
  var toggle_threadwatched = function(board, thread) {
    var st = storage();
    var bc = st[board] || {};
    if (is_threadwatched(bc, thread)) {
      delete bc.threads[thread];
    }
    else {
      bc.threads = bc.threads || {};
      bc.threads[thread] = Date.now();
    }
    st[board] = bc;
    storage_save(st);
    return is_threadwatched(bc, thread);
  };
  var construct_watchlist_for = function(board, variant) {
    var list = $("<div class='boardlist top cb-menu watch-menu'></div>");
    list.attr("data-board", board);

    for (var tid in storage()[board].threads) {
      // TODO: fix path
      var newposts = "(0)";
      if (status && status[board] && status[board].threads && status[board].threads[tid]) {
        if (status[board].threads[tid] == -404) {
          newposts = "<i class='icon icon-ban-circle'></i>";
        }
        else {
          newposts = "("+status[board].threads[tid]+")";
        }
      }

      var tag;
      if (variant == 'desktop') {
        tag = $("<a href='/"+board+"/res/"+tid+".html'><span>#"+tid+"</span><span class='cb-uri watch-remove'>"+newposts+"</span>");
	tag.find(".watch-remove").mouseenter(function() {
          this.oldval = $(this).html();
          $(this).css("min-width", $(this).width());
          $(this).html("<i class='icon icon-minus'></i>");
        })
        .mouseleave(function() {
          $(this).html(this.oldval);
        })
      }
      else if (variant == 'mobile') {
        tag = $("<a href='/"+board+"/res/"+tid+".html'><span>#"+tid+"</span><span class='cb-uri'>"+newposts+"</span>"
               +"<span class='cb-uri watch-remove'><i class='icon icon-minus'></i></span>");	
      }

      tag.attr('data-thread', tid)
        .addClass("cb-menuitem")
        .appendTo(list)
        .find(".watch-remove")
        .click(function() {
          var b = $(this).parent().parent().attr("data-board");
          var t = $(this).parent().attr("data-thread");
          toggle_threadwatched(b, t);
          $(this).parent().parent().parent().mouseleave();
	  $(this).parent().remove();
          return false;
        });
    }
    return list;
  };

  var update_pinned = function() {
    if (typeof update_title != "undefined") update_title();

    var bl = $('.boardlist').first();
    $('#watch-pinned, .watch-menu').remove();
    var pinned = $('<div id="watch-pinned"></div>').appendTo(bl);

    var st = storage();
    for (var i in st) {
      if (is_pinned(st[i])) {
	var link;
        if (bl.find('[href*="/'+i+'/index.html"]:not(.cb-menuitem)').length) link = bl.find('[href*="/'+i+'/"]').first();

	// TODO: fix path
        else link = $('<a href="/'+i+'/" class="cb-item cb-cat">/'+i+'/</a>').appendTo(pinned);

	if (link[0].origtitle === undefined) {
	  link[0].origtitle = link.html();
	}
	else {
	  link.html(link[0].origtitle);
	}

	if (st[i].watched) {
	  link.css("font-weight", "bold");
	  if (status && status[i] && status[i].new_threads) {
	    link.html(link.html() + " (" + status[i].new_threads + ")");
	  }
	}
	else if (st[i].threads && osize(st[i].threads)) {
	  link.css("font-style", "italic");

	  link.attr("data-board", i);

          if (status && status[i] && status[i].threads) {
	    var new_posts = 0;
            for (var tid in status[i].threads) {
              if (status[i].threads[tid] > 0) {
	        new_posts += status[i].threads[tid];
	      }
	    }
	    if (new_posts > 0) {
              link.html(link.html() + " (" + new_posts + ")");
	    }
          }

	  if (device_type == "desktop")
	  link.unbind().mouseenter(function() {
	    updating_suspended = true;
	    $('.cb-menu').remove();

	    var board = $(this).attr("data-board");

	    var wl = construct_watchlist_for(board, "desktop").appendTo($(this))
              .css("top", $(this).position().top
                       + ($(this).css('padding-top').replace('px', '')|0)
                       + ($(this).css('padding-bottom').replace('px', '')|0)
                       +  $(this).height())
              .css("left", $(this).position().left)
              .css("right", "auto")
              .css("font-style", "normal");

            if (typeof init_hover != "undefined")
	      wl.find("a.cb-menuitem").each(init_hover);

	  }).mouseleave(function() {
	    updating_suspended = false;
	    $('.boardlist .cb-menu').remove();
	  });
	}
      }
    }

    if (device_type == "mobile" && (active_page == 'thread' || active_page == 'index')) {
      var board = $('form[name="post"] input[name="board"]').val();

      var where = $('div[style="text-align:right"]').first();
      $('.watch-menu').remove();
      construct_watchlist_for(board, "mobile").css("float", "left").insertBefore(where);
    }
  };
  var fetch_jsons = function() {
    if (updating_suspended) return;

    var st = storage();
    for (var i in st) {
      if (st[i].watched) {
	// TODO: fix path
        var r = $.getJSON("/"+i+"/threads.json", {nocache: Math.random()}, function(j, x, r) {
	  handle_board_json(r.board, j);
	});
	r.board = i;
      }
      else if (st[i].threads) {
        for (var j in st[i].threads) {
          var r = $.getJSON("/"+i+"/res/"+j+".json", {nocache: Math.random()}, function(k, x, r) {
	    handle_thread_json(r.board, r.thread, k);
          }).error(function(r) {
	    if(r.status == 404) handle_thread_404(r.board, r.thread);
	  });
	  
	  r.board = i;
	  r.thread = j;
	}
      }
    }
  };

  var handle_board_json = function(board, json) {
    var last_thread;

    var new_threads = 0;

    for (var i in json) {
      for (var j in json[i].threads) {
        var thread = json[i].threads[j];

	if (thread.last_modified > storage()[board].watched / 1000) {
	  last_thread = thread.no;

	  new_threads++;
	}
      }
    }

    status = status || {};
    status[board] = status[board] || {};
    status[board].last_thread = last_thread;
    status[board].new_threads = new_threads;
    update_pinned();
  };
  var handle_thread_json = function(board, threadid, json) {
    for (var i in json.posts) {
      var post = json.posts[i];

      var new_posts = 0;
      if (post.time > storage()[board].threads[threadid] / 1000) {
	new_posts++;
      }
      status = status || {};
      status[board] = status[board] || {};
      status[board].threads = status[board].threads || {};
      status[board].threads[threadid] = new_posts;
      update_pinned();
    } 
  };
  var handle_thread_404 = function(board, threadid) {
    status = status || {};
    status[board] = status[board] || {};
    status[board].threads = status[board].threads || {};
    status[board].threads[threadid] = -404; //notify 404
    update_pinned();
  };

  if (active_page == "thread") {
    var board = $('form[name="post"] input[name="board"]').val();
    var thread = $('form[name="post"] input[name="thread"]').val();

    var boardconfig = storage()[board] || {};
    
    $('hr:first').before('<div id="watch-thread" style="text-align:right"><a class="unimportant" href="javascript:void(0)">-</a></div>');
    $('#watch-thread a').html(is_threadwatched(boardconfig, thread) ? _("Stop watching this thread") : _("Watch this thread")).click(function() {
      $(this).html(toggle_threadwatched(board, thread) ? _("Stop watching this thread") : _("Watch this thread"));
      update_pinned();
    });
  }
  if (active_page == "index") {
    var board = $('form[name="post"] input[name="board"]').val();

    var boardconfig = storage()[board] || {};

    $('hr:first').before('<div id="watch-pin" style="text-align:right"><a class="unimportant" href="javascript:void(0)">-</a></div>');
    $('#watch-pin a').html(is_pinned(boardconfig) ? _("Unpin this board") : _("Pin this board")).click(function() {
      $(this).html(toggle_pinned(board) ? _("Unpin this board") : _("Pin this board"));
      $('#watch-board a').html(is_boardwatched(boardconfig) ? _("Stop watching this board") : _("Watch this board"));
      update_pinned();
    });

    $('hr:first').before('<div id="watch-board" style="text-align:right"><a class="unimportant" href="javascript:void(0)">-</a></div>');
    $('#watch-board a').html(is_boardwatched(boardconfig) ? _("Stop watching this board") : _("Watch this board")).click(function() {
      $(this).html(toggle_boardwatched(board) ? _("Stop watching this board") : _("Watch this board"));
      $('#watch-pin a').html(is_pinned(boardconfig) ? _("Unpin this board") : _("Pin this board"));
      update_pinned();
    });

  }

  var check_post = function(frame, post) {
    return post.length && $(frame).scrollTop() + $(frame).height() >=
      post.position().top + post.height();
  }

  $(window).scroll(function() { 
    if (!status) return;
    var refresh = false;
    for(var bid in status) {
      if ((status[bid].new_threads && (active_page == "ukko" || active_page == "index")) || status[bid].new_threads == 1
            && check_post(this, $('[data-board="'+bid+'"]#thread_'+status[bid].last_thread))) {
	var st = storage()
	st[bid].watched = time_loaded;
	storage_save(st);
	refresh = true;
      }
      if (!status[bid].threads) continue;

      for (var tid in status[bid].threads) {
	if(status[bid].threads[tid] && check_post(this, $('[data-board="'+bid+'"]#thread_'+tid))) {
	  var st = storage();
	  st[bid].threads[tid] = time_loaded;
	  storage_save(st);
	  refresh = true;
	}
      }
    }
    if (refresh) {
      fetch_jsons();
      refresh = false;
    }
  });

  if (typeof add_title_collector != "undefined")
  add_title_collector(function() {
    if (!status) return 0;
    var sum = 0;
    for (var bid in status) {
      if (status[bid].new_threads) {
	sum += status[bid].new_threads;
        if (!status[bid].threads) continue;
        for (var tid in status[bid].threads) {
	  if (status[bid].threads[tid] > 0) {
            if (auto_reload_enabled && active_page == "thread") {
              var board = $('form[name="post"] input[name="board"]').val();
              var thread = $('form[name="post"] input[name="thread"]').val();
              
              if (board == bid && thread == tid) continue;
            }
	    sum += status[bid].threads[tid];
	  }
	}
      }
    }
    return sum;
  });

  update_pinned();
  fetch_jsons();
  setInterval(fetch_jsons, 10000);
});
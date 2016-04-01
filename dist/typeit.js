/**
 * jQuery TypeIt
 * @author Alex MacArthur (http://macarthur.me)
 * @version 3.0.1
 * @copyright 2016 Alex MacArthur
 * @description Types out a given string or strings.
 */

 (function($, undefined){

  $.fn.typeIt = function(opt, cb, defStr){
   return this.each(function(){
     $(this).data('typeit', new $.typeIt($(this), opt, cb, defStr));
   });
  };

  // Accepts element, options, and callback function.
  $.typeIt = function(el, opt, cb, defStr) {
    var t = this;
    defStr = (defStr === undefined) ? 'Your default string.' : defStr;

    t.d = {
      strings: defStr,
      speed: 100,
      lifeLike: true,
      cursor: true,
      cursorSpeed: 1000,
      breakLines: true,
      breakDelay: 750,
      preStringPause: 100,
      postStringPause: 500,
      startDelay: 250,
      loop: false,
      loopDelay: 750,
      html: true ,
      autoStart: true
     };

    t.dd = {
      strings: el.data('typeitStrings'),
      speed: el.data('typeitSpeed'),
      lifeLike: el.data('typeitLifelike'),
      cursor: el.data('typeitCursor'),
      cursorSpeed: el.data('typeitCursorspeed'),
      breakLines: el.data('typeitBreaklines'),
      breakDelay: el.data('typeitBreakdelay'),
      startDelay: el.data('typeitStartdelay'),
      preStringPause: el.data('typeitPrestringpause'),
      postStringPause: el.data('typeitPoststringpause'),
      loop: el.data('typeitLoop'),
      loopDelay: el.data('typeitLoopdelay'),
      html: el.data('typeitHtml'),
      autoStart: el.data('typeitAutostart')
    };

    this.queue = [];
    this.queueIndex = 0;
    this.inTag = false;
    t.s = $.extend({}, t.d, opt, t.dd);
    t.el = el;
    t.cb = cb;   
    t._init(t, opt);
  };

 $.typeIt.prototype = {

  _init : function(t) {
    t._valCB(t);
    t._elCheck(t); 
    t.span = '<span style="display:inline-block;width:0;height:0;overflow:hidden;">_</span>';
    this.s.strings = this._toArray(this.s.strings);
    t.el.html('<span style="display:inline;position:relative;font:inherit;"></span>');
    t.tel = t.el.find('span');
    t.insert = function(c) { 
      t.tel.append(c);
    };

    for(i = 0; i < t.s.strings.length; i++) {

      this.queue.push([this.type, t.s.strings[i]]);
      this.queue.push([this.pause, t.s.breakDelay/2]);

      if(i < (t.s.strings.length - 1)) {
        this.queue.push([t.s.breakLines ? this.break : this.delete]);
      }

      this.queue.push([this.pause, t.s.breakDelay/2]);
    }

    if(t.s.autoStart) {
      t._cursor(t);
      t._to(function() {
        this._executeQueue();
      }.bind(this), this.s.startDelay);
    }
  }, 

  /*
    Pass in a string, and loop over that string until empty. Then return true.
  */
  type : function(string, rake){

    // set default 'rake' value
    rake = typeof rake === 'undefined' ? true : rake;

    // convert to array
    string = this._toArray(string);

    // if it's designated, rake that bad boy for HTML tags and stuff
    if(rake) {
      string = this._rake(string);
      string = string[0];
    }

    // do the work that matters
    this.tTO = this._to(function() {

      // _randomize the timeout each time, if that's your thing
      this._random(this);

      // "_print" the stringacter 
      // if an opening HTML tag is found and we're not already pringing inside a tag
      if((string[0].indexOf('<') !== -1 && string[0].indexOf('</') === -1) && (!this.inTag)){

        // loop the string to find where the tag ends
        for(var i = string.length - 1; i >= 0; i--) {
          if(string[i].indexOf('</') !== -1) {
            this.tagCount = 1;
            this.tagDuration = i;
          }
        }

        this._makeNode(string[0]);
      } else {
        this._print(string[0]);
      }

      // shorten it
      string.splice(0, 1);

      // if there's more to it, run again until fully printed
      if(string.length) {
        this.type(string, false);
      } else{
        this._executeQueue();
      }

    }.bind(this), this.DT);
  },

  pause : function(time) {
    time = time === undefined || time === null ? this.s.breakDelay : time;
    this._to(function() {
      this._executeQueue();
    }.bind(this), time);
  },

  break : function() {
    this.insert('<br>');
    this._executeQueue();
  },

  _print : function(chr) {
    if(this.inTag) {
      $(this.tag, this.el).last().append(chr);
      if(this.tagCount < this.tagDuration) {
        this.tagCount++;
      } else {
        this.inTag = false;
      }
    } else {
      this.insert(chr);
    }
  },

    /*
    If show cursor is enabled, move array starting point for the for loop back one,
    so that the loop will not find the closing tag and delete the cursor.
  */
  delete : function(characters) {

    this.dTO = this._to(function() {

      this._random();

      var a = this.tel.html().split("");

      var amount = characters === undefined || characters === null ? a.length-1 : characters + 1;

      // cut the array by a character
      for (var n = a.length-1; n > -1; n--) {

        if((a[n] === '>' || a[n] === ';') && this.s.html) {
          for(var o = n; o > -1; o--) {

            if(a.slice(o-3, o+1).join('') === '<br>') {
              a.splice(o-3, 4);
              break;
            }

            if(a[o] === '&') {
              a.splice(o, n-o+1);
              break;
            }

            if(a[o] === '<') {
              if(a[o-1] !== '>') {
                if(a[o-1] === ';') {
                  for(var p = o-1; p > -1; p--) {
                    if(a[p] === '&') {
                      a.splice(p, o-p);
                      break;
                    }
                  }
                }

                a.splice(o-1, 1);
                break;
              }
            }
          }
          break;
        }

        else {
          a.pop();
          break;
        }

      }

      // if we've found an empty set of HTML tags...
      if(this.tel.html().indexOf('></') > -1) {
        for (var i = this.tel.html().indexOf('></')-2; i >= 0; i--) {
          if(a[i] === '<') {
            a.splice(i, a.length-i);
            break;
          }
        }
      }
      
      this.tel.html(a.join(''));

      // Characters still in the string.
      if (amount > (characters === undefined ? 0 : 2)) {
        this.delete(characters === undefined ? undefined : characters-1);
      } else {
        this._executeQueue();
      }
    }.bind(this), this.DT/3);
  },

  /* 
    Advance the function queue to execute the next function after the previous one has finished.
  */
  _executeQueue : function() {
    if(this.queueIndex < this.queue.length) {
      var thisFunc = this.queue[this.queueIndex];
      this.queueIndex++;
      thisFunc[0].bind(this)(thisFunc[1]);
    } else {
      if(this.s.loop) {
        this.queueIndex = 0;
        this.delete();
      } else {
        this.cb();
      }
    }
  }, 

  _valCB : function(t) {
    t.cb = t.cb === undefined || t.cb === null ? function(){return;} : t.cb;
  }, 

  _to : function(fn, time) {
    setTimeout(function() {
      fn();
    }.bind(this), time);
  },

  _elCheck : function(t) {
    if(t.el.html().length > 0) {
      t.s.strings = t.el.html().trim();
    }
  }, 

  _toArray : function(str) {
    return str.constructor === Array ? str.slice(0) : str.split('<br>');
  },

  _cursor : function(t) {
    if(t.s.cursor) {
      t.el.append('<span class="c">|</span>');
      var s = t.s.cursorSpeed;
      (function loop() {
        t.el.find('.c').fadeTo(s/2, 0).fadeTo(s/2, 1);
        t._to(loop, s);
      })();
    }
  },

  _random : function() {
    var s = this.s.speed;
    var r = s/2;
    this.DT = this.s.lifeLike ? Math.abs(Math.random() * ((s+r) - (s-r)) + (s-r)) : s;
  }, 

  _mergeSettings : function(settings) {

  },

  /*
  Convert each string in the array to a sub-array. While happening, search the subarrays for HTML tags. 
  When a complete tag is found, slice the subarray to get the complete tag, insert it at the correct index, 
  and delete the range of indexes where the indexed tag used to be.
  */
  _rake : function(array) {
    for(var i = 0; i < array.length; i++) {
      array[i] = array[i].split('');

      if(this.s.html) {
        this.tPos = [];
        var p = this.tPos;
        var tag;
        var en = false;
        for(var j = 0; j < array[i].length; j++) {

          if(array[i][j] === '<' || array[i][j] === '&') {
            p[0] = j;
            en = array[i][j] === '&' ? true : false;
          }

          if(array[i][j] === '>' || (array[i][j] === ';' && en)) {
            p[1] = j;
            j = 0;
            tag = (array[i].slice(p[0], p[1]+1)).join('');
            array[i].splice(p[0], (p[1]-p[0]+1), tag);
            en = false;
          }
        }
      }
    }

    return array;
  },

  /*
    Get the start & ending positions of the string inside HTML opening & closing angle brackets, 
    and then create a DOM element of that string/tag name.
  */
  _makeNode : function(char) {
    this.tag = $($.parseHTML(char));
    this._print(this.tag);
    this.inTag = true;
  }
};

$.createInst = function(el) {
  el = $(el);
  if(el.data('typeit') === undefined) {
    el.data('typeit', new $.typeIt(el, {}, null, []));
  }
};

$.fn.tiType = function(str){
  $.createInst(this);
  var Inst = $(this).data('typeit');
  Inst.queue.push([Inst.type, str]);
  return this;
};

$.fn.tiDelete = function(num){
  $.createInst(this);
  var Inst = $(this).data('typeit');
  Inst.queue.push([Inst.delete, num]);
  return this;
};

$.fn.tiPause = function(time){
  $.createInst(this);
  var Inst = $(this).data('typeit');
  Inst.queue.push([Inst.pause, time]);
  return this;
};

$.fn.tiBreak = function(){
  $.createInst(this);
  var Inst = $(this).data('typeit');
  Inst.queue.push([Inst.break]);
  return this;
};

$.fn.tiSettings = function(settings) {
    $.createInst(this);
    var Inst = $(this).data('typeit');
    Inst.queue.push([Inst.mergeSettings], settings);
    return this;
};

}(jQuery));



/**
 * jQuery TypeIt
 * @author Alex MacArthur (http://macarthur.me)
 * @version 3.0.1
 * @copyright 2016 Alex MacArthur
 * @description Types out a given string or strings.
 */

 (function($, undefined){

  $.fn.typeIt = function(opt, cb){
   return this.each(function(){
     $(this).data("typeit", new $.fn.typeIt.tClass($(this), opt, cb));
   });
  };

  // function ttype() {
  //   console.log('ttype!');
  // }

  // function tdelete() {
  //   console.log('tdelete');
  // }

  // $.fn.tiType = function(){
  //   var Instance = this.data('typeit');
  //   Instance.functionQueue.push(ttype);
  //   return this;
  // };

  // $.fn.tiDelete = function(){
  //   var Instance = this.data('typeit');
  //   Instance.functionQueue.push(tdelete);
  //   return this;
  // };

  // Accepts element, options, and callback function.
  $.fn.typeIt.tClass = function(e, o, c) {
    var t = this;

    t.d = {
      strings: 'Your default string.',
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
      strings: e.data('typeitStrings'),
      speed: e.data('typeitSpeed'),
      lifeLike: e.data('typeitLifelike'),
      cursor: e.data('typeitCursor'),
      cursorSpeed: e.data('typeitCursorspeed'),
      breakLines: e.data('typeitBreaklines'),
      breakDelay: e.data('typeitBreakdelay'),
      startDelay: e.data('typeitStartdelay'),
      preStringPause: e.data('typeitPrestringpause'),
      postStringPause: e.data('typeitPoststringpause'),
      loop: e.data('typeitLoop'),
      loopDelay: e.data('typeitLoopdelay'),
      html: e.data('typeitHtml'),
      autoStart: e.data('typeitAutostart')
    };

    this.functionQueue = [];
    this.inTag = false;
    t.s = $.extend({}, t.d, o, t.dd);
    t.el = e;
    t.cb = c; 
    t._valCB(t);
    t.elCheck(t);   
    t.init(t, o);
  };

 var p = $.fn.typeIt.tClass.prototype;

 p.init = function(t){
  t.span = '<span style="display:inline-block;width:0;height:0;overflow:hidden;">_</span>';
  t.toArr();
  t.el.html('<span style="display:inline;position:relative;font:inherit;"></span>');
  t.tel = t.el.find('span');
  t.insert = function(c) { t.tel.append(c); };

  for(i = 0; i < t.s.strings.length; i++) {
    this.functionQueue.push([this.type, t.s.strings[i]]);
    this.functionQueue.push([this.pause, t.s.breakDelay/2]);

    if(i < (t.s.strings.length - 1)) {
      this.functionQueue.push([t.s.breakLines ? this.break : this.delete]);
    }

    this.functionQueue.push([this.pause, t.s.breakDelay/2]);
  }

  if(t.s.autoStart) {
    t.cursor(t);
    t.to(function() {
      this.executeQueue();
    }.bind(this), this.s.startDelay);
  }
 };

 p.executeQueue = function() {
    if(this.functionQueue.length) {
      var thisFunction = this.functionQueue.shift();
      thisFunction[0].bind(this)(thisFunction[1]);
    } else {
      this.cb();
    }
 };

p.pause = function(duration) {
  duration = duration === undefined || duration === null ? this.s.breakDelay : duration;
  this.to(function() {
    this.executeQueue();
  }.bind(this), duration);
};

p.break = function() {
  this.insert('<br>');
  this.executeQueue();
};

p._valCB = function(t) {
  t.cb = t.cb === undefined ? function(){return;} : t.cb;
};

p.to = function(fn, t) {
  setTimeout(function() {
    fn();
  }.bind(t), t);
};

  p.elCheck = function(t) {
    if(t.el.html().length > 0) {
      t.s.strings = t.el.html().trim();
    }
  };

  p.toArr = function() {
    var s = this.s.strings;
    this.s.strings = s.constructor === Array ? s.slice(0) : s.split('<br>');
  };

  p.cursor = function(t) {
    if(t.s.cursor) {
      t.el.append('<i class="c">|</i>');
      var s = t.s.cursorSpeed;
      (function loop() {
        t.el.find('.c').fadeTo(s/2, 0).fadeTo(s/2, 1);
        t.to(loop, s);
      })();
    }
  };

  p._random = function() {
    var s = this.s.speed;
    var r = s/2;
    this.DT = this.s.lifeLike ? Math.abs(Math.random() * ((s+r) - (s-r)) + (s-r)) : s;
  };

 /*
  Convert each string in the array to a sub-array. While happening, search the subarrays for HTML tags. 
  When a complete tag is found, slice the subarray to get the complete tag, insert it at the correct index, 
  and delete the range of indexes where the indexed tag used to be.
  */
  p._rake = function(array) {

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
  };

  /* new functions! */

  p._toArray = function(string){
    return string.constructor === Array ? string.slice(0) : string.split('<br>');
  };

  /*
    Pass in a string, and loop over that string until empty. Then return true.
  */
  p.type = function(char, rake){

    /* FOR SOME REASON, THE FIRST CHARACTER IS GETTING CUT UNECESSARILY */

    // set default 'rake' value
    rake = typeof rake === 'undefined' ? true : rake;

    // convert to array
    char = this._toArray(char);

    // if it's designated, rake that bad boy for HTML tags and stuff
    if(rake) {
      char = this._rake(char);
      char = char[0];
    }

    // do the work that matters
    this.tTO = this.to(function() {

      // _randomize the timeout each time, if that's your thing
      this._random(this);

      // "print" the character 
      // if an opening HTML tag is found and we're not already pringing inside a tag
      if((char[0].indexOf('<') !== -1 && char[0].indexOf('</') === -1) && (!this.inTag)){

        // loop the string to find where the tag ends
        for(var i = char.length - 1; i >= 0; i--) {
          if(char[i].indexOf('</') !== -1) {
            this.tagCount = 0;
            this.tagDuration = i;
          }
        }

        this._makeNode(char[0]);
      } else {
        this.print(char[0]);
      }

      // shorten it
      char.splice(0, 1);

      // if there's more to it, run again until fully printed
      if(char.length) {
        this.type(char, false);
      } else{
        this.executeQueue();
      }

    }.bind(this), this.DT);
  };

  /*
    Get the start & ending positions of the string inside HTML opening & closing angle brackets, 
    and then create a DOM element of that string/tag name.
  */
  p._makeNode = function(char) {
    this.tag = $($.parseHTML(char));
    this.print(this.tag);
    this.inTag = true;
  };

  p.print = function(chr) {
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
  };

  p.end = function(t) {
    if(t.s.loop){
      t.to(function(){
        t.delete(t);
      }.bind(t), t.s.loopDelay);
    } else {
      t.cb();
    }
  };

  /*
    If show cursor is enabled, move array starting point for the for loop back one,
    so that the loop will not find the closing tag and delete the cursor.
  */
  p.delete = function(characters) {

    this.dTO = this.to(function() {

      // _randomize it 
      this._random();

      // the current content
      var a = this.tel.html().split("");

      // the amount we want to delete
      var amount = characters === undefined || characters === null ? a.length-1 : characters + 1;

      // cut the array by a character
      for (var n = amount; n > -1; n--) {
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
          a.splice(n, 1);
          break;
        }
      }

      // if we've found an empty set of HTML tags...
      console.log(this.tel.html().indexOf('></') > -1);
      console.log(a.join(''));
      console.log('---');
      if(this.tel.html().indexOf('></') > -1) {
        for (var i = this.tel.html().indexOf('></')-1; i >= 0; i--) {
          if(a[i] === '<') {
            // console.log(i);
            // console.log(a.splice(i, a.length-i);
            a.splice(i, a.length-i);
            // console.log(a.join(''));
            break;
          }
        }
      }
      
      // repopulate the element
      this.tel.html(a.join(''));

      // Characters still in the string.
      if (amount > (characters === undefined ? 0 : 2)) {
        this.delete(characters === undefined ? undefined : characters-1);
      } else {
        this.executeQueue();
      }
    }.bind(this), this.DT/3);
  };

}(jQuery));

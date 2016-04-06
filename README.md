# TypeIt: A jQuery Animated Typing Plugin
*The most versatile jQuery animated typing plugin on the planet.*

---

### Table of Contents
- [Overview](#overview)
- [Choose a License](#choose-a-license)
- [Setup](#setup)
- [Simple Usage](#simple-usage)
- [Advanced Usage (Chaining Companion Functions)](#advanced-usage)
- [About HTML Handling](#about-html-handling)
- [Options](#options)
- [Limitations](#limitations)
- [Contributions](#contributions)

---

## Overview

TypeIt is the most versatile, user-friendly animated typing plugin on the planet. In simple use, it allows you to type single or multiple strings that break lines, delete & replace each other, and it even handles HTML tags &amp; entities. 

For more advanced, controlled typing effects, TypeIt comes with companion functions that can be chained to control your typing down to the smallest character, enabling you to type not just a few strings of text, but an entire narrative, with complete control over speed, characters, line breaks, pausing, everything.

### Some Included Perks
* Start typing only when your element is in the viewport. 
* Loop your string(s).
* Features JavaScript fallback / SEO optimization option for your strings.
* Multiple easy ways to set up & initialize.
* Create several unique instances on a single page.
* Handle HTML tags (including your custom classes, ID's, etc.) and entities with ease.
* Use companion functions to chain individual commands together for fine tuning your typing. 
* Supported by jQuery 1.8.0 or higher.
* Lightweight. (< Xkb, single JavaScript file)

### Demos
Checkout several demos and a sandbox where you can try it out at <a href="http://macarthur.me/typeit">macarthur.me/typeit</a>.

## Choose a License
To get started, first select a license: 
* Personal - [FREE](#setup)
* Single Commercial License - [Purchase Here](http://www.uplabs.com/posts/typeit-a-jquery-animated-typing-plugin)
* Extended Commercial License - [Purchase Here](http://www.uplabs.com/posts/typeit-a-jquery-animated-typing-plugin)

## Setup

### Download the Plugin

Get it from this repo, or from the following sources: 

* <strong><a href="https://www.jsdelivr.com/projects/jquery.typeit">CDN:</a></strong> Include  `https://cdn.jsdelivr.net/jquery.typeit/3.0.1/typeit.min.js` on your page.
* <strong><a href="https://www.npmjs.com/package/typeit">npm:</a></strong> Install with `npm install typeit`.

### Prepare to Initialize on Your Site

1. Load jQuery and typeit.js on your page.

  ```html
  <script src="jquery-2.1.4.min.js"></script>
  <script src="typeit.js"></script>
  ```
  
2. Create an empty HTML element to select. (If you want to have a fallback for users without JavaScript, you can put a string or strings right into this element. More on that later.)

  ```html
  <span class="type-it"></span>
  ```

You're ready to start typing!

## Simple Usage

In it's simplest use, just call `typeIt()` on any element and include your [options](#options). Out of the box, you're ready to type.

### Typing Multiple Strings

Aside from simply typing a single string, you can configure TypeIt to type multiple strings. If you define your strings within your HTML element, just separate them with `<br>` tags:

  ```html
  <span class="type-it">Here is a string. <br>And here is another!</span> 
  ```
If they're defined in the settings object, it's possible to put them inside quotation marks separated by `<br>` tags, but it's recommended that you use an array:

```js
  $('.type-it').typeIt({
    strings: ['Enter your string here!', 'Another string!']
  });
```

By default, multiple strings will stack on top of each other (breakLines = true). However, you can also set them to delete and replace each other:

```js
  $('.type-it').typeIt({
    strings: ['Enter your string here!', 'Another string!'],
    breakLines: false
  });
```

## About HTML Handling

TypeIt will handle HTML tags in your strings, as long as they're only one level deep and are `inline` elements: 

```js
  // GOOD! :)
  $('.typeit-box').typeIt({
    strings: '<h1 class="your-class">This is a string!</h1>',
  }
```

```js
  // BAD! :(
  $('.typeit-box').typeIt({
    strings: '<h1 class="your-class"><span>This is a string!</span></h1>',
  }
```

And it'll also handle HTML entities: 

```js
  $('.typeit-box').typeIt({
    strings: '<h1 class="your-class">One thing &amp; another!<h1>',
  }
```

To disable all HTML rendering, set 'html' to false.

## Options

You can modify the options for the plugin in two different ways -- either by inserting them directly into the function call, or by using data-* attributes.

#### About Using Settings Object
* When using a single string, you can just wrap it in quotation marks (or in an array; it doesn't matter). 
* When using multiple strings, it's recommended that you place them in an array (Ex: `strings: ['String #1','String #2']`). You can optionally place them in quotation marks, separated by `<br>` tags, however.

Example:s

  ```html
   <span class="type-it"></span>
  ```

 ```js
  $('.type-it').typeIt({
    strings: 'Enter your string here!',
    speed: 300,
    lifeLike: false,
    cursor: true
  });
  ```

#### About Using Data-* Attributes
* Make sure the names are all lowercase. 
* When using multiple strings, wrap your array of strings inside single quotation marks. Ex: `data-typeit-strings='["string #1", "string #2"]'`

Example:

  ```html
  <span class="type-it"
  data-typeit-strings="A new string to type."
  data-typeit-speed="100"
  data-typeit-lifelike="true"
  data-typeit-cursor="true">

  </span>
  ```

  ```js
  $('.type-it').typeIt();
  ```

You can also define what to type a third way -- by simply filling the element with a string or strings of text. This is convenient because if a user doesn't have JavaScript enabled, they'll still be able to read the text, and the text will be available for SEO purposes. **Note: by default, the plugin will use the string that's in the element. If strings are defined either in the function call or data-* attributes, they will be overridden.**

  ```html
  <span class="type-it">This is the string that will be typed.</span> 
  ```

There are a number of options you may use to customize typeIt.

| Option        | Description   | Default Value
| ------------- | ------------- | ------------- |
| strings  | The string(s) to be typed.       | 'Your default string.' |
| speed     | The typing speed.             | 100  |
| lifeLike      | Will make the typing pace irregular, as if a real person is doing it.  | true |
| cursor    | Show a blinking cursor at the end of the string(s).  | true  |
| cursorSpeed    | The blinking speed of the cursor.  | 1000  |
| breakLines    | Choose whether you want multiple strings to be printed on top of each other (breakLines = true), or if you want each string to be deleted and replaced by the next one (breakLines = false).  | true  |
| breakDelay    | The amount of time between typing multiple strings.  | 750  |
| startDelay    | The amount of time before the plugin begins typing after initalizing.  | 250  |
| loop    | Have your string or strings continuously loop after completing.  | false  |
| loopDelay    | The amount of time between looping over a string or set of strings again.  | 750  |
| html    | Handle strings as HTML, which will process tags and HTML entities. If 'false,' strings will be typed literally.  | true  |

## Limitations
TypeIt is an constantly improving work in progress. Because of that, certain limitations are going to exist. Some have some workarounds you can easily implement yourself; others do not. Here are a few obvious limitations: 

- By default, the cursor is italicized (because it's wrapped in `<i>` tags). Until this is updated, just style it on your own by targeting the `.c` class. 
- There's currently no way to start with text on the screen and begin to delete it. Instead, the element must always start with no text. 
- As of the latest release, there's no way to pause and delay typing at a given time. There are workarounds to this, but until a future release addresses it, it can be a limitation.

## Contributions

Gulp is configured to check & minify the JavaScript. In the root of the repo, use these commands to run these default tasks and watch for file changes (make sure Node.js, npm, and Gulp are installed on your computer):

```
npm install
gulp
```
## Donate

If I've made your life eaiser in some way by creating this thing and want to kick a small "thank you" my way, I'd very much appreciate it! 

PayPal: <a href="http://paypal.me/alexmacarthur">paypal.me/alexmacarthur</a>

Venmo: <a href="https://venmo.com/amacarthur">venmo.com/amacarthur</a>

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.GameCapsule = factory());
}(this, function () { 'use strict';

  var CLASS_NAME = 'GameCapsule';
  var isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  var isAndroid = navigator.userAgent.indexOf('Android') > 0;
  var isMobile = isIos || isAndroid;
  var createRandom = function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
  };
  var zeroPadding = function (target, digit) {
      var zero = (function () {
          var tmp = '';
          for (var i = 0; i < digit; i++)
              tmp += '0';
          return tmp;
      })();
      return (zero + target.toString()).slice(-digit);
  };
  //# sourceMappingURL=util.js.map

  var Gacha = (function () {
      function Gacha(list, key) {
          this.list = list;
          this.key = key;
          this.totalWeight = (function () {
              var sum = 0;
              list.forEach(function (target) { return sum += target[key]; });
              return sum;
          })();
      }
      Gacha.prototype.draw = function () {
          var r = Math.random() * this.totalWeight;
          var s = 0.0;
          for (var list in this.list) {
              var target = this.list[list];
              s += target[this.key];
              if (r < s)
                  return target;
          }
      };
      return Gacha;
  }());
  //# sourceMappingURL=gacha.js.map

  var GameCapsule = (function () {
      function GameCapsule(options) {
          var _this = this;
          this.options = {
              target: '#canvas',
              isRetina: true,
              isTouch: true,
              parent: null,
              countDownSeconds: 0,
          };
          if (options) {
              Object.keys(options).forEach(function (key) {
                  _this.options[key] = options[key];
              });
          }
          this.isIos = isIos;
          this.isAndroid = isAndroid;
          this.isMobile = isMobile;
          this.Gacha = Gacha;
          this.isPause = false;
          this._initTimer();
          this._initStage();
          var resizeTimer;
          window.addEventListener('resize', function () {
              if (resizeTimer)
                  clearTimeout(resizeTimer);
              resizeTimer = setTimeout(function () {
                  _this._resizeHandle();
              }, 200);
          });
      }
      GameCapsule.prototype.init = function () {
          throw new Error(CLASS_NAME + 'コンストラクタで作ったインスタンスにinit関数を定義し、stageの更新で使う変数、関数を定義してください。\n※ init関数ではthis.stageでstageにアクセスできます。\n※ init関数では変数をthisに定義すればupdate関数で利用することができます。\n※ update関数で何もつかわない場合でも中身は空っぽで良いのでinit関数を定義してください。');
      };
      GameCapsule.prototype.update = function (event) {
          throw new Error(CLASS_NAME + 'コンストラクタで作ったインスタンスにupdate関数を定義し、メインループ処理を設定してください。\n※ updade関数ではthis.stageでstageにアクセスできます。\n※ updade関数ではinit関数で定義した変数をthis経由で使用できます。\n※ stage.update()はupdade関数の直後に自動で実行されるのでupdate関数内でstege.update()を実行する必要はありません。\n※ update関数の引数には"tick"イベントが入ってきます');
      };
      GameCapsule.prototype.play = function () {
          var _this = this;
          createjs.Ticker.init();
          createjs.Ticker.timingMode = createjs.Ticker.RAF;
          try {
              this.init();
          }
          catch (e) {
              console.error(e);
              return false;
          }
          createjs.Ticker.addEventListener('tick', createjs.Tween);
          createjs.Ticker.addEventListener('tick', function (event) {
              if (_this.isPause)
                  return false;
              try {
                  _this.update(event);
              }
              catch (e) {
                  _this._clearStage();
                  console.error(e);
              }
              _this.stage.update();
          });
          this.timer = setInterval(function () {
              _this.totalTime.s++;
              _this.totalTime.m = Math.floor(_this.totalTime.s / 60);
          }, 1000);
          this.stage.update();
      };
      GameCapsule.prototype.pause = function () {
          createjs.Ticker.paused = !createjs.Ticker.paused;
          this.isPause = !this.isPause;
      };
      GameCapsule.prototype.reset = function () {
          this._clearStage();
          this._initTimer();
          this._initStage();
          this.play();
      };
      Object.defineProperty(GameCapsule.prototype, "mouseX", {
          get: function () {
              return this.divisionRetina(this.stage.mouseX);
          },
          set: function (x) {
              if (this.options.isRetina && window.devicePixelRatio) {
                  this.stage.mouseX = x * window.devicePixelRatio;
              }
              else {
                  this.stage.mouseX = x;
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(GameCapsule.prototype, "mouseY", {
          get: function () {
              return this.divisionRetina(this.stage.mouseY);
          },
          set: function (y) {
              if (this.options.isRetina && window.devicePixelRatio) {
                  this.stage.mouseY = y * window.devicePixelRatio;
              }
              else {
                  this.stage.mouseY = y;
              }
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(GameCapsule.prototype, "width", {
          get: function () {
              return this.divisionRetina(this.stage.canvas.width);
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(GameCapsule.prototype, "height", {
          get: function () {
              return this.divisionRetina(this.stage.canvas.height);
          },
          enumerable: true,
          configurable: true
      });
      GameCapsule.prototype.getDispTime = function (isZeroPadding) {
          var dispTime = {
              s: Math.floor(this.totalTime.s % 60),
              m: this.totalTime.m,
          };
          if (isZeroPadding) {
              dispTime.s = this.zeroPadding(dispTime.s, 2);
              dispTime.m = this.zeroPadding(dispTime.m, 2);
          }
          return dispTime;
      };
      GameCapsule.prototype.getRemainingTime = function (isZeroPadding) {
          if (!this.options.countDownSeconds)
              return false;
          var remainingS = this.options.countDownSeconds - this.totalTime.s;
          var remainingM = Math.floor(remainingS / 60);
          var dispTime = {
              s: remainingS,
              m: remainingM,
          };
          if (isZeroPadding) {
              dispTime.s = this.zeroPadding(dispTime.s, 2);
              dispTime.m = this.zeroPadding(dispTime.m, 2);
          }
          return dispTime;
      };
      GameCapsule.prototype.divisionRetina = function (num) {
          return this.options.isRetina ? num / window.devicePixelRatio : num;
      };
      GameCapsule.prototype.createRandom = function (min, max) {
          return createRandom(min, max);
      };
      GameCapsule.prototype.zeroPadding = function (target, digit) {
          return zeroPadding(target, digit);
      };
      GameCapsule.prototype.isCountDownComplete = function () {
          if (!this.options.countDownSeconds)
              return false;
          if (this.totalTime.s > this.options.countDownSeconds) {
              var eventCountDownComplete = document.createEvent('HTMLEvents');
              eventCountDownComplete.initEvent('countDownComplete', true, false);
              window.dispatchEvent(eventCountDownComplete);
              return true;
          }
          return false;
      };
      GameCapsule.prototype._clearStage = function () {
          this.isPause = createjs.Ticker.paused = false;
          createjs.Ticker.removeEventListener('tick', this.stage);
          createjs.Ticker.reset();
          this.stage.removeAllChildren();
          createjs.Tween.removeAllTweens();
          this.stage.clear();
      };
      GameCapsule.prototype._initTimer = function () {
          clearTimeout(this.timer);
          this.totalTime = {
              s: 0,
              m: 0,
          };
      };
      GameCapsule.prototype._initStage = function () {
          this.parent = this.options.parent ? document.querySelector(this.options.parent) : null;
          this.canvas = document.querySelector(this.options.target);
          this.canvas.style.setProperty('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)');
          this.canvas.style.setProperty('vertical-align', 'top');
          this.stage = null;
          this.stage = new createjs.Stage(this.options.target.replace(/(.|#)/, ''));
          this._setCanvasSize();
          if (this.options.isRetina)
              this._devicePixelRatio();
          if (this.options.isTouch && createjs.Touch.isSupported())
              createjs.Touch.enable(this.stage);
      };
      GameCapsule.prototype._setCanvasSize = function () {
          if (this.parent) {
              this.stage.canvas.width = this.canvas.width = this.parent.clientWidth;
              this.stage.canvas.height = this.canvas.height = this.parent.clientHeight;
          }
          else {
              this.stage.canvas.width = this.canvas.width = window.innerWidth;
              this.stage.canvas.height = this.canvas.height = window.innerHeight;
          }
      };
      GameCapsule.prototype._devicePixelRatio = function () {
          if (window.devicePixelRatio) {
              var tmpW = this.canvas.width;
              var tmpH = this.canvas.height;
              this.canvas.width = tmpW * window.devicePixelRatio;
              this.canvas.height = tmpH * window.devicePixelRatio;
              this.canvas.style.width = tmpW + 'px';
              this.canvas.style.height = tmpH + 'px';
              this.stage.scaleX = this.stage.scaleY = window.devicePixelRatio;
          }
      };
      GameCapsule.prototype._resizeHandle = function () {
          this._setCanvasSize();
          if (this.options.isRetina)
              this._devicePixelRatio();
      };
      return GameCapsule;
  }());
  //# sourceMappingURL=index.js.map

  return GameCapsule;

}));

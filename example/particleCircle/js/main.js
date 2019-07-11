/**
 * パーティクルを生成
 */
var particleCircle = new GameCapsule();

/**
 * 初期化処理
 */
particleCircle.init = function() {
  var count = 0; // tick イベントの回数
  var MAX_LIFE = 40; // 寿命の最大値
  var particles = []; // パーティクルの入れ物

  this.stage.mouseX = this.stage.canvas.width / 2; // 初期位置X
  this.stage.mouseY = this.stage.canvas.height * 1 / 3; // 初期位置Y

  this.elTimer = document.querySelector('.js-timer');
  
  /**
   * パーティクルを生成
   */
  this.emitParticles = function() {
    // パーティクルの生成
    for (var i = 0; i < 5; i++) {
      // カウントの更新
      count += 1;

      // オブジェクトの作成
      var particle = new createjs.Shape();
      particle.graphics.beginFill(createjs.Graphics.getHSL(count, 50, 50)).drawCircle(0, 0, 30 * Math.random());
      particle.compositeOperation = "lighter";
      this.stage.addChild(particle);
      
      // パーティクルの発生場所
      particle.x = this.divisionRetina(this.stage.mouseX);
      particle.y = this.divisionRetina(this.stage.mouseY);

      // 動的にプロパティーを追加します。
      // 速度
      particle.vx = 30 * (Math.random() - 0.5);
      particle.vy = 30 * (Math.random() - 0.5);
      // 寿命
      particle.life = MAX_LIFE;
      particles.push(particle);
    }
  }

  /**
   * パーティクルの位置を更新
   */
  this.updateParticles = function() {
    // パーティクルの計算を行う
    for (var i = 0; i < particles.length; i++) {
      // オブジェクトの作成
      var particle = particles[i];
      // 重力
      particle.vy += 1;
      // 摩擦
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      // 速度を位置に適用
      particle.x += particle.vx;
      particle.y += particle.vy;
      // 地面
      if (particle.y > this.stage.canvas.height) {
        particle.y = this.stage.canvas.height; // 行き過ぎ補正
        particle.vy *= -1; // Y軸の速度を反転
      }
      // パーティクルのサイズをライフ依存にする
      var scale = particle.life / MAX_LIFE;
      particle.scaleX = particle.scaleY = scale;
      // 寿命を減らす
      particle.life -= 1;
      // 寿命の判定
      if (particle.life <= 0) {
        // ステージから削除
        this.stage.removeChild(particle);
        // 配列からも削除
        particles.splice(i, 1);
      }
    }
  }
};

/**
 * 更新処理
 */
particleCircle.update = function(e) {
  this.emitParticles();
  this.updateParticles();

  var dispTimer = this.getDispTime(true);
  this.elTimer.textContent = dispTimer.m + ':' + dispTimer.s;
};

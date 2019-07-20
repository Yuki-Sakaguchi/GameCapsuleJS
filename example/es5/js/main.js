/**
 * パーティクルを生成
 */
var game = new GameCapsule()

/**
 * 初期化処理
 */
game.init = function() {
  var count = 0
  var MAX_LIFE = 40
  var particles = []

  this.mouseX = this.width / 2
  this.mouseY = this.height * 1 / 3

  this.elTimer = document.querySelector('.js-timer')
  
  /**
   * パーティクルを生成
   */
  this.emitParticles = () => {
    for (var i = 0; i < 5; i++) {
      count += 1

      const particle = new createjs.Shape()
      particle.graphics.beginFill(createjs.Graphics.getHSL(count, 50, 50)).drawCircle(0, 0, 30 * Math.random())
      particle.compositeOperation = 'lighter'
      this.stage.addChild(particle)
      
      particle.x = this.mouseX
      particle.y = this.mouseY

      particle.vx = 30 * (Math.random() - 0.5)
      particle.vy = 30 * (Math.random() - 0.5)

      particle.life = MAX_LIFE
      particles.push(particle)
    }
  }

  /**
   * パーティクルの位置を更新
   */
  this.updateParticles = () => {
    for (var i = 0; i < particles.length; i++) {
      const particle = particles[i]
      particle.vy += 1
      particle.vx *= 0.96
      particle.vy *= 0.96
      particle.x += particle.vx
      particle.y += particle.vy

      if (particle.y > this.height) {
        particle.y = this.height
        particle.vy *= -1
      }

      const scale = particle.life / MAX_LIFE
      particle.scaleX = particle.scaleY = scale

      particle.life -= 1

      if (particle.life <= 0) {
        this.stage.removeChild(particle)
        particles.splice(i, 1)
      }
    }
  }
}

/**
 * 更新処理
 */
game.update = function(e) {
  this.emitParticles()
  this.updateParticles()
  var dispTimer = this.getDispTime(true)
  this.elTimer.textContent = dispTimer.m + ':' + dispTimer.s
}

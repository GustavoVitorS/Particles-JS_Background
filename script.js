// modify and create the particles the way you want //

window.onload = function () {

  var particulesCounter = 0;
  var allItem = document.getElementsByClassName('particules');
  for (var i = 0; i < allItem.length; ++i) {
    particulesSystem[particulesCounter] = new particulesSystem(allItem[i]);
    particulesSystem[particulesCounter].init();
    particulesCounter++;
  }
}

var particulesSystem = function (dom) {

  /*=========================================\
    $CONSTRUCTEUR
  \=========================================*/

  var self = this,
    data = dom.dataset,
    labels = data.labels ? data.labels.split(',') : false,
    colorLines = data.colorLines || 'rgba(125,125,125,.5)',
    colorDots = data.colorDots || 'rgba(125,125,125,.5)',
    colorLabels = data.colorLabels || 'rgba(125,125,125,.5)',
    mouse = { x: -100, y: -100 },
    canvas = document.createElement("canvas"),
    canvasDom,
    ctx = canvas.getContext("2d"),
    retina = window.devicePixelRatio > 1 ? true : false,
    particles = [],
    patriclesNum = 200,
    rad = 2;

  if (retina) {
    patriclesNum *= 2;
    rad++;
  }

  ctx.fillStyle = "#2A2025";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /*=========================================\
    $INIT
  \=========================================*/

  self.init = function () {
    dom.appendChild(canvas);
    canvasDom = dom.querySelector('canvas')
    self.setCanvasSize(canvasDom);
    window.onresize = self.setCanvasSize(canvasDom);
    window.addEventListener("resize", self.setCanvasSize());

    for (var i = 0; i < patriclesNum; i++) {
      particles.push(new multi_part());
    }

    canvasDom.addEventListener('mousemove', self.mouseMoveCanvas, false)

    window.setInterval(function () { self.move_part() }, 33);
  }

  /*=========================================\
    $FUNCTIONS
  \=========================================*/

  function multi_part() {
    this.x = Math.random() * canvasDom.width;
    this.y = Math.random() * canvasDom.height;
    this.vx = Math.random() * 0.88 - 0.44;
    this.vy = Math.random() * 0.88 - 0.44;
    this.rad = Math.floor(Math.random() * 200) / 100 + 1;
  }


  /*=========================================\
    $METHODS
  \=========================================*/

  self.setCanvasSize = function () {
    if (retina) {
      canvasDom.width = canvasDom.parentNode.offsetWidth * 2;
      canvasDom.height = canvasDom.parentNode.offsetHeight * 2;
    } else {
      canvasDom.width = canvasDom.parentNode.offsetWidth;
      canvasDom.height = canvasDom.parentNode.offsetHeight;
    }
    canvasDom.style.width = canvasDom.parentNode.offsetWidth + "px";
    canvasDom.style.height = canvasDom.parentNode.offsetHeight + "px";
  }

  self.move_part = function () {
    ctx.clearRect(0, 0, canvasDom.width, canvasDom.height);
    for (var i = 0; i < patriclesNum; i++) {
      var temp = particles[i];
      var distParticule = self.findDistance(temp, mouse);
      if (labels[i]) {
        var fontSize = retina ? parseInt(getComputedStyle(canvasDom.parentNode).fontSize) * 2 + 'px' : parseInt(getComputedStyle(canvasDom.parentNode).fontSize) + 'px',
          fontWeight = getComputedStyle(canvasDom.parentNode).fontWeight,
          fontFamily = getComputedStyle(canvasDom.parentNode).fontFamily;
        ctx.font = fontWeight + " " + fontSize + " " + fontFamily;
        console.log(ctx.font, fontWeight + " " + fontSize + "px " + fontFamily, getComputedStyle(canvasDom.parentNode).fontSize, parseInt(getComputedStyle(canvasDom.parentNode).fontSize) * 2 + 'px');

        ctx.font = retina ? "200 22px " + getComputedStyle(canvasDom.parentNode).fontFamily : getComputedStyle(canvasDom.parentNode).fontWeight + getComputedStyle(canvasDom.parentNode).fontSize + getComputedStyle(canvasDom.parentNode).fontFamily;
        ctx.textAlign = "right";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = colorLabels;
        ctx.fillText(labels[i], temp.x - 10, temp.y);
      }

      var distretina = retina ? 150 : 100;
      if (distParticule < distretina) {
        self.createLine(temp, mouse, distParticule);
      }
      for (var j = 0; j < patriclesNum; j++) {
        var temp2 = (temp != particles[j]) ? particles[j] : false;
        ctx.linewidth = 1;
        if (temp2) {
          var distParticule = self.findDistance(temp, temp2);
          if (distParticule < distretina) {
            self.createLine(temp, temp2, distParticule);
          }
        }
      }
      ctx.fillStyle = colorDots;
      ctx.beginPath();
      ctx.globalAlpha = 1;
      ctx.arc(temp.x, temp.y, temp.rad, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
      temp.x += temp.vx;
      temp.y += temp.vy;
      if (temp.x > canvasDom.width) temp.x = 0;
      if (temp.x < 0) temp.x = canvasDom.width;
      if (temp.y > canvasDom.height) temp.y = 0;
      if (temp.y < 0) temp.y = canvasDom.height;
    }
  }

  self.createLine = function (p1, p2, d) {
    ctx.strokeStyle = colorLines;
    ctx.globalAlpha = 50 / d - 0.3;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  self.findDistance = function (p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  self.mouseMoveCanvas = function (e) {
    var rect = canvasDom.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    mouse = {
      x: mouseX,
      y: mouseY
    }
  }

}
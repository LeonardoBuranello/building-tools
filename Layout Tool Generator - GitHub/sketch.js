// Id 1st PANEL
var headline = document.getElementById("headline");
var imageUpload = document.getElementById("imageUpload");
var diameter = document.getElementById("diameter");
var fontsize = document.getElementById("fontsize");
var colorpicker = document.getElementById("colorpicker");
var formatSelector = document.getElementById("formatSelector");

var textAlignSelector = document.getElementById("textAlignSelector");


// Visibility Toggles
var showHeadline = document.getElementById("showHeadline");
var showRings = document.getElementById("showRings");
var showParticles = document.getElementById("showParticles");

// Rings Controls
var numRings = document.getElementById("numRings");
var ringsColorPicker = document.getElementById("ringsColorPicker");
var ringsOpacity = document.getElementById("ringsOpacity");
var bgColor = document.getElementById("bgColor");

// Id 2nd PANEL
var particleSelector = document.getElementById("particleSelector");
var svgUpload = document.getElementById("svgUpload");
var particleShapeSize = document.getElementById("particleShapeSize");
var particleColorPicker = document.getElementById("particleColorPicker");
var particleAmount = document.getElementById("particleAmount");
var particleVelocity = document.getElementById("particleVelocity");

var showValues = document.getElementById("showValues");
var valuesColorPicker = document.getElementById("valuesColorPicker");

// Download Button
var downloadBtn = document.getElementById("download-poster");



// GLOBAL VARIABLES
let particles = [];
let customSvg = null;
let svgBuffer; 
let media = null;
let isVideo = false;

let firma = '#e5e6e4';

let customFont;
let customFontHeadline;

//Font HEADLINE Slider
let fontRegular, fontItalic, fontMedium, fontMediumItalic, fontBold;


//FONTS

function preload() {
  customFont = loadFont('fonts/DMMono-Medium.ttf');

  fontRegular = loadFont('fonts/ravenna_serial-regular-webfont.woff');
  fontItalic = loadFont('fonts/ravenna_serial-italic-webfont.woff');
  fontMedium = loadFont('fonts/ravenna_serial-medium-webfont.woff');
  fontMediumItalic = loadFont('fonts/ravenna_serial-mediumitalic-webfont.woff');
  fontBold = loadFont('fonts/ravenna_serial-bold-webfont.woff');

}





function setup() {

  customFontHeadline = fontRegular;

  //Output in alta risoluzione
  pixelDensity(3);

  // Canvas setup
  var c = createCanvas(700, 900);
  c.parent("canvasWrapper");
  
  // Event Listeners
  imageUpload.addEventListener("change", handleChangeEvent);
  formatSelector.addEventListener("change", updateCanvasSize);
  svgUpload.addEventListener("change", handleSvgUpload);
  particleColorPicker.addEventListener("input", updateSvgBuffer);
  
  // Aggiornamento iniziale della dimensione del canvas
  // in base al formato selezionato
  updateCanvasSize();

  // Download Button Event Listener
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function() {
      console.log("Click received");
      downloadPoster();
    });
    console.log("Download ok");
  } 
}





function draw() {
  background(bgColor.value);

  if (media !== null) {
    image(media, 0, 0, width, height);
  }

  if (showRings.checked) {
    push();
    translate(width / 2, height / 2);
    noFill();
    strokeWeight(2);
    let ringsCount = parseInt(numRings.value); 
    let baseOpacity = map(ringsOpacity.value, 0, 100, 0, 255);
    let rColor = color(ringsColorPicker.value);
    for (let i = 0; i < ringsCount; i++) {
      let pulsazione = sin(frameCount * 0.05 - i * 0.5) * 15;
      let d = parseInt(diameter.value) + (i * 40) + pulsazione;
      let fade = map(i, 0, ringsCount, baseOpacity, 0);
      rColor.setAlpha(fade);
      stroke(rColor);
      circle(0, 0, d);
    }
    pop();
  }

  if (showParticles.checked) {
    while (particles.length < particleAmount.value) {
      particles.push(new Particle());
    }
    if (particles.length > particleAmount.value) {
      particles.splice(0, particles.length - particleAmount.value);
    }
    for (let p of particles) {
      p.update(particleVelocity.value);
      p.display(particleShapeSize.value, particleSelector.value, particleColorPicker.value);
    }
  }


// FONT STYLE SLIDER per HEADLINE

// Valore dello slider (0, 1, 2 o 3)
let styleVal = parseInt(document.getElementById('fontStyleSlider').value);

// Cambio font in base alla posizione
if (styleVal === 0) {
  customFontHeadline = fontRegular;
} else if (styleVal === 1) {
  customFontHeadline = fontItalic;
} else if (styleVal === 2) {
  customFontHeadline = fontMedium;
} else if (styleVal === 3) {
  customFontHeadline = fontMediumItalic;
} else if (styleVal === 4) {
  customFontHeadline = fontBold;
}


// HEADLINE

  if (showHeadline.checked) {
    push();
    fill(colorpicker.value);
    let tSize = parseInt(fontsize.value) || 20;
    textFont(customFontHeadline);
    textSize(tSize);
    
    // Margini
    let margin = 40;
    let tw = width - (margin * 2); 
    let th = height - (margin * 2);

    let x = margin; 
    let y = margin;
    let alignH = CENTER; 
    let alignV = CENTER; 


    // Posizioni in base a dropdown "Text Align"
    switch (textAlignSelector.value) {
      case "top-left":
        alignH = LEFT; alignV = TOP;
        break;
      case "top-right":
        alignH = RIGHT; alignV = TOP;
        break;
      case "top-center":
        alignH = CENTER; alignV = TOP;
        break;
      case "center":
        alignH = CENTER; alignV = CENTER;
      //Correzione ottica
      th += tSize * -0.2;
        break;
      case "bottom-left":
        alignH = LEFT; alignV = BOTTOM;
        break;
      case "bottom-center":
        alignH = CENTER; alignV = BOTTOM;
        break;
      case "bottom-right":
        alignH = RIGHT; alignV = BOTTOM;
        break;
      default:
        alignH = CENTER; alignV = CENTER;
    }

    textAlign(alignH, alignV);
    
    // Interlinea
    textLeading(tSize / 1); 

    /* Testo in box (x, y, tw, th).
      così p5.js posiziona gli elementi dentro un fake rect
    */
    text(headline.value, x, y, tw, th);
    pop();
  }


  // FIRMA
  push();
  
  textFont(customFont);
  textSize(10);
  
  // Colore a parte per firma
  fill(firma); 
  noStroke();

  translate(width - 8, 272);
  rotate(HALF_PI);
  textAlign(RIGHT, TOP);
  
  // \n per andare a capo
  let signature = "LAYOUT GENERATOR TOOL BY LEONARDO BURANELLO";
  
  // Posizionamento 
  text(signature, 0, 0);
  pop();







// VALUES (Data Visualization)

  if (showValues.checked) {
    push();
    fill(valuesColorPicker.value);
    noStroke();
    textFont(customFont);
    textSize(10);
    
    let x, y;
    let alignH, alignV;
    let margin = 25;

    // if Headline is... then go to the opposite sides
    if (textAlignSelector.value.includes("top")) {
    // Alto -> Values in basso
      y = height - margin;
      alignV = BOTTOM;
    } else if (textAlignSelector.value.includes("bottom")) {
    // Basso -> Values in alto
      y = margin;
      alignV = TOP;
    } else {
    // Centro -> Values in basso (default)
      y = height - margin;
      alignV = BOTTOM;
    }

    if (textAlignSelector.value.includes("left")) {
    // Sinistra -> destra
      x = width - margin;
      alignH = RIGHT;
    } else if (textAlignSelector.value.includes("right")) {
    // Destra -> Sinistra
      x = margin;
      alignH = LEFT;
    } else {
    // Se centrata orizzontalmente, values vanno a sx
      x = margin;
      alignH = LEFT;
    }

    textAlign(alignH, alignV);

    let infoText = "";
    infoText += "CANVAS: " + formatSelector.value.toUpperCase() + "\n";
    if (showRings.checked) infoText += "RINGS: " + numRings.value + " (Ø " + diameter.value + "px)\n";
    if (showParticles.checked) infoText += "PARTICLES: " + particles.length + "\n";
    if (showHeadline.checked && headline.value !== "") infoText += "FONT SIZE: " + fontsize.value + "px";

    text(infoText, x, y);
    pop();
  }
}

// Fine draw



// FUNZIONI SVG
function handleSvgUpload(event) {
  let file = event.target.files[0];
  if (file && file.type === "image/svg+xml") {
    let url = URL.createObjectURL(file);
    loadImage(url, (img) => {
      customSvg = img;
      if (!svgBuffer) svgBuffer = createGraphics(200, 200); 
      updateSvgBuffer(); 
    });
  }
}

function updateSvgBuffer() {
  if (!customSvg || !svgBuffer) return;
  svgBuffer.clear();
  svgBuffer.push();
  svgBuffer.imageMode(CENTER);
  svgBuffer.tint(particleColorPicker.value); 
  svgBuffer.image(customSvg, svgBuffer.width / 2, svgBuffer.height / 2, svgBuffer.width * 0.8, svgBuffer.height * 0.8);
  svgBuffer.pop();
}




// PARTICLES Class
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.angle = random(TWO_PI);
    this.vx = cos(this.angle);
    this.vy = sin(this.angle);
    this.alpha = random(100, 255);
  }
  update(speed) {
    let s = map(speed, 50, 250, 0.5, 5);
    this.x += this.vx * s;
    this.y += this.vy * s;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  display(size, shape, col) {
    push();
    translate(this.x, this.y);
    if (customSvg && svgBuffer) {
      imageMode(CENTER);
      let sSVG = map(size, 50, 250, 10, 60);
      image(svgBuffer, 0, 0, sSVG, sSVG);
    } else {
      let c = color(col);
      c.setAlpha(this.alpha);
      fill(c);
      noStroke();
      let s = map(size, 50, 250, 2, 20);
      if (shape === "square") { rectMode(CENTER); square(0, 0, s); }
      else if (shape === "triangle") { triangle(0, -s/2, -s/2, s/2, s/2, s/2); }
      else if (shape === "diamond") { rotate(QUARTER_PI); square(0, 0, s); }
      else { circle(0, 0, s); }
    }
    pop();
  }

}






// FUNCTIONS DI SUPPORTO
function updateCanvasSize() {
  let val = formatSelector.value;
  if (val === "landscape") resizeCanvas(960, 540);
  else if (val === "reel") resizeCanvas(540, 960);
  else if (val === "square") resizeCanvas(700, 700);
  else if (val === "portrait") resizeCanvas(506, 900);
}

function handleChangeEvent(event) {
  let file = event.target.files[0];
  if (file) {
    let url = URL.createObjectURL(file);
    if (file.type.startsWith('video/')) {
      isVideo = true;
      media = createVideo(url, () => { media.loop(); media.volume(0); media.play(); });
      media.hide();
    } else {
      isVideo = false;
      media = loadImage(url);
    }
  }
}



// DOWNLOAD Function

function downloadPoster() {
  let fileName = headline.value.trim() || "poster";

  // Soluzione per risolvere il mancato download su Safari.
  let safeName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '');
  
  saveCanvas(safeName, 'png');
}
const canvas=document.getElementById('editorCanvas');
const headlineSlider=document.getElementById('headlineY');
const captionSlider=document.getElementById('captionY');
let activeText=null;

function canvasY(event){
  const rect=canvas.getBoundingClientRect();
  const pointer=event.touches?event.touches[0]:event;
  return (pointer.clientY-rect.top)*(canvas.height/rect.height);
}

function selectText(y){
  const headlineCanvasY=canvas.height*(Number(headlineSlider.value)/100);
  const captionCanvasY=canvas.height*(Number(captionSlider.value)/100);
  if(Math.abs(y-headlineCanvasY)<canvas.height*0.1)return 'headline';
  if(Math.abs(y-captionCanvasY)<canvas.height*0.1)return 'caption';
  return null;
}

function updateTextPosition(y){
  const percent=Math.round((y/canvas.height)*1000)/10;
  if(activeText==='headline')headlineSlider.value=Math.max(3,Math.min(45,percent));
  if(activeText==='caption')captionSlider.value=Math.max(55,Math.min(97,percent));
  headlineSlider.dispatchEvent(new Event('input',{bubbles:true}));
  captionSlider.dispatchEvent(new Event('input',{bubbles:true}));
}

function startDrag(event){
  if(!canvas||!headlineSlider||!captionSlider)return;
  activeText=selectText(canvasY(event));
  if(activeText){canvas.style.cursor='grabbing';event.preventDefault();}
}

function moveDrag(event){
  if(!activeText)return;
  updateTextPosition(canvasY(event));
  event.preventDefault();
}

function stopDrag(){
  activeText=null;
  if(canvas)canvas.style.cursor='grab';
}

if(canvas&&headlineSlider&&captionSlider){
  canvas.style.cursor='grab';
  canvas.addEventListener('mousedown',startDrag);
  window.addEventListener('mousemove',moveDrag);
  window.addEventListener('mouseup',stopDrag);
  canvas.addEventListener('touchstart',startDrag,{passive:false});
  canvas.addEventListener('touchmove',moveDrag,{passive:false});
  canvas.addEventListener('touchend',stopDrag);
}

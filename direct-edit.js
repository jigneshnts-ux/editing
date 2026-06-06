const canvas=document.getElementById('editorCanvas');
const headlineSlider=document.getElementById('headlineY');
const captionSlider=document.getElementById('captionY');
let activeText=null;

function getCanvasY(event){
  const rect=canvas.getBoundingClientRect();
  const pointer=event.touches?event.touches[0]:event;
  return (pointer.clientY-rect.top)*(canvas.height/rect.height);
}

function nearestText(y){
  const headlineY=canvas.height*(Number(headlineSlider.value)/100);
  const captionY=canvas.height*(Number(captionSlider.value)/100);
  const headlineDistance=Math.abs(y-headlineY);
  const captionDistance=Math.abs(y-captionY);
  return headlineDistance<captionDistance?'headline':'caption';
}

function updatePosition(y){
  const percent=Math.round((y/canvas.height)*1000)/10;
  if(activeText==='headline'){
    headlineSlider.value=Math.max(3,Math.min(45,percent));
    headlineSlider.dispatchEvent(new Event('input',{bubbles:true}));
  }
  if(activeText==='caption'){
    captionSlider.value=Math.max(55,Math.min(97,percent));
    captionSlider.dispatchEvent(new Event('input',{bubbles:true}));
  }
}

function startDrag(event){
  if(!canvas||!headlineSlider||!captionSlider)return;
  activeText=nearestText(getCanvasY(event));
  canvas.style.cursor='grabbing';
  updatePosition(getCanvasY(event));
  event.preventDefault();
}

function moveDrag(event){
  if(!activeText)return;
  updatePosition(getCanvasY(event));
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

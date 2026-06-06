const canvas=document.getElementById('editorCanvas');
const headlineSlider=document.getElementById('headlineY');
const captionSlider=document.getElementById('captionY');

function getPercentY(event){
  const rect=canvas.getBoundingClientRect();
  const pointer=event.touches?event.touches[0]:event;
  const y=(pointer.clientY-rect.top)*(canvas.height/rect.height);
  return Math.round((y/canvas.height)*1000)/10;
}

function moveText(percent){
  if(percent<50){
    headlineSlider.value=Math.max(3,Math.min(45,percent));
    headlineSlider.dispatchEvent(new Event('input',{bubbles:true}));
  }else{
    captionSlider.value=Math.max(55,Math.min(97,percent));
    captionSlider.dispatchEvent(new Event('input',{bubbles:true}));
  }
}

function handleCanvas(event){
  if(!canvas||!headlineSlider||!captionSlider)return;
  moveText(getPercentY(event));
  event.preventDefault();
}

if(canvas&&headlineSlider&&captionSlider){
  canvas.style.cursor='crosshair';
  canvas.addEventListener('click',handleCanvas);
  canvas.addEventListener('touchstart',handleCanvas,{passive:false});
}

const logoInput=document.getElementById('logoInput');
const logoX=document.getElementById('logoX');
const logoY=document.getElementById('logoY');
const logoSize=document.getElementById('logoSize');
let editproLogo=null;

if(logoInput){
  logoInput.addEventListener('change',e=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      editproLogo=new Image();
      editproLogo.onload=()=>window.dispatchEvent(new Event('edit
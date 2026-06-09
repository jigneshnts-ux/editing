(function(){
  const tools=[
    ['move','Move'],['select','Select'],['crop','Crop'],['brush','Brush'],['eraser','Eraser'],['text','Text'],['shape','Shape'],['zoom','Zoom'],['export','Export']
  ];
  function init(){
    if(document.getElementById('proToolbar'))return;
    const bar=document.createElement('div');
    bar.id='proToolbar';
    bar.style.cssText='position:fixed;left:10px;top:80px;z-index:9999;background:#0f172a;border:1px solid #334155;border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:6px
(function(){
  const bar=document.querySelector('.top-actions');
  if(!bar)return;
  const undo=document.createElement('button');
  undo.id='undoBtn';
  undo.className='btn upload';
  undo.textContent='Undo';
  const redo=document.createElement('button');
  redo.id='redoBtn';
  redo.className='btn upload';
  redo.textContent='Redo';
  bar.appendChild(undo);
  bar.appendChild(redo);
  let stack=[];
  let redoStack=[];
  function readState(){
    const ids=['headline','caption','headlineY
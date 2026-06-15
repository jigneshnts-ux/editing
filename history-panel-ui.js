(function(){
  if(document.getElementById('historyPanelBox')) return;
  const panel=document.createElement('div');
  panel.id='historyPanelBox';
  panel.style.position='fixed';
  panel.style.right='16px';
  panel.style.bottom='16px';
  panel.style.width='260px';
  panel.style.maxHeight='320px';
  panel.style.overflow='auto';
  panel.style.background='#111827';
  panel.style.color='#e5e7eb';
  panel.style.border='1px solid #334155';
  panel.style.borderRadius='14px';
  panel.style.padding='12px';
  panel.style.zIndex='999
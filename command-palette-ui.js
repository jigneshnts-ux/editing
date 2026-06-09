(function(){
  const commands=[
    'New Canvas','Open Image','Export PNG','Export JPG','Export WebP','Zoom In','Zoom Out','Fit To Screen','Move Tool','Selection Tool','Crop Tool','Brush Tool','Eraser Tool','Text Tool','Shape Tool','Layer Panel','History Panel','Undo','Redo','Gaussian Blur','Brightness Contrast','Hue Saturation','Layer Mask','Command Palette','Progress Dashboard'
  ];
  const wrap=document.createElement('div');
  wrap.id='commandPaletteOverlay';
  wrap.style.cssText='display:none
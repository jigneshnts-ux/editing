(function(){
  const commands = [
    'New Canvas','Open Image','Save Project','Export PNG','Export JPG','Export WebP','Zoom In','Zoom Out','Fit to Screen','Actual Size',
    'Move Tool','Selection Tool','Crop Tool','Text Tool','Shape Tool','Brush Tool','Eraser Tool','Layers Panel','History Panel','Feature Registry',
    'Brightness Contrast','Hue Saturation','Curves','Levels','Gaussian Blur','Sharpen','Vignette','Add Layer','Delete Layer','Duplicate Layer',
    'Layer Opacity','Blend Mode','Undo','Redo','Logo Upload','Watermark','Background Blur','Text Shadow','Command Palette'
  ];

  const style = document.createElement('style');
  style.textContent = `
    .cmd-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;place-items:start center;padding-top:9vh;z-index:9999}
    .cmd-box{width:min(720px
window.EditProCropTransform={
  activeTool:null,
  cropBox:{x:10,y:10,w:80,h:80,ratio:'free'},
  transform:{rotate:0,scaleX:1,scaleY:1,flipX:false,flipY:false},
  presets:{square:'1:1',portrait:'4:5',reel:'9:16',wide:'16:9',post:'3:4',a4:'A4'},
  setTool(name){this.activeTool=name;return this.activeTool},
  setCropPreset(name){this.cropBox.ratio=this.presets[name]||'free';return this.cropBox},
  rotate90(){this.transform.rotate=(this.transform.rotate+90)%360;return this.transform},
  flipHorizontal(){this.transform.flipX=!this.transform.flipX;return this.transform},
  flipVertical(){this.transform.flipY=!this.transform.flipY;return this.transform},
  reset(){
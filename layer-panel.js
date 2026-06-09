(function(){
  function layerStore(){
    if(!window.EditForgeLayers){
      window.EditForgeLayers={
        layers:[
          {id:'background',name:'Background Image',type:'image',visible:true,locked:false,opacity:100,blendMode:'normal'},
          {id:'headline',name:'Headline Text',type:'text',visible:true,locked:false,opacity:100,blendMode:'normal'},
          {id:'caption',name:'Caption Text',type:'text',visible:true,locked:false,opacity:100,blendMode:'normal'},
         
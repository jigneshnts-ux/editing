const fileInput=document.getElementById('fileInput');
const logoInput=document.getElementById('logoInput');
const canvas=document.getElementById('editorCanvas');
const ctx=canvas.getContext('2d');
const empty=document.getElementById('emptyState');
const $=id=>document.getElementById(id);

let img=null;
let logo=null;
let ratio='9:16';
let fileName='export.png';

const sizes={
  '1:1':[1080,1080],
  '3:4':[1080,1440],
  '9:16':[1080,1920],
  '16:9':[1920,1080]
};

const state={
  headline:'Breaking News',
  caption:'Full story in caption',
  headlineY:8,
  captionY:90,
  headlineSize:78,
  captionSize:48,
  brightness:100,
 
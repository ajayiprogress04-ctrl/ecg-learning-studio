import test from 'node:test';
import assert from 'node:assert/strict';
import{BoardHistory,validBoard,normalPoint,drawStroke,strokeForMode}from'../classroom-core.js';
const stroke={tool:'ink',color:'#fff8e7',size:5,points:[{x:.2,y:.3},{x:.4,y:.5}]};
test('drawing and notes are independently undoable, with undoable clear',()=>{const h=new BoardHistory();h.add(stroke);h.addNote('My revision');h.clear();assert.equal(h.value.strokes.length,0);h.undo();assert.equal(h.value.notes[0],'My revision');h.undo();assert.equal(h.value.notes.length,0);assert.equal(h.value.strokes.length,1);h.redo();assert.equal(h.value.notes.length,1)});
test('new annotation replaces redo branch without mutating original',()=>{const h=new BoardHistory();h.add(stroke);h.undo();h.addNote('New branch');assert.equal(h.redo(),false);assert.equal(stroke.points.length,2)});
test('malformed stored coordinates and excessive boards are rejected',()=>{assert.deepEqual(validBoard({strokes:[{...stroke,points:[{x:NaN,y:.5}]}],notes:[]}),{strokes:[],notes:[]});assert.throws(()=>new BoardHistory().addNote('x'.repeat(601)));assert.deepEqual(normalPoint(500,-1,{left:0,top:0,width:100,height:100}),{x:1,y:0});assert.equal(normalPoint(0,0,{width:0,height:100}),null)});
test('eraser uses destination-out only on the annotation canvas',()=>{const modes=[];const c={save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},set globalCompositeOperation(x){modes.push(x)}};drawStroke(c,stroke,1200,600);drawStroke(c,{...stroke,tool:'erase'},1200,600);assert.deepEqual(modes,['source-over','destination-out'])});

test('ink stays visible when switching board backgrounds',()=>{assert.equal(strokeForMode(stroke,'white').color,'#18232b');assert.equal(strokeForMode(strokeForMode(stroke,'white'),'black').color,stroke.color);assert.equal(stroke.color,'#fff8e7')});

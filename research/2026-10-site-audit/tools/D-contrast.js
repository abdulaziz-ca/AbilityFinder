const hex=(h)=>{h=h.replace('#','');if(h.length===3)h=[...h].map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const lum=(c)=>{const [r,g,b]=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return 0.2126*r+0.7152*g+0.0722*b};
const cr=(a,b)=>{const x=lum(hex(a)),y=lum(hex(b));return ((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2)};
const dark={bg:'#14110e',bg2:'#191512',panel:'#1d1815',panel2:'#241e19',text:'#f8f3ec',dim:'#c5bcaf',dimmer:'#948a7d',accent:'#e9ddc9',accenthi:'#fbf4e8',ok:'#57bf90',warn:'#e0a44e',danger:'#e0605e',btn:'#f7f2ea',btnink:'#14110e'};
const light={bg:'#f7f2e9',bg2:'#f0e9dc',panel:'#fffdf8',panel2:'#f3ece0',text:'#1f1913',dim:'#665d51',dimmer:'#6b6256',accent:'#43372a',accenthi:'#241c13',ok:'#106843',warn:'#855511',danger:'#b53a38',btn:'#1f1913',btnink:'#fffdf8'};
const hc={bg:'#000000',bg2:'#000000',panel:'#0b0b0b',panel2:'#151515',text:'#ffffff',dim:'#ececec',dimmer:'#d0d0d0',accent:'#f4ead6',accenthi:'#ffffff',ok:'#5ce6a0',warn:'#ffd27a'};
const themes={dark,light,'contrast+dark':{...dark,...hc},'contrast+light':{...light,...hc}};
for(const [n,t] of Object.entries(themes)){const rows=[];for(const fg of ['text','dim','dimmer','accent','accenthi','ok','warn','danger'])for(const bg of ['bg','bg2','panel','panel2']){const v=cr(t[fg],t[bg]);if(v<4.5)rows.push(`${fg} on ${bg}=${v}`)}
rows.push(`btnink on btn=${cr(t.btnink,t.btn)}`, `btn vs bg (non-text)=${cr(t.btn,t.bg)}`);console.log(n.padEnd(15),'min fails:',rows.join('; '))}
console.log('guide footer #0000ee on dark bg', cr('#0000ee','#14110e'));

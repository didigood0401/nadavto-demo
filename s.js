(function(){
var R=matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};

// интро-шторка -> заголовок героя
requestAnimationFrame(function(){setTimeout(function(){document.body.classList.add('done');setTimeout(function(){$('#hero').classList.add('on')},650)},R?0:700)});
setTimeout(function(){$('.intro').style.display='none'},2600);

// появление
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
$$('.rv,.map').forEach(function(el){io.observe(el)});

// счётчики
$$('[data-count]').forEach(function(el){var to=+el.dataset.count,done=false;
 new IntersectionObserver(function(es,o){if(es[0].isIntersecting&&!done){done=true;o.disconnect();var t0=performance.now();
  (function f(t){var k=Math.min(1,(t-t0)/1400);k=1-Math.pow(1-k,4);el.textContent=Math.round(to*k);if(k<1)requestAnimationFrame(f)})(t0)}},{threshold:.5}).observe(el)});

// шапка, прогресс, параллакс, бегущие строки от скорости прокрутки
var hdr=$('#hdr'),prog=$('#prog'),bg=$('#herobg'),ly=scrollY,vel=0,fab=$('#fab');
var ghosts=$$('[data-par]');
var tickers=[{el:$('#tick .tr'),x:0,dir:-1,sp:.6}].concat($$('.tape .tr').map(function(t){return {el:t,x:t.dataset.dir>0?-600:0,dir:+t.dataset.dir,sp:.9}}));
tickers.forEach(function(t){t.el.innerHTML+=t.el.innerHTML;});
function loop(){
  var y=scrollY,dy=y-ly;ly=y;vel+= (dy-vel)*.15;
  var H=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(y/H)+')';
  hdr.classList.toggle('sc',y>40);hdr.classList.toggle('hide',y>600&&dy>2&&!document.body.classList.contains('mopen'));if(dy<-2)hdr.classList.remove('hide');
  fab.classList.toggle('show',y>innerHeight*.8);
  if(!R){
    if(y<innerHeight*1.2)bg.style.translate='0 '+(y*.3)+'px';
    ghosts.forEach(function(g){var r=g.parentElement.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)g.style.transform='translateX('+(r.top*+g.dataset.par)+'px)'});
    tickers.forEach(function(t){var w=t.el.scrollWidth/2;t.x+=t.dir*(t.sp+Math.min(Math.abs(vel)*.35,14));if(t.x<-w)t.x+=w;if(t.x>0)t.x-=w;t.el.style.transform='translate3d('+t.x+'px,0,0)'});
  }
  requestAnimationFrame(loop)}
requestAnimationFrame(loop);

// мобильное меню
$('#burger').onclick=function(){var o=$('#mm').classList.toggle('open');document.body.classList.toggle('mopen',o);document.body.style.overflow=o?'hidden':''};
$$('#mm a').forEach(function(a){a.onclick=function(){$('#mm').classList.remove('open');document.body.classList.remove('mopen');document.body.style.overflow=''}});

// было / стало
var ba=$('#baw'),drag=false;
function setX(e){var r=ba.getBoundingClientRect(),x=((e.touches?e.touches[0].clientX:e.clientX)-r.left)/r.width;ba.style.setProperty('--x',Math.max(0,Math.min(100,x*100))+'%')}
ba.addEventListener('pointerdown',function(e){drag=true;ba.setPointerCapture(e.pointerId);setX(e)});
ba.addEventListener('pointermove',function(e){if(drag)setX(e)});
ba.addEventListener('pointerup',function(){drag=false});
// подсказка-движение при первом показе
new IntersectionObserver(function(es,o){if(es[0].isIntersecting&&!R){o.disconnect();var t0=performance.now();(function f(t){var k=(t-t0)/1600;if(k>1||drag)return;ba.style.setProperty('--x',(50+Math.sin(k*Math.PI*2)*18)+'%');requestAnimationFrame(f)})(t0)}},{threshold:.6}).observe(ba);

// липкие этапы
var imgs=$$('#stage img'),steps=$$('.step'),cn=$('#cn'),cbar=$('#cbar');
var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var i=steps.indexOf(e.target);
  steps.forEach(function(s,j){s.classList.toggle('on',j===i)});imgs.forEach(function(m,j){m.classList.toggle('on',j<=i)});
  cn.textContent='0'+(i+1);cbar.style.width=((i+1)/steps.length*100)+'%'}})},{rootMargin:'-45% 0px -45% 0px'});
steps.forEach(function(s){so.observe(s)});

// все услуги
$('#allsvc').onclick=function(){var g=$('#svcg');g.classList.toggle('all');this.firstChild.textContent=g.classList.contains('all')?'Свернуть ':'Все 14 услуг ';this.querySelector('svg').style.transform=g.classList.contains('all')?'rotate(-90deg)':'rotate(90deg)'};

// калькулятор срока
function seg(id){var s=$(id),p=$('.pill',s);function mv(b){p.style.left=b.offsetLeft+'px';p.style.width=b.offsetWidth+'px'}
 $$('button',s).forEach(function(b){b.onclick=function(){$$('button',s).forEach(function(x){x.classList.remove('on')});b.classList.add('on');mv(b);calc()}});
 requestAnimationFrame(function(){mv($('button.on',s))});addEventListener('resize',function(){mv($('button.on',s))})}
seg('#seg');seg('#seg2');
$$('#works button').forEach(function(b){b.onclick=function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');calc()}});
var dEl=$('#days'),cur=11;
function calc(){
  var buy=$('#seg2 .on').dataset.v==='buy',k=+$('#seg .on').dataset.k,sel=$$('#works [aria-pressed=true]');
  var d=buy?Math.round(30*k):Math.max(3,Math.round(sel.reduce(function(s,b){return s+ +b.dataset.d},0)*k*.85));
  var items=buy?['Разборка до рамы и полная сборка','Кабина, двигатель, кузов, КПП, мосты - с капремонта','Тормоза, проводка, АКБ, РТИ - новые','Предоплата 50%, остаток при получении']:
    (sel.length?sel.map(function(b){return 'Ремонт: '+b.textContent.toLowerCase()}):['Выберите хотя бы один вид ремонта']).concat(['Гарантия 6 месяцев или 30 000 км']);
  $('#wl').innerHTML=items.map(function(x){return '<li>'+x+'</li>'}).join('');
  var from=cur,to=d,t0=performance.now();cur=d;
  (function f(t){var q=Math.min(1,(t-t0)/600);q=1-Math.pow(1-q,3);dEl.textContent=Math.round(from+(to-from)*q);if(q<1)requestAnimationFrame(f)})(t0);
  $$('#works button').forEach(function(b){b.disabled=buy;b.style.opacity=buy?.35:1});
}
calc();
$('#f').onsubmit=function(e){e.preventDefault();var b=$('button',this);b.innerHTML='Заявка принята ✓';b.disabled=true};

// карта отгрузок
var C=[['Набережные Челны',52.4,55.7,'наш цех'],['Москва',37.6,55.8,'надрамник, ПЭК'],['Вологда',39.9,59.2,'КАМАЗ 6520'],['Нижний Новгород',44.0,56.3,'самосвал'],['Саратов',46.0,51.5,'КАМАЗ 45143'],['Бузулук',52.2,52.8,'замена кузова'],['Уфа, Башкирия',56.0,54.7,'кузов 45142'],['Оренбург',55.1,51.8,'к уборочной'],['Казахстан',57.2,50.3,'самосвал'],['Кемерово',86.1,55.4,'кузов']];
function P(c){return [(c[1]-32)*13+20,(61.5-c[2])*42+40]}
var sv=$('#msvg'),NS='http://www.w3.org/2000/svg',h='';
for(var gx=0;gx<800;gx+=20)for(var gy=0;gy<500;gy+=20)h+='<circle cx="'+gx+'" cy="'+gy+'" r="1" fill="rgba(255,255,255,.07)"/>';
var hub=P(C[0]);
C.slice(1).forEach(function(c,i){var p=P(c),mx=(hub[0]+p[0])/2,my=(hub[1]+p[1])/2-Math.abs(hub[0]-p[0])*.28-30;
  h+='<path class="route" data-i="'+(i+1)+'" d="M'+hub[0]+' '+hub[1]+' Q'+mx+' '+my+' '+p[0]+' '+p[1]+'" style="transition-delay:'+(i*.12)+'s"/>';
  h+='<circle class="dot" cx="'+p[0]+'" cy="'+p[1]+'" r="5" style="transition-delay:'+(1+i*.12)+'s"/><text x="'+(p[0]+9)+'" y="'+(p[1]+4)+'" style="transition-delay:'+(1.2+i*.12)+'s">'+c[0]+'</text>'});
h+='<circle class="ring" cx="'+hub[0]+'" cy="'+hub[1]+'" r="8"/><circle class="dot hub" cx="'+hub[0]+'" cy="'+hub[1]+'" r="8"/><text x="'+(hub[0]+12)+'" y="'+(hub[1]-10)+'" style="fill:#ff5a1a;font-weight:700">Наб. Челны</text>';
sv.innerHTML=h;
$$('.route',sv).forEach(function(p){p.style.setProperty('--l',p.getTotalLength())});
$('#cities').innerHTML=C.slice(1).map(function(c,i){return '<li data-i="'+(i+1)+'">'+c[0]+'<span>'+c[3]+'</span></li>'}).join('');
$$('#cities li').forEach(function(li){li.onmouseenter=function(){$$('.route',sv).forEach(function(r){r.style.strokeWidth=r.dataset.i===li.dataset.i?3.5:1.2;r.style.opacity=r.dataset.i===li.dataset.i?1:.35})};
  li.onmouseleave=function(){$$('.route',sv).forEach(function(r){r.style.strokeWidth='';r.style.opacity=''})}});

// галерея: перетаскивание, стрелки, лайтбокс
var gr=$('#galr'),down=false,sx=0,sl=0,moved=0;
gr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;sx=e.clientX;sl=gr.scrollLeft;gr.classList.add('drag')});
addEventListener('pointermove',function(e){if(!down)return;moved=Math.abs(e.clientX-sx);gr.scrollLeft=sl-(e.clientX-sx)});
addEventListener('pointerup',function(){down=false;gr.classList.remove('drag')});
$('#gn').onclick=function(){gr.scrollBy({left:gr.clientWidth*.7,behavior:'smooth'})};
$('#gp').onclick=function(){gr.scrollBy({left:-gr.clientWidth*.7,behavior:'smooth'})};
var lb=$('#lb');
$$('#galr figure').forEach(function(f){f.onclick=function(){if(moved>6)return;$('img',lb).src=$('img',f).src;lb.classList.add('open')}});
lb.onclick=function(){lb.classList.remove('open')};
addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open')});

// видео: наведение / касание
$$('.vc').forEach(function(v){var vd=$('video',v);
  function play(){vd.play();v.classList.add('playing')}function stop(){vd.pause();v.classList.remove('playing')}
  v.addEventListener('mouseenter',play);v.addEventListener('mouseleave',stop);
  v.addEventListener('click',function(){vd.paused?play():stop()})});
})();

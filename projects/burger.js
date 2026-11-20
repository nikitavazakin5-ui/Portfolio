// BURGER LAB — scroll reveals + subtle parallax ingredients
const revealCards = document.querySelectorAll('.menu-card');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.15});
revealCards.forEach(card=>revealObserver.observe(card));

const stage = document.querySelector('.assembly-stage');
const ingredients = [...document.querySelectorAll('.ingredient')];
let rafPending = false;
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function smoothstep(v){return v*v*(3-2*v);}
function updateIngredients(){
  if(!stage){rafPending=false;return;}
  const rect=stage.getBoundingClientRect();
  const vh=window.innerHeight||1;
  // Animation is tied to the stage's own position; movement remains limited.
  const raw=clamp((vh*0.78-rect.top)/(rect.height*0.9),0,1);
  const spread=smoothstep(raw);
  const offsets=[-62,-34,-12,12,38,66];
  ingredients.forEach((el,i)=>{
    const y=offsets[i]||0;
    const x=(i===1||i===4)?-14:(i===2||i===5)?14:0;
    const rot=(i%2===0?1:-1)*spread*2.2;
    el.style.transform=`translate(-50%, ${y*spread}px) translateX(${x*spread}px) rotate(${rot}deg)`;
  });
  rafPending=false;
}
function onScroll(){if(!rafPending){requestAnimationFrame(updateIngredients);rafPending=true;}}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',onScroll);
updateIngredients();

// reveal hero image and title on load
window.addEventListener('load',()=>{
  document.querySelector('.hero-food')?.classList.add('loaded');
  document.querySelector('.hero-copy')?.classList.add('loaded');
});

// RU / EN switch: default language is Russian.
const langMap={
'БУРГЕРЫ РУЧНОЙ СБОРКИ / 2026':'HANDCRAFTED BURGERS / 2026','СВЕЖЕЕ КАЖДЫЙ ДЕНЬ':'FRESH EVERY DAY','ГОЛОДУ НЕ НУЖНЫ ПРАВИЛА':'HUNGER HAS NO RULES','СОЧНО.':'JUICY.','ГРОМКО.':'LOUD.','ПОСМОТРЕТЬ МЕНЮ ↓':'VIEW MENU ↓','02 / МЕНЮ':'02 / MENU','ВЫБИРАЙ':'CHOOSE','СВОЙ ВКУС.':'YOUR FLAVOR.','КЛАССИК':'CLASSIC','ДВОЙНОЙ УДАР':'DOUBLE HIT','ОГНЕННЫЙ':'FIRE','ХИТ':'BESTSELLER','ОСТРО':'SPICY','03 / ВНУТРИ ВКУСА':'03 / INSIDE THE FLAVOR','НИЧЕГО':'NOTHING','СЛУЧАЙНОГО.':'ACCIDENTAL.','СОБРАНО С ЗАБОТОЙ':'MADE WITH CARE','СЛОЙ ЗА СЛОЕМ ↓':'LAYER BY LAYER ↓','04 / ВРЕМЯ ЕСТЬ':'04 / THE MOMENT','ВРЕМЯ КУСАТЬ.':'TIME TO BITE.','ВЫБРАТЬ БУРГЕР ↗':'CHOOSE A BURGER ↗','05 / НАЙДИ НАС':'05 / FIND US','ЗАХОДИ.':'COME ON IN.','БУДЕТ ВКУСНО.':'IT’S DELICIOUS.','06 / ЧЕМ СОБРАНО':'06 / BUILT WITH','НЕ МАГИЯ.':'NOT MAGIC.','ПРОСТО КОД.':'JUST CODE.','СТРУКТУРА':'STRUCTURE','СТИЛЬ И АНИМАЦИИ':'STYLE & MOTION','ИНТЕРАКТИВНОСТЬ':'INTERACTION','КОНЦЕПТ · 2026':'CONCEPT · 2026','НАВЕРХ ↑':'BACK TO TOP ↑','Сайт собран из привычных веб-технологий. Немного кода, экспериментов и попыток сделать всё живее.':'This site uses familiar web technologies, a bit of code, experiments and little touches of motion.','Основа страницы: секции, меню, тексты и содержание.':'Page structure: sections, menu, text and content.','Цвета, композиция, адаптация под экран и анимации.':'Colors, layout, responsive design and animations.','Поведение элементов, эффекты при прокрутке и небольшие взаимодействия.':'Element behavior, scroll effects and small interactions.','Пока изучаю и пробую новое — иногда приходится гуглить прямо по ходу работы. Это тоже часть процесса :)':'Still learning and trying new things — sometimes I have to look things up as I go. That is part of the process :)',};
let englishMode=false;
const languageButton=document.querySelector('#langToggle');
const savedTextNodes=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
let textNode;while(textNode=walker.nextNode()){if(textNode.nodeValue.trim())savedTextNodes.push({node:textNode,original:textNode.nodeValue});}
languageButton?.addEventListener('click',()=>{englishMode=!englishMode;savedTextNodes.forEach(({node,original})=>{const key=original.trim();if(langMap[key])node.nodeValue=englishMode?original.replace(key,langMap[key]):original;});languageButton.textContent=englishMode?'EN / RU':'RU / EN';document.documentElement.lang=englishMode?'en':'ru';});

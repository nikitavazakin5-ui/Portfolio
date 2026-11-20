// ----- Smooth reveal + small motion accents -----
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero-title-wrap', {opacity:0, y:36, duration:1.1, ease:'power3.out', delay:.15});
  gsap.from('.hero-top, .hero-bottom', {opacity:0, y:16, duration:.8, stagger:.12, ease:'power2.out', delay:.25});
  gsap.utils.toArray('.section-heading, .project-info, .about-content, .process-heading, .process-item, .price-block, .contact h2, .contact-description, .contact-button').forEach((el)=>{
    gsap.from(el,{opacity:0,y:30,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
  });
  gsap.to('.hero-number',{opacity:.15,y:40,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
}

// ----- Pointer glow -----
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove',(e)=>{
  if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';}
});

// ----- Tilt project cards -----
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',(e)=>{
    if(window.innerWidth<760)return;
    const rect=card.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width-.5;
    const y=(e.clientY-rect.top)/rect.height-.5;
    const visual=card.querySelector('.project-visual');
    if(visual)visual.style.transform=`perspective(1000px) rotateX(${-y*3}deg) rotateY(${x*4}deg)`;
  });
  card.addEventListener('mouseleave',()=>{
    const visual=card.querySelector('.project-visual');if(visual)visual.style.transform='';
  });
});

// ----- Three.js hero sculpture -----
const host=document.getElementById('hero-scene');
if(host && window.THREE){
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(40,host.clientWidth/host.clientHeight,.1,100);
  camera.position.set(0,0,8.2);
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(host.clientWidth,host.clientHeight);
  renderer.outputEncoding=THREE.sRGBEncoding;
  host.appendChild(renderer.domElement);
  const group=new THREE.Group();scene.add(group);

  const coreMat=new THREE.MeshStandardMaterial({color:0x171b14,metalness:.95,roughness:.18,emissive:0x23300c,emissiveIntensity:.35});
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.05,2),coreMat);group.add(core);
  const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.09,1),new THREE.MeshBasicMaterial({color:0xd5ff40,wireframe:true,transparent:true,opacity:.28}));group.add(wire);
  const ringMat=new THREE.MeshStandardMaterial({color:0xd5ff40,metalness:.8,roughness:.25});
  const rings=[];
  [[1.75,.012,0.3,0.15],[2.15,.008,-.55,.3],[1.45,.009,.8,-.25]].forEach(([radius,tube,rx,ry])=>{
    const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,160),ringMat);ring.rotation.x=rx;ring.rotation.y=ry;group.add(ring);rings.push(ring);
  });
  const dotGeo=new THREE.SphereGeometry(.025,6,6);const dots=[];
  for(let i=0;i<360;i++){
    const p=new THREE.Mesh(dotGeo,new THREE.MeshBasicMaterial({color:i%5===0?0xd5ff40:0x8d9a6b,transparent:true,opacity:.4+Math.random()*.4}));
    const r=2.1+Math.random()*1.25,theta=Math.random()*Math.PI*2,phi=Math.acos(2*Math.random()-1);
    p.position.set(r*Math.sin(phi)*Math.cos(theta),r*Math.sin(phi)*Math.sin(theta),r*Math.cos(phi));scene.add(p);dots.push(p);
  }
  scene.add(new THREE.AmbientLight(0xffffff,.5));
  const light1=new THREE.PointLight(0xd5ff40,2.5,8);light1.position.set(2,1,3);scene.add(light1);
  const light2=new THREE.PointLight(0xffffff,1.4,10);light2.position.set(-2,-1,2);scene.add(light2);
  let mouseX=0,mouseY=0;
  window.addEventListener('mousemove',(e)=>{mouseX=(e.clientX/window.innerWidth-.5)*.6;mouseY=(e.clientY/window.innerHeight-.5)*.4;});
  const clock=new THREE.Clock();
  function render(){requestAnimationFrame(render);const t=clock.getElapsedTime();core.rotation.y=t*.22;core.rotation.x=t*.13;wire.rotation.y=-t*.1;wire.rotation.x=t*.07;group.rotation.y+=(mouseX-group.rotation.y)*.018;group.rotation.x+=(mouseY-group.rotation.x)*.018;rings[0].rotation.z=t*.13;rings[1].rotation.x+=.001;rings[2].rotation.y-=.001;group.position.y=Math.sin(t*.8)*.08;renderer.render(scene,camera);}
  render();
  const resize=()=>{camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();renderer.setSize(host.clientWidth,host.clientHeight);};window.addEventListener('resize',resize);
  if(window.gsap&&window.ScrollTrigger){gsap.to(group.scale,{x:.78,y:.78,z:.78,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});gsap.to(group.position,{x:1.25,y:-.6,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});}
}

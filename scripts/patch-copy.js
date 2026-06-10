/**
 * Patches branding copy in the legacy App3D bundle.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { patchSummaryContent } from './patch-summary.mjs';
import { patchEducationCube } from './patch-education.mjs';
import { patchExperienceCube } from './patch-experience.mjs';

const bundlePath = path.join(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
  'src/legacy/App3D-f554a111.js',
);

let source = readFileSync(bundlePath, 'utf8');

// Remove footer legal lines and copyright line.
source = source.replace(
  /rights:`Igloo, Inc\.\s*All Rights Reserved\.`/,
  'rights:""',
);
source = source.replace(/copyright:"\/\/ Copyright © 2026"/g, 'copyright:""');

if (!source.includes('logoText:')) {
  source = source.replace(
    'copyright:"",rights:""',
    'copyright:"",logoText:"Chris",rights:""',
  );
}

const oldLogoClass =
  'class LF{constructor(e){this.scene=e,this.ready=new Promise(t=>{this.isReady=t}),this.init()}init(){const e=new kt;e.translate(.5,-.5,0),this.mesh=new Ce(e,new fe({uniforms:{tMap:{value:le.load("ui/logo-datatexture.ktx2","datatexture")},tBlocks:{value:le.load("scroll-datatexture.ktx2","datatexture-repeat")},uColor:{value:new Z(Be.colorLogo)},uColor2:{value:new Z("#ffffff")},uShow:{value:q.devScene?1:0},uRand:{value:Math.random()}},vertexShader:`';

if (!source.includes(oldLogoClass)) {
  if (source.includes('logoText:"Chris"') && source.includes('text:Be.logoText')) {
    console.log('Copy already patched:', bundlePath);
    process.exit(0);
  }
  console.error('Logo class marker not found — bundle format may have changed.');
  process.exit(1);
}

const newLogoClass =
  'class LF{constructor(e){this.scene=e,this.ready=new Promise(t=>{this.isReady=t}),this.init()}async init(){this.mesh=new Ui({font:"IBMPlexMono-Medium",text:Be.logoText||"Chris",width:1.6,align:"left",lineHeight:.85,size:.28},{uniforms:{tMap:{value:le.load("../fonts/IBMPlexMono-Medium-datatexture.ktx2","data")},tBlocks:{value:le.load("scroll-datatexture.ktx2","datatexture-repeat")},uColor:{value:new Z(Be.colorLogo)},uColor2:{value:new Z("#ffffff")},uShow:{value:q.devScene?1:0},uRand:{value:Math.random()}},vertexShader:`';

source = source.replace(oldLogoClass, newLogoClass);

// Ui geometry uses vUv directly — drop imagefitUV scaling from the logo shader.
source = source.replace(
  'vec2 uv = imagefitUV(vUv, vec2(textureSize(tMap, 0)), vScale, 1.0);',
  'vec2 uv = vUv;',
);

// Ui meshes are billboarded — remove unused vScale varying from logo shaders.
source = source.replace(
  `varying vec2 vUv;
                flat varying vec2 vScale;

                void main() {
                    vUv = uv;
                    vScale = getMatrixScale(modelMatrix).xy;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            \`,fragmentShader:\`
                \${ii}
                \${Lc}

                uniform sampler2D tMap;
                uniform sampler2D tBlocks;
                uniform vec3 uColor;
                uniform vec3 uColor2;
                uniform float uShow;
                uniform float uRand;

                varying vec2 vUv;
                flat varying vec2 vScale;`,
  `varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * viewMatrix * billboardModelMatrix() * vec4(position, 1.0);
                }
            \`,fragmentShader:\`
                \${ii}
                \${Lc}
                \${Ue}

                uniform sampler2D tMap;
                uniform sampler2D tBlocks;
                uniform vec3 uColor;
                uniform vec3 uColor2;
                uniform float uShow;
                uniform float uRand;

                varying vec2 vUv;`,
);

// Wait for MSDF geometry before wiring interactions.
source = source.replace(
  '})),this.mesh.name="logo",this.mesh.frustumCulled=!1,this.mesh.renderOrder=10,this.scene.add(this.mesh),this.interaction=new Er({meshes:[this.mesh],camera:this.scene.camera,onHover:t=>{t.action==="hover_in"&&(this.show(.25,0),Q.emit("webgl_hover_logo"),Q.emit("webgl_play_audio","logo"))}}),Q.once("webgl_show_ui_intro",()=>{this.interaction.enable(),this.show(),Q.emit("webgl_play_audio","logo")}),q.devScene&&this.interaction.enable(),this.isReady()}show(e=.5,t=.75){this.mesh.material.uniforms.uRand.value=Math.random(),re.fromTo(this.mesh.material.uniforms.uShow,{value:0},{delay:t,value:1,duration:e,ease:"none",overwrite:!0})}resize(){const e=this.scene.mobile?140:this.scene.small?160:200,t=e*.21;this.mesh.scale.set(e,t,1),this.mesh.position.set(this.scene.meshMarginLeft,-this.scene.meshMarginTop,0)}}class FF',
  '}),this.mesh.name="logo",this.mesh.frustumCulled=!1,this.mesh.renderOrder=10,this.scene.add(this.mesh),await this.mesh.ready,this.interaction=new Er({meshes:[this.mesh],camera:this.scene.camera,onHover:t=>{t.action==="hover_in"&&(this.show(.25,0),Q.emit("webgl_hover_logo"),Q.emit("webgl_play_audio","logo"))}}),Q.once("webgl_show_ui_intro",()=>{this.interaction.enable(),this.show(),Q.emit("webgl_play_audio","logo")}),q.devScene&&this.interaction.enable(),this.isReady()}show(e=.5,t=.75){this.mesh.material.uniforms.uRand.value=Math.random(),re.fromTo(this.mesh.material.uniforms.uShow,{value:0},{delay:t,value:1,duration:e,ease:"none",overwrite:!0})}resize(){const e=this.scene.mobile?150:this.scene.small?175:210;this.mesh.scale.set(e,e,1),this.mesh.position.set(this.scene.meshMarginLeft,-this.scene.meshMarginTop,0)}}class FF',
);

// Hide empty copyright/rights UI when copy is blank.
source = source.replace(
  'const l=(e?160:200)*.21,c=a+l+this.copyright.size.y*1.25*s;Si.positionUI({camera:this.scene.camera,mesh:this.copyright,x:r,y:c,width:s,height:s}),Be.rights&&Si.positionUI({camera:this.scene.camera,mesh:this.rights,x:r,y:c+this.copyright.size.y*1.5*s,width:s,height:s})',
  'const l=(e?160:200)*.21,c=a+l+(Be.copyright?this.copyright.size.y*1.25*s:0);Be.copyright&&Si.positionUI({camera:this.scene.camera,mesh:this.copyright,x:r,y:c,width:s,height:s}),Be.rights&&Si.positionUI({camera:this.scene.camera,mesh:this.rights,x:r,y:c+(Be.copyright?this.copyright.size.y*1.5*s:0),width:s,height:s})',
);

source = source.replace(
  '[this.title,this.text,this.copyright,this.rights].forEach(e=>{re.set(e.material.uniforms.uShow1,{value:0,overwrite:!0}),re.set(e.material.uniforms.uShow2,{value:0,overwrite:!0})})',
  '[this.title,this.text,...(Be.copyright?[this.copyright]:[]),...(Be.rights?[this.rights]:[])].forEach(e=>{re.set(e.material.uniforms.uShow1,{value:0,overwrite:!0}),re.set(e.material.uniforms.uShow2,{value:0,overwrite:!0})})',
);

source = source.replace(
  '[this.copyright,...(Be.rights?[this.rights]:[]),this.title,this.text].forEach((e,t)=>',
  '[...(Be.copyright?[this.copyright]:[]),...(Be.rights?[this.rights]:[]),this.title,this.text].forEach((e,t)=>',
);

source = source.replace(
  '(Be.rights?[this.copyright,this.rights]:[this.copyright]).forEach((e,t)=>{re.fromTo(e.material.uniforms.uBlink',
  '[...(Be.copyright?[this.copyright]:[]),...(Be.rights?[this.rights]:[])].forEach((e,t)=>{re.fromTo(e.material.uniforms.uBlink',
);

source = source.replace(
  /manifesto:\{title:"[^"]*",text:"[^"]*"\}/,
  'manifesto:{title:"",text:"Senior Director of AI/ML Engineering\\n& Data Platforms |\\nFull-Stack AI/ML & MLOps Expert"}',
);

source = source.replace(
  /this\.options=\{manifestoWidth:[^,]+,copyrightWidth:\.9,align:"right",lineHeight:[^,]+,size:[^}]+\}/,
  'this.options={manifestoWidth:.92,copyrightWidth:.9,align:"right",lineHeight:.95,size:.1}',
);

source = source.replace(
  'Si.positionUI({camera:this.scene.camera,mesh:this.title,x:q.screen.width-r,y:a+this.title.size.y*.75*n,width:s,height:n}),Si.positionUI({camera:this.scene.camera,mesh:this.text,x:q.screen.width-r,y:a+this.title.size.y*2.25*n,width:s,height:n});',
  'Be.manifesto.title&&Si.positionUI({camera:this.scene.camera,mesh:this.title,x:q.screen.width-r,y:a+this.title.size.y*.75*n,width:s,height:n}),Si.positionUI({camera:this.scene.camera,mesh:this.text,x:q.screen.width-r,y:a+(Be.manifesto.title?this.title.size.y*2.25*n:this.text.size.y*.45*n),width:s,height:n});',
);

source = source.replace(
  '[this.title,this.text,...(Be.copyright?[this.copyright]:[]),...(Be.rights?[this.rights]:[])].forEach(e=>{re.set(e.material.uniforms.uShow1,{value:0,overwrite:!0}),re.set(e.material.uniforms.uShow2,{value:0,overwrite:!0})})',
  '[...(Be.manifesto.title?[this.title]:[]),this.text,...(Be.copyright?[this.copyright]:[]),...(Be.rights?[this.rights]:[])].forEach(e=>{re.set(e.material.uniforms.uShow1,{value:0,overwrite:!0}),re.set(e.material.uniforms.uShow2,{value:0,overwrite:!0})})',
);

source = source.replace(
  '[...(Be.copyright?[this.copyright]:[]),...(Be.rights?[this.rights]:[]),this.title,this.text].forEach((e,t)=>',
  '[...(Be.copyright?[this.copyright]:[]),...(Be.rights?[this.rights]:[]),...(Be.manifesto.title?[this.title]:[]),this.text].forEach((e,t)=>',
);

source = source.replace(
  'this.title.name="title",this.title.frustumCulled=!1,this.title.renderOrder=999,this.scene.add(this.title),this.text=new Ui({font:"IBMPlexMono-Medium",text:Be.manifesto.text',
  'this.title.name="title",this.title.frustumCulled=!1,this.title.renderOrder=999,Be.manifesto.title||(this.title.visible=!1),this.scene.add(this.title),this.text=new Ui({font:"IBMPlexMono-Medium",text:Be.manifesto.text',
);

source = source.replace(
  /title:"PORTFOLIO_CO_01 [^"]+"/,
  'title:"PORTFOLIO_CO_01 Chris Lim"',
);

source = source.replace(
  'title:"PORTFOLIO_CO_02 Overpass"',
  'title:"PORTFOLIO_CO_02 Experience"',
);

source = source.replace(
  'title:"PORTFOLIO_CO_03 Abstract"',
  'title:"PORTFOLIO_CO_03 Education"',
);

source = source.replace(
  'title:"PORTFOLIO_CO_03 Education",hash:"abstract"',
  'title:"PORTFOLIO_CO_03 Education",hash:"education"',
);

source = source.replace(
  /hash:"pudgy-penguins"/,
  'hash:"about_me"',
);

source = source.replace(
  'social:[{name:"X",link:"https://x.com/pudgypenguins"},{name:"IG",link:"https://instagram.com/pudgypenguins"},{name:"LI",link:"https://www.linkedin.com/company/pudgy-penguins"},{name:"TK",link:"https://www.tiktok.com/@pudgypenguins"}],linkTitle:"/// Visit",links:[{name:"website",link:"https://www.pudgypenguins.com"}],obj:"pudgy"',
  'social:[{name:"X",link:"https://x.com/Chrislim0067"},{name:"LI",link:"https://www.linkedin.com/in/chris-kiel-804659106/"}],linkTitle:"",links:[],obj:"pudgy"',
);

source = source.replace(
  'social:[{name:"X",link:"https://twitter.com/OverpassIP"}],linkTitle:"/// Visit",links:[{name:"website",link:"https://www.overpassip.com"}],obj:"overpass_logo"',
  'social:[{name:"X",link:"https://x.com/Chrislim0067"},{name:"LI",link:"https://www.linkedin.com/in/chris-kiel-804659106/"}],linkTitle:"",links:[],obj:"overpass_logo"',
);

source = source.replaceAll(
  'url:"https://www.linkedin.com/company/igloo-incorporated"',
  'url:"https://www.linkedin.com/in/chris-kiel-804659106/"',
);

source = source.replaceAll(
  'url:"https://www.twitter.com/iglooinc"',
  'url:"https://x.com/Chrislim0067"',
);

source = source.replaceAll(
  'url:"https://twitter.com/iglooinc"',
  'url:"https://x.com/Chrislim0067"',
);

source = source.replace(
  'social:[{name:"X",link:"https://twitter.com/iglooinc"},{name:"LI",link:"https://www.linkedin.com/company/igloo-incorporated"}]',
  'social:[{name:"X",link:"https://x.com/Chrislim0067"},{name:"LI",link:"https://www.linkedin.com/in/chris-kiel-804659106/"}]',
);

source = source.replaceAll(
  'link:"https://twitter.com/iglooinc"',
  'link:"https://x.com/Chrislim0067"',
);

source = source.replaceAll(
  'link:"https://www.linkedin.com/company/igloo-incorporated"',
  'link:"https://www.linkedin.com/in/chris-kiel-804659106/"',
);

source = patchSummaryContent(source);
source = patchExperienceCube(source);
source = patchEducationCube(source);

source = source.replace(
  'this.elements.push(new Yh({parent:this,text:e.title,options:{...t,color:Be.colorProjectTitle}}),new Yh({parent:this,text:e.content,options:{...t,color:Be.colorProjectText}}),new Yh({parent:this,text:e.socialTitle,options:{...t,color:Be.colorProjectTitle}}),new ey({parent:this,links:e.social,options:{...t,color:Be.colorProjectText}}),new Yh({parent:this,text:e.linkTitle,options:{...t,color:Be.colorProjectTitle}}),new ey({parent:this,links:e.links,options:{...t,color:Be.colorProjectText}}))',
  'this.elements.push(new Yh({parent:this,text:e.title,options:{...t,color:Be.colorProjectTitle}}),new Yh({parent:this,text:e.content,options:{...t,color:Be.colorProjectText}}),new Yh({parent:this,text:e.socialTitle,options:{...t,color:Be.colorProjectTitle}}),new ey({parent:this,links:e.social,options:{...t,color:Be.colorProjectText}})),e.linkTitle&&this.elements.push(new Yh({parent:this,text:e.linkTitle,options:{...t,color:Be.colorProjectTitle}})),e.links&&e.links.length&&this.elements.push(new ey({parent:this,links:e.links,options:{...t,color:Be.colorProjectText}}))',
);

writeFileSync(bundlePath, source, 'utf8');
console.log('Patched branding copy in', bundlePath);

var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function r(e){e.forEach(t)}function o(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function a(e){return 0===Object.keys(e).length}function s(e,t){e.appendChild(t)}function c(e,t,n){e.insertBefore(t,n||null)}function l(e){e.parentNode.removeChild(e)}function u(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function d(){return p(" ")}function f(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function g(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function h(e){return""===e?null:+e}function m(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function x(e,t){e.value=null==t?"":t}function b(e){const t={};for(const n of e)t[n.name]=n.value;return t}let v;function w(e){v=e}const y=[],$=[],L=[],k=[],T=Promise.resolve();let P=!1;function E(e){L.push(e)}let A=!1;const S=new Set;function C(){if(!A){A=!0;do{for(let e=0;e<y.length;e+=1){const t=y[e];w(t),M(t.$$)}for(w(null),y.length=0;$.length;)$.pop()();for(let e=0;e<L.length;e+=1){const t=L[e];S.has(t)||(S.add(t),t())}L.length=0}while(y.length);for(;k.length;)k.pop()();P=!1,A=!1,S.clear()}}function M(e){if(null!==e.fragment){e.update(),r(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(E)}}const _=new Set;function R(e,t){const n=e.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function H(e,t){-1===e.$$.dirty[0]&&(y.push(e),P||(P=!0,T.then(C)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function j(i,a,s,c,u,p,d=[-1]){const f=v;w(i);const g=a.props||{},h=i.$$={fragment:null,ctx:null,props:p,update:e,not_equal:u,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:n(),dirty:d,skip_bound:!1};let m=!1;if(h.ctx=s?s(i,g,((e,t,...n)=>{const r=n.length?n[0]:t;return h.ctx&&u(h.ctx[e],h.ctx[e]=r)&&(!h.skip_bound&&h.bound[e]&&h.bound[e](r),m&&H(i,e)),t})):[],h.update(),m=!0,r(h.before_update),h.fragment=!!c&&c(h.ctx),a.target){if(a.hydrate){const e=function(e){return Array.from(e.childNodes)}(a.target);h.fragment&&h.fragment.l(e),e.forEach(l)}else h.fragment&&h.fragment.c();a.intro&&((x=i.$$.fragment)&&x.i&&(_.delete(x),x.i(b))),function(e,n,i){const{fragment:a,on_mount:s,on_destroy:c,after_update:l}=e.$$;a&&a.m(n,i),E((()=>{const n=s.map(t).filter(o);c?c.push(...n):r(n),e.$$.on_mount=[]})),l.forEach(E)}(i,a.target,a.anchor),C()}var x,b;w(f)}let U;"function"==typeof HTMLElement&&(U=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){for(const e in this.$$.slotted)this.appendChild(this.$$.slotted[e])}attributeChangedCallback(e,t,n){this[e]=n}$destroy(){R(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){this.$$set&&!a(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}});var B="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function D(e){var t={exports:{}};return e(t,t.exports),t.exports}var z=D((function(e){!function(t){var n=function(){return{escape:function(e){return e.replace(/([.*+?^${}()|\[\]\/\\])/g,"\\$1")},parseExtension:t,mimeType:function(e){var n=t(e).toLowerCase();return(r="application/font-woff",o="image/jpeg",{woff:r,woff2:r,ttf:"application/font-truetype",eot:"application/vnd.ms-fontobject",png:"image/png",jpg:o,jpeg:o,gif:"image/gif",tiff:"image/tiff",svg:"image/svg+xml"})[n]||"";var r,o},dataAsUrl:function(e,t){return"data:"+t+";base64,"+e},isDataUrl:function(e){return-1!==e.search(/^(data:)/)},canvasToBlob:function(e){return e.toBlob?new Promise((function(t){e.toBlob(t)})):function(e){return new Promise((function(t){for(var n=window.atob(e.toDataURL().split(",")[1]),r=n.length,o=new Uint8Array(r),i=0;i<r;i++)o[i]=n.charCodeAt(i);t(new Blob([o],{type:"image/png"}))}))}(e)},resolveUrl:function(e,t){var n=document.implementation.createHTMLDocument(),r=n.createElement("base");n.head.appendChild(r);var o=n.createElement("a");return n.body.appendChild(o),r.href=t,o.href=e,o.href},getAndEncode:function(e){var t=3e4;s.impl.options.cacheBust&&(e+=(/\?/.test(e)?"&":"?")+(new Date).getTime());return new Promise((function(n){var r,o=new XMLHttpRequest;if(o.onreadystatechange=a,o.ontimeout=c,o.responseType="blob",o.timeout=t,o.open("GET",e,!0),o.send(),s.impl.options.imagePlaceholder){var i=s.impl.options.imagePlaceholder.split(/,/);i&&i[1]&&(r=i[1])}function a(){if(4===o.readyState)if(200===o.status){var t=new FileReader;t.onloadend=function(){var e=t.result.split(/,/)[1];n(e)},t.readAsDataURL(o.response)}else r?n(r):l("cannot fetch resource: "+e+", status: "+o.status)}function c(){r?n(r):l("timeout of "+t+"ms occured while fetching resource: "+e)}function l(e){console.error(e),n("")}}))},uid:(e=0,function(){return"u"+t()+e++;function t(){return("0000"+(Math.random()*Math.pow(36,4)<<0).toString(36)).slice(-4)}}),delay:function(e){return function(t){return new Promise((function(n){setTimeout((function(){n(t)}),e)}))}},asArray:function(e){for(var t=[],n=e.length,r=0;r<n;r++)t.push(e[r]);return t},escapeXhtml:function(e){return e.replace(/#/g,"%23").replace(/\n/g,"%0A")},makeImage:function(e){return new Promise((function(t,n){var r=new Image;r.onload=function(){t(r)},r.onerror=n,r.src=e}))},width:function(e){var t=n(e,"border-left-width"),r=n(e,"border-right-width");return e.scrollWidth+t+r},height:function(e){var t=n(e,"border-top-width"),r=n(e,"border-bottom-width");return e.scrollHeight+t+r}};var e;function t(e){var t=/\.([^\.\/]*?)$/g.exec(e);return t?t[1]:""}function n(e,t){var n=window.getComputedStyle(e).getPropertyValue(t);return parseFloat(n.replace("px",""))}}(),r=function(){var e=/url\(['"]?([^'"]+?)['"]?\)/g;return{inlineAll:function(e,n,i){return a()?Promise.resolve(e):Promise.resolve(e).then(r).then((function(t){var r=Promise.resolve(e);return t.forEach((function(e){r=r.then((function(t){return o(t,e,n,i)}))})),r}));function a(){return!t(e)}},shouldProcess:t,impl:{readUrls:r,inline:o}};function t(t){return-1!==t.search(e)}function r(t){for(var r,o=[];null!==(r=e.exec(t));)o.push(r[1]);return o.filter((function(e){return!n.isDataUrl(e)}))}function o(e,t,r,o){return Promise.resolve(t).then((function(e){return r?n.resolveUrl(e,r):e})).then(o||n.getAndEncode).then((function(e){return n.dataAsUrl(e,n.mimeType(t))})).then((function(r){return e.replace(function(e){return new RegExp("(url\\(['\"]?)("+n.escape(e)+")(['\"]?\\))","g")}(t),"$1"+r+"$3")}))}}(),o=function(){return{resolveAll:function(){return e().then((function(e){return Promise.all(e.map((function(e){return e.resolve()})))})).then((function(e){return e.join("\n")}))},impl:{readAll:e}};function e(){return Promise.resolve(n.asArray(document.styleSheets)).then((function(e){var t=[];return e.forEach((function(e){try{n.asArray(e.cssRules||[]).forEach(t.push.bind(t))}catch(t){console.log("Error while reading CSS rules from "+e.href,t.toString())}})),t})).then((function(e){return e.filter((function(e){return e.type===CSSRule.FONT_FACE_RULE})).filter((function(e){return r.shouldProcess(e.style.getPropertyValue("src"))}))})).then((function(t){return t.map(e)}));function e(e){return{resolve:function(){var t=(e.parentStyleSheet||{}).href;return r.inlineAll(e.cssText,t)},src:function(){return e.style.getPropertyValue("src")}}}}}(),i=function(){return{inlineAll:function t(o){return o instanceof Element?i(o).then((function(){return o instanceof HTMLImageElement?e(o).inline():Promise.all(n.asArray(o.childNodes).map((function(e){return t(e)})))})):Promise.resolve(o);function i(e){var t=e.style.getPropertyValue("background");return t?r.inlineAll(t).then((function(t){e.style.setProperty("background",t,e.style.getPropertyPriority("background"))})).then((function(){return e})):Promise.resolve(e)}},impl:{newImage:e}};function e(e){return{inline:function(t){return n.isDataUrl(e.src)?Promise.resolve():Promise.resolve(e.src).then(t||n.getAndEncode).then((function(t){return n.dataAsUrl(t,n.mimeType(e.src))})).then((function(t){return new Promise((function(n,r){e.onload=n,e.onerror=r,e.src=t}))}))}}}}(),a={imagePlaceholder:void 0,cacheBust:!1},s={toSvg:c,toPng:function(e,t){return l(e,t||{}).then((function(e){return e.toDataURL()}))},toJpeg:function(e,t){return l(e,t=t||{}).then((function(e){return e.toDataURL("image/jpeg",t.quality||1)}))},toBlob:function(e,t){return l(e,t||{}).then(n.canvasToBlob)},toPixelData:function(e,t){return l(e,t||{}).then((function(t){return t.getContext("2d").getImageData(0,0,n.width(e),n.height(e)).data}))},impl:{fontFaces:o,images:i,util:n,inliner:r,options:{}}};function c(e,t){return function(e){void 0===e.imagePlaceholder?s.impl.options.imagePlaceholder=a.imagePlaceholder:s.impl.options.imagePlaceholder=e.imagePlaceholder;void 0===e.cacheBust?s.impl.options.cacheBust=a.cacheBust:s.impl.options.cacheBust=e.cacheBust}(t=t||{}),Promise.resolve(e).then((function(e){return u(e,t.filter,!0)})).then(p).then(d).then((function(e){t.bgcolor&&(e.style.backgroundColor=t.bgcolor);t.width&&(e.style.width=t.width+"px");t.height&&(e.style.height=t.height+"px");t.style&&Object.keys(t.style).forEach((function(n){e.style[n]=t.style[n]}));return e})).then((function(r){return function(e,t,r){return Promise.resolve(e).then((function(e){return e.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),(new XMLSerializer).serializeToString(e)})).then(n.escapeXhtml).then((function(e){return'<foreignObject x="0" y="0" width="100%" height="100%">'+e+"</foreignObject>"})).then((function(e){return'<svg xmlns="http://www.w3.org/2000/svg" width="'+t+'" height="'+r+'">'+e+"</svg>"})).then((function(e){return"data:image/svg+xml;charset=utf-8,"+e}))}(r,t.width||n.width(e),t.height||n.height(e))}))}function l(e,t){return c(e,t).then(n.makeImage).then(n.delay(100)).then((function(r){var o=function(e){var r=document.createElement("canvas");if(r.width=t.width||n.width(e),r.height=t.height||n.height(e),t.bgcolor){var o=r.getContext("2d");o.fillStyle=t.bgcolor,o.fillRect(0,0,r.width,r.height)}return r}(e);return o.getContext("2d").drawImage(r,0,0),o}))}function u(e,t,r){return r||!t||t(e)?Promise.resolve(e).then((function(e){return e instanceof HTMLCanvasElement?n.makeImage(e.toDataURL()):e.cloneNode(!1)})).then((function(r){return function(e,t,r){var o=e.childNodes;return 0===o.length?Promise.resolve(t):i(t,n.asArray(o),r).then((function(){return t}));function i(e,t,n){var r=Promise.resolve();return t.forEach((function(t){r=r.then((function(){return u(t,n)})).then((function(t){t&&e.appendChild(t)}))})),r}}(e,r,t)})).then((function(t){return function(e,t){return t instanceof Element?Promise.resolve().then(r).then(o).then(i).then(a).then((function(){return t})):t;function r(){function r(e,t){function r(e,t){n.asArray(e).forEach((function(n){t.setProperty(n,e.getPropertyValue(n),e.getPropertyPriority(n))}))}e.cssText?t.cssText=e.cssText:r(e,t)}r(window.getComputedStyle(e),t.style)}function o(){function r(r){var o=window.getComputedStyle(e,r),i=o.getPropertyValue("content");if(""!==i&&"none"!==i){var a=n.uid();t.className=t.className+" "+a;var s=document.createElement("style");s.appendChild(c(a,r,o)),t.appendChild(s)}function c(e,t,r){var o="."+e+":"+t,i=r.cssText?a(r):s(r);return document.createTextNode(o+"{"+i+"}");function a(e){var t=e.getPropertyValue("content");return e.cssText+" content: "+t+";"}function s(e){return n.asArray(e).map(t).join("; ")+";";function t(t){return t+": "+e.getPropertyValue(t)+(e.getPropertyPriority(t)?" !important":"")}}}}[":before",":after"].forEach((function(e){r(e)}))}function i(){e instanceof HTMLTextAreaElement&&(t.innerHTML=e.value),e instanceof HTMLInputElement&&t.setAttribute("value",e.value)}function a(){t instanceof SVGElement&&(t.setAttribute("xmlns","http://www.w3.org/2000/svg"),t instanceof SVGRectElement&&["width","height"].forEach((function(e){var n=t.getAttribute(e);n&&t.style.setProperty(e,n)})))}}(e,t)})):Promise.resolve()}function p(e){return o.resolveAll().then((function(t){var n=document.createElement("style");return e.appendChild(n),n.appendChild(document.createTextNode(t)),e}))}function d(e){return i.inlineAll(e).then((function(){return e}))}e.exports=s}()}));function O(t){let n,o,i,a,b,v,w,y,$,L,k,T,P,E,A,S,C,M,_,R,H,j,U,B,D,z,O,F,I,N,V,W,G,q,X,K,J,Q,Y,Z,ee,te,ne,re,oe,ie,ae,se,ce,le,ue,pe,de,fe,ge,he,me,xe,be,ve,we,ye,$e,Le,ke,Te,Pe,Ee,Ae,Se,Ce,Me,_e,Re,He,je,Ue,Be,De,ze,Oe,Fe,Ie,Ne,Ve,We,Ge,qe,Xe,Ke,Je,Qe,Ye,Ze,et,tt,nt,rt,ot,it,at,st,ct,lt,ut,pt,dt,ft,gt,ht,mt,xt,bt,vt,wt,yt,$t,Lt,kt,Tt,Pt,Et,At,St,Ct,Mt,_t,Rt,Ht,jt,Ut,Bt,Dt=(t[1]+t[2]+t[3])*t[4]*t[16]+"",zt=t[6].toLocaleString(void 0,{maximumFractionDigits:1})+"",Ot=(t[6]/t[10]).toLocaleString()+"",Ft=t[7].toLocaleString()+"",It=(t[7]/t[11]).toLocaleString(void 0,{maximumFractionDigits:0})+"",Nt=t[8].toLocaleString(void 0,{maximumFractionDigits:0})+"",Vt=(t[8]/t[12]).toLocaleString(void 0,{maximumFractionDigits:1})+"";return{c(){n=u("main"),o=u("h1"),o.textContent="Schulverpflegung Impact Rechner",i=d(),a=u("ol"),b=u("li"),v=u("h2"),v.innerHTML="Wie viele <strong>Menülinien</strong> bieten Sie an?",w=d(),y=u("p"),$=u("input"),L=d(),k=u("input"),T=d(),P=u("li"),E=u("h2"),E.innerHTML="Wie viele <strong>Gerichte</strong> in Ihren Menülinien möchten Sie klima-\n        und umweltfreundlicher gestalten (pro Woche)?",A=d(),S=u("div"),C=u("div"),M=u("p"),M.innerHTML='<img src="./img/icons/meat.png" alt="meat icon"/> \n            <img src="./img/icons/arrow.png" alt="arrow icon"/> \n            <img src="./img/icons/plant.png" alt="plantbased icon"/>',_=d(),R=u("label"),H=u("input"),j=p("\n            Gerichte"),U=d(),B=u("small"),B.textContent="vegetarisch statt fleischhaltig",D=d(),z=u("div"),O=u("p"),O.innerHTML='<img src="./img/icons/meat.png" alt="meat icon"/> \n            <img src="./img/icons/arrow.png" alt="arrow icon"/> \n            <img src="./img/icons/veg.png" alt="vegan icon"/>',F=d(),I=u("label"),N=u("input"),V=p("\n            Gerichte"),W=d(),G=u("small"),G.textContent="rein pflanzlich statt fleischhaltig",q=d(),X=u("div"),K=u("p"),K.innerHTML='<img src="./img/icons/plant.png" alt="plantbased icon"/> \n            <img src="./img/icons/arrow.png" alt="arrow icon"/> \n            <img src="./img/icons/veg.png" alt="vegan icon"/>',J=d(),Q=u("label"),Y=u("input"),Z=p("\n            Gerichte"),ee=d(),te=u("small"),te.textContent="rein pflanzlich statt vegetarisch",ne=d(),re=u("li"),oe=u("h2"),oe.innerHTML="Wie viele <strong>Portionen</strong> bereiten Sie bei regulärem\n        Schulbetrieb <strong>pro Tag</strong> zu?",ie=d(),ae=u("p"),se=u("label"),ce=u("input"),le=p("\n          Portionen"),ue=d(),pe=u("section"),de=u("h2"),fe=p("Durch den Einsatz von\n      "),ge=u("strong"),he=p(Dt),me=p("\n        klima- und umweltfreundlicheren Mahlzeiten"),xe=p("\n      pro Woche sparen sie im Jahr etwa"),be=d(),ve=u("section"),we=u("div"),we.innerHTML='<div class="text-box text-box--first"><span class="text text--big text--bold text--uppercase">Wir sparen pro Jahr</span> \n        <br/> \n        <span class="text text--small">durch die Reduktion von tierischen Lebensmitteln in der\n          Schulverpflegung bis zu...</span></div> \n      <div class="logo"><img src="./img/proveg-logo.svg" alt="proveg logo"/></div> \n      <div class="dotted-border"></div>',ye=d(),$e=u("div"),Le=u("div"),Le.innerHTML='<img src="./img/icons/carbon.png" alt="carbon icon"/>',ke=d(),Te=u("div"),Pe=u("span"),Ee=p(zt),Ae=p("\n          Tonnen"),Se=d(),Ce=u("span"),Ce.innerHTML="CO<sub>2</sub>-Equivalente,",Me=d(),_e=u("br"),Re=d(),He=u("span"),He.textContent="das entspricht",je=d(),Ue=u("span"),Be=p(Ot),De=p("\n          km"),ze=d(),Oe=u("span"),Oe.textContent="mit dem Auto",Fe=d(),Ie=u("div"),Ne=d(),Ve=u("div"),We=u("div"),We.innerHTML='<img src="./img/icons/waterdrop.png" alt="waterdrop icon"/>',Ge=d(),qe=u("div"),Xe=u("span"),Ke=p(Ft),Je=p("\n          Liter"),Qe=d(),Ye=u("span"),Ye.textContent="Wasser,",Ze=d(),et=u("br"),tt=d(),nt=u("span"),nt.textContent="das entspricht",rt=d(),ot=u("span"),it=p(It),at=d(),st=u("span"),st.textContent="Badewannen",ct=d(),lt=u("div"),ut=d(),pt=u("div"),dt=u("div"),dt.innerHTML='<img src="./img/icons/forrest.png" alt="forrest icon"/>',ft=d(),gt=u("div"),ht=u("span"),mt=p(Nt),xt=p("\n          m"),bt=u("sup"),bt.textContent="2",vt=d(),wt=u("span"),wt.textContent="Land,",yt=d(),$t=u("br"),Lt=d(),kt=u("span"),kt.textContent="das entspricht",Tt=d(),Pt=u("span"),Et=p(Vt),At=d(),St=u("span"),St.textContent="Fußballfeldern",Ct=d(),Mt=u("div"),_t=d(),Rt=u("div"),Rt.innerHTML='<div class="link">Berechnet auf <span class="text--uppercase">proveg.com/impact-rechner</span></div>',Ht=d(),jt=u("button"),jt.textContent="Banner speichern",this.c=e,g($,"type","range"),g($,"min",t[13]),g($,"max",t[14]),g(k,"type","number"),g(k,"min",t[13]),g(k,"max",t[14]),g(y,"class","flex-wrapper"),g(M,"class","large-icons"),g(H,"name","KCAL_meat_to_plant"),g(H,"type","number"),g(H,"min","0"),g(H,"max","100"),g(R,"class","inline"),g(C,"class","flex-wrapper flex-wrapper--col"),g(O,"class","large-icons"),g(N,"name","KCAL_meat_to_veg"),g(N,"type","number"),g(N,"min","0"),g(N,"max","100"),g(I,"class","inline"),g(z,"class","flex-wrapper flex-wrapper--col"),g(K,"class","large-icons"),g(Y,"name","KCAL_veg_to_plant"),g(Y,"type","number"),g(Y,"min","0"),g(Y,"max","100"),g(Q,"class","inline"),g(X,"class","flex-wrapper flex-wrapper--col"),g(S,"class","flex-wrapper flex-wrapper--space-around"),g(ce,"type","number"),g(ce,"min","0"),g(ce,"max",t[15]),g(se,"class","inline"),g(ae,"class","flex-wrapper"),g(we,"class","banner"),g(Le,"class","icon icon--right"),g(Pe,"class","text text--bold text--orange"),g(Ce,"class","text"),g(He,"class","text"),g(Ue,"class","text text--bold text--orange"),g(Oe,"class","text"),g(Te,"class","text-box"),g(Ie,"class","dotted-border"),g($e,"class","banner"),g(We,"class","icon"),g(Xe,"class","text text--bold text--blue"),g(Ye,"class","text"),g(nt,"class","text"),g(ot,"class","text text--bold text--blue"),g(st,"class","text text--bold text--blue"),g(qe,"class","text-box"),g(lt,"class","dotted-border"),g(Ve,"class","banner"),g(dt,"class","icon icon--right"),g(ht,"class","text text--bold text--green"),g(wt,"class","text"),g(kt,"class","text"),g(Pt,"class","text text--bold text--green"),g(St,"class","text text--bold text--green"),g(gt,"class","text-box"),g(Mt,"class","dotted-border"),g(pt,"class","banner"),g(Rt,"class","banner"),g(jt,"class","download-banner")},m(e,r){c(e,n,r),s(n,o),s(n,i),s(n,a),s(a,b),s(b,v),s(b,w),s(b,y),s(y,$),x($,t[0]),s(y,L),s(y,k),x(k,t[0]),s(a,T),s(a,P),s(P,E),s(P,A),s(P,S),s(S,C),s(C,M),s(C,_),s(C,R),s(R,H),x(H,t[1]),s(R,j),s(C,U),s(C,B),s(S,D),s(S,z),s(z,O),s(z,F),s(z,I),s(I,N),x(N,t[2]),s(I,V),s(z,W),s(z,G),s(S,q),s(S,X),s(X,K),s(X,J),s(X,Q),s(Q,Y),x(Y,t[3]),s(Q,Z),s(X,ee),s(X,te),s(a,ne),s(a,re),s(re,oe),s(re,ie),s(re,ae),s(ae,se),s(se,ce),x(ce,t[4]),s(se,le),s(n,ue),s(n,pe),s(pe,de),s(de,fe),s(de,ge),s(ge,he),s(ge,me),s(de,xe),s(n,be),s(n,ve),s(ve,we),s(ve,ye),s(ve,$e),s($e,Le),s($e,ke),s($e,Te),s(Te,Pe),s(Pe,Ee),s(Pe,Ae),s(Te,Se),s(Te,Ce),s(Te,Me),s(Te,_e),s(Te,Re),s(Te,He),s(Te,je),s(Te,Ue),s(Ue,Be),s(Ue,De),s(Te,ze),s(Te,Oe),s($e,Fe),s($e,Ie),s(ve,Ne),s(ve,Ve),s(Ve,We),s(Ve,Ge),s(Ve,qe),s(qe,Xe),s(Xe,Ke),s(Xe,Je),s(qe,Qe),s(qe,Ye),s(qe,Ze),s(qe,et),s(qe,tt),s(qe,nt),s(qe,rt),s(qe,ot),s(ot,it),s(qe,at),s(qe,st),s(Ve,ct),s(Ve,lt),s(ve,ut),s(ve,pt),s(pt,dt),s(pt,ft),s(pt,gt),s(gt,ht),s(ht,mt),s(ht,xt),s(ht,bt),s(gt,vt),s(gt,wt),s(gt,yt),s(gt,$t),s(gt,Lt),s(gt,kt),s(gt,Tt),s(gt,Pt),s(Pt,Et),s(gt,At),s(gt,St),s(pt,Ct),s(pt,Mt),s(ve,_t),s(ve,Rt),t[31](ve),s(n,Ht),s(n,jt),Ut||(Bt=[f($,"change",t[25]),f($,"input",t[25]),f(k,"input",t[26]),f(H,"input",t[27]),f(N,"input",t[28]),f(Y,"input",t[29]),f(ce,"input",t[30]),f(jt,"click",t[9])],Ut=!0)},p(e,t){1&t[0]&&x($,e[0]),1&t[0]&&h(k.value)!==e[0]&&x(k,e[0]),2&t[0]&&h(H.value)!==e[1]&&x(H,e[1]),4&t[0]&&h(N.value)!==e[2]&&x(N,e[2]),8&t[0]&&h(Y.value)!==e[3]&&x(Y,e[3]),16&t[0]&&h(ce.value)!==e[4]&&x(ce,e[4]),30&t[0]&&Dt!==(Dt=(e[1]+e[2]+e[3])*e[4]*e[16]+"")&&m(he,Dt),64&t[0]&&zt!==(zt=e[6].toLocaleString(void 0,{maximumFractionDigits:1})+"")&&m(Ee,zt),64&t[0]&&Ot!==(Ot=(e[6]/e[10]).toLocaleString()+"")&&m(Be,Ot),128&t[0]&&Ft!==(Ft=e[7].toLocaleString()+"")&&m(Ke,Ft),128&t[0]&&It!==(It=(e[7]/e[11]).toLocaleString(void 0,{maximumFractionDigits:0})+"")&&m(it,It),256&t[0]&&Nt!==(Nt=e[8].toLocaleString(void 0,{maximumFractionDigits:0})+"")&&m(mt,Nt),256&t[0]&&Vt!==(Vt=(e[8]/e[12]).toLocaleString(void 0,{maximumFractionDigits:1})+"")&&m(Et,Vt)},i:e,o:e,d(e){e&&l(n),t[31](null),Ut=!1,r(Bt)}}}function F(e,t,n){let r,o,i,a,s,c,l,u,p,d,f,g;const m=.9;let x=2,b=1,v=1,w=1,y=200,L=200;return e.$$.update=()=>{21&e.$$.dirty[0]&&n(17,r=v*y/x*L*46e-5*m),19&e.$$.dirty[0]&&n(18,o=b*y/x*L*684e-6*m),25&e.$$.dirty[0]&&n(19,i=w*y/x*L*224e-6*m),917504&e.$$.dirty[0]&&n(6,a=r+o+i),21&e.$$.dirty[0]&&n(20,s=v*y/x*L*325),19&e.$$.dirty[0]&&n(21,c=b*y/x*L*325),3145728&e.$$.dirty[0]&&n(7,l=s+c),21&e.$$.dirty[0]&&n(22,u=v*y/x*L*.541095890410959*m),19&e.$$.dirty[0]&&n(23,p=b*y/x*L*.6643835616438356*m),25&e.$$.dirty[0]&&n(24,d=w*y/x*L*.1232876712328767*m),29360128&e.$$.dirty[0]&&n(8,f=u+p+d)},[x,b,v,w,y,g,a,l,f,function(){z.toBlob(g).then((function(e){window.saveAs(e,"banner.png")}))},12e-5,150,7140,1,5,1e4,5,r,o,i,s,c,u,p,d,function(){x=h(this.value),n(0,x)},function(){x=h(this.value),n(0,x)},function(){b=h(this.value),n(1,b)},function(){v=h(this.value),n(2,v)},function(){w=h(this.value),n(3,w)},function(){y=h(this.value),n(4,y)},function(e){$[e?"unshift":"push"]((()=>{g=e,n(5,g)}))}]}D((function(e,t){!function(){function t(e,t){return void 0===t?t={autoBom:!1}:"object"!=typeof t&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e}function n(e,t,n){var r=new XMLHttpRequest;r.open("GET",e),r.responseType="blob",r.onload=function(){s(r.response,t,n)},r.onerror=function(){console.error("could not download file")},r.send()}function r(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function o(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(n){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var i="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof B&&B.global===B?B:void 0,a=i.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),s=i.saveAs||("object"!=typeof window||window!==i?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(e,t,a){var s=i.URL||i.webkitURL,c=document.createElement("a");t=t||e.name||"download",c.download=t,c.rel="noopener","string"==typeof e?(c.href=e,c.origin===location.origin?o(c):r(c.href)?n(e,t,a):o(c,c.target="_blank")):(c.href=s.createObjectURL(e),setTimeout((function(){s.revokeObjectURL(c.href)}),4e4),setTimeout((function(){o(c)}),0))}:"msSaveOrOpenBlob"in navigator?function(e,i,a){if(i=i||e.name||"download","string"!=typeof e)navigator.msSaveOrOpenBlob(t(e,a),i);else if(r(e))n(e,i,a);else{var s=document.createElement("a");s.href=e,s.target="_blank",setTimeout((function(){o(s)}))}}:function(e,t,r,o){if((o=o||open("","_blank"))&&(o.document.title=o.document.body.innerText="downloading..."),"string"==typeof e)return n(e,t,r);var s="application/octet-stream"===e.type,c=/constructor/i.test(i.HTMLElement)||i.safari,l=/CriOS\/[\d]+/.test(navigator.userAgent);if((l||s&&c||a)&&"undefined"!=typeof FileReader){var u=new FileReader;u.onloadend=function(){var e=u.result;e=l?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),o?o.location.href=e:location=e,o=null},u.readAsDataURL(e)}else{var p=i.URL||i.webkitURL,d=p.createObjectURL(e);o?o.location=d:location.href=d,o=null,setTimeout((function(){p.revokeObjectURL(d)}),4e4)}});i.saveAs=s.saveAs=s,e.exports=s}()}));function I(t){let n;return{c(){n=u("main"),n.innerHTML="<my-component></my-component>"},m(e,t){c(e,n,t)},p:e,i:e,o:e,d(e){e&&l(n)}}}customElements.define("my-component",class extends U{constructor(e){super(),this.shadowRoot.innerHTML='<style>main{text-align:center;min-width:258px;margin:0 auto;color:#11284a}h1{font-weight:500}h2{font-size:1.2em;font-weight:400}ol{list-style:inside decimal;padding-left:0}ol li{margin-bottom:3rem}ol li::marker{display:inline}ol li h2{display:inline}.flex-wrapper{display:flex;flex-wrap:wrap;justify-content:center;gap:12px}.flex-wrapper--col{flex-direction:column}.flex-wrapper--space-around{justify-content:space-around}.large-icons img{margin-top:5px;max-height:40px}.text-box{flex-grow:1;align-self:center}.text-box--first{margin-top:8px}.text{font-size:1.4em}.text--big{font-size:1.5em}.text--small{font-size:1.1em}.text--bold{font-weight:400}.text--uppercase{text-transform:uppercase}.text--orange{color:#ffae2c}.text--blue{color:#5bb7e5}.text--green{color:#73c800}.banner{position:relative;display:flex;text-align:left;font-size:0.85em;font-weight:300;line-height:1.2;color:white;background-color:#11284a;padding:8px 18px;margin:auto;max-width:500px}.banner .icon{align-self:center;flex:0 0 70px;margin-right:16px}.banner .icon--right{order:1;margin-right:0}.banner .logo{position:absolute;top:12px;right:20px;width:70px}.banner img{width:100%}.banner .link{text-align:right;width:100%;font-size:0.75em}@media(min-width: 640px){.banner{font-size:initial}.banner .icon{flex-basis:100px}.banner .logo{width:90px}}.dotted-border{position:absolute;bottom:0;left:0;right:0;width:100%;height:1px;background-image:linear-gradient(to right, #606060 0%, #606060 40%, transparent 40%);background-size:5px 1px}.inline{display:inline}input{font-family:inherit;font-size:inherit;-webkit-padding:0.4em 0;padding:0.4em;margin:0 0 0.5em 0;box-sizing:border-box;border:1px solid #ccc;border-radius:2px}input:disabled{color:#ccc}input[type="range"]{-webkit-appearance:none;border:none}input[type="range"]:focus{outline:none}input[type="range"]::-webkit-slider-runnable-track{height:8.4px;cursor:pointer;box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;background:#3071a9;border-radius:1.3px;border:0.2px solid #010101}input[type="range"]::-webkit-slider-thumb{box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;border:1px solid #000000;height:36px;width:16px;border-radius:3px;background:#ffffff;cursor:pointer;-webkit-appearance:none;margin-top:-14px}input[type="range"]:focus::-webkit-slider-runnable-track{background:#367ebd}input[type="range"]::-moz-range-track{height:8.4px;cursor:pointer;box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;background:#3071a9;border-radius:1.3px;border:0.2px solid #010101}input[type="range"]::-moz-range-thumb{box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;border:1px solid #000000;height:36px;width:16px;border-radius:3px;background:#ffffff;cursor:pointer}input[type="range"]::-ms-track{height:8.4px;cursor:pointer;background:transparent;border-color:transparent;border-width:16px 0;color:transparent}input[type="range"]::-ms-fill-lower{background:#2a6495;border:0.2px solid #010101;border-radius:2.6px;box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d}input[type="range"]::-ms-fill-upper{background:#3071a9;border:0.2px solid #010101;border-radius:2.6px;box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d}input[type="range"]::-ms-thumb{box-shadow:1px 1px 1px #000000, 0px 0px 1px #0d0d0d;border:1px solid #000000;height:36px;width:16px;border-radius:3px;background:#ffffff;cursor:pointer}input[type="range"]:focus::-ms-fill-lower{background:#3071a9}input[type="range"]:focus::-ms-fill-upper{background:#367ebd}.download-banner{margin:4rem 0}@media(min-width: 640px){main{max-width:600px}}</style>',j(this,{target:this.shadowRoot,props:b(this.attributes)},F,O,i,{},[-1,-1]),e&&e.target&&c(e.target,this,e.anchor)}});return new class extends class{$destroy(){R(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){this.$$set&&!a(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}{constructor(e){super(),j(this,e,null,I,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map

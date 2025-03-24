(()=>{var s={wages:{USD:10,CLP:7179,EUR:8.5,GBP:9.5,JPY:1500,CAD:13}};function m(e){let r=e.toUpperCase();return s.wages[r]?s.wages[r]:(console.warn(`Currency ${e} not configured, using USD as fallback`),s.wages.USD)}function p(e,r){let n=e/r,t=Math.floor(n),o=Math.round((n-t)*60);return{hours:t,minutes:o}}function f(e,r){let{hours:n,minutes:t}=e;return`${n}h ${t}m${r.startsWith("es")?" Tiempo de Trabajo":" Working Time"}`}var a=new WeakSet;function d(e,r){let n=m(e.currency),t=document.getElementsByClassName(r.priceSelector);Array.from(t).forEach(o=>{if(a.has(o))return;let c=o.nextElementSibling;if(c&&c.classList.contains("time-needed")){a.add(o);return}try{let i=r.getPriceElement(o);if(!i)return;let l=i.innerText;if(!l)return;let u=e.parsePrice(l);if(!u)return;let y=p(u,n),S=f(y,navigator.language),x=r.fontSize||"1rem",z=e.createDisplayElement(S,x);e.insertElement(i,z),a.add(o)}catch(i){console.error("Error processing price element:",i)}})}function g(e){let r=window.location.href;for(let n of e.pages)if(n.urlPattern.test(r))return n;return e.pages[e.pages.length-1]}var w={hostnames:["www.solotodo.cl"],pages:[{urlPattern:/^https?:\/\/www\.solotodo\.cl\/?$/,priceSelector:"MuiCardContent-root css-1njhssi",getPriceElement:function(e){try{return e.children[4]}catch(r){return console.error("Error finding price text in homepage card:",r),null}}},{urlPattern:/^https?:\/\/www\.solotodo\.cl\/products\/[^\/]+\/?$/,priceSelector:"MuiStack-root css-j7qwjs",fontSize:"0.7rem",getPriceElement:function(e){return e.children[1]}},{urlPattern:/^https?:\/\/www\.solotodo\.cl\/([^\/]+)\/?$/,priceSelector:"MuiCardContent-root css-1njhssi",getPriceElement:function(e){try{return e.children[2]}catch(r){return console.error("Error finding price text in category card:",r),null}}},{urlPattern:/.*/,priceSelector:"MuiTypography-root",getPriceElement:function(e){return null}}],parsePrice:function(e){if(!e)return 0;let r=e.replace(/[^\d]/g,"");return parseInt(r)||0},createDisplayElement:function(e,r){r===void 0&&(r="1rem");var n=document.createElement("div");return n.className="MuiTypography-root MuiTypography-h2 css-guehu2 time-needed",n.style.fontSize=r,n.style.fontWeight="normal",n.style.position="relative",n.innerHTML=e,n},insertElement:function(e,r){e.parentNode.insertBefore(r,e)},currency:"CLP"};var h={hostnames:["www.amazon.com","amazon.com","www.amazon.co.uk","amazon.co.uk","www.amazon.ca","amazon.ca","www.amazon.es","amazon.es"],pages:[{urlPattern:/^https?:\/\/www\.amazon\.(com|co\.uk|ca|es)\/$/,priceSelector:"a-price",getPriceElement:function(e){let r=e.getElementsByClassName("a-offscreen");return r.length===0?null:(console.log(r[0]),r[0])}},{urlPattern:/^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|es)\/(gp\/product\/|dp\/)[A-Z0-9]+(\?.*)?$/,priceSelector:"aok-offscreen",getPriceElement:function(e){return console.log("ProductPage or SearchPage"),console.log(e),e}},{urlPattern:/^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|es)\/s\?/,priceSelector:"a-price",getPriceElement:function(e){let r=e.getElementsByClassName("a-offscreen");return r.length===0?null:r[0]}},{urlPattern:/^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|es)\/s\?/,priceSelector:"a-price",getPriceElement:function(e){let r=e.querySelector(".a-price-whole"),n=e.querySelector(".a-price-fraction");if(r&&n){let t=document.createElement("span");return t.innerText=`${r.innerText}.${n.innerText}`,t}return null}},{urlPattern:/.*/,priceSelector:"null",getPriceElement:function(e){return null}}],parsePrice:function(e){if(!e)return 0;let r=window.location.hostname,n=r.includes("amazon.es")||r.includes("amazon.de")||r.includes("amazon.fr")||r.includes("amazon.it"),t=e.replace(/[^\d.,]/g,""),o;return n?t.includes(",")?o=parseFloat(t.replace(/\./g,"").replace(",",".")):o=parseInt(t.replace(/\./g,"")):t.includes(".")?(o=t.replaceAll(",",""),o=t.replace(/\./g,""),o=parseFloat(o.slice(0,-2)+"."+o.slice(-2))):t.length>2?o=parseFloat(t.slice(0,-2)+"."+t.slice(-2)):o=parseInt(t),o||0},createDisplayElement:function(e,r){r===void 0&&(r="0.9rem");var n=document.createElement("span");return n.className="a-size-base a-color-secondary time-needed",n.style.fontSize=r,n.style.display="block",n.style.marginTop="4px",n.innerHTML=e,n},insertElement:function(e,r){e.parentNode&&e.parentNode.insertBefore(r,e.nextSibling.nextSibling)},getCurrency:function(){let e=window.location.hostname;return e.includes("amazon.co.uk")?"GBP":e.includes("amazon.ca")?"CAD":e.includes("amazon.es")?"EUR":"USD"},get currency(){return this.getCurrency()}};var C=[w,h];function E(e){for(let r of C)if(r.hostnames.includes(e))return r;return null}console.log("Work Hour Extension loaded");function P(){let e=window.location.hostname,r=E(e);if(!r){console.warn(`No configuration found for ${e}`);return}let n=g(r);d(r,n)}function T(){P();let e=null,r=!1;new MutationObserver(t=>{r||!t.some(c=>c.addedNodes&&c.addedNodes.length>0)||(r=!0,e&&clearTimeout(e),e=setTimeout(()=>{P(),r=!1},1e3))}).observe(document.body,{childList:!0,subtree:!0})}T();})();

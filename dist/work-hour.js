(()=>{var i=typeof browser<"u"?browser.storage:chrome.storage,l=typeof browser<"u"?browser.runtime:chrome.runtime,u={USD:10,CLP:7179,EUR:8.5,GBP:9.5,JPY:1500,CAD:13},s={wages:{...u}};typeof i<"u"&&i&&(i.sync.get("workHourWages",function(e){e.workHourWages&&(console.log("Loaded work hour wages:",e.workHourWages),s.wages=e.workHourWages)}),i.onChanged.addListener(function(e,t){console.log(),t==="sync"&&e.workHourWages&&(console.log("Work hour wages updated:",e.workHourWages.newValue),s.wages=e.workHourWages.newValue,typeof window.processCurrentSite=="function"&&window.processCurrentSite())}));function y(e){let t=e.toUpperCase();return s.wages[t]?s.wages[t]:(console.warn(`Currency ${e} not configured, using USD as fallback`),s.wages.USD)}function m(e){return new Promise((t,r)=>{try{Object.entries(e).forEach(([o,n])=>{if(isNaN(parseFloat(n))||parseFloat(n)<=0)throw new Error(`Invalid wage for ${o}: ${n}`);e[o]=parseFloat(n)}),s.wages=e,typeof i<"u"&&i?i.sync.set({workHourWages:e},function(){l.lastError?r(l.lastError):t(!0)}):(localStorage.setItem("workHourWages",JSON.stringify(e)),t(!0))}catch(o){console.error("Error saving wages:",o),r(o)}})}function k(){return new Promise((e,t)=>{if(typeof i<"u"&&i)i.sync.get("workHourWages",function(r){l.lastError?t(l.lastError):e(r.workHourWages||null)});else try{let r=localStorage.getItem("workHourWages");e(r?JSON.parse(r):null)}catch(r){console.error("Error loading wages:",r),t(r)}})}function x(){return s.wages={...u},m(s.wages)}function c(){return Object.keys(s.wages)}function E(e,t){let r=e/t,o=Math.floor(r),n=Math.round((r-o)*60);return{hours:o,minutes:n}}function b(e,t){let{hours:r,minutes:o}=e;return`${r}h ${o}m${t.startsWith("es")?" Tiempo de Trabajo":" Working Time"}`}var p=new Set;function N(){document.querySelectorAll(".time-needed").forEach(t=>{t.remove()}),console.log("Cleared processed elements"),p.clear()}function S(e,t){N();let r=y(e.currency),o=document.getElementsByClassName(t.priceSelector);console.log("priceElements:",o),Array.from(o).forEach(n=>{if(p.has(n))return;let f=n.nextElementSibling;if(f&&f.classList.contains("time-needed")){p.add(n);return}try{let a=t.getPriceElement(n);if(console.log("priceElement:",a),!a)return;let w=a.innerText;if(!w)return;let h=e.parsePrice(w);if(!h)return;let z=E(h,r),T=b(z,navigator.language),H=t.fontSize||"1rem",$=e.createDisplayElement(T,H);e.insertElement(a,$),p.add(n)}catch(a){console.error("Error processing price element:",a)}})}function C(e){let t=window.location.href;console.log("currentUrl:",t);for(let r of e.pages)if(r.urlPattern.test(t))return console.log(`Matched URL pattern for ${r.urlPattern}`),r;return e.pages[e.pages.length-1]}var P={hostnames:["www.solotodo.cl"],pages:[{urlPattern:/^https?:\/\/www\.solotodo\.cl\/?$/,priceSelector:"MuiCardContent-root css-1njhssi",getPriceElement:function(e){try{return e.children[4]}catch(t){return console.error("Error finding price text in homepage card:",t),null}}},{urlPattern:/^https?:\/\/www\.solotodo\.cl\/products\/[^\/]+\/?$/,priceSelector:"MuiStack-root css-j7qwjs",fontSize:"0.7rem",getPriceElement:function(e){return e.children[1]}},{urlPattern:/^https?:\/\/www\.solotodo\.cl\/([^\/]+)\/?$/,priceSelector:"MuiCardContent-root css-1njhssi",getPriceElement:function(e){try{return e.children[2]}catch(t){return console.error("Error finding price text in category card:",t),null}}},{urlPattern:/.*/,priceSelector:"MuiTypography-root",getPriceElement:function(e){return null}}],parsePrice:function(e){if(!e)return 0;let t=e.replace(/[^\d]/g,"");return parseInt(t)||0},createDisplayElement:function(e,t){t===void 0&&(t="1rem");var r=document.createElement("div");return r.className="MuiTypography-root MuiTypography-h2 css-guehu2 time-needed",r.style.fontSize=t,r.style.fontWeight="normal",r.style.position="relative",r.innerHTML=e,r},insertElement:function(e,t){e.parentNode.insertBefore(t,e)},currency:"CLP"};var v={hostnames:["www.amazon.com","amazon.com","www.amazon.co.uk","amazon.co.uk","www.amazon.ca","amazon.ca","www.amazon.es","amazon.es"],pages:[{urlPattern:/^https?:\/\/www\.amazon\.(com|co\.uk|ca|es)\/$/,priceSelector:"a-price",getPriceElement:function(e){let t=e.getElementsByClassName("a-offscreen");return t.length===0?null:(console.log(t[0]),t[0])}},{urlPattern:/^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|es)\/.*\/dp\/[A-Z0-9]+/,priceSelector:"aok-offscreen",getPriceElement:function(e){return console.log("ProductPage or SearchPage"),console.log(e),e}},{urlPattern:/^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|es)\/s\?/,priceSelector:"a-price",getPriceElement:function(e){let t=e.getElementsByClassName("a-offscreen");return t.length===0?null:t[0]}},{urlPattern:/^https?:\/\/(www\.)?amazon\.(com|co\.uk|ca|es)\/s\?/,priceSelector:"a-price",getPriceElement:function(e){let t=e.querySelector(".a-price-whole"),r=e.querySelector(".a-price-fraction");if(t&&r){let o=document.createElement("span");return o.innerText=`${t.innerText}.${r.innerText}`,o}return null}},{urlPattern:/.*/,priceSelector:"null",getPriceElement:function(e){throw new Error("Fallback page not implemented")}}],parsePrice:function(e){if(!e)return 0;let t=window.location.hostname,r=t.includes("amazon.es")||t.includes("amazon.de")||t.includes("amazon.fr")||t.includes("amazon.it"),o=e.replace(/[^\d.,]/g,""),n;return r?o.includes(",")?n=parseFloat(o.replace(/\./g,"").replace(",",".")):n=parseInt(o.replace(/\./g,"")):o.includes(".")?(n=o.replaceAll(",",""),n=o.replace(/\./g,""),n=parseFloat(n.slice(0,-2)+"."+n.slice(-2))):o.length>2?n=parseFloat(o.slice(0,-2)+"."+o.slice(-2)):n=parseInt(o),n||0},createDisplayElement:function(e,t){t===void 0&&(t="0.9rem");var r=document.createElement("span");return r.className="a-size-base a-color-secondary time-needed",r.style.fontSize=t,r.style.display="block",r.style.marginTop="4px",r.innerHTML=e,r},insertElement:function(e,t){e.parentNode&&e.parentNode.insertBefore(t,e.nextSibling.nextSibling)},getCurrency:function(){let e=window.location.hostname;return e.includes("amazon.co.uk")?"GBP":e.includes("amazon.ca")?"CAD":e.includes("amazon.es")?"EUR":"USD"},get currency(){return this.getCurrency()}};var L=[P,v];function W(e){for(let t of L)if(t.hostnames.includes(e))return t;return null}var d=class{constructor(){this.isOpen=!1,this.panel=null,this.createPanel()}createPanel(){this.panel=document.createElement("div"),this.panel.className="work-hour-settings-panel",this.panel.style.display="none";let t=`
      .work-hour-settings-panel {
        position: fixed;
        top: 50px;
        right: 20px;
        width: 320px;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        border-radius: 8px;
        padding: 16px;
        z-index: 9999;
        font-family: Arial, sans-serif;
      }
      .work-hour-settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }
      .work-hour-settings-title {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
      }
      .work-hour-settings-close {
        cursor: pointer;
        font-size: 20px;
        color: #666;
      }
      .work-hour-settings-form {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .work-hour-settings-label {
        display: flex;
        align-items: center;
      }
      .work-hour-settings-input {
        width: 100%;
        padding: 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .work-hour-settings-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        padding-top: 8px;
        border-top: 1px solid #eee;
      }
      .work-hour-settings-button {
        padding: 6px 12px;
        cursor: pointer;
        border-radius: 4px;
        border: none;
      }
      .work-hour-settings-save {
        background: #4285f4;
        color: white;
      }
      .work-hour-settings-reset {
        background: #f44336;
        color: white;
      }
      .work-hour-settings-toggle {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9998;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
    `,r=document.createElement("style");r.textContent=t,document.head.appendChild(r),this.panel.innerHTML=`
      <div class="work-hour-settings-header">
        <h3 class="work-hour-settings-title">Work Hour Calculator Settings</h3>
        <span class="work-hour-settings-close">&times;</span>
      </div>
      <div class="work-hour-settings-form">
        ${this.buildCurrencyInputs()}
      </div>
      <div class="work-hour-settings-footer">
        <button class="work-hour-settings-button work-hour-settings-reset">Reset to Default</button>
        <button class="work-hour-settings-button work-hour-settings-save">Save</button>
      </div>
    `;let o=document.createElement("button");o.className="work-hour-settings-toggle",o.textContent="\u2699\uFE0F Work Hour",o.addEventListener("click",()=>this.toggle()),document.body.appendChild(this.panel),document.body.appendChild(o),this.panel.querySelector(".work-hour-settings-close").addEventListener("click",()=>this.close()),this.panel.querySelector(".work-hour-settings-save").addEventListener("click",()=>this.saveSettings()),this.panel.querySelector(".work-hour-settings-reset").addEventListener("click",()=>this.resetSettings())}buildCurrencyInputs(){return c().map(r=>`
      <label class="work-hour-settings-label">${r}:</label>
      <input 
        type="number" 
        class="work-hour-settings-input" 
        data-currency="${r}" 
        value="${s.wages[r]}" 
        min="0.01" 
        step="0.01"
      >
    `).join("")}toggle(){this.isOpen?this.close():this.open()}open(){this.panel.style.display="block",this.isOpen=!0,c().forEach(t=>{let r=this.panel.querySelector(`input[data-currency="${t}"]`);r&&(r.value=s.wages[t])})}close(){this.panel.style.display="none",this.isOpen=!1}saveSettings(){let t={};c().forEach(r=>{let o=this.panel.querySelector(`input[data-currency="${r}"]`);o&&(t[r]=parseFloat(o.value))}),m(t)?(alert("Wage settings saved successfully!"),this.close(),typeof processCurrentSite=="function"&&processCurrentSite()):alert("Error saving settings. Please check your input values.")}resetSettings(){confirm("Reset all wage settings to default values?")&&(x(),c().forEach(t=>{let r=this.panel.querySelector(`input[data-currency="${t}"]`);r&&(r.value=u[t])}),alert("Settings reset to default values."),typeof processCurrentSite=="function"&&processCurrentSite())}};console.log("Work Hour Extension loaded");var M=typeof browser<"u"?browser.runtime:chrome.runtime;function g(){let e=window.location.hostname,t=W(e);if(!t){console.warn(`No configuration found for ${e}`);return}let r=C(t);S(t,r)}function F(){let e=new d;window.processCurrentSite=g,g();let t=null,r=!1;new MutationObserver(n=>{r||!n.some(a=>a.addedNodes&&a.addedNodes.length>0)||(r=!0,t&&clearTimeout(t),t=setTimeout(()=>{g(),r=!1},1e3))}).observe(document.body,{childList:!0,subtree:!0})}async function q(){try{let e=await k();e&&(s.wages=e,g())}catch(e){console.error("Error reloading settings:",e)}}M.onMessage.addListener(function(e,t,r){return e.action==="refreshCalculations"&&q(),!0});F();})();

import{g as xe}from"./phones-BnMkZt1Z.js";document.addEventListener("DOMContentLoaded",()=>{let Y=window.innerWidth/2,Z=window.innerHeight/3,J=!1;const ee=()=>{document.documentElement.style.setProperty("--mouse-x",`${Y}px`),document.documentElement.style.setProperty("--mouse-y",`${Z}px`),J=!1};window.addEventListener("mousemove",t=>{Y=t.clientX,Z=t.clientY,J||(window.requestAnimationFrame(ee),J=!0)},{passive:!0}),ee();const B=document.getElementById("toast-notification");let _=null;function w(t,e=3e3){B&&(B.textContent=t,B.classList.add("show"),_&&clearTimeout(_),_=setTimeout(()=>{B.classList.remove("show")},e))}let h=[];const i={selectedCategory:"all",activeFilterTags:new Set,searchQuery:"",sortBy:"score-desc",comparisonList:[],diffOnly:!1,quizAnswers:{useCase:null,dealbreaker:null,budget:null},currentQuizStep:1},I=document.getElementById("phones-grid"),q=document.getElementById("phone-search-input"),T=document.getElementById("phone-sort-select"),te=document.getElementById("filter-result-count"),F=document.getElementById("reset-filters-btn"),ae=document.querySelectorAll(".chip-btn"),ze=document.querySelectorAll(".category-card"),z=document.getElementById("active-filters-bar"),O=document.getElementById("compare-drawer"),re=document.getElementById("compare-selected-list"),Ie=document.querySelectorAll(".compare-count-badge"),se=document.getElementById("open-compare-modal-btn"),ie=document.getElementById("clear-compare-btn"),ne=document.getElementById("header-compare-btn"),N=document.getElementById("compare-modal");document.getElementById("spec-detail-modal");const Ae=document.querySelectorAll(".step-indicator"),qe=document.querySelectorAll(".quiz-step-content"),ce=document.querySelectorAll(".quiz-option-card"),A=document.getElementById("quiz-next-btn"),H=document.getElementById("quiz-prev-btn"),M=document.getElementById("quiz-results-view"),oe=document.getElementById("restart-quiz-btn"),le=document.getElementById("hero-matchup-stage"),de=document.querySelectorAll(".matchup-pill-btn"),me=document.getElementById("hero-launch-matrix-btn"),y=document.getElementById("deck-phone-1"),v=document.getElementById("deck-phone-2"),k=document.getElementById("deck-phone-3"),pe=document.getElementById("deck-compare-submit-btn"),Be=document.querySelectorAll(".deck-preset-tag"),ue=document.getElementById("deck-search-filter"),fe=document.getElementById("deck-swap-btn");let G=["samsung-galaxy-s24-ultra","iphone-15-pro-max"];const he={"s24u-vs-15pm":["samsung-galaxy-s24-ultra","iphone-15-pro-max"],"op12-vs-iqoo12":["oneplus-12","iqoo-12"],"poco-vs-nord":["poco-f6","oneplus-nord-4"]};function P(){try{const t=i.comparisonList.map(r=>r.id),e=new URL(window.location);t.length>=2?e.searchParams.set("compare",t.join(",")):e.searchParams.delete("compare"),window.history.replaceState(null,"",e.toString())}catch{}}function Te(){try{const e=new URLSearchParams(window.location.search).get("compare");if(e&&h.length>0){const s=e.split(",").map(c=>c.trim()).filter(Boolean).map(c=>h.find(m=>m.id===c)).filter(Boolean);s.length>=2&&(i.comparisonList=s.slice(0,3),E(),g(),C())}}catch(t){console.warn("URL comparison parsing error:",t)}}function R(t,e){if(!le||h.length===0)return;const r=h.find(o=>o.id===t)||h[0],s=h.find(o=>o.id===e)||h[1];if(!r||!s)return;G=[r.id,s.id];const c=r.antutu>=s.antutu,m=(r.battery.capacityNum||0)>=(s.battery.capacityNum||0);le.innerHTML=`
      <div class="matchup-dual-header">
        <div class="matchup-phone-col">
          <span class="matchup-phone-brand">${r.brand}</span>
          <h3 class="matchup-phone-title">${r.name}</h3>
          <span class="matchup-phone-price">${r.priceFormatted||"₹"+Number(r.price).toLocaleString("en-IN")}</span>
        </div>
        <div class="matchup-vs-badge">VS</div>
        <div class="matchup-phone-col" style="text-align: right;">
          <span class="matchup-phone-brand">${s.brand}</span>
          <h3 class="matchup-phone-title">${s.name}</h3>
          <span class="matchup-phone-price">${s.priceFormatted||"₹"+Number(s.price).toLocaleString("en-IN")}</span>
        </div>
      </div>

      <table class="matchup-metrics-table">
        <tbody>
          <tr>
            <td class="matchup-metric-label">Compute Silicon</td>
            <td class="matchup-val-cell">${r.processor.split("(")[0].trim()}</td>
            <td class="matchup-val-cell" style="text-align: right;">${s.processor.split("(")[0].trim()}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">AnTuTu Score</td>
            <td class="matchup-val-cell ${c?"winner":""}">${r.antutuFormatted} ${c?"★":""}</td>
            <td class="matchup-val-cell ${c?"":"winner"}" style="text-align: right;">${c?"":"★ "}${s.antutuFormatted}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">Display & Hz</td>
            <td class="matchup-val-cell">${r.display.size} ${r.display.refresh}</td>
            <td class="matchup-val-cell" style="text-align: right;">${s.display.size} ${s.display.refresh}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">Battery Cell</td>
            <td class="matchup-val-cell ${m?"winner":""}">${r.battery.capacity}</td>
            <td class="matchup-val-cell ${m?"":"winner"}" style="text-align: right;">${s.battery.capacity}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">Primary Camera</td>
            <td class="matchup-val-cell">${r.camera.main}</td>
            <td class="matchup-val-cell" style="text-align: right;">${s.camera.main}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">OS / Software</td>
            <td class="matchup-val-cell">${r.os.name}</td>
            <td class="matchup-val-cell" style="text-align: right;">${s.os.name}</td>
          </tr>
        </tbody>
      </table>
    `}function Fe(){de.forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.matchup;if(de.forEach(r=>r.classList.remove("active")),t.classList.add("active"),he[e]){const[r,s]=he[e];R(r,s),y&&(y.value=r),v&&(v.value=s),k&&(k.value="")}})}),me&&me.addEventListener("click",()=>{const t=h.find(r=>r.id===G[0]),e=h.find(r=>r.id===G[1]);t&&e&&(i.comparisonList=[t,e],E(),g(),C())})}function ge(t=""){if(!y||!v||!k||h.length===0)return;const e=y.value||"samsung-galaxy-s24-ultra",r=v.value||"iphone-15-pro-max",s=k.value||"",c=t.trim()?h.filter(o=>{const p=t.toLowerCase();return o.name.toLowerCase().includes(p)||o.brand.toLowerCase().includes(p)||o.processor.toLowerCase().includes(p)}):h,m=(o,p=!1)=>{let n=p?'<option value="">+ 3rd Phone (Optional)</option>':'<option value="">Select Phone...</option>';return[...new Set(c.map(u=>u.brand))].sort().forEach(u=>{n+=`<optgroup label="${u}">`,c.filter(d=>d.brand===u).forEach(d=>{const b=d.id===o?"selected":"",L=d.priceFormatted||"₹"+Number(d.price).toLocaleString("en-IN");n+=`<option value="${d.id}" ${b}>${d.name} (${L})</option>`}),n+="</optgroup>"}),n};y.innerHTML=m(e),v.innerHTML=m(r),k.innerHTML=m(s,!0),!y.value&&c.length>0&&(y.value=c[0].id),!v.value&&c.length>1&&(v.value=c[1].id)}function Oe(){const t=()=>{const e=y?y.value:"",r=v?v.value:"";e&&r&&e!==r&&R(e,r)};y&&y.addEventListener("change",t),v&&v.addEventListener("change",t),fe&&fe.addEventListener("click",()=>{if(!y||!v)return;const e=y.value,r=v.value;y.value=r,v.value=e,t()}),ue&&ue.addEventListener("input",e=>{ge(e.target.value)}),pe&&pe.addEventListener("click",()=>{const e=y?y.value:"",r=v?v.value:"",s=k?k.value:"";if(!e||!r){alert("Please select at least two distinct smartphones to compare.");return}if(e===r||s&&(s===e||s===r)){alert("Please select different smartphones for each slot.");return}const c=[e,r];s&&c.push(s),i.comparisonList=c.map(m=>h.find(o=>o.id===m)).filter(Boolean),E(),g(),C()}),Be.forEach(e=>{e.addEventListener("click",()=>{const r=e.dataset.p1,s=e.dataset.p2;y&&(y.value=r),v&&(v.value=s),k&&(k.value=""),R(r,s);const c=h.find(o=>o.id===r),m=h.find(o=>o.id===s);c&&m&&(i.comparisonList=[c,m],E(),g(),C())})})}function Ne(){if(!z)return;const t=i.selectedCategory!=="all",e=i.activeFilterTags.size>0,r=i.searchQuery.length>0;if(!t&&!e&&!r){z.style.display="none",z.innerHTML="";return}z.style.display="flex";const s={"flagship-killers":"Flagship Killers","compact-performers":"Compact Performers","battery-titans":"Battery Titans","camera-mavericks":"Camera Mavericks","clean-software":"Clean Software","headphone-jack-saviors":"3.5mm Headphone Jack"},c={"flat-display":"Flat Display Only",ois:"Hardware OIS","headphone-jack":"3.5mm Jack Included","battery-5000":"5000mAh+ Cell","antutu-650k":"AnTuTu > 650k","clean-os":"Clean Stock OS",compact:'Compact (<6.4")'};let m='<span class="active-filters-title">Active Filters:</span>';t&&(m+=`
        <span class="active-filter-pill">
          Archetype: ${s[i.selectedCategory]||i.selectedCategory}
          <span class="active-filter-remove" data-remove-cat="${i.selectedCategory}" title="Clear category filter">✕</span>
        </span>
      `);for(let o of i.activeFilterTags)m+=`
        <span class="active-filter-pill">
          ${c[o]||o}
          <span class="active-filter-remove" data-remove-tag="${o}" title="Remove constraint">✕</span>
        </span>
      `;r&&(m+=`
        <span class="active-filter-pill">
          Search: "${i.searchQuery}"
          <span class="active-filter-remove" data-clear-search="true" title="Clear search query">✕</span>
        </span>
      `),z.innerHTML=m,z.querySelectorAll("[data-remove-cat]").forEach(o=>{o.addEventListener("click",()=>{i.selectedCategory="all",document.querySelectorAll('.chip-btn[data-type="category"]').forEach(p=>{p.classList.toggle("active",p.dataset.filter==="all")}),g()})}),z.querySelectorAll("[data-remove-tag]").forEach(o=>{o.addEventListener("click",()=>{const p=o.dataset.removeTag;i.activeFilterTags.delete(p);const n=document.querySelector(`.chip-btn[data-type="spec"][data-filter="${p}"]`);n&&n.classList.remove("active"),g()})}),z.querySelectorAll("[data-clear-search]").forEach(o=>{o.addEventListener("click",()=>{i.searchQuery="",q&&(q.value=""),g()})})}let j=null;async function g(){if(!I)return;j&&j.abort(),j=new AbortController;const t=j.signal;Ne(),I.innerHTML=`
      <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px solid var(--border-light); background-color: var(--bg-card); position: relative; z-index: 2;">
        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); display: inline-flex; align-items: center; justify-content: center; gap: 0.65rem;">
          <span class="spinner"></span>
          <span>Querying verified hardware specifications...</span>
        </div>
      </div>
    `;try{const r=(await xe({category:i.selectedCategory,activeFilterTags:i.activeFilterTags,searchQuery:i.searchQuery,sortBy:i.sortBy},{signal:t})).data||[];if(te&&(te.textContent=`Showing ${r.length} of ${h.length||27} curated devices`),r.length===0){I.innerHTML=`
          <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px solid var(--border-light); background-color: var(--bg-card); position: relative; z-index: 2;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 0.5rem;">0 MATCHES FOUND</div>
            <h3 style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--text-primary); margin-bottom: 1rem;">No device satisfies all selected constraints.</h3>
            <p style="font-size: 0.9375rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem auto;">Try removing one of the strict hardware filters (e.g. 3.5mm jack or compact dimensions) to expand results.</p>
            <button class="btn btn-primary btn-sm" id="empty-state-reset-btn">Reset All Criteria</button>
          </div>
        `;const s=document.getElementById("empty-state-reset-btn");s&&F&&s.addEventListener("click",()=>F.click());return}I.innerHTML=r.map(s=>{const c=i.comparisonList.some(m=>m.id===s.id);return`
          <article class="phone-card" data-id="${s.id}">
            <div class="phone-card-top">
              <div>
                <div class="phone-brand-series">${s.brand} · ${s.series}</div>
                <h3 class="phone-title">${s.name}</h3>
              </div>
              <div class="antutu-pill" title="Verified AnTuTu V10 Lab Benchmark">
                ★ ${s.antutuFormatted}
              </div>
            </div>

            <div class="phone-specs-grid">
              <div class="spec-cell">
                <span class="spec-cell-label">SoC</span>
                <span class="spec-cell-val">${s.processor.split("(")[0].trim()}</span>
              </div>
              <div class="spec-cell">
                <span class="spec-cell-label">Display</span>
                <span class="spec-cell-val">${s.display.size} ${s.isFlat?"Flat":"Curved"} ${s.display.refresh}</span>
              </div>
              <div class="spec-cell">
                <span class="spec-cell-label">Battery</span>
                <span class="spec-cell-val">${s.battery.capacity} (${s.battery.charging.split("(")[0].trim()})</span>
              </div>
              <div class="spec-cell">
                <span class="spec-cell-label">Main Camera</span>
                <span class="spec-cell-val">${s.camera.main} ${s.camera.ois?"(OIS)":""}</span>
              </div>
            </div>

            <div class="phone-badges-row">
              ${s.isFlat?'<span class="spec-badge highlight">Flat AMOLED</span>':""}
              ${s.hasOIS?'<span class="spec-badge highlight">Hardware OIS</span>':""}
              ${s.hasJack?'<span class="spec-badge highlight">3.5mm Jack</span>':""}
              ${s.isCleanOS?'<span class="spec-badge highlight">Clean OS</span>':""}
              ${s.ipRating?`<span class="spec-badge">${s.ipRating}</span>`:""}
            </div>

            <div class="phone-card-footer">
              <div class="phone-price-tag">
                <span class="tier">${s.categoryName}</span>
                <span class="amount">${s.priceFormatted||"₹"+Number(s.price).toLocaleString("en-IN")}</span>
              </div>

              <div class="phone-actions">
                <label class="compare-checkbox-label ${c?"selected":""}" title="Add to comparison tray">
                  <input type="checkbox" data-compare-id="${s.id}" ${c?"checked":""}>
                  <span>${c?"Comparing":"Compare"}</span>
                </label>
                <a href="phone.html?id=${s.id}" target="_blank" class="btn btn-outline btn-sm view-spec-btn" data-spec-id="${s.id}">
                  Specs
                </a>
              </div>
            </div>
          </article>
        `}).join(""),He()}catch(e){if(e.name==="AbortError")return;console.error("[RE-CONE] Query exception:",e),I.innerHTML=`
        <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px solid var(--border-dark); background-color: var(--bg-card); position: relative; z-index: 2;">
          <div class="eyebrow" style="color: #ff5555; margin-bottom: 0.5rem;">DATABASE NOTICE</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.75rem;">Failed to load hardware specifications</h3>
          <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem auto;">${e.message||"The database query was interrupted or encountered a network timeout."}</p>
          <button class="btn btn-primary btn-sm" id="retry-query-btn">↻ Retry Query</button>
        </div>
      `;const r=document.getElementById("retry-query-btn");r&&r.addEventListener("click",()=>g())}}function ye(t){const s=Math.max(0,Math.round((window.screen.width-720)/2)),c=Math.max(0,Math.round((window.screen.height-860)/2)),m=`phone.html?id=${encodeURIComponent(t)}`,o=window.open(m,`recone_spec_${t.replace(/[^a-zA-Z0-9]/g,"_")}`,`width=720,height=860,top=${c},left=${s},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`);!o||o.closed||typeof o.closed>"u"?window.open(m,"_blank"):o.focus()}function He(){document.querySelectorAll("input[data-compare-id]").forEach(t=>{t.addEventListener("change",e=>{const r=e.target.dataset.compareId,s=h.find(c=>c.id===r);if(s){if(e.target.checked){if(i.comparisonList.length>=3){w("Comparison tray limit reached (max 3 devices)."),e.target.checked=!1;return}i.comparisonList.some(c=>c.id===r)||(i.comparisonList.push(s),w(`Added ${s.name} to comparison tray.`))}else i.comparisonList=i.comparisonList.filter(c=>c.id!==r),w(`Removed ${s.name} from comparison tray.`);P(),E(),g()}})}),document.querySelectorAll(".view-spec-btn").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const r=t.dataset.specId;ye(r)})})}if(q){let t=null;q.addEventListener("input",e=>{clearTimeout(t),t=setTimeout(()=>{i.searchQuery=e.target.value.toLowerCase().trim(),g()},150)})}T&&T.addEventListener("change",t=>{i.sortBy=t.target.value,g()}),F&&F.addEventListener("click",()=>{i.searchQuery="",q&&(q.value=""),i.selectedCategory="all",i.activeFilterTags.clear(),i.sortBy="score-desc",T&&(T.value="score-desc"),ae.forEach(t=>{t.dataset.filter==="all"&&t.dataset.type==="category"?t.classList.add("active"):t.classList.remove("active")}),g(),w("Filters reset to all devices.")}),ae.forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.type,r=t.dataset.filter;e==="category"?(document.querySelectorAll('.chip-btn[data-type="category"]').forEach(s=>s.classList.remove("active")),t.classList.add("active"),i.selectedCategory=r):e==="spec"&&(i.activeFilterTags.has(r)?(i.activeFilterTags.delete(r),t.classList.remove("active")):(i.activeFilterTags.add(r),t.classList.add("active"))),g()})}),ze.forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.category;i.selectedCategory=e,document.querySelectorAll('.chip-btn[data-type="category"]').forEach(s=>{s.dataset.filter===e?s.classList.add("active"):s.classList.remove("active")}),g();const r=document.getElementById("spec-matrix-explorer");r&&r.scrollIntoView({behavior:"smooth"})})});function E(){const t=i.comparisonList.length;Ie.forEach(e=>{e.textContent=t}),t>0?O&&O.classList.add("open"):O&&O.classList.remove("open"),re&&(re.innerHTML=i.comparisonList.map(e=>`
        <span class="compare-pill-tag">
          ${e.name}
          <span class="compare-remove-btn" data-remove-compare="${e.id}" title="Remove device">✕</span>
        </span>
      `).join(""),document.querySelectorAll("[data-remove-compare]").forEach(e=>{e.addEventListener("click",r=>{const s=r.target.dataset.removeCompare;i.comparisonList=i.comparisonList.filter(c=>c.id!==s),P(),E(),g()})}))}ie&&ie.addEventListener("click",()=>{i.comparisonList=[],P(),E(),g(),w("Comparison tray cleared.")}),se&&se.addEventListener("click",()=>{if(i.comparisonList.length<2){w("Please select at least 2 devices to compare.");return}C()}),ne&&ne.addEventListener("click",()=>{if(i.comparisonList.length<2){const t=document.getElementById("quick-compare-bar")||document.getElementById("spec-matrix-explorer");t&&t.scrollIntoView({behavior:"smooth"}),w("Select 2 or 3 phones to initiate comparison matrix.")}else C()});function Me(t){if(t.length<2)return{};let e=-1;t.forEach(p=>{p.antutu>e&&(e=p.antutu)});let r=-1;t.forEach(p=>{const n=p.battery.capacityNum||0;n>r&&(r=n)});let s=-1;t.forEach(p=>{const n=(p.battery.charging||"").match(/(\d+)\s*W/i),l=n?parseInt(n[1]):0;l>s&&(s=l)});let c=999;t.forEach(p=>{const n=(p.weight||"").match(/(\d+(\.\d+)?)/),l=n?parseFloat(n[1]):999;l<c&&(c=l)});let m=9999999;t.forEach(p=>{p.price<m&&(m=p.price)});let o=0;return t.forEach(p=>{const n=(p.display.refresh||"").match(/(\d+)\s*Hz/i),l=n?parseInt(n[1]):60;l>o&&(o=l)}),{maxAntutu:e,maxBattery:r,maxCharging:s,minWeight:c,minPrice:m,maxRefresh:o}}function Pe(t){if(t.length<2)return"";const e=[...t].sort((o,p)=>p.antutu-o.antutu)[0],r=[...t].sort((o,p)=>(p.battery.capacityNum||0)-(o.battery.capacityNum||0))[0],s=[...t].sort((o,p)=>o.price-p.price)[0],c=[...t].sort((o,p)=>(parseInt(o.weight)||999)-(parseInt(p.weight)||999))[0];let m=[];return m.push(`<strong>Raw Silicon Horsepower:</strong> ${e.name} takes the computational crown with ${e.antutuFormatted} AnTuTu score driven by ${e.processor.split("(")[0].trim()}.`),r.id!==e.id&&m.push(`<strong>Endurance & Longevity:</strong> ${r.name} provides superior power security with a ${r.battery.capacity} cell and ${r.battery.charging}.`),m.push(`<strong>Ergonomic Handfeel:</strong> ${c.name} is the most pocketable daily driver at ${c.weight} with a ${c.display.size} ${c.isFlat?"flat":"curved"} display.`),m.push(`<strong>Value Proposition:</strong> ${s.name} (${s.priceFormatted||"₹"+s.price}) delivers the highest hardware specification-to-rupee ratio in this clash.`),m.map(o=>`<p style="margin-bottom: 0.5rem;">${o}</p>`).join("")}function C(){if(!N)return;const t=N.querySelector(".modal-content-slot");if(!t)return;const e=i.comparisonList;if(e.length<2){w("Select at least two devices to compare.");return}P();const r=Me(e),s=Pe(e),c=a=>a.antutu===r.maxAntutu&&e.filter(f=>f.antutu===r.maxAntutu).length<e.length,m=a=>(a.battery.capacityNum||0)===r.maxBattery&&e.filter(f=>(f.battery.capacityNum||0)===r.maxBattery).length<e.length,o=a=>{const f=(a.battery.charging||"").match(/(\d+)\s*W/i),$=f?parseInt(f[1]):0;return $===r.maxCharging&&e.filter(x=>((x.battery.charging||"").match(/(\d+)\s*W/i)||[0,0])[1]==$).length<e.length},p=a=>{const f=(a.weight||"").match(/(\d+(\.\d+)?)/),$=f?parseFloat(f[1]):999;return $===r.minWeight&&e.filter(x=>{var Ce;return parseFloat((Ce=(x.weight||"").match(/(\d+(\.\d+)?)/))==null?void 0:Ce[1])==$}).length<e.length},n=a=>a.price===r.minPrice&&e.filter(f=>f.price===r.minPrice).length<e.length,l=a=>{const f=(a.display.refresh||"").match(/(\d+)\s*Hz/i),$=f?parseInt(f[1]):60;return $===r.maxRefresh&&e.filter(x=>((x.display.refresh||"").match(/(\d+)\s*Hz/i)||[0,0])[1]==$).length<e.length},u=a=>{const f=a(e[0]);return e.every($=>a($)===f)},d=u(a=>a.antutu),b=u(a=>a.processor),L=u(a=>`${a.display.size} ${a.display.type} ${a.isFlat?"Flat":"Curved"}`),V=u(a=>a.display.refresh),W=u(a=>`${a.battery.capacity} ${a.battery.charging}`),be=u(a=>`${a.camera.main} ${a.hasOIS}`),X=u(a=>a.hasJack),U=u(a=>a.os.name),$e=u(a=>a.os.updates),we=u(a=>a.ipRating),Le=u(a=>a.weight),je=h.filter(a=>!e.some(f=>f.id===a.id)),De=e.length<3?`
      <th style="vertical-align: middle; text-align: center; background-color: var(--bg-card); min-width: 170px;">
        <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.5rem;">+ ADD 3RD PHONE</div>
        <select id="modal-add-phone-select" class="deck-select" style="font-size: 0.72rem; padding: 0.4rem;">
          <option value="">Select Device...</option>
          ${je.map(a=>`<option value="${a.id}">${a.name} (${a.priceFormatted||"₹"+a.price})</option>`).join("")}
        </select>
      </th>
    `:"",S=e.length<3?'<td style="background-color: var(--bg-secondary); text-align: center; color: var(--text-muted); font-size: 0.75rem;">—</td>':"";t.innerHTML=`
      <div class="spec-modal-header">
        <div class="eyebrow">Direct Technical Audit // 2026 Verified Standards</div>
        <h2 class="spec-modal-title">Side-by-Side Hardware Matrix</h2>
        <p class="spec-modal-sub">Comparing ${e.length} curated devices with automatic category winner highlights and trade-off synthesis.</p>
      </div>

      <!-- Comparison Toolbar -->
      <div class="compare-toolbar">
        <label class="compare-diff-toggle" title="Hide rows where all selected devices have identical specifications">
          <input type="checkbox" id="diff-only-checkbox" ${i.diffOnly?"checked":""}>
          <span>Show Differences Only</span>
        </label>

        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button type="button" class="share-compare-btn" id="copy-compare-link-btn" title="Copy shareable link with current selection">
            🔗 Copy Shareable Link
          </button>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
            (${e.length}/3 Devices)
          </span>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="compare-matrix-table" id="compare-matrix-table-el">
          <thead>
            <tr>
              <th scope="col">Specification</th>
              ${e.map(a=>`
                <th scope="col" class="col-header-cell">
                  <button class="col-remove-btn" data-drop-compare="${a.id}" title="Remove ${a.name} from comparison">✕</button>
                  <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${a.name}</div>
                  <div style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); font-size: 0.85rem;">
                    ${a.priceFormatted||"₹"+Number(a.price).toLocaleString("en-IN")}
                    ${n(a)?'<span class="winner-badge-pill">★ Best Value</span>':""}
                  </div>
                </th>
              `).join("")}
              ${De}
            </tr>
          </thead>
          <tbody>
            <tr class="spec-row ${d?"identical-row":""} ${d&&i.diffOnly?"hidden-diff":""}">
              <td>AnTuTu V10 Lab Benchmark</td>
              ${e.map(a=>`
                <td class="${c(a)?"winner-cell":""}">
                  <strong>${a.antutuFormatted}</strong> (~${a.antutu.toLocaleString()} pts)
                  ${c(a)?'<span class="winner-badge-pill">★ Winner</span>':""}
                </td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${b?"identical-row":""} ${b&&i.diffOnly?"hidden-diff":""}">
              <td>Processor Silicon</td>
              ${e.map(a=>`
                <td>
                  <strong>${a.processor}</strong><br>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${a.ram} · ${a.storage}</span>
                </td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${L?"identical-row":""} ${L&&i.diffOnly?"hidden-diff":""}">
              <td>Display Architecture</td>
              ${e.map(a=>`
                <td>
                  ${a.display.size} ${a.display.type}<br>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${a.display.resolution} (${a.isFlat?"100% Flat":"Curved"})</span>
                </td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${V?"identical-row":""} ${V&&i.diffOnly?"hidden-diff":""}">
              <td>Refresh Rate & Lumens</td>
              ${e.map(a=>`
                <td class="${l(a)?"winner-cell":""}">
                  <strong>${a.display.refresh}</strong> · ${a.display.brightness}
                  ${l(a)?'<span class="winner-badge-pill">★ Winner</span>':""}
                </td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${W?"identical-row":""} ${W&&i.diffOnly?"hidden-diff":""}">
              <td>Battery & Fast Charging</td>
              ${e.map(a=>`
                <td class="${m(a)||o(a)?"winner-cell":""}">
                  <strong>${a.battery.capacity}</strong>
                  ${m(a)?'<span class="winner-badge-pill">★ Max mAh</span>':""}<br>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${a.battery.charging}</span>
                  ${o(a)?'<span class="winner-badge-pill">★ Fastest</span>':""}
                </td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${be?"identical-row":""} ${be&&i.diffOnly?"hidden-diff":""}">
              <td>Optics & Stabilization</td>
              ${e.map(a=>`
                <td>
                  <strong>${a.camera.main}</strong><br>
                  <span style="font-weight:600; color:var(--text-primary); font-size:0.75rem;">${a.hasOIS?"✓ Hardware OIS":"✕ EIS Only"}</span><br>
                  <span style="color:var(--text-muted); font-size:0.72rem;">${a.camera.secondary}</span>
                </td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${X?"identical-row":""} ${X&&i.diffOnly?"hidden-diff":""}">
              <td>3.5mm Headphone Jack</td>
              ${e.map(a=>`
                <td class="${a.hasJack?"winner-cell":""}">
                  <strong>${a.hasJack?"✓ Included (Analog Audio)":"✕ No 3.5mm Jack"}</strong>
                  ${a.hasJack&&!X?'<span class="winner-badge-pill">★ Feature</span>':""}
                </td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${U?"identical-row":""} ${U&&i.diffOnly?"hidden-diff":""}">
              <td>OS & Software Experience</td>
              ${e.map(a=>`
                <td class="${a.isCleanOS&&!U?"winner-cell":""}">
                  <strong>${a.os.name}</strong><br>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${a.os.bloatware}</span>
                  ${a.isCleanOS&&!U?'<span class="winner-badge-pill">★ Clean OS</span>':""}
                </td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${$e?"identical-row":""} ${$e&&i.diffOnly?"hidden-diff":""}">
              <td>Software Lifecycle</td>
              ${e.map(a=>`
                <td><strong>${a.os.updates}</strong></td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${we?"identical-row":""} ${we&&i.diffOnly?"hidden-diff":""}">
              <td>Ingress Submersion</td>
              ${e.map(a=>`
                <td><strong>${a.ipRating}</strong></td>
              `).join("")}
              ${S}
            </tr>

            <tr class="spec-row ${Le?"identical-row":""} ${Le&&i.diffOnly?"hidden-diff":""}">
              <td>Chassis Weight & Build</td>
              ${e.map(a=>{var f;return`
                <td class="${p(a)?"winner-cell":""}">
                  <strong>${a.weight}</strong>
                  ${p(a)?'<span class="winner-badge-pill">★ Lightest</span>':""}<br>
                  <span style="color:var(--text-muted); font-size:0.72rem;">${((f=a.build)==null?void 0:f.material)||""}</span>
                </td>
              `}).join("")}
              ${S}
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dynamic Automated Verdict Box -->
      <div class="compare-verdict-box">
        <div class="compare-verdict-title">
          <span>RE-CONE Technical Verdict // Synthesis</span>
        </div>
        <div class="compare-verdict-body">
          ${s}
        </div>
      </div>
    `;const Ee=t.querySelector("#diff-only-checkbox");Ee&&Ee.addEventListener("change",a=>{i.diffOnly=a.target.checked,t.querySelectorAll("tr.identical-row").forEach(f=>{f.classList.toggle("hidden-diff",i.diffOnly)})});const Se=t.querySelector("#copy-compare-link-btn");Se&&Se.addEventListener("click",()=>{const a=window.location.href;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(a).then(()=>{w("✓ Comparison link copied to clipboard!")}).catch(()=>{prompt("Copy comparison URL:",a)}):prompt("Copy comparison URL:",a)}),t.querySelectorAll("[data-drop-compare]").forEach(a=>{a.addEventListener("click",f=>{const $=f.target.dataset.dropCompare;i.comparisonList=i.comparisonList.filter(x=>x.id!==$),E(),g(),i.comparisonList.length>=2?C():(N.classList.remove("active"),w("Comparison requires at least 2 phones."))})});const ke=t.querySelector("#modal-add-phone-select");ke&&ke.addEventListener("change",a=>{const f=a.target.value;if(!f)return;const $=h.find(x=>x.id===f);$&&i.comparisonList.length<3&&(i.comparisonList.push($),E(),g(),C(),w(`Added ${$.name} to comparison.`))}),N.classList.add("active")}document.querySelectorAll(".modal-close-btn, .modal-overlay").forEach(t=>{t.addEventListener("click",e=>{(e.target===t||e.target.closest(".modal-close-btn"))&&document.querySelectorAll(".modal-overlay").forEach(r=>r.classList.remove("active"))})}),window.addEventListener("keydown",t=>{t.key==="Escape"&&document.querySelectorAll(".modal-overlay.active").forEach(e=>{e.classList.remove("active")})}),ce.forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.step,r=t.dataset.value,s=t.closest(".quiz-options-grid");s&&s.querySelectorAll(".quiz-option-card").forEach(c=>c.classList.remove("selected")),t.classList.add("selected"),e==="1"&&(i.quizAnswers.useCase=r),e==="2"&&(i.quizAnswers.dealbreaker=r),e==="3"&&(i.quizAnswers.budget=r),A&&(A.disabled=!1)})}),A&&A.addEventListener("click",()=>{i.currentQuizStep<3?(i.currentQuizStep++,K()):Re()}),H&&H.addEventListener("click",()=>{i.currentQuizStep>1&&(i.currentQuizStep--,K())}),oe&&oe.addEventListener("click",()=>{i.currentQuizStep=1,i.quizAnswers={useCase:null,dealbreaker:null,budget:null},ce.forEach(e=>e.classList.remove("selected")),M&&M.classList.remove("active");const t=document.querySelector(".quiz-step-container");t&&(t.style.display="block"),K()});function K(){if(qe.forEach(t=>{parseInt(t.dataset.step)===i.currentQuizStep?t.classList.add("active"):t.classList.remove("active")}),Ae.forEach((t,e)=>{e+1===i.currentQuizStep?t.classList.add("current"):t.classList.remove("current")}),H&&(H.style.visibility=i.currentQuizStep>1?"visible":"hidden"),A){A.textContent=i.currentQuizStep===3?"Match Daily Driver":"Next Step →";let t=!1;i.currentQuizStep===1&&i.quizAnswers.useCase&&(t=!0),i.currentQuizStep===2&&i.quizAnswers.dealbreaker&&(t=!0),i.currentQuizStep===3&&i.quizAnswers.budget&&(t=!0),A.disabled=!t}}function Re(){const{useCase:t,dealbreaker:e,budget:r}=i.quizAnswers,s=h.map(n=>{let l=0,u=[],d=[];return r==="budget"?n.price<=3e4?(l+=35,u.push("Fits comfortably within your sub-₹30,000 budget ceiling.")):n.price<=35e3?(l+=15,d.push(`Slightly stretches budget parameter at ${n.priceFormatted}`)):(l-=20,d.push(`Higher price bracket (${n.priceFormatted})`)):r==="midrange"?n.price>=25e3&&n.price<=6e4?(l+=35,u.push("Ideal price-to-performance sweet spot (₹30K - ₹60K bracket).")):n.price<25e3?(l+=20,u.push("Under budget while offering flagship-level essentials.")):(l+=10,d.push(`Premium tier price at ${n.priceFormatted}`)):r==="flagship"&&(n.price>=55e3?(l+=35,u.push("Premium no-compromise flagship tier construction.")):(l+=20,u.push("Delivers flagship performance at a lower expenditure tier."))),e==="flat-screen"?n.isFlat?(l+=30,u.push("100% Flat display with zero curved glare or palm touches.")):(l-=40,d.push("Features curved display edges (more glare, fragile drops)")):e==="35mm-jack"?n.hasJack?(l+=50,u.push("Features dedicated physical 3.5mm analog audio headphone jack.")):(l-=30,d.push("Lacks 3.5mm headphone jack (requires Type-C or Bluetooth)")):e==="clean-os"?n.isCleanOS?(l+=35,u.push("Bloatware-free, ad-free clean operating system.")):(l-=15,d.push(`OS contains moderate preloaded vendor apps (${n.os.bloatware})`)):e==="ois"&&(n.hasOIS?(l+=30,u.push("Equipped with hardware Optical Image Stabilization (OIS).")):(l-=35,d.push("Relies on electronic EIS only (lacks physical gyro OIS)"))),t==="gaming"?n.antutu>=15e5?(l+=35,u.push(`Top-tier AnTuTu benchmark (${n.antutuFormatted}) for competitive framerates.`)):n.antutu>=1e6?(l+=25,u.push(`Fluent computational horsepower (~${n.antutuFormatted} AnTuTu).`)):d.push("Mid-tier silicon not tailored for sustained high-res 3D titles"):t==="camera"?n.hasOIS&&(n.brand==="Google"||n.brand==="Samsung"||n.brand==="Apple"||n.brand==="Xiaomi"||n.brand==="Vivo")?(l+=35,u.push(`Class-leading ${n.camera.main} optics with natural dynamic range.`)):n.hasOIS?(l+=25,u.push(`Reliable optical stabilization on primary ${n.camera.main} sensor.`)):d.push("Camera setup is basic with no optical stabilization"):t==="battery"?(n.battery.capacityNum||0)>=5500?(l+=35,u.push(`Massive ${n.battery.capacity} battery cell with ${n.battery.charging}.`)):(n.battery.capacityNum||0)>=5e3?(l+=30,u.push(`High-density ${n.battery.capacity} endurance for multi-day reliability.`)):d.push(`Moderate battery capacity (${n.battery.capacity})`):t==="productivity"&&(n.isCleanOS&&(n.isCompact||n.isFlat)?(l+=35,u.push("Calm, distraction-free software paired with ergonomic build.")):n.isCleanOS?(l+=25,u.push("Zero notification spam and clean stock system architecture.")):d.push("Vendor UI requires notification hygiene to eliminate spam")),parseInt(n.weight)>215&&!d.some(b=>b.includes("weight"))&&d.push(`Heavier chassis weight (${n.weight})`),!n.hasJack&&e!=="35mm-jack"&&d.push("No 3.5mm headphone jack"),{phone:n,score:l,reasons:u,tradeoffs:d}}).sort((n,l)=>l.score-n.score),c=s[0],m=s.slice(1).find(n=>n.phone.brand!==c.phone.brand)||s[1],o=s.slice(1).find(n=>n.phone.id!==c.phone.id&&n.phone.id!==m.phone.id&&n.phone.price<Math.max(c.phone.price,m.phone.price))||s[2],p=[{item:c,badge:"MATCH // BEST OVERALL PICK",matchPct:98,isTop:!0},{item:m,badge:"MATCH // STRONG ALTERNATIVE",matchPct:89,isTop:!1},{item:o,badge:"MATCH // VALUE CONTENDER",matchPct:82,isTop:!1}];if(M){const n=document.querySelector(".quiz-step-container");n&&(n.style.display="none"),M.classList.add("active");const l=document.getElementById("quiz-result-slot");if(l){l.innerHTML=`
          <div class="quiz-recommendations-header">
            <div>
              <div class="eyebrow">Algorithmic Technical Match // Complete Report</div>
              <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin-top: 0.25rem;">Top 3 Recommended Smartphones</h2>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">Evaluated against your workflow priorities, hardware non-negotiables, and budget boundary.</p>
            </div>
            <button class="btn btn-primary" id="compare-all-recs-btn" style="white-space: nowrap;">
              Compare All 3 Side-by-Side →
            </button>
          </div>

          <div class="quiz-recommendations-grid">
            ${p.map(({item:d,badge:b,matchPct:L,isTop:V})=>`
              <div class="quiz-rec-card ${V?"top-pick":""}">
                <div>
                  <div class="quiz-rec-tier-badge">${b} · ${L}%</div>
                  <div class="eyebrow" style="font-size: 0.65rem;">${d.phone.brand} · ${d.phone.categoryName}</div>
                  <h3 class="quiz-rec-name">${d.phone.name}</h3>
                  <div class="quiz-rec-price">${d.phone.priceFormatted||"₹"+Number(d.phone.price).toLocaleString("en-IN")}</div>

                  <div class="quiz-rec-reasons">
                    <strong style="color:var(--text-primary); font-size:0.75rem;">Why it matches:</strong>
                    <ul>
                      ${d.reasons.slice(0,3).map(W=>`<li>${W}</li>`).join("")}
                    </ul>
                  </div>

                  <div class="quiz-rec-tradeoffs">
                    <strong>Honest Trade-offs:</strong>
                    <span>${d.tradeoffs.slice(0,2).join(" · ")||"No notable hardware shortcomings in this bracket."}</span>
                  </div>
                </div>

                <div class="quiz-rec-actions">
                  <button class="btn btn-outline btn-sm rec-inspect-btn" data-rec-id="${d.phone.id}">
                    Specs
                  </button>
                  <button class="btn btn-primary btn-sm rec-compare-btn" data-rec-id="${d.phone.id}">
                    + Compare
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `;const u=document.getElementById("compare-all-recs-btn");u&&u.addEventListener("click",()=>{i.comparisonList=p.map(d=>d.item.phone),E(),g(),C()}),l.querySelectorAll(".rec-inspect-btn").forEach(d=>{d.addEventListener("click",()=>{const b=h.find(L=>L.id===d.dataset.recId);b&&ye(b.id)})}),l.querySelectorAll(".rec-compare-btn").forEach(d=>{d.addEventListener("click",()=>{const b=h.find(L=>L.id===d.dataset.recId);if(b){if(i.comparisonList.length>=3&&!i.comparisonList.some(L=>L.id===b.id)){w("Comparison tray limit reached (3 max).");return}i.comparisonList.some(L=>L.id===b.id)?w(`${b.name} is already in comparison tray.`):(i.comparisonList.push(b),E(),g(),w(`Added ${b.name} to comparison tray.`))}})})}}}async function ve(){try{h=(await xe({category:"all"})).data||[],await g(),E(),ge(),R("samsung-galaxy-s24-ultra","iphone-15-pro-max"),Fe(),Oe(),Te()}catch(t){if(console.error("[RE-CONE] Initialization error:",t),I){I.innerHTML=`
          <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px solid var(--border-dark); background-color: var(--bg-card);">
            <div class="eyebrow" style="color: #ff5555; margin-bottom: 0.5rem;">CONNECTION NOTICE</div>
            <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">Failed to load verified database</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${t.message||"Error communicating with Supabase backend."}</p>
            <button class="btn btn-primary btn-sm" id="initial-retry-btn">↻ Retry Connection</button>
          </div>
        `;const e=document.getElementById("initial-retry-btn");e&&e.addEventListener("click",()=>ve())}}}ve();const D=document.querySelector(".mobile-menu-toggle"),Q=document.querySelector(".mobile-nav-panel");D&&Q&&(D.addEventListener("click",()=>{const t=Q.classList.toggle("open");D.setAttribute("aria-expanded",t?"true":"false")}),Q.querySelectorAll(".nav-link").forEach(t=>{t.addEventListener("click",()=>{Q.classList.remove("open"),D.setAttribute("aria-expanded","false")})}))});

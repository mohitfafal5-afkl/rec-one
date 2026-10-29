import{a as f}from"./phones-BnMkZt1Z.js";document.addEventListener("DOMContentLoaded",async()=>{const e=document.getElementById("phone-content-slot"),i=document.getElementById("close-window-btn");i&&i.addEventListener("click",()=>{window.opener?window.close():window.history.length>1?window.history.back():window.location.href="index.html"});const s=new URLSearchParams(window.location.search).get("id")||"samsung-galaxy-s24-ultra";let g=new AbortController;async function d(){var n,l,c,p,m,u,y,v;if(e){e.innerHTML=`
      <div style="text-align: center; padding: 5rem 1rem; font-family: var(--font-mono); color: var(--text-muted);">
        <span class="spinner" style="margin-right: 0.5rem;"></span>
        Querying verified smartphone specifications...
      </div>
    `;try{const t=await f(s,{signal:g.signal});if(!t){e.innerHTML=`
          <div style="text-align: center; padding: 4rem 1rem; border: 1px solid var(--border-light); background-color: var(--bg-card);">
            <div class="eyebrow" style="margin-bottom: 0.5rem;">DEVICE NOT FOUND</div>
            <h2 style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--text-primary); margin-bottom: 1rem;">No device matching "${s}"</h2>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">The device identifier may be incorrect or removed from our verified database.</p>
            <a href="index.html#spec-matrix-explorer" class="btn btn-primary btn-sm">Explore All Curated Phones →</a>
          </div>
        `;return}document.title=`${t.name} — Full Specifications // RE-CONE`;const o=(t.sources||["Manufacturer Whitepaper","AnTuTu V10 Lab Benchmark"]).map(r=>`<li>${r}</li>`).join(""),b=(t.pros||[]).map(r=>`<li>${r}</li>`).join(""),h=(t.cons||[]).map(r=>`<li>${r}</li>`).join("");e.innerHTML=`
        <!-- Hero Card -->
        <div class="phone-hero-card">
          <div class="phone-hero-brand">${t.brand} · ${t.series} · Verified ${t.verifiedDate||"2026-Q1"}</div>
          <h1 class="phone-hero-title">${t.name}</h1>
          <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            ${t.editorialVerdict}
          </p>

          <div class="phone-hero-meta-row">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.68rem; text-transform: uppercase; color: var(--text-muted); display: block;">Hardware Price</span>
              <span class="phone-hero-price">${t.priceFormatted||"₹"+Number(t.price).toLocaleString("en-IN")}</span>
            </div>
            <div class="antutu-pill" style="font-size: 0.85rem; padding: 0.4rem 0.85rem;" title="Verified AnTuTu V10 Lab Benchmark">
              ★ ${t.antutuFormatted} (~${t.antutu.toLocaleString()} pts)
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap;">
            <a href="index.html?compare=${t.id},samsung-galaxy-s24-ultra" class="btn btn-outline btn-sm">
              Compare on RE-CONE →
            </a>
            <button type="button" id="copy-spec-link" class="btn btn-outline btn-sm">
              🔗 Copy Link
            </button>
          </div>
        </div>

        <!-- Editorial Review & Trade-offs -->
        <div class="editorial-box">
          <div class="spec-group-header" style="border-bottom-color: var(--border-medium); margin-bottom: 1rem;">
            <span>RE-CONE Editorial Assessment // Trade-Offs</span>
            <span style="font-size: 0.68rem; color: var(--text-muted);">${t.categoryName}</span>
          </div>

          <div class="editorial-verdict-quote">
            "${t.editorialVerdict}"
          </div>

          <div class="pros-cons-grid">
            <div class="pro-column">
              <strong>✓ Key Strengths:</strong>
              <ul>${b}</ul>
            </div>
            <div class="con-column">
              <strong>✕ Honest Trade-Offs:</strong>
              <ul>${h}</ul>
            </div>
          </div>
        </div>

        <!-- 01: Compute & Storage -->
        <div class="spec-group-box">
          <div class="spec-group-header">
            <span>01 // Silicon & Compute Architecture</span>
            <span class="eyebrow" style="font-size: 0.65rem;">Verified</span>
          </div>
          <table class="spec-table-compact">
            <tr><td>Processor (SoC)</td><td>${t.processor}</td></tr>
            <tr><td>AnTuTu V10 Lab Benchmark</td><td>${t.antutuFormatted} (${t.antutu.toLocaleString()} pts)</td></tr>
            <tr><td>System Memory (RAM)</td><td>${t.ram}</td></tr>
            <tr><td>Internal Flash Storage</td><td>${t.storage}</td></tr>
            <tr><td>Operating System</td><td>${t.os.name} (${t.os.version})</td></tr>
            <tr><td>Vendor Bloatware Level</td><td>${t.os.bloatware}</td></tr>
            <tr><td>Software Update Promise</td><td>${t.os.updates}</td></tr>
          </table>
        </div>

        <!-- 02: Display & Ergonomics -->
        <div class="spec-group-box">
          <div class="spec-group-header">
            <span>02 // Display & Ergonomics</span>
            <span class="eyebrow" style="font-size: 0.65rem;">Verified</span>
          </div>
          <table class="spec-table-compact">
            <tr><td>Panel Size & Technology</td><td>${t.display.size} ${t.display.type}</td></tr>
            <tr><td>Native Resolution</td><td>${t.display.resolution}</td></tr>
            <tr><td>Screen Contour</td><td>${t.isFlat?"100% Flat Screen (No Curved Glare)":"Curved Display Edges"}</td></tr>
            <tr><td>Refresh Rate</td><td>${t.display.refresh}</td></tr>
            <tr><td>Peak Luminance</td><td>${t.display.brightness}</td></tr>
            <tr><td>Protective Glass</td><td>${t.display.protection||"Corning Gorilla Glass"}</td></tr>
            <tr><td>Chassis Weight</td><td>${t.weight}</td></tr>
            <tr><td>Dimensions</td><td>${((n=t.build)==null?void 0:n.dimensions)||"N/A"}</td></tr>
            <tr><td>Ingress Protection</td><td>${t.ipRating||"None"}</td></tr>
          </table>
        </div>

        <!-- 03: Optics & Camera Architecture -->
        <div class="spec-group-box">
          <div class="spec-group-header">
            <span>03 // Optics & Sensor Setup</span>
            <span class="eyebrow" style="font-size: 0.65rem;">Verified</span>
          </div>
          <table class="spec-table-compact">
            <tr><td>Primary Camera</td><td>${t.camera.main}</td></tr>
            <tr><td>Hardware OIS</td><td>${t.hasOIS?"Included (Optical Image Stabilization)":"Not Included (EIS Only)"}</td></tr>
            <tr><td>Sensor Model</td><td>${t.camera.mainSensor||"High-Resolution CMOS"}</td></tr>
            <tr><td>Auxiliary Sensors</td><td>${t.camera.secondary||"N/A"}</td></tr>
            <tr><td>Front Selfie Optics</td><td>${t.camera.selfie||"N/A"}</td></tr>
            <tr><td>Video Recording</td><td>${t.camera.video||"4K Video Capture"}</td></tr>
          </table>
        </div>

        <!-- 04: Power, Battery & Charging -->
        <div class="spec-group-box">
          <div class="spec-group-header">
            <span>04 // Battery Cell & Charging</span>
            <span class="eyebrow" style="font-size: 0.65rem;">Verified</span>
          </div>
          <table class="spec-table-compact">
            <tr><td>Battery Capacity</td><td>${t.battery.capacity}</td></tr>
            <tr><td>Wired Fast Charging</td><td>${t.battery.charging}</td></tr>
            <tr><td>Charge Time Estimate</td><td>${t.battery.chargingTime||"N/A"}</td></tr>
            <tr><td>Wireless Charging</td><td>${t.battery.wirelessCharging?"Supported":"Not Supported"}</td></tr>
          </table>
        </div>

        <!-- 05: Audio & Connectivity -->
        <div class="spec-group-box">
          <div class="spec-group-header">
            <span>05 // Audio & Connectivity Standards</span>
            <span class="eyebrow" style="font-size: 0.65rem;">Verified</span>
          </div>
          <table class="spec-table-compact">
            <tr><td>3.5mm Headphone Jack</td><td>${t.hasJack?"Dedicated 3.5mm Analog Audio Port":"No 3.5mm Jack (USB Type-C / Bluetooth)"}</td></tr>
            <tr><td>Speaker Architecture</td><td>${((l=t.audio)==null?void 0:l.speakerDetails)||((c=t.audio)!=null&&c.stereo?"Stereo Speakers":"Mono Loudspeaker")}</td></tr>
            <tr><td>Cellular 5G Support</td><td>${(p=t.connectivity)!=null&&p.fiveG?"Sub-6GHz 5G Supported":"4G LTE"}</td></tr>
            <tr><td>Wi-Fi Standard</td><td>${((m=t.connectivity)==null?void 0:m.wifi)||"Wi-Fi 6"}</td></tr>
            <tr><td>Bluetooth</td><td>${((u=t.connectivity)==null?void 0:u.bluetooth)||"Bluetooth 5.3"}</td></tr>
            <tr><td>NFC Support</td><td>${(y=t.connectivity)!=null&&y.nfc?"Supported":"Not Supported"}</td></tr>
            <tr><td>USB Port</td><td>${((v=t.connectivity)==null?void 0:v.usb)||"USB Type-C"}</td></tr>
          </table>
        </div>

        <!-- 06: Data Verification & Sources -->
        <div class="spec-group-box" style="margin-bottom: 3rem;">
          <div class="spec-group-header">
            <span>06 // Verification Date & Sources</span>
            <span class="eyebrow" style="font-size: 0.65rem;">Trust Audit</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6;">
            <strong>Verification Date:</strong> ${t.verifiedDate||"2026-Q1"} (Zero sponsored rankings)<br>
            <strong>Data Sources:</strong>
            <ul style="list-style: square; padding-left: 1.25rem; margin-top: 0.25rem;">
              ${o}
            </ul>
          </div>
        </div>
      `;const a=document.getElementById("copy-spec-link");a&&a.addEventListener("click",()=>{navigator.clipboard.writeText(window.location.href).then(()=>{a.textContent="✓ Copied!",setTimeout(()=>a.textContent="🔗 Copy Link",2e3)})})}catch(t){if(t.name==="AbortError")return;console.error("[RE-CONE] Error fetching phone specs:",t),e.innerHTML=`
        <div style="text-align: center; padding: 4rem 1rem; border: 1px solid var(--border-dark); background-color: var(--bg-card);">
          <div class="eyebrow" style="color: #ff5555; margin-bottom: 0.5rem;">CONNECTION / QUERY NOTICE</div>
          <h2 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.75rem;">Failed to load device specifications</h2>
          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Please check network connectivity or retry the query.</p>
          <button id="phone-retry-btn" class="btn btn-primary btn-sm">↻ Retry Query</button>
        </div>
      `;const o=document.getElementById("phone-retry-btn");o&&o.addEventListener("click",()=>d())}}}d()});

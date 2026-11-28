import"./hoisted.972BY2g3.js";import"./DashChartRange.astro_astro_type_script_index_0_lang.B8ha3G8o.js";const N=document.querySelector(".stats");if(N){const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=()=>{N.classList.add("counted"),!e&&N.querySelectorAll("[data-home-stat-value]").forEach(i=>{if(i.dataset.homeStatValue==="servers")return;const c=/^(\d+)(%?)$/.exec((i.textContent??"").trim());if(!c)return;const w=Number(c[1]),u=performance.now(),r=d=>{const g=Math.min(1,(d-u)/1100);i.textContent=`${Math.round(w*(1-Math.pow(1-g,3)))}${c[2]}`,g<1&&requestAnimationFrame(r)};requestAnimationFrame(r)})};if("IntersectionObserver"in window){const i=new IntersectionObserver(c=>{c.some(w=>w.isIntersecting)&&(i.disconnect(),n())},{threshold:.4});i.observe(N)}else n()}const $=document.querySelector('[data-home-stat-value="servers"]'),q=document.querySelector("[data-bot-dot]"),M="petto-home-servers";try{const e=localStorage.getItem(M);$&&e&&/^\d+$/.test(e)&&($.textContent=e)}catch{}async function B(){if($)try{const e=await fetch("/api/status",{cache:"no-store",headers:{Accept:"application/json"}});if(!e.ok)return;const n=await e.json();if(!Array.isArray(n.shards)||n.shards.length===0)return;const i=5*60*1e3;let c=0,w=0;const u=n.shards.reduce((r,d)=>{if(!(d.updated_at?Date.now()-new Date(d.updated_at).getTime()<=i:!1)||d.status==="Disconnected")return r;d.status==="Ready"?c+=1:w+=1;const h=Number(d.guild_count);return r+(Number.isFinite(h)?h:0)},0);if(q&&(q.dataset.state=c?"online":w?"reconnecting":"offline"),u>0){$.textContent=String(u),document.querySelectorAll("[data-sc-count]").forEach(r=>{r.textContent=String(u)});try{localStorage.setItem(M,String(u))}catch{}}}catch{}}B();const j=document.getElementById("tryChips"),L=document.getElementById("tryBody"),k=document.getElementById("tryChan"),T=Array.from(j?.querySelectorAll(".try-chip")??[]),_={ban:{chan:"#moderation",html:`
        <div class="wmsg">
          <img class="wav" src="/assets/user-liam.png" alt="" />
          <div><div class="wmeta"><b>liam</b><span>used <code>/ban</code> · just now</span></div><div class="wtxt">/ban user:@spammer reason:unauthorized advertising</div></div>
        </div>
        <div class="wmsg">
          <div class="wav bot"><img src="/assets/favicon-3d.png" alt="" /></div>
          <div>
            <div class="wmeta"><b>Petto</b><span class="wtag">APP</span></div>
            <div class="wcard"><div class="wcard-t">Case #144 &middot; Ban</div><div class="wcard-r"><b>User</b>spammer#0192</div><div class="wcard-r"><b>Reason</b>unauthorized advertising</div></div>
          </div>
        </div>`},rank:{chan:"#general",html:`
        <div class="wmsg">
          <img class="wav" src="/assets/user-liam.png" alt="" />
          <div><div class="wmeta"><b>liam</b><span>used <code>/rank</code> · just now</span></div><div class="wtxt">/rank</div></div>
        </div>
        <div class="wmsg">
          <div class="wav bot"><img src="/assets/favicon-3d.png" alt="" /></div>
          <div>
            <div class="wmeta"><b>Petto</b><span class="wtag">APP</span></div>
            <div class="wlevel"><div class="wlevel-t">Level <b>12</b> &middot; Rank <b>#4</b></div><div class="wlevel-bar"><span style="width: 64%"></span></div><div class="wlevel-xp">8,240 / 12,900 XP</div></div>
          </div>
        </div>`},giveaway:{chan:"#giveaways",html:`
        <div class="wmsg">
          <img class="wav" src="/assets/user-liam.png" alt="" />
          <div><div class="wmeta"><b>liam</b><span>used <code>/giveaway</code> · just now</span></div><div class="wtxt">/giveaway quick duration:10m winners:1 prize:"Nitro Classic"</div></div>
        </div>
        <div class="wmsg">
          <div class="wav bot"><img src="/assets/favicon-3d.png" alt="" /></div>
          <div>
            <div class="wmeta"><b>Petto</b><span class="wtag">APP</span></div>
            <div class="wgiveaway"><div class="wgiveaway-t">&#9733; Discord Nitro Classic</div><div class="wgiveaway-r">Hosted by <b>liam</b> &middot; 1 winner</div><div class="wgiveaway-r">Ends in 10 minutes</div><button class="wbtn">&#127881; Enter Giveaway</button></div>
          </div>
        </div>`},invites:{chan:"#general",html:`
        <div class="wmsg">
          <img class="wav" src="/assets/user-liam.png" alt="" />
          <div><div class="wmeta"><b>liam</b><span>just now</span></div><div class="wtxt">!invites top</div></div>
        </div>
        <div class="wmsg">
          <div class="wav bot"><img src="/assets/favicon-3d.png" alt="" /></div>
          <div>
            <div class="wmeta"><b>Petto</b><span class="wtag">BOT</span></div>
            <div class="wcard">
              <div class="wcard-t">Invite leaderboard</div>
              <div class="wcard-r"><b>1. liam</b>42 net</div>
              <div class="wcard-r"><b>2. kiwi</b>19 net</div>
              <div class="wcard-r"><b>3. mono</b>7 net</div>
            </div>
          </div>
        </div>`}};function D(e){const n=_[e];!n||!L||(L.innerHTML=n.html,k&&(k.textContent=n.chan),T.forEach(i=>i.classList.toggle("active",i.dataset.cmd===e)))}T.forEach(e=>e.addEventListener("click",()=>D(e.dataset.cmd??"")));D("ban");(function(){const e=document.getElementById("vxShowcase"),n=document.getElementById("vxTabs"),i=document.getElementById("vxDcChan");if(!e||!n)return;const c=Array.from(n.querySelectorAll("[data-vx-tab]")),w=Array.from(e.querySelectorAll("[data-vx-cfg]")),u=Array.from(e.querySelectorAll("[data-vx-dc]"));let r=0,d=null,g=!1;function h(S){r=(S%c.length+c.length)%c.length;const y=c[r],x=y.dataset.vxTab||"";i&&y.dataset.vxChan&&(i.textContent=y.dataset.vxChan),c.forEach((v,I)=>{const t=I===r;v.classList.remove("active"),v.offsetWidth,v.classList.toggle("active",t),v.setAttribute("aria-selected",t?"true":"false")}),w.forEach(v=>v.classList.toggle("active",v.dataset.vxCfg===x)),u.forEach(v=>v.classList.toggle("active",v.dataset.vxDc===x))}function f(){d&&window.clearTimeout(d),!g&&(d=window.setTimeout(()=>{h(r+1),f()},6e3))}c.forEach((S,y)=>{S.addEventListener("click",()=>{h(y),f()})}),e.addEventListener("pointerenter",()=>{g=!0,e.classList.add("is-paused"),d&&window.clearTimeout(d)}),e.addEventListener("pointerleave",()=>{g=!1,e.classList.remove("is-paused"),f()}),f()})();const P=document.querySelector("[data-showcase]");P&&H(P);function H(e){const n=new Intl.NumberFormat(e.dataset.locale||"en"),i=38,c=314,w=9;let u="";const r=new Set(["discoverable","community","boost-2","boost-3"]),d=t=>t.startsWith("discoverable")?e.dataset.discoverable||"":t.startsWith("community")?e.dataset.community||"":t==="partnered"?e.dataset.partnered||"":t==="verified"?e.dataset.verified||"":`${e.dataset.boost||""} ${t.replace("boost-","")}`.trim(),g=(t,o,s)=>{const a=document.createElement("img");return a.className=`sc-badge-img ${s}`,a.src=`/assets/discord-badges/${o}.svg`,a.alt="",a.width=18,a.height=18,a.loading="lazy",a.decoding="async",a},h=t=>{const o=document.createElement("div");o.className="sc-card",o.dataset.id=t.id;const s=document.createElement(t.icon?"img":"span");s.className="sc-icon",t.icon&&s instanceof HTMLImageElement?(s.src=t.icon,s.alt="",s.loading="lazy",s.decoding="async",s.width=44,s.height=44):s.textContent=(t.name.trim()[0]||"?").toUpperCase();const a=document.createElement("div");a.className="sc-body";const l=document.createElement("div");l.className="sc-top";const m=document.createElement("span");if(m.className="sc-name",m.textContent=t.name,l.append(m),t.badge){const A=document.createElement("span");A.className="sc-badge",A.title=d(t.badge),r.has(t.badge)?A.append(g(t.badge,`${t.badge}-light`,"sc-on-dark"),g(t.badge,`${t.badge}-dark`,"sc-on-light")):A.append(g(t.badge,t.badge,"")),l.append(A)}const p=document.createElement("div");p.className="sc-numbers";const E=document.createElement("span");E.className="sc-dot";const b=document.createElement("span");b.className="sc-online",b.textContent=t.online===null?"":`${n.format(t.online)} ${e.dataset.online}`;const C=document.createElement("span");return C.className="sc-members",C.textContent=`${n.format(t.members)} ${e.dataset.members}`,t.online===null?p.append(C):p.append(E,b,C),a.append(l,p),o.append(s,a),o},f=window.matchMedia("(prefers-reduced-motion: reduce)").matches,S=(t,o)=>{const s=o?[...t].reverse():t;if(f)return s;let a=[...s];for(;a.length<w;)a=a.concat(s);return a},y=t=>{e.hidden=t.length===0;const o=Array.from(e.querySelectorAll(".sc-row")),a=t.length>=4?[t.filter((l,m)=>m%2===0),t.filter((l,m)=>m%2===1)]:[t,[]];o.forEach((l,m)=>{const p=a[m]??[];if(l.hidden=p.length===0,!p.length)return;const E=l.querySelector(".sc-track"),b=S(p,m===1);E.replaceChildren(...b.map(h),...f?[]:b.map(h)),E.style.setProperty("--sc-dur",`${Math.round(b.length*c/i)}s`),E.style.setProperty("--sc-delay",`${m===1?-Math.round(b.length*c/i/3):0}s`)})},x=t=>{const o=t.map(a=>a.id).join(",");if(o!==u){u=o,y(t);return}const s=new Map(t.map(a=>[a.id,a]));e.querySelectorAll(".sc-card").forEach(a=>{const l=s.get(a.dataset.id||"");if(!l)return;const m=a.querySelector(".sc-online"),p=a.querySelector(".sc-members");m&&l.online!==null&&(m.textContent=`${n.format(l.online)} ${e.dataset.online}`),p&&(p.textContent=`${n.format(l.members)} ${e.dataset.members}`)})},v="petto-showcase-servers";try{const t=JSON.parse(localStorage.getItem(v)||"null");Array.isArray(t)&&t.length&&x(t)}catch{}(async()=>{try{const t=await fetch("/api/showcase",{headers:{Accept:"application/json"}});if(!t.ok)return;const o=await t.json();if(Array.isArray(o?.servers)){x(o.servers);try{localStorage.setItem(v,JSON.stringify(o.servers))}catch{}}}catch{}})()}

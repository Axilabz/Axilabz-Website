/**
 * Splash shown while the page loads: the Axilabz "A" mark assembles itself, tilts toward the pointer
 * and bounces when tapped. It is plain server-rendered HTML + CSS + a tiny inline script, so it shows
 * immediately, before any JavaScript bundle. It fades out once the page has loaded (minimum ~0.9s so it
 * never flashes), and a CSS fail-safe hides it after 7s even if the script never runs.
 */
const css = `
#page-loader{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;background:radial-gradient(circle at 50% 42%,#fff 0,#f1f5ff 65%,#e6edff 100%);transition:opacity .55s ease,visibility .55s;pointer-events:none;animation:pl-failsafe .5s ease 4s forwards}
#page-loader.is-done{opacity:0;visibility:hidden;pointer-events:none}
#page-loader[hidden]{display:none;pointer-events:none}
.pl-stage{display:grid;justify-items:center;gap:26px;perspective:700px}
.pl-mark{width:min(40vw,180px);transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .18s ease-out;cursor:pointer;touch-action:manipulation;filter:drop-shadow(0 16px 22px rgba(35,64,200,.28))}
.pl-mark svg{display:block;width:100%;height:auto;overflow:visible}
.pl-mark.pl-pop svg{animation:pl-pop .55s cubic-bezier(.3,1.6,.5,1)}
.pl-l{animation:pl-in-l .85s cubic-bezier(.2,.8,.2,1) both}
.pl-r{animation:pl-in-r .85s cubic-bezier(.2,.8,.2,1) .12s both}
.pl-t{transform-box:fill-box;transform-origin:50% 100%;animation:pl-tri .6s cubic-bezier(.3,1.5,.5,1) .6s both,pl-pulse 1.8s ease-in-out 1.4s infinite}
.pl-bar{width:128px;height:3px;border-radius:3px;background:#d9e2fb;overflow:hidden}
.pl-bar i{display:block;height:100%;width:0;border-radius:3px;background:linear-gradient(90deg,#2340c8,#ffb020);animation:pl-load 3s cubic-bezier(.2,.7,.2,1) forwards}
@keyframes pl-in-l{from{opacity:0;transform:translate(-90px,70px)}to{opacity:1;transform:none}}
@keyframes pl-in-r{from{opacity:0;transform:translate(90px,70px)}to{opacity:1;transform:none}}
@keyframes pl-tri{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}
@keyframes pl-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes pl-pop{0%{transform:scale(1)}40%{transform:scale(1.14) rotate(-3deg)}100%{transform:scale(1)}}
@keyframes pl-load{to{width:92%}}
@keyframes pl-failsafe{to{opacity:0;visibility:hidden}}
@media (prefers-reduced-motion:reduce){.pl-l,.pl-r,.pl-t,.pl-bar i,.pl-mark.pl-pop svg{animation:none!important}.pl-bar i{width:60%}.pl-mark{transition:none}}
`;

const script = `(function(){var el=document.getElementById('page-loader');if(!el)return;var t0=Date.now(),done=false;
function hide(){if(done)return;done=true;el.classList.add('is-done');setTimeout(function(){el.setAttribute('hidden','')},700)}
function ready(){setTimeout(hide,Math.max(0,900-(Date.now()-t0)))}
if(document.readyState==='complete')ready();else window.addEventListener('load',ready);
setTimeout(hide,3000);
el.addEventListener('pointermove',function(e){var x=e.clientX/window.innerWidth-.5,y=e.clientY/window.innerHeight-.5;el.style.setProperty('--rx',(-y*24)+'deg');el.style.setProperty('--ry',(x*30)+'deg')});
var m=el.querySelector('.pl-mark');if(m)m.addEventListener('click',function(){m.classList.remove('pl-pop');void m.offsetWidth;m.classList.add('pl-pop')});
})();`;

export function PageLoader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div id="page-loader" aria-hidden="true" suppressHydrationWarning>
        <div className="pl-stage">
          <div className="pl-mark">
            <svg viewBox="90 370 1750 1180" xmlns="http://www.w3.org/2000/svg" focusable="false">
              <defs>
                <linearGradient id="pl-g1" x1="0.75" y1="0.05" x2="0.1" y2="1">
                  <stop offset="0" stopColor="#030c2c" />
                  <stop offset="0.45" stopColor="#022683" />
                  <stop offset="1" stopColor="#0a4fff" />
                </linearGradient>
                <linearGradient id="pl-g2" x1="0.1" y1="0.1" x2="0.9" y2="1">
                  <stop offset="0" stopColor="#0a55ff" />
                  <stop offset="0.5" stopColor="#0a6cff" />
                  <stop offset="0.8" stopColor="#0630ff" />
                  <stop offset="1" stopColor="#031a9a" />
                </linearGradient>
                <linearGradient id="pl-g3" x1="0.2" y1="0.2" x2="0.9" y2="0.9">
                  <stop offset="0" stopColor="#ffb02e" />
                  <stop offset="0.7" stopColor="#fbbc3a" />
                  <stop offset="1" stopColor="#f7d36a" />
                </linearGradient>
              </defs>
              <path className="pl-l" fill="url(#pl-g1)" d="M785 400 L975 740 L512 1495 Q496 1528 455 1530 L132 1530 Q100 1526 112 1495 L760 420 Q770 400 785 400Z" />
              <path className="pl-r" fill="url(#pl-g2)" d="M806 392 L1112 392 Q1150 395 1170 432 L1815 1495 Q1826 1528 1796 1530 L1472 1530 Q1436 1528 1420 1495 L975 740 L783 412 Q782 392 806 392Z" />
              <path className="pl-t" fill="url(#pl-g3)" d="M965 1082 Q975 1080 984 1092 L1226 1500 Q1234 1530 1204 1530 L722 1530 Q692 1528 698 1500 L946 1092 Q955 1080 965 1082Z" />
            </svg>
          </div>
          <div className="pl-bar"><i /></div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}

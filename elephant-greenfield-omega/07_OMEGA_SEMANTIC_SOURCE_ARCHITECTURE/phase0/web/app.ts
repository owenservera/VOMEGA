// TypeScript browser client. Regenerate app.js: node build-web.mjs
// Python remains the semantic engine. This is NOT a TypeScript core port.
const element = (id: string): any => document.getElementById(id);
const input = element('input');
const confirm = element('confirm');
const bootstrap = await fetch('/bootstrap').then(r => r.json());
let revision: number = 0;
let preview: Record<string, any> | null = null;
let queue = Promise.resolve();
async function api(path: string, body: Record<string, any>) {
  const r = await fetch(path, {method:'POST', headers:{'Content-Type':'application/json','X-Omega-CSRF':bootstrap.csrf},body:JSON.stringify({session:bootstrap.session,...body})});
  const value = await r.json();
  if (!r.ok) throw new Error(value.error);
  return value;
}
function showPreview(p: Record<string, any> | null) {
  preview = p;
  confirm.disabled = !p;
  if (p) { element('reading').textContent = p.reading; element('status').textContent = 'REVIEW · Your confirmation is required'; }
}
function changed() {
  const rev = ++revision, text = input.value;
  preview = null; confirm.disabled = true;
  element('receipt').textContent = ''; element('choices').replaceChildren();
  element('status').textContent = 'Interpreting…';
  // Serialize updates; ignore stale responses. No approval survives a keystroke.
  queue = queue.catch(() => {}).then(async () => {
    const result = await api('/interpret',{input:text,revision:rev});
    if (rev !== revision) return;
    element('reading').textContent = result.reading;
    element('trace').textContent = JSON.stringify(result.state.trace,null,2);
    element('status').textContent = result.state.ambiguous ? 'CHOOSE · Multiple meanings' : result.state.status;
    for (const reading of result.alternatives) {
      const b = document.createElement('button'); b.textContent = reading;
      b.onclick = async () => {
        try { const p = await api('/choose',{revision:rev,reading}); if (rev === revision) showPreview(p); }
        catch(e) { element('status').textContent = e.message; }
      };
      element('choices').append(b);
    }
    showPreview(result.preview);
  }).catch(e => { if(rev === revision) element('status').textContent = 'Blocked: '+e.message; });
}
input.addEventListener('input', changed);
document.querySelectorAll('[data-text]').forEach(b => b.addEventListener('click',()=>{input.value=b.dataset.text;changed();input.focus();}));
confirm.onclick = async () => {
  const shown = preview, rev = revision;
  if (!shown) return;
  confirm.disabled = true;
  try {
    const auth = await api('/authorize',{preview:shown,consent:true});
    if (rev !== revision) throw new Error('Input changed; confirm a fresh reading.');
    const receipt = await api('/dispatch',{preview:shown,permit:auth.permit});
    element('receipt').textContent = JSON.stringify(receipt,null,2);
    element('status').textContent = 'RECORDED · Mock receipt'; preview = null;
  } catch(e) { element('status').textContent = 'Blocked: '+e.message; }
};
element('lab-toggle').onclick = async () => {
  const panel = element('lab'); panel.hidden = !panel.hidden;
  element('lab-toggle').setAttribute('aria-expanded',String(!panel.hidden));
  element('metrics').textContent = JSON.stringify(await fetch('/status').then(r=>r.json()),null,2);
};

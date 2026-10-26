// ===== CONFIG: ajuste aqui =====
const CONFIG = {
  checkoutMain: '#pricing',       // TODO: checkout do Completo (order bump e upsell ficam na plataforma)
  checkoutBasic: '#pricing',      // TODO: checkout do Essencial
  checkoutDesconto: '#pricing',   // TODO: checkout do Completo com desconto (R$ 29,90), usado no pop-up
  precoBasic: 'R$ 19,90',
  preco: 'R$ 39,90',              // preço do Completo
  precoDesconto: 'R$ 29,90',      // preço do Completo oferecido no pop-up ao clicar no Essencial
  fimDaOferta: '2026-12-15T23:59:59-03:00',  // data REAL de encerramento
  emailSuporte: '',               // TODO: e-mail de suporte (aparece na garantia)
  lojaLogo: 'assets/logo-loja.webp',                 // logo da loja (aparece na biografia)
  lojaInstagram: '@ladoceriaroyal_', // @ do Instagram da loja (aparece na biografia, com link)
  amostras: ['foto1','d10','f04','d16','foto3','b02','d47','foto5','g04','d34','f10','d12','s06','d45','f25','d52'],
  amostras2: ['foto4','d14','f19','foto6','d18','foto2','b05','foto7','f21','d36','d31','s05','d26','f33','b09','d22','s07'],
};
// ================================

document.querySelectorAll('[data-buy]').forEach(a => { a.href = a.dataset.buy === 'basic' ? CONFIG.checkoutBasic : CONFIG.checkoutMain; });
document.getElementById('preco').textContent = CONFIG.preco;
document.getElementById('preco-basic').textContent = CONFIG.precoBasic;
document.getElementById('ano').textContent = new Date().getFullYear();
if (CONFIG.emailSuporte) document.getElementById('email').textContent = CONFIG.emailSuporte;
// oferta válida "até hoje": a data é a do dia atual (horário de Brasília) e muda sozinha a cada dia
document.getElementById('fim').textContent = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' });
// biografia da loja: logo + @ do Instagram (só aparecem quando preenchidos no CONFIG)
(function () {
  const top = document.querySelector('.bio-top');
  if (CONFIG.lojaLogo) { const l = document.getElementById('bio-logo'); l.src = CONFIG.lojaLogo; l.hidden = false; } else top.classList.add('solo');
  if (CONFIG.lojaInstagram) { const h = CONFIG.lojaInstagram.replace(/^@/, ''); const a = document.getElementById('bio-ig'); a.textContent = '@' + h; a.href = 'https://instagram.com/' + h; a.hidden = false; }
})();

// "por dentro do livro": duas fileiras que rolam sozinhas em sentidos opostos
[['row1', CONFIG.amostras], ['row2', CONFIG.amostras2]].forEach(([id, lista]) => {
  const t = document.getElementById(id);
  const html = lista.map(n => `<img src="assets/m/${n}.webp" alt="" height="210">`).join('');
  t.innerHTML = html + html;
});

// vídeos em loop, sem som e sem controles, passando em carrossel
(function () {
  const lista = ['v1', 'v2', 'v3', 'v4'];
  const html = lista.map(n => '<div class="vcard"><video data-v="' + n + '" src="assets/v/' + n + '.mp4" poster="assets/v/' + n + '.webp" muted loop playsinline preload="auto" disablepictureinpicture></video></div>').join('');
  const t = document.getElementById('rowv');
  if (!t) return;
  t.innerHTML = html + html;
  const vids = [...t.querySelectorAll('video')];
  vids.forEach(v => { v.muted = true; v.defaultMuted = true; v.setAttribute('playsinline', ''); });
  const tocar = v => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  vids.forEach(tocar);
  // reforça a reprodução quando a seção aparece (alguns celulares só liberam depois da primeira rolagem)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tocar(e.target); }), { threshold: 0.1 });
    vids.forEach(v => io.observe(v));
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) vids.forEach(tocar); });
  addEventListener('touchstart', () => vids.forEach(v => { if (v.paused) tocar(v); }), { once: true, passive: true });
})();

// pop-up: ao clicar no Essencial, oferece o Completo com desconto antes do checkout
(function () {
  const num = v => parseFloat(String(v).replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
  const brl = n => 'R$ ' + n.toFixed(2).replace('.', ',');
  const modal = document.getElementById('modal');
  if (!modal) return;
  const desc = num(CONFIG.preco) - num(CONFIG.precoDesconto);
  document.getElementById('m-desc').textContent = brl(desc).replace(',00', '');
  document.getElementById('m-de').textContent = CONFIG.preco;
  document.getElementById('m-por').textContent = CONFIG.precoDesconto;
  const sim = document.getElementById('m-sim'), nao = document.getElementById('m-nao');
  sim.href = CONFIG.checkoutDesconto; sim.textContent = 'Sim, quero o Completo por ' + CONFIG.precoDesconto.replace(' ', ' ');
  nao.href = CONFIG.checkoutBasic; nao.textContent = 'Não, quero só o Essencial (' + CONFIG.precoBasic.replace(' ', ' ') + ')';
  let ultimo = null;
  const abrir = () => { ultimo = document.activeElement; modal.hidden = false; document.body.classList.add('modal-open'); sim.focus(); };
  const fechar = () => { modal.hidden = true; document.body.classList.remove('modal-open'); if (ultimo) ultimo.focus(); };
  document.querySelectorAll('[data-buy="basic"]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); abrir(); }));
  document.getElementById('m-x').addEventListener('click', fechar);
  modal.addEventListener('click', e => { if (e.target === modal) fechar(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) fechar(); });
  [sim, nao].forEach(a => a.addEventListener('click', () => { if (a.getAttribute('href') === '#pricing') fechar(); }));
})();

// neve
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const snow = document.getElementById('snow');
  for (let i = 0; i < (innerWidth < 820 ? 14 : 34); i++) {
    const f = document.createElement('i');
    const size = 3 + Math.random() * 6;
    f.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;opacity:${0.35 + Math.random() * 0.5};animation-duration:${8 + Math.random() * 12}s;animation-delay:${-Math.random() * 18}s;--dx:${(Math.random() * 60 - 30).toFixed(0)}px`;
    snow.appendChild(f);
  }
}


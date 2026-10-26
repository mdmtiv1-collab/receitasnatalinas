// ===== CONFIG: ajuste aqui =====
const CONFIG = {
  checkoutMain: '#pricing',       // TODO: checkout do Completo (order bump e upsell ficam na plataforma)
  checkoutBasic: '#pricing',      // TODO: checkout do Essencial
  precoBasic: 'R$ 19,90',
  preco: 'R$ 29,90',
  fimDaOferta: '2026-12-15T23:59:59-03:00',  // data REAL de encerramento
  emailSuporte: '',               // TODO: e-mail de suporte (aparece na garantia)
  amostras: ['foto1','d10','f04','d16','foto3','b02','d47','g04','d34','f10','d12','s06','d45','f25','d52'],
  amostras2: ['foto4','d14','f19','d18','foto2','b05','f21','d36','d31','s05','d26','f33','b09','d22','s07'],
};
// ================================

document.querySelectorAll('[data-buy]').forEach(a => { a.href = a.dataset.buy === 'basic' ? CONFIG.checkoutBasic : CONFIG.checkoutMain; });
document.getElementById('preco').textContent = CONFIG.preco;
document.getElementById('preco-s').textContent = CONFIG.preco;
document.getElementById('preco-basic').textContent = CONFIG.precoBasic;
document.getElementById('ano').textContent = new Date().getFullYear();
if (CONFIG.emailSuporte) document.getElementById('email').textContent = CONFIG.emailSuporte;
document.getElementById('fim').textContent = new Date(CONFIG.fimDaOferta).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

// "por dentro do livro": duas fileiras que rolam sozinhas em sentidos opostos
[['row1', CONFIG.amostras], ['row2', CONFIG.amostras2]].forEach(([id, lista]) => {
  const t = document.getElementById(id);
  const html = lista.map(n => `<img src="assets/m/${n}.webp" alt="" height="210">`).join('');
  t.innerHTML = html + html;
});

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

// barra fixa no celular: aparece depois do topo e some na área de preço
const sticky = document.getElementById('sticky');
const pricing = document.getElementById('pricing');
function sticks() {
  const r = pricing.getBoundingClientRect();
  sticky.classList.toggle('on', scrollY > 500 && !(r.top < innerHeight && r.bottom > 0));
}
addEventListener('scroll', sticks, { passive: true }); sticks();

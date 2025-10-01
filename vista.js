(function createHearts(){
  const overlay = document.getElementById('heartsOverlay');
  if(!overlay) return;
  const count = 18;
  for(let i=0;i<count;i++){
    const span = document.createElement('span');
    span.className = 'heart';
    span.textContent = '💖';
    // posición inicial aleatoria
    span.style.left = (Math.random()*100) + 'vw';
    span.style.bottom = (-10 - Math.random()*40) + 'vh';
    // duración y delay aleatorios
    const dur = 8 + Math.random()*10;
    span.style.animationDuration = dur + 's';
    span.style.animationDelay = (Math.random()*-10) + 's';
    span.style.fontSize = (14 + Math.random()*28) + 'px';
    overlay.appendChild(span);
    // limpiar después de terminar animación (opcional)
    setTimeout(()=>{ span.remove(); }, (dur + 1) * 1000);
    // recrear corazón para loop (simple)
    setInterval(()=>{
      if(!document.body.contains(span)){
        // nothing
      } else {
        // reinicia posición (para navegadores que no recarguen)
        span.style.left = (Math.random()*100) + 'vw';
      }
    }, 7000 + Math.random()*5000);
  }
})();

/* ---- Modal de mensaje (cada emoji) ---- */
const emojiBtns = document.querySelectorAll('.emoji-btn');
const msgModal = document.getElementById('msgModal');
const msgInner = document.getElementById('msgModalInner');
const closeMsg = document.getElementById('closeMsg');

emojiBtns.forEach(btn=>{
  btn.addEventListener('click', () => {
    const text = btn.dataset.message || 'Un mensajito 💌';
    // contenido con pequeño estilo
    msgInner.innerHTML = `
      <div style="padding:10px 6px;">
        <p style="margin:0 0 8px;font-size:1.1rem;">${text}</p>
        <small style="opacity:.8"></small>
      </div>
    `;
    msgModal.style.display = 'flex';
  });
});

closeMsg.addEventListener('click', ()=> msgModal.style.display = 'none');
msgModal.addEventListener('click', (e)=> { if(e.target === msgModal) msgModal.style.display = 'none'; });


/* ---- Modal secreto: escritura lenta, input y verificación ---- */
const secretBtn = document.getElementById('secretBtn');
const secretModal = document.getElementById('secretModal');
const closeSecret = document.getElementById('closeSecret');
const typedTextEl = document.getElementById('typedText');
const inputArea = document.getElementById('inputArea');
const codeInput = document.getElementById('codeInput');
const checkCode = document.getElementById('checkCode');
const codeAlert = document.getElementById('codeAlert');
const videoBox = document.getElementById('videoBox');
const secretVideo = document.getElementById('secretVideo');

let typingTimeouts = [];

// función de máquina de escribir (vacía el texto antes)
function typeWrite(text, el, speed = 60, cb){
  // limpiar timeouts previos
  typingTimeouts.forEach(t => clearTimeout(t));
  typingTimeouts = [];
  el.textContent = '';
  for(let i=0;i<text.length;i++){
    const t = setTimeout(() => {
      el.textContent += text.charAt(i);
      if(i === text.length - 1 && typeof cb === 'function') cb();
    }, i * speed);
    typingTimeouts.push(t);
  }
}

// abrir modal secreto
secretBtn.addEventListener('click', () => {
  // reset
  typedTextEl.textContent = '';
  inputArea.classList.add('hidden');
  codeAlert.classList.add('hidden');
  videoBox.classList.add('hidden');
  secretVideo.src = ''; // quitar src previo
  codeInput.value = '';
  secretModal.style.display = 'flex';

  // escribe el texto y luego muestra input
  typeWrite('Este es un video que lo hice con mucho cariño...espero que te guste mucho ❤️BEA❤️', typedTextEl, 50, () => {
    setTimeout(()=> {
      inputArea.classList.remove('hidden');
      codeInput.focus();
    }, 400);
  });
});

// cerrar modal secreto con la X
closeSecret.addEventListener('click', ()=> {
  secretModal.style.display = 'none';
  // detener video si está sonando
  secretVideo.pause();
  secretVideo.currentTime = 0;
  secretVideo.src = '';
});

checkCode.addEventListener('click', () => {
  const val = (codeInput.value || '').trim().toLowerCase();
  if(!val) {
    showCodeAlert('Escribe algo bonito🥰');
    return;
  }

  if (val === 'beatriz') {
    codeAlert.classList.add('hidden');
    secretVideo.src = 'Bea.mp4';
    videoBox.classList.remove('hidden');
    setTimeout(() => videoBox.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  } else {
    showCodeAlert('❌ Clave incorrecta. Intenta nuevamente.');
  }
});

// notificación en escritorio o móvil
function showCodeAlert(msg) {
  if (window.innerWidth <= 768) {
    // En móvil → usar notificación tipo toast
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  } else {
    // En escritorio → SweetAlert normal
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: msg,
      confirmButtonColor: '#d33',
    });
  }
}

// cerrar modales al hacer click fuera
window.addEventListener('click', (evt) => {
  if(evt.target === secretModal) {
    secretModal.style.display = 'none';
    // detener video también
    secretVideo.pause();
    secretVideo.currentTime = 0;
    secretVideo.src = '';
  }
  if(evt.target === msgModal) msgModal.style.display = 'none';
});

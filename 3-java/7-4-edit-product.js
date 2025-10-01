/* ----------------- Sidebar toggle ----------------- */
const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const closeSidebar = document.getElementById('closeSidebar');

function toggleSidebar() {
  if (!sidebar) return;
  sidebar.classList.toggle('active');
}

// كليك في أي حتة برا يقفل السايدبار
document.addEventListener('click', (e) => {
  if (!sidebar || !hamburger) return;
  const clickedInside = sidebar.contains(e.target);
  const clickedToggle = hamburger.contains(e.target) || (closeSidebar && closeSidebar.contains(e.target));
  if (sidebar.classList.contains('active') && !clickedInside && !clickedToggle) {
    sidebar.classList.remove('active');
  }
});

/* ---------- logout ---------- */
let logoutEl = document.getElementById('logout')
  || Array.from(document.querySelectorAll('.sidebar a')).find(a =>
    /log\s*out|تسجيل الخروج|log out/i.test(a.textContent));
if (logoutEl) {
  logoutEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('هل تريد تسجيل الخروج؟')) {
      window.location.href = 'login.html';
    }
  });
}

/* ---------- toast helper ---------- */
const toastEl = document.getElementById('toast');
function showToast(text = 'Saved') {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.style.display = 'block';
  setTimeout(() => { toastEl.style.display = 'none'; }, 1800);
}
window.showToast = showToast;

/* ---------- Add product modal ---------- */
const addBtn = document.getElementById('addBtn');
const addOverlay = document.getElementById('addOverlay');
const addForm = document.getElementById('addForm');
const addImgInput = document.getElementById('addImg');
const addImgPreview = document.getElementById('addImgPreview');
const addCancel = document.getElementById('addCancel');

function hideAddErrors() {
  ['addImgError','addNameError','addPriceError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

if (addBtn && addOverlay && addForm) {
  addBtn.addEventListener('click', () => {
    addForm.reset();
    hideAddErrors();
    if (addImgPreview) {
      addImgPreview.style.backgroundImage = '';
      addImgPreview.textContent = 'No image';
    }
    addOverlay.classList.add('active');
  });

  if (addCancel) addCancel.addEventListener('click', () => addOverlay.classList.remove('active'));

  if (addImgInput && addImgPreview) {
    addImgInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) {
        addImgPreview.style.backgroundImage = '';
        addImgPreview.textContent = 'No image';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        addImgPreview.style.backgroundImage = `url('${reader.result}')`;
        addImgPreview.textContent = '';
      };
      reader.readAsDataURL(f);
    });
  }

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideAddErrors();

    const name = (document.getElementById('addName') || {}).value?.trim() || '';
    const price = parseFloat((document.getElementById('addPrice') || {}).value);
    const imgFile = addImgInput ? addImgInput.files[0] : null;

    let ok = true;
    if (!imgFile) { const el = document.getElementById('addImgError'); if(el) el.style.display = 'block'; ok = false; }
    if (!name) { const el = document.getElementById('addNameError'); if(el) el.style.display = 'block'; ok = false; }
    if (isNaN(price) || price <= 0) { const el = document.getElementById('addPriceError'); if(el) el.style.display = 'block'; ok = false; }

    if (!ok) return;

    const reader = new FileReader();
    reader.onload = () => {
      const masonry = document.getElementById('masonry');
      if (!masonry) return;
      const newId = Date.now();
      const div = document.createElement('div');
      div.className = 'product-card';
      div.dataset.id = newId;
      div.dataset.name = name;
      div.dataset.price = price;
      div.dataset.img = reader.result;
      div.innerHTML = `
        <div class="product-thumb" style="background-image:url('${reader.result}')"></div>
        <div class="product-info">
          <div>
            <div class="product-title">${escapeHtml(name)}</div>
            <div class="product-price">EGP ${escapeHtml(price)}</div>
          </div>
          <div class="product-actions">
            <button class="edit-btn" data-action="edit">Edit</button>
          </div>
        </div>
      `;
      masonry.prepend(div);
      addOverlay.classList.remove('active');
      showToast('Product published');
    };
    reader.readAsDataURL(imgFile);
  });
}

/* ---------- Edit product modal ---------- */
const editOverlay = document.getElementById('editOverlay');
const editForm = document.getElementById('editForm');
const editImgInput = document.getElementById('editImg');
const editImgPreview = document.getElementById('editImgPreview');

function hideEditErrors() {
  ['editImgError','editNameError','editPriceError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

const masonryEl = document.getElementById('masonry');
if (masonryEl) {
  masonryEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.edit-btn');
    if (!btn) return;
    const card = e.target.closest('.product-card');
    if (!card) return;
    openEditModal(card);
  });
}

function openEditModal(card) {
  if (!editOverlay || !editForm) return;
  const idEl = document.getElementById('editId');
  if (idEl) idEl.value = card.dataset.id || '';
  const nameEl = document.getElementById('editName');
  if (nameEl) nameEl.value = card.dataset.name || '';
  const priceEl = document.getElementById('editPrice');
  if (priceEl) priceEl.value = card.dataset.price || '';
  const descEl = document.getElementById('editDesc');
  if (descEl) descEl.value = card.dataset.desc || '';
  const discEl = document.getElementById('editDiscount');
  if (discEl) discEl.value = card.dataset.discount || '';

  const src = card.dataset.img || '';
  if (editImgPreview) {
    if (src) {
      editImgPreview.style.backgroundImage = `url('${src}')`;
      editImgPreview.textContent = '';
    } else {
      editImgPreview.style.backgroundImage = '';
      editImgPreview.textContent = 'No image';
    }
  }
  hideEditErrors();
  editOverlay.classList.add('active');
}

const editCancel = document.getElementById('editCancel');
if (editCancel) editCancel.addEventListener('click', () => editOverlay && editOverlay.classList.remove('active'));

if (editImgInput && editImgPreview) {
  editImgInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      editImgPreview.style.backgroundImage = `url('${reader.result}')`;
      editImgPreview.textContent = '';
    };
    reader.readAsDataURL(f);
  });
}

if (editForm) {
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideEditErrors();
    const id = (document.getElementById('editId') || {}).value || '';
    const name = (document.getElementById('editName') || {}).value?.trim() || '';
    const price = parseFloat((document.getElementById('editPrice') || {}).value);
    const discount = (document.getElementById('editDiscount') || {}).value?.trim() || '';
    const desc = (document.getElementById('editDesc') || {}).value?.trim() || '';
    const imgFile = editImgInput ? editImgInput.files[0] : null;

    let ok = true;
    if (!name) { const el = document.getElementById('editNameError'); if (el) el.style.display = 'block'; ok = false; }
    if (isNaN(price) || price <= 0) { const el = document.getElementById('editPriceError'); if (el) el.style.display = 'block'; ok = false; }
    if (!ok) return;

    const card = document.querySelector(`.product-card[data-id="${id}"]`);
    if (imgFile && card) {
      const reader = new FileReader();
      reader.onload = () => {
        card.dataset.img = reader.result;
        const thumb = card.querySelector('.product-thumb');
        if (thumb) thumb.style.backgroundImage = `url('${reader.result}')`;
        applyEditToCard(card, name, price, discount, desc);
        editOverlay.classList.remove('active');
        showToast('Product updated');
      };
      reader.readAsDataURL(imgFile);
    } else {
      if (card) {
        applyEditToCard(card, name, price, discount, desc);
        editOverlay.classList.remove('active');
        showToast('Product updated');
      } else {
        editOverlay.classList.remove('active');
        showToast('Updated (no matching card found)');
      }
    }
  });
}

function applyEditToCard(card, name, price, discount, desc) {
  card.dataset.name = name;
  card.dataset.price = price;
  if (discount !== '') card.dataset.discount = discount;
  if (desc !== '') card.dataset.desc = desc;
  const title = card.querySelector('.product-title');
  if (title) title.textContent = name;
  const priceEl = card.querySelector('.product-price');
  if (priceEl) priceEl.textContent = `EGP ${price}`;
}

/* ---------- overlays close on background click ---------- */
document.querySelectorAll('.overlay').forEach(ov => {
  ov.addEventListener('click', (e) => {
    if (e.target === ov) ov.classList.remove('active');
  });
});

/* ---------- utility ---------- */
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[&<"'>]/g, function (m) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m];
  });
}
window.escapeHtml = escapeHtml;

/* ---------- set page title ---------- */
const pageTitle = document.getElementById('pageTitle');
if (pageTitle) pageTitle.textContent = 'Products';

const lines = [
  {
    id: 1,
    factoryName: 'Aurora Setting House',
    barcode: 'UID-20481',
    webOrder: '',
    style: 'Oval Solitaire / 18K',
    cadFile: 'oval-solitaire-v2.step',
    specFile: 'oval-solitaire-spec.pdf',
    eta: '2026-03-22',
    status: 'File Uploaded',
    updatedAt: '2026-03-18 08:45 UTC',
    note: 'Stone dimensions confirmed. Gallery rail updated before production release.',
    messages: [
      { author: 'Factory', body: 'Initial CAD and spec sheet uploaded for approval.', time: '08:45 UTC' }
    ]
  },
  {
    id: 2,
    factoryName: 'Nova Benchworks',
    barcode: '',
    webOrder: 'WEB-903144',
    style: 'Hidden Halo / Platinum',
    cadFile: 'hidden-halo-r3.step',
    specFile: 'hidden-halo-r3.pdf',
    eta: '2026-03-24',
    status: 'Revision',
    updatedAt: '2026-03-18 09:15 UTC',
    note: 'Please confirm cathedral shoulder thickness after previous comments.',
    messages: [
      { author: 'Factory', body: 'Updated CAD pack attached with slimmer basket profile.', time: '09:02 UTC' },
      { author: 'Admin', body: 'Please revise shoulder thickness to match approved render and re-upload.', time: '09:15 UTC' }
    ]
  },
  {
    id: 3,
    factoryName: 'Meridian Atelier',
    barcode: 'UID-88310',
    webOrder: 'WEB-903201',
    style: 'Three Stone Trellis / 14K',
    cadFile: 'trellis-final.step',
    specFile: 'trellis-final.pdf',
    eta: '2026-03-20',
    status: 'Approved',
    updatedAt: '2026-03-18 07:10 UTC',
    note: 'Approved for production once stone seat depth is confirmed internally.',
    messages: [
      { author: 'Factory', body: 'Final trellis update uploaded for sign-off.', time: '07:00 UTC' },
      { author: 'Admin', body: 'Approved. Ring can move into production.', time: '07:10 UTC' }
    ]
  }
];

let selectedLineId = lines[0]?.id ?? null;

const factoryTableBody = document.querySelector('#factory-table-body');
const adminLineList = document.querySelector('#admin-line-list');
const detail = document.querySelector('#admin-detail');
const emptyState = document.querySelector('#admin-empty-state');
const detailTitle = document.querySelector('#detail-title');
const detailStatusBadge = document.querySelector('#detail-status-badge');
const detailMeta = document.querySelector('#detail-meta');
const detailFiles = document.querySelector('#detail-files');
const chatThread = document.querySelector('#chat-thread');
const lineCountChip = document.querySelector('#line-count-chip');
const uploadedCount = document.querySelector('#uploaded-count');
const revisionCount = document.querySelector('#revision-count');
const approvedCount = document.querySelector('#approved-count');
const formMessage = document.querySelector('#form-message');

function createStatusBadge(status) {
  return `<span class="status-badge" data-status="${status}">${status}</span>`;
}

function renderFactoryTable() {
  factoryTableBody.innerHTML = lines
    .map(
      (line) => `
        <tr>
          <td>
            <strong>${line.factoryName}</strong>
            <div class="muted">${line.style}</div>
          </td>
          <td>
            <div>Barcode/UID: ${line.barcode || '—'}</div>
            <div>Web Order: ${line.webOrder || '—'}</div>
          </td>
          <td>
            <div>${line.cadFile}</div>
            <div>${line.specFile}</div>
          </td>
          <td>${createStatusBadge(line.status)}</td>
          <td>${line.updatedAt}</td>
        </tr>`
    )
    .join('');

  lineCountChip.textContent = `${lines.length} active lines`;
}

function renderAdminList() {
  adminLineList.innerHTML = lines
    .map(
      (line) => `
      <button class="admin-line-card ${line.id === selectedLineId ? 'active' : ''}" data-line-id="${line.id}">
        <strong>${line.style}</strong>
        <p>${line.factoryName}</p>
        <p>${line.barcode || line.webOrder}</p>
        <div style="margin-top: 12px;">${createStatusBadge(line.status)}</div>
      </button>`
    )
    .join('');
}

function renderAdminDetail() {
  const line = lines.find((entry) => entry.id === selectedLineId);

  if (!line) {
    detail.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  detail.classList.remove('hidden');
  emptyState.classList.add('hidden');

  detailTitle.textContent = `${line.style} · ${line.factoryName}`;
  detailStatusBadge.dataset.status = line.status;
  detailStatusBadge.textContent = line.status;

  detailMeta.innerHTML = `
    <article>
      <strong>Barcode / UID</strong>
      <p>${line.barcode || 'Not provided'}</p>
    </article>
    <article>
      <strong>Web Order #</strong>
      <p>${line.webOrder || 'Not provided'}</p>
    </article>
    <article>
      <strong>Requested approval</strong>
      <p>${line.eta}</p>
    </article>
    <article>
      <strong>Factory note</strong>
      <p>${line.note || 'No note added.'}</p>
    </article>
  `;

  detailFiles.innerHTML = `
    <article class="file-card">
      <strong>CAD file</strong>
      <p>${line.cadFile}</p>
    </article>
    <article class="file-card">
      <strong>Spec sheet</strong>
      <p>${line.specFile}</p>
    </article>
  `;

  chatThread.innerHTML = line.messages
    .map(
      (message) => `
      <article class="message ${message.author.toLowerCase()}">
        <header>
          <strong>${message.author}</strong>
          <time>${message.time}</time>
        </header>
        <p>${message.body}</p>
      </article>`
    )
    .join('');
}

function renderMetrics() {
  uploadedCount.textContent = lines.filter((line) => line.status === 'File Uploaded').length;
  revisionCount.textContent = lines.filter((line) => line.status === 'Revision').length;
  approvedCount.textContent = lines.filter((line) => line.status === 'Approved').length;
}

function rerender() {
  renderFactoryTable();
  renderAdminList();
  renderAdminDetail();
  renderMetrics();
}

function setStatus(status, commentBody) {
  const line = lines.find((entry) => entry.id === selectedLineId);
  if (!line) return;

  line.status = status;
  line.updatedAt = '2026-03-18 10:00 UTC';

  if (commentBody) {
    line.messages.push({ author: 'Admin', body: commentBody, time: '10:00 UTC' });
  }

  rerender();
}

document.querySelector('#line-form').addEventListener('submit', (event) => {
  event.preventDefault();
  formMessage.style.color = '#fda4af';
  formMessage.textContent = '';

  const formData = new FormData(event.currentTarget);
  const barcode = String(formData.get('barcode') || '').trim();
  const webOrder = String(formData.get('webOrder') || '').trim();

  if (!barcode && !webOrder) {
    formMessage.textContent = 'Please provide either a Barcode/UID or a Web Order Number.';
    return;
  }

  const newLine = {
    id: Date.now(),
    factoryName: String(formData.get('factoryName')).trim(),
    barcode,
    webOrder,
    style: String(formData.get('style')).trim(),
    cadFile: String(formData.get('cadFile')).trim(),
    specFile: String(formData.get('specFile')).trim(),
    eta: String(formData.get('eta')).trim(),
    status: 'File Uploaded',
    updatedAt: '2026-03-18 10:00 UTC',
    note: String(formData.get('note')).trim(),
    messages: [{ author: 'Factory', body: 'New CAD/spec pack uploaded and waiting for admin review.', time: '10:00 UTC' }]
  };

  lines.unshift(newLine);
  selectedLineId = newLine.id;
  event.currentTarget.reset();
  rerender();
  formMessage.style.color = '#86efac';
  formMessage.textContent = 'Line uploaded successfully. Admin can now review it.';
});

document.querySelector('#chat-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#chat-input');
  const body = input.value.trim();

  if (!body) return;

  const line = lines.find((entry) => entry.id === selectedLineId);
  if (!line) return;

  line.messages.push({ author: 'Admin', body, time: '10:00 UTC' });
  line.updatedAt = '2026-03-18 10:00 UTC';
  input.value = '';
  rerender();
});

document.addEventListener('click', (event) => {
  const navButton = event.target.closest('[data-view-target]');
  if (navButton) {
    const targetId = navButton.dataset.viewTarget;
    document.querySelectorAll('.nav-card').forEach((button) => button.classList.toggle('active', button === navButton));
    document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === targetId));
  }

  const adminCard = event.target.closest('[data-line-id]');
  if (adminCard) {
    selectedLineId = Number(adminCard.dataset.lineId);
    rerender();
  }

  const statusAction = event.target.closest('[data-status-action]');
  if (statusAction) {
    const status = statusAction.dataset.statusAction;
    const note =
      status === 'Revision'
        ? 'Marked as revision. Please review the latest comments and upload an updated CAD/spec pack.'
        : 'Approved. Files are accepted and the ring can move toward production.';
    setStatus(status, note);
  }
});

rerender();

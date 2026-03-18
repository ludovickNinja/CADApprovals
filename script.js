const TODAY = '2026-03-18';
const TIMESTAMP = '2026-03-18 10:00 UTC';
const CREATIONS_FACTORY = 'Creations';
const MESSAGE_TIME = '10:00 UTC';

const uidCatalog = {
  'UID-20481': {
    webOrder: 'WEB-903144',
    style: 'Oval Solitaire / 18K',
    cadFile: 'oval-solitaire-v2.step',
    specFile: 'oval-solitaire-spec.pdf',
    note: 'Stone dimensions confirmed. Gallery rail updated before production release.'
  },
  'UID-88310': {
    webOrder: 'WEB-903201',
    style: 'Three Stone Trellis / 14K',
    cadFile: 'trellis-final.step',
    specFile: 'trellis-final.pdf',
    note: 'Approved profile retained for production handoff.'
  },
  'UID-77142': {
    webOrder: 'WEB-903322',
    style: 'Hidden Halo / Platinum',
    cadFile: 'hidden-halo-r4.step',
    specFile: 'hidden-halo-r4.pdf',
    note: 'Center stone seat and hidden halo spacing verified against Creations SKU data.'
  }
};

const lines = [
  {
    id: 1,
    factoryName: CREATIONS_FACTORY,
    barcode: 'UID-20481',
    webOrder: 'WEB-903144',
    style: 'Oval Solitaire / 18K',
    cadFile: 'oval-solitaire-v2.step',
    specFile: 'oval-solitaire-spec.pdf',
    eta: '2026-03-18',
    status: 'File Uploaded',
    updatedAt: '2026-03-18 08:45 UTC',
    note: 'Stone dimensions confirmed. Gallery rail updated before production release.',
    messages: [{ author: 'Factory', body: 'Initial CAD and spec sheet uploaded for approval.', time: '08:45 UTC' }]
  },
  {
    id: 2,
    factoryName: CREATIONS_FACTORY,
    barcode: '',
    webOrder: 'WEB-903322',
    style: 'Hidden Halo / Platinum',
    cadFile: 'hidden-halo-r3.step',
    specFile: 'hidden-halo-r3.pdf',
    eta: '2026-03-18',
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
    factoryName: CREATIONS_FACTORY,
    barcode: 'UID-88310',
    webOrder: 'WEB-903201',
    style: 'Three Stone Trellis / 14K',
    cadFile: 'trellis-final.step',
    specFile: 'trellis-final.pdf',
    eta: '2026-03-18',
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
let selectedFactoryLineId = lines[0]?.id ?? null;

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
const lineForm = document.querySelector('#line-form');
const factoryNameInput = document.querySelector('#factory-name');
const barcodeInput = document.querySelector('#barcode');
const webOrderInput = document.querySelector('#web-order');
const styleInput = document.querySelector('#style');
const cadFileInput = document.querySelector('#cad-file');
const specFileInput = document.querySelector('#spec-file');
const etaInput = document.querySelector('#eta');
const noteInput = document.querySelector('#factory-note');
const factoryDetail = document.querySelector('#factory-detail');
const factoryEmptyState = document.querySelector('#factory-empty-state');
const factoryDetailTitle = document.querySelector('#factory-detail-title');
const factoryDetailStatus = document.querySelector('#factory-detail-status');
const factoryDetailMeta = document.querySelector('#factory-detail-meta');
const factoryDetailFiles = document.querySelector('#factory-detail-files');
const factoryChatThread = document.querySelector('#factory-chat-thread');
const factoryChatForm = document.querySelector('#factory-chat-form');
const factoryChatInput = document.querySelector('#factory-chat-input');
const factoryDiscussionCopy = document.querySelector('#factory-discussion-copy');

function createStatusBadge(status) {
  return `<span class="status-badge" data-status="${status}">${status}</span>`;
}

function normalizeUid(value) {
  return value.trim().toUpperCase();
}

function createFileCard(label, fileName, description) {
  return `
    <article class="file-card">
      <strong>${label}</strong>
      <p>${fileName}</p>
      <small>${description}</small>
    </article>
  `;
}

function createMessageMarkup(message) {
  return `
    <article class="message ${message.author.toLowerCase()}">
      <header>
        <strong>${message.author}</strong>
        <time>${message.time}</time>
      </header>
      <p>${message.body}</p>
    </article>`;
}

function applyUidAutofill(uid) {
  const lookup = uidCatalog[normalizeUid(uid)];
  const isKnownUid = Boolean(lookup);

  factoryNameInput.value = CREATIONS_FACTORY;

  if (isKnownUid) {
    webOrderInput.value = lookup.webOrder;
    styleInput.value = lookup.style;
    cadFileInput.value = lookup.cadFile;
    specFileInput.value = lookup.specFile;
    noteInput.value = lookup.note;
    etaInput.value = TODAY;
    formMessage.style.color = '#2563eb';
    formMessage.textContent = `UID recognized. Linked Creations order details were filled in for ${normalizeUid(uid)}.`;
    return;
  }

  if (normalizeUid(uid)) {
    webOrderInput.value = '';
    styleInput.value = '';
    cadFileInput.value = '';
    specFileInput.value = '';
    noteInput.value = '';
    etaInput.value = TODAY;
    formMessage.style.color = '#f59e0b';
    formMessage.textContent = 'UID not found in the Creations lookup yet. Enter the remaining details manually.';
    return;
  }

  webOrderInput.value = '';
  styleInput.value = '';
  cadFileInput.value = '';
  specFileInput.value = '';
  noteInput.value = '';
  etaInput.value = TODAY;
  formMessage.textContent = '';
}

function renderFactoryTable() {
  factoryTableBody.innerHTML = lines
    .map(
      (line) => `
        <tr class="factory-row ${line.id === selectedFactoryLineId ? 'active' : ''}" data-factory-line-id="${line.id}">
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

  detailFiles.innerHTML = [
    createFileCard('CAD file', line.cadFile, 'Primary geometry package submitted by the factory.'),
    createFileCard('Spec sheet', line.specFile, 'Reference dimensions and manufacturing notes for admin review.')
  ].join('');

  chatThread.innerHTML = line.messages.map(createMessageMarkup).join('');
}

function renderFactoryDetail() {
  const line = lines.find((entry) => entry.id === selectedFactoryLineId);

  if (!line) {
    factoryDetail.classList.add('hidden');
    factoryEmptyState.classList.remove('hidden');
    return;
  }

  factoryDetail.classList.remove('hidden');
  factoryEmptyState.classList.add('hidden');

  factoryDetailTitle.textContent = `${line.style} · ${line.factoryName}`;
  factoryDetailStatus.dataset.status = line.status;
  factoryDetailStatus.textContent = line.status;

  factoryDetailMeta.innerHTML = `
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
      <strong>Last updated</strong>
      <p>${line.updatedAt}</p>
    </article>
    <article>
      <strong>Factory note</strong>
      <p>${line.note || 'No note added.'}</p>
    </article>
    <article>
      <strong>Discussion access</strong>
      <p>${line.status === 'Revision' ? 'Enabled for this revision cycle.' : 'Available only after admin marks the line as Revision.'}</p>
    </article>
  `;

  factoryDetailFiles.innerHTML = [
    createFileCard('CAD file provided', line.cadFile, 'The CAD file currently attached to this submission.'),
    createFileCard('Spec sheet provided', line.specFile, 'The matching specification sheet shared with admin.'),
    createFileCard('Submission status', line.status, 'Current decision state for this exact file package.'),
    createFileCard('Package timestamp', line.updatedAt, 'Most recent time this line or thread was updated.')
  ].join('');

  if (line.status === 'Revision') {
    factoryDiscussionCopy.textContent = 'Admin comments and factory replies are available while the line is in Revision.';
    factoryChatThread.innerHTML = line.messages.map(createMessageMarkup).join('');
    factoryChatForm.classList.remove('hidden');
  } else {
    factoryDiscussionCopy.textContent = 'Discussion becomes available when a line is marked as Revision.';
    factoryChatThread.innerHTML = `
      <article class="message system-message">
        <header>
          <strong>Discussion locked</strong>
          <time>${line.updatedAt}</time>
        </header>
        <p>This line is currently ${line.status}. Select a Revision line to review admin comments and respond.</p>
      </article>`;
    factoryChatForm.classList.add('hidden');
    factoryChatInput.value = '';
  }
}

function renderMetrics() {
  uploadedCount.textContent = lines.filter((line) => line.status === 'File Uploaded').length;
  revisionCount.textContent = lines.filter((line) => line.status === 'Revision').length;
  approvedCount.textContent = lines.filter((line) => line.status === 'Approved').length;
}

function rerender() {
  renderFactoryTable();
  renderFactoryDetail();
  renderAdminList();
  renderAdminDetail();
  renderMetrics();
}

function setStatus(status, commentBody) {
  const line = lines.find((entry) => entry.id === selectedLineId);
  if (!line) return;

  line.status = status;
  line.updatedAt = TIMESTAMP;

  if (commentBody) {
    line.messages.push({ author: 'Admin', body: commentBody, time: MESSAGE_TIME });
  }

  selectedFactoryLineId = line.id;
  rerender();
}

barcodeInput.addEventListener('input', () => {
  applyUidAutofill(barcodeInput.value);
});

lineForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formMessage.style.color = '#fda4af';
  formMessage.textContent = '';

  const formData = new FormData(event.currentTarget);
  const barcode = normalizeUid(String(formData.get('barcode') || ''));
  const webOrder = String(formData.get('webOrder') || '').trim();

  if (!barcode && !webOrder) {
    formMessage.textContent = 'Please provide either a Barcode/UID or a Web Order Number.';
    return;
  }

  const knownUid = uidCatalog[barcode];

  const newLine = {
    id: Date.now(),
    factoryName: CREATIONS_FACTORY,
    barcode,
    webOrder: webOrder || knownUid?.webOrder || '',
    style: String(formData.get('style')).trim(),
    cadFile: String(formData.get('cadFile')).trim(),
    specFile: String(formData.get('specFile')).trim(),
    eta: String(formData.get('eta')).trim() || TODAY,
    status: 'File Uploaded',
    updatedAt: TIMESTAMP,
    note: String(formData.get('note')).trim(),
    messages: [{ author: 'Factory', body: 'New CAD/spec pack uploaded and waiting for admin review.', time: MESSAGE_TIME }]
  };

  lines.unshift(newLine);
  selectedLineId = newLine.id;
  selectedFactoryLineId = newLine.id;
  event.currentTarget.reset();
  factoryNameInput.value = CREATIONS_FACTORY;
  etaInput.value = TODAY;
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

  line.messages.push({ author: 'Admin', body, time: MESSAGE_TIME });
  line.updatedAt = TIMESTAMP;
  selectedFactoryLineId = line.id;
  input.value = '';
  rerender();
});

factoryChatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const body = factoryChatInput.value.trim();

  if (!body) return;

  const line = lines.find((entry) => entry.id === selectedFactoryLineId);
  if (!line || line.status !== 'Revision') return;

  line.messages.push({ author: 'Factory', body, time: MESSAGE_TIME });
  line.updatedAt = TIMESTAMP;
  selectedLineId = line.id;
  factoryChatInput.value = '';
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

  const factoryRow = event.target.closest('[data-factory-line-id]');
  if (factoryRow) {
    const lineId = Number(factoryRow.dataset.factoryLineId);
    selectedFactoryLineId = lineId;
    selectedLineId = lineId;
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

factoryNameInput.value = CREATIONS_FACTORY;
etaInput.value = TODAY;
rerender();

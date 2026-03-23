const TODAY = '2026-03-18';
const TIMESTAMP = '2026-03-18 10:00 UTC';
const CROWNRING_REVIEWER = 'CrownRing';
const MESSAGE_TIME = '10:00 UTC';
const FACTORIES = ['Creations', 'Uni-Design'];
const PREVIEWABLE_MIME_PREFIXES = ['image/'];
const PREVIEWABLE_MIME_TYPES = ['application/pdf', 'text/plain'];

const uidCatalog = {
  Creations: {
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
  },
  'Uni-Design': {
    'UNI-50192': {
      webOrder: 'WEB-905880',
      style: 'Signature Hidden Halo / 18K',
      cadFile: 'signature-halo-r2.step',
      specFile: 'signature-halo-r2.pdf',
      sampleSet: 'SET-118',
      metalCallout: '18K Yellow / Bright polish',
      note: 'Sample set includes alternate head options for CrownRing merchandising review.'
    },
    'UNI-77431': {
      webOrder: 'WEB-905991',
      style: 'Split Shank Cushion / Platinum',
      cadFile: 'split-shank-cushion-r5.step',
      specFile: 'split-shank-cushion-r5.pdf',
      sampleSet: 'SET-122',
      metalCallout: 'Platinum / High polish',
      note: 'Plating and shoulder profile aligned to the showroom sample request.'
    },
    'UNI-66420': {
      webOrder: 'WEB-906114',
      style: 'Cathedral Emerald / 14K',
      cadFile: 'cathedral-emerald-r3.step',
      specFile: 'cathedral-emerald-r3.pdf',
      sampleSet: 'SET-124',
      metalCallout: '14K White / Rhodium',
      note: 'Assembly note added for the under-gallery and bridge support.'
    }
  }
};


function createFileRecord(value, fallbackType = '') {
  if (!value) return null;

  if (typeof value === 'string') {
    return {
      name: value,
      url: '',
      type: fallbackType || '',
      previewable: false,
      source: 'catalog'
    };
  }

  if (value instanceof File) {
    if (!value.name) return null;
    const type = value.type || fallbackType || '';
    return {
      name: value.name,
      url: URL.createObjectURL(value),
      type,
      previewable: PREVIEWABLE_MIME_TYPES.includes(type) || PREVIEWABLE_MIME_PREFIXES.some((prefix) => type.startsWith(prefix)),
      source: 'upload'
    };
  }

  return value;
}

function hydrateLineFiles(line) {
  return {
    ...line,
    cadFile: createFileRecord(line.cadFile),
    specFile: createFileRecord(line.specFile, 'application/pdf')
  };
}

function hydrateCatalogFiles(catalog) {
  Object.values(catalog).forEach((entry) => {
    entry.cadFile = createFileRecord(entry.cadFile);
    entry.specFile = createFileRecord(entry.specFile, 'application/pdf');
  });
}

function getFileName(file) {
  return file?.name || 'Not provided';
}

function createFileLinkMarkup(file, linkLabel = 'Open file') {
  if (!file) {
    return '<p>No file attached</p>';
  }

  if (!file.url) {
    return `<p>${file.name}</p>`;
  }

  return `
    <p>${file.name}</p>
    <a class="file-link" href="${file.url}" target="_blank" rel="noreferrer">${linkLabel}</a>
  `;
}

function createFilePreviewMarkup(file) {
  if (!file?.url || !file.previewable) {
    return '<p class="file-preview-empty">Preview becomes available here when the uploaded file can be rendered in the browser.</p>';
  }

  if (file.type === 'application/pdf') {
    return `<iframe class="file-preview-frame" src="${file.url}" title="${file.name}"></iframe>`;
  }

  if (file.type.startsWith('image/')) {
    return `<img class="file-preview-image" src="${file.url}" alt="Preview of ${file.name}" />`;
  }

  return `<iframe class="file-preview-frame" src="${file.url}" title="${file.name}"></iframe>`;
}

const lines = [
  {
    id: 1,
    factoryName: 'Creations',
    barcode: 'UID-20481',
    webOrder: 'WEB-903144',
    style: 'Oval Solitaire / 18K',
    cadFile: 'oval-solitaire-v2.step',
    specFile: 'oval-solitaire-spec.pdf',
    eta: '2026-03-18',
    status: 'File Uploaded',
    updatedAt: '2026-03-18 08:45 UTC',
    note: 'Stone dimensions confirmed. Gallery rail updated before production release.',
    messages: [{ author: 'Creations', body: 'Initial CAD and spec sheet uploaded for approval.', time: '08:45 UTC' }]
  },
  {
    id: 2,
    factoryName: 'Creations',
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
      { author: 'Creations', body: 'Updated CAD pack attached with slimmer basket profile.', time: '09:02 UTC' },
      { author: CROWNRING_REVIEWER, body: 'Please revise shoulder thickness to match approved render and re-upload.', time: '09:15 UTC' }
    ]
  },
  {
    id: 3,
    factoryName: 'Creations',
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
      { author: 'Creations', body: 'Final trellis update uploaded for sign-off.', time: '07:00 UTC' },
      { author: CROWNRING_REVIEWER, body: 'Approved. Ring can move into production.', time: '07:10 UTC' }
    ]
  },
  {
    id: 4,
    factoryName: 'Creations',
    barcode: 'UID-77142',
    webOrder: 'WEB-903322',
    style: 'Hidden Halo / Platinum',
    cadFile: 'hidden-halo-r4.step',
    specFile: 'hidden-halo-r4.pdf',
    eta: '2026-03-19',
    status: 'File Uploaded',
    updatedAt: '2026-03-18 09:36 UTC',
    note: 'Center stone seat and hidden halo spacing verified against Creations SKU data.',
    messages: [{ author: 'Creations', body: 'New hidden halo revision uploaded with updated seat depth.', time: '09:36 UTC' }]
  },
  {
    id: 5,
    factoryName: 'Creations',
    barcode: 'UID-66412',
    webOrder: 'WEB-903410',
    style: 'Radiant Cathedral / 18K',
    cadFile: 'radiant-cathedral-r2.step',
    specFile: 'radiant-cathedral-r2.pdf',
    eta: '2026-03-20',
    status: 'Revision',
    updatedAt: '2026-03-18 09:48 UTC',
    note: 'Awaiting feedback on gallery clearance around hidden halo baskets.',
    messages: [
      { author: 'Creations', body: 'Sharing updated cathedral shoulders and hidden halo basket clearance.', time: '09:22 UTC' },
      { author: CROWNRING_REVIEWER, body: 'Please open the gallery by 0.2mm and confirm center-stone clearance in the next upload.', time: '09:48 UTC' }
    ]
  },
  {
    id: 6,
    factoryName: 'Creations',
    barcode: 'UID-66419',
    webOrder: 'WEB-903512',
    style: 'Knife Edge Pear / 14K',
    cadFile: 'knife-edge-pear-r1.step',
    specFile: 'knife-edge-pear-r1.pdf',
    eta: '2026-03-21',
    status: 'Approved',
    updatedAt: '2026-03-18 08:05 UTC',
    note: 'Surface break on the shoulder adjusted for cleaner casting.',
    messages: [
      { author: 'Creations', body: 'Pear solitaire package uploaded with knife-edge shoulder update.', time: '07:53 UTC' },
      { author: CROWNRING_REVIEWER, body: 'Approved. Geometry and seat layout match the approved concept.', time: '08:05 UTC' }
    ]
  },
  {
    id: 7,
    factoryName: 'Uni-Design',
    barcode: 'UNI-50192',
    webOrder: 'WEB-905880',
    style: 'Signature Hidden Halo / 18K',
    cadFile: 'signature-halo-r2.step',
    specFile: 'signature-halo-r2.pdf',
    eta: '2026-03-18',
    status: 'File Uploaded',
    updatedAt: '2026-03-18 09:05 UTC',
    note: 'Sample set includes alternate head options for CrownRing merchandising review.',
    sampleSet: 'SET-118',
    metalCallout: '18K Yellow / Bright polish',
    messages: [{ author: 'Uni-Design', body: 'Initial sample-set CAD and plating callout uploaded for review.', time: '09:05 UTC' }]
  },
  {
    id: 8,
    factoryName: 'Uni-Design',
    barcode: 'UNI-77431',
    webOrder: 'WEB-905991',
    style: 'Split Shank Cushion / Platinum',
    cadFile: 'split-shank-cushion-r5.step',
    specFile: 'split-shank-cushion-r5.pdf',
    eta: '2026-03-19',
    status: 'Revision',
    updatedAt: '2026-03-18 09:40 UTC',
    note: 'Plating and shoulder profile aligned to the showroom sample request.',
    sampleSet: 'SET-122',
    metalCallout: 'Platinum / High polish',
    messages: [
      { author: 'Uni-Design', body: 'Uploaded revised split shank with sample-set finishing notes.', time: '09:12 UTC' },
      { author: CROWNRING_REVIEWER, body: 'Please reduce the split width near the head and attach the updated plating note.', time: '09:40 UTC' }
    ]
  },
  {
    id: 9,
    factoryName: 'Uni-Design',
    barcode: 'UNI-66420',
    webOrder: 'WEB-906114',
    style: 'Cathedral Emerald / 14K',
    cadFile: 'cathedral-emerald-r3.step',
    specFile: 'cathedral-emerald-r3.pdf',
    eta: '2026-03-20',
    status: 'Approved',
    updatedAt: '2026-03-18 08:52 UTC',
    note: 'Assembly note added for the under-gallery and bridge support.',
    sampleSet: 'SET-124',
    metalCallout: '14K White / Rhodium',
    messages: [
      { author: 'Uni-Design', body: 'Sharing final cathedral emerald package with rhodium callout.', time: '08:34 UTC' },
      { author: CROWNRING_REVIEWER, body: 'Approved. Assembly note and rhodium direction are complete.', time: '08:52 UTC' }
    ]
  },
  {
    id: 10,
    factoryName: 'Uni-Design',
    barcode: 'UNI-66433',
    webOrder: 'WEB-906225',
    style: 'Bezel Marquise / 18K',
    cadFile: 'bezel-marquise-r2.step',
    specFile: 'bezel-marquise-r2.pdf',
    eta: '2026-03-21',
    status: 'File Uploaded',
    updatedAt: '2026-03-18 09:58 UTC',
    note: 'Bezel wall and polish direction tuned to the retail sample brief.',
    sampleSet: 'SET-130',
    metalCallout: '18K Rose / Satin bezel',
    messages: [{ author: 'Uni-Design', body: 'Bezel marquise package uploaded with satin bezel finishing note.', time: '09:58 UTC' }]
  },
  {
    id: 11,
    factoryName: 'Uni-Design',
    barcode: 'UNI-66501',
    webOrder: 'WEB-906318',
    style: 'East-West Oval / 14K',
    cadFile: 'east-west-oval-r4.step',
    specFile: 'east-west-oval-r4.pdf',
    eta: '2026-03-22',
    status: 'Revision',
    updatedAt: '2026-03-18 09:50 UTC',
    note: 'Awaiting final confirmation on low-profile basket and plating mask zones.',
    sampleSet: 'SET-133',
    metalCallout: '14K Yellow / Satin shank + bright prongs',
    messages: [
      { author: 'Uni-Design', body: 'Updated low-profile east-west oval with combined satin and bright finish zones.', time: '09:25 UTC' },
      { author: CROWNRING_REVIEWER, body: 'Please define the plating mask break more clearly near the bridge and re-export the spec.', time: '09:50 UTC' }
    ]
  },
  {
    id: 12,
    factoryName: 'Uni-Design',
    barcode: 'UNI-66514',
    webOrder: 'WEB-906401',
    style: 'Double Halo Pear / Platinum',
    cadFile: 'double-halo-pear-r6.step',
    specFile: 'double-halo-pear-r6.pdf',
    eta: '2026-03-22',
    status: 'Approved',
    updatedAt: '2026-03-18 08:18 UTC',
    note: 'Two-stage halo spacing approved against showroom mockup standards.',
    sampleSet: 'SET-135',
    metalCallout: 'Platinum / Mirror polish',
    messages: [
      { author: 'Uni-Design', body: 'Final double halo pear package uploaded for sign-off.', time: '08:02 UTC' },
      { author: CROWNRING_REVIEWER, body: 'Approved. Halo spacing and mirror polish direction are ready for production.', time: '08:18 UTC' }
    ]
  }
];

hydrateCatalogFiles(uidCatalog.Creations);
hydrateCatalogFiles(uidCatalog['Uni-Design']);

const hydratedLines = lines.map(hydrateLineFiles);
lines.length = 0;
lines.push(...hydratedLines);

let selectedLineId = lines[0]?.id ?? null;
const selectedFactoryLineIds = Object.fromEntries(FACTORIES.map((factory) => [factory, lines.find((line) => line.factoryName === factory)?.id ?? null]));
const factoryFilters = Object.fromEntries(
  FACTORIES.map((factory) => [factory, { query: '', status: 'All Statuses', sort: 'updated-desc' }])
);

const adminLineList = document.querySelector('#admin-line-list');
const detail = document.querySelector('#admin-detail');
const emptyState = document.querySelector('#admin-empty-state');
const detailTitle = document.querySelector('#detail-title');
const detailStatusBadge = document.querySelector('#detail-status-badge');
const detailMeta = document.querySelector('#detail-meta');
const detailFiles = document.querySelector('#detail-files');
const chatThread = document.querySelector('#chat-thread');
const uploadedCount = document.querySelector('#uploaded-count');
const revisionCount = document.querySelector('#revision-count');
const approvedCount = document.querySelector('#approved-count');

function getFactoryRefs(factory) {
  return {
    tableBody: document.querySelector(`[data-factory-table-body="${factory}"]`),
    lineCountChip: document.querySelector(`[data-line-count-chip="${factory}"]`),
    form: document.querySelector(`[data-factory-form="${factory}"]`),
    formMessage: document.querySelector(`[data-form-message="${factory}"]`),
    barcodeInput: document.querySelector(`[data-factory-form="${factory}"] [name="barcode"]`),
    detail: document.querySelector(`[data-factory-detail="${factory}"]`),
    emptyState: document.querySelector(`[data-factory-empty-state="${factory}"]`),
    detailTitle: document.querySelector(`[data-factory-detail-title="${factory}"]`),
    detailStatus: document.querySelector(`[data-factory-detail-status="${factory}"]`),
    detailMeta: document.querySelector(`[data-factory-detail-meta="${factory}"]`),
    detailFiles: document.querySelector(`[data-factory-detail-files="${factory}"]`),
    discussionCopy: document.querySelector(`[data-factory-discussion-copy="${factory}"]`),
    chatThread: document.querySelector(`[data-factory-chat-thread="${factory}"]`),
    chatForm: document.querySelector(`[data-factory-chat-form="${factory}"]`),
    chatInput: document.querySelector(`[data-factory-chat-input="${factory}"]`),
    searchInput: document.querySelector(`[data-queue-search="${factory}"]`),
    statusFilter: document.querySelector(`[data-queue-status-filter="${factory}"]`),
    sortSelect: document.querySelector(`[data-queue-sort="${factory}"]`)
  };
}

function createStatusBadge(status) {
  return `<span class="status-badge" data-status="${status}">${status}</span>`;
}

function normalizeUid(value) {
  return value.trim().toUpperCase();
}

function getMessageRoleClass(author) {
  return author === CROWNRING_REVIEWER ? 'admin' : FACTORIES.includes(author) ? 'factory' : 'system-message';
}

function createFileCard(label, fileName, description) {
  return `
    <article class="file-card">
      <strong>${label}</strong>
      ${createFileLinkMarkup(fileName)}
      <small>${description}</small>
    </article>
  `;
}


function createMessageMarkup(message) {
  return `
    <article class="message ${getMessageRoleClass(message.author)}">
      <header>
        <strong>${message.author}</strong>
        <time>${message.time}</time>
      </header>
      <p>${message.body}</p>
    </article>`;
}

function getLatestComment(line) {
  return [...line.messages].reverse().find((message) => message.author === CROWNRING_REVIEWER) || null;
}

function getVisibleFactoryLines(factory) {
  const filters = factoryFilters[factory];
  const query = filters.query.trim().toLowerCase();

  return [...lines]
    .filter((line) => line.factoryName === factory)
    .filter((line) => {
      const matchesQuery =
        !query ||
        [line.style, line.barcode, line.webOrder, line.status, getFileName(line.cadFile), getFileName(line.specFile), line.sampleSet, line.metalCallout]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const matchesStatus = filters.status === 'All Statuses' || line.status === filters.status;
      return matchesQuery && matchesStatus;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'updated-asc':
          return a.updatedAt.localeCompare(b.updatedAt);
        case 'style-asc':
          return a.style.localeCompare(b.style);
        case 'status-asc':
          return a.status.localeCompare(b.status) || b.updatedAt.localeCompare(a.updatedAt);
        case 'updated-desc':
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });
}

function applyUidAutofill(factory, uid) {
  const refs = getFactoryRefs(factory);
  const lookup = uidCatalog[factory][normalizeUid(uid)];
  const isKnownUid = Boolean(lookup);
  const form = refs.form;

  form.elements.factoryName.value = factory;

  if (isKnownUid) {
    form.elements.webOrder.value = lookup.webOrder;
    form.elements.style.value = lookup.style;
    form.elements.note.value = lookup.note;
    form.elements.eta.value = TODAY;

    refs.formMessage.style.color = '#2563eb';
    refs.formMessage.textContent = `UID recognized. Linked ${factory} order details were filled in for ${normalizeUid(uid)}. Please upload the CAD and spec sheet files before submitting.`;
    return;
  }

  if (normalizeUid(uid)) {
    ['webOrder', 'style', 'note'].forEach((field) => {
      form.elements[field].value = '';
    });
    form.elements.eta.value = TODAY;

    refs.formMessage.style.color = '#f59e0b';
    refs.formMessage.textContent = `UID not found in the ${factory} lookup yet. Enter the remaining details manually.`;
    return;
  }

  form.reset();
  form.elements.factoryName.value = factory;
  form.elements.eta.value = TODAY;
  refs.formMessage.textContent = '';
}

function renderFactoryTable(factory) {
  const refs = getFactoryRefs(factory);
  const visibleLines = getVisibleFactoryLines(factory);
  const selectedVisible = visibleLines.some((line) => line.id === selectedFactoryLineIds[factory]);

  if (!selectedVisible && visibleLines.length) {
    selectedFactoryLineIds[factory] = visibleLines[0].id;
  }

  refs.tableBody.innerHTML = visibleLines.length
    ? visibleLines
        .map(
          (line) => `
        <tr class="factory-row ${line.id === selectedFactoryLineIds[factory] ? 'active' : ''}" data-factory-line-id="${line.id}" data-factory-name="${factory}">
          <td>
            <strong>${line.factoryName}</strong>
            <div class="muted">${line.style}</div>
          </td>
          <td>
            <div>Barcode/UID: ${line.barcode || '—'}</div>
            <div>Web Order: ${line.webOrder || '—'}</div>
            ${line.sampleSet ? `<div>Sample Set: ${line.sampleSet}</div>` : ''}
          </td>
          <td>
            <div>${getFileName(line.cadFile)}</div>
            <div>${getFileName(line.specFile)}</div>
          </td>
          <td>${createStatusBadge(line.status)}</td>
          <td>${line.updatedAt}</td>
        </tr>`
        )
        .join('')
    : `
      <tr>
        <td colspan="5">
          <div class="table-empty-state">No submissions match the current search and filter settings.</div>
        </td>
      </tr>`;

  refs.lineCountChip.textContent = `${visibleLines.length} active line${visibleLines.length === 1 ? '' : 's'}`;
}

function renderAdminList() {
  adminLineList.innerHTML = [...lines]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((line) => {
      const latestComment = getLatestComment(line);
      return `
      <button class="admin-line-card ${line.id === selectedLineId ? 'active' : ''}" data-line-id="${line.id}">
        <strong>${line.style}</strong>
        <p>${line.factoryName}</p>
        <p>${line.barcode || line.webOrder}</p>
        <div class="admin-line-comment">
          <span>CrownRing review</span>
          <p>${latestComment ? latestComment.body : 'No CrownRing comments yet. Review is pending.'}</p>
        </div>
        <div class="admin-line-footer">
          <div>${createStatusBadge(line.status)}</div>
          <small>${line.messages.length} comment${line.messages.length === 1 ? '' : 's'}</small>
        </div>
      </button>`;
    })
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
      <strong>Last updated</strong>
      <p>${line.updatedAt}</p>
    </article>
    <article>
      <strong>${line.factoryName} note</strong>
      <p>${line.note || 'No note added.'}</p>
    </article>
  `;

  detailFiles.innerHTML = [
    createFileCard('CAD file', line.cadFile, 'Primary geometry package submitted by the factory.'),
    createFileCard('Spec sheet', line.specFile, 'Reference dimensions and manufacturing notes for CrownRing review.')
  ].join('');

  detailFiles.insertAdjacentHTML('beforeend', `
    <article class="file-preview-card">
      <strong>CAD preview</strong>
      ${createFilePreviewMarkup(line.cadFile)}
    </article>
    <article class="file-preview-card">
      <strong>Spec sheet preview</strong>
      ${createFilePreviewMarkup(line.specFile)}
    </article>
  `);

  chatThread.innerHTML = line.messages.map(createMessageMarkup).join('');
}

function renderFactoryDetail(factory) {
  const refs = getFactoryRefs(factory);
  const line = lines.find((entry) => entry.id === selectedFactoryLineIds[factory]);

  if (!line) {
    refs.detail.classList.add('hidden');
    refs.emptyState.classList.remove('hidden');
    return;
  }

  refs.detail.classList.remove('hidden');
  refs.emptyState.classList.add('hidden');

  refs.detailTitle.textContent = `${line.style} · ${line.factoryName}`;
  refs.detailStatus.dataset.status = line.status;
  refs.detailStatus.textContent = line.status;

  refs.detailMeta.innerHTML = `
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
      <strong>${factory} note</strong>
      <p>${line.note || 'No note added.'}</p>
    </article>
  `;

  refs.detailFiles.innerHTML = [
    createFileCard('CAD file provided', line.cadFile, 'The CAD file currently attached to this submission.'),
    createFileCard('Spec sheet provided', line.specFile, 'The matching specification sheet shared with CrownRing.'),
    createFileCard('Package timestamp', line.updatedAt, 'Most recent time this line or thread was updated.')
  ].join('');

  if (line.status === 'Revision') {
    refs.discussionCopy.textContent = `CrownRing reviews and comments are available while this ${factory} line is in Revision.`;
    refs.chatThread.innerHTML = line.messages.map(createMessageMarkup).join('');
    refs.chatForm.classList.remove('hidden');
  } else {
    refs.discussionCopy.textContent = 'CrownRing reviews and comments appear here when a line is marked as Revision.';
    refs.chatThread.innerHTML = `
      <article class="message system-message">
        <header>
          <strong>Discussion locked</strong>
          <time>${line.updatedAt}</time>
        </header>
        <p>This line is currently ${line.status}. Select a Revision line to review CrownRing comments and respond.</p>
      </article>`;
    refs.chatForm.classList.add('hidden');
    refs.chatInput.value = '';
  }
}

function renderMetrics() {
  uploadedCount.textContent = lines.filter((line) => line.status === 'File Uploaded').length;
  revisionCount.textContent = lines.filter((line) => line.status === 'Revision').length;
  approvedCount.textContent = lines.filter((line) => line.status === 'Approved').length;
}

function rerender() {
  FACTORIES.forEach((factory) => {
    renderFactoryTable(factory);
    renderFactoryDetail(factory);
  });
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
    line.messages.push({ author: CROWNRING_REVIEWER, body: commentBody, time: MESSAGE_TIME });
  }

  selectedFactoryLineIds[line.factoryName] = line.id;
  rerender();
}

FACTORIES.forEach((factory) => {
  const refs = getFactoryRefs(factory);
  refs.form.elements.factoryName.value = factory;
  refs.form.elements.eta.value = TODAY;

  refs.barcodeInput.addEventListener('input', () => {
    applyUidAutofill(factory, refs.barcodeInput.value);
  });

  refs.searchInput.addEventListener('input', (event) => {
    factoryFilters[factory].query = event.currentTarget.value;
    rerender();
  });

  refs.statusFilter.addEventListener('change', (event) => {
    factoryFilters[factory].status = event.currentTarget.value;
    rerender();
  });

  refs.sortSelect.addEventListener('change', (event) => {
    factoryFilters[factory].sort = event.currentTarget.value;
    rerender();
  });

  refs.form.addEventListener('submit', (event) => {
    event.preventDefault();
    refs.formMessage.style.color = '#fda4af';
    refs.formMessage.textContent = '';

    const formData = new FormData(event.currentTarget);
    const barcode = normalizeUid(String(formData.get('barcode') || ''));
    const webOrder = String(formData.get('webOrder') || '').trim();

    if (!barcode && !webOrder) {
      refs.formMessage.textContent = 'Please provide either a Barcode/UID or a Web Order Number.';
      return;
    }

    const knownUid = uidCatalog[factory][barcode];
    const newLine = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      factoryName: factory,
      barcode,
      webOrder: webOrder || knownUid?.webOrder || '',
      style: String(formData.get('style')).trim(),
      cadFile: createFileRecord(formData.get('cadFile')),
      specFile: createFileRecord(formData.get('specFile'), 'application/pdf'),
      eta: String(formData.get('eta')).trim() || TODAY,
      status: 'File Uploaded',
      updatedAt: TIMESTAMP,
      note: String(formData.get('note')).trim(),
      messages: [{ author: factory, body: 'New CAD/spec pack uploaded and waiting for CrownRing review.', time: MESSAGE_TIME }]
    };

    lines.unshift(newLine);
    selectedLineId = newLine.id;
    selectedFactoryLineIds[factory] = newLine.id;
    event.currentTarget.reset();
    refs.form.elements.factoryName.value = factory;
    refs.form.elements.eta.value = TODAY;
    rerender();
    refs.formMessage.style.color = '#86efac';
    refs.formMessage.textContent = `${factory} line uploaded successfully. CrownRing can now review it.`;
  });

  refs.chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const body = refs.chatInput.value.trim();

    if (!body) return;

    const line = lines.find((entry) => entry.id === selectedFactoryLineIds[factory]);
    if (!line || line.status !== 'Revision') return;

    line.messages.push({ author: factory, body, time: MESSAGE_TIME });
    line.updatedAt = TIMESTAMP;
    selectedLineId = line.id;
    refs.chatInput.value = '';
    rerender();
  });
});

document.querySelector('#chat-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#chat-input');
  const body = input.value.trim();

  if (!body) return;

  const line = lines.find((entry) => entry.id === selectedLineId);
  if (!line) return;

  line.messages.push({ author: CROWNRING_REVIEWER, body, time: MESSAGE_TIME });
  line.updatedAt = TIMESTAMP;
  selectedFactoryLineIds[line.factoryName] = line.id;
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

  const factoryRow = event.target.closest('[data-factory-line-id]');
  if (factoryRow) {
    const lineId = Number(factoryRow.dataset.factoryLineId);
    const factory = factoryRow.dataset.factoryName;
    selectedFactoryLineIds[factory] = lineId;
    selectedLineId = lineId;
    rerender();
  }

  const statusAction = event.target.closest('[data-status-action]');
  if (statusAction) {
    const status = statusAction.dataset.statusAction;
    const note =
      status === 'Revision'
        ? 'Marked as revision. Please review the latest CrownRing comments and upload an updated CAD/spec pack.'
        : 'Approved. Files are accepted and the ring can move toward production.';
    setStatus(status, note);
  }
});

rerender();

/* =====================================================================
   HTTP Status Code Reference Pro — app.js
   Searchable, filterable reference of every IANA-registered HTTP status
   code, plus a "which code should I use?" scenario helper.
   Classic script (no modules). Depends on window.WUS (core.js).
   ===================================================================== */
(function () {
  'use strict';

  var WUS = window.WUS;
  var STORE_KEY = 'httpstatus.state';

  /* =================================================================
     DATA — every IANA-registered HTTP status code (RFC 9110 + WebDAV
     RFC 4918 + misc. registered extensions), with real names/meanings.
     ================================================================= */
  var DATA = [
    // ---- 1xx Informational ----
    { code: 100, name: 'Continue', cat: '1xx',
      desc: 'The server has received the request headers and the client should proceed to send the request body. Sent in response to an "Expect: 100-continue" header so the client does not send a large body needlessly.' },
    { code: 101, name: 'Switching Protocols', cat: '1xx',
      desc: 'The server is complying with a client request, via the Upgrade header, to switch protocols — most commonly used to upgrade an HTTP connection to a WebSocket connection.' },
    { code: 102, name: 'Processing', cat: '1xx',
      desc: 'WebDAV: the server has received and is processing the request, but no response is available yet. Sent to prevent the client from timing out on long-running operations.' },
    { code: 103, name: 'Early Hints', cat: '1xx',
      desc: 'Lets the server send preliminary response headers (such as resource preload hints) before the final HTTP response is ready, so the client can start acting on them early.' },

    // ---- 2xx Success ----
    { code: 200, name: 'OK', cat: '2xx',
      desc: 'The request succeeded. The meaning of the response body depends on the method — a representation of the resource for GET, or the result of the action for POST.' },
    { code: 201, name: 'Created', cat: '2xx',
      desc: 'The request succeeded and a new resource was created as a result, typically after a POST or PUT. The Location header should point to the newly created resource.' },
    { code: 202, name: 'Accepted', cat: '2xx',
      desc: 'The request has been accepted for processing, but the processing has not completed and may not even have started yet — used for asynchronous or queued work.' },
    { code: 203, name: 'Non-Authoritative Information', cat: '2xx',
      desc: 'The returned metadata is not exactly the same as what the origin server would return; it was collected from a local or third-party copy, typically by a transforming proxy.' },
    { code: 204, name: 'No Content', cat: '2xx',
      desc: 'The server successfully processed the request but is intentionally returning no content in the body — common after a DELETE or a PUT with nothing to send back.' },
    { code: 205, name: 'Reset Content', cat: '2xx',
      desc: 'The server successfully processed the request and asks the client to reset the document view that sent it, such as clearing a submitted form.' },
    { code: 206, name: 'Partial Content', cat: '2xx',
      desc: 'The server is delivering only part of the resource because the client sent a Range header — the basis for resumable downloads and byte-range video/audio streaming.' },
    { code: 207, name: 'Multi-Status', cat: '2xx',
      desc: 'WebDAV: conveys status information for multiple independent operations in a single response body (typically XML), since a single HTTP status could not describe them all.' },
    { code: 208, name: 'Already Reported', cat: '2xx',
      desc: 'WebDAV: used inside a DAV multi-status response to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.' },
    { code: 226, name: 'IM Used', cat: '2xx',
      desc: 'The server fulfilled a GET request and the response is a representation of the result of one or more instance-manipulations applied to the current instance (delta encoding).' },

    // ---- 3xx Redirection ----
    { code: 300, name: 'Multiple Choices', cat: '3xx',
      desc: 'The request has more than one possible response and there is no agreed-upon way to pick one automatically; the user or user agent should choose from the options given.' },
    { code: 301, name: 'Moved Permanently', cat: '3xx',
      desc: 'The requested resource has permanently moved to a new URL given in the Location header. Clients, caches, and search engines should update their links to the new URL.' },
    { code: 302, name: 'Found', cat: '3xx',
      desc: 'The requested resource resides temporarily under a different URL. Unlike 301, the client should keep using the original URL for future requests.' },
    { code: 303, name: 'See Other', cat: '3xx',
      desc: 'The response to the request can be found at another URL and should be retrieved with a GET request — commonly used to redirect after a successful POST (Post/Redirect/Get).' },
    { code: 304, name: 'Not Modified', cat: '3xx',
      desc: 'Indicates a cached version of the resource is still valid, so the body is not retransmitted. Returned in response to a conditional request using ETag or If-Modified-Since.' },
    { code: 305, name: 'Use Proxy', cat: '3xx',
      desc: 'Deprecated: would have required the requested resource to be accessed through the proxy given in the Location header. Dropped by browsers due to security concerns.' },
    { code: 307, name: 'Temporary Redirect', cat: '3xx',
      desc: 'Like 302, but explicitly guarantees the request method and body will not change when the redirected request is repeated — 302 was historically re-sent as GET by some clients.' },
    { code: 308, name: 'Permanent Redirect', cat: '3xx',
      desc: 'Like 301, but explicitly guarantees the request method and body will not change when the redirected request is repeated.' },

    // ---- 4xx Client Error ----
    { code: 400, name: 'Bad Request', cat: '4xx',
      desc: 'The server cannot or will not process the request due to a client error — malformed request syntax, invalid framing, or otherwise unparseable input.' },
    { code: 401, name: 'Unauthorized', cat: '4xx',
      desc: 'Authentication is required and has either failed or not been supplied. Despite the name, this is about authentication, not authorization — the client should log in and retry.' },
    { code: 402, name: 'Payment Required', cat: '4xx',
      desc: 'Reserved for future use since the earliest days of HTTP. Some APIs repurpose it today to signal billing issues, an expired trial, or exhausted usage credits.' },
    { code: 403, name: 'Forbidden', cat: '4xx',
      desc: 'The server understood the request but refuses to authorize it. Unlike 401, re-authenticating will not help — the caller\'s identity is known but lacks permission.' },
    { code: 404, name: 'Not Found', cat: '4xx',
      desc: 'The server cannot find the requested resource. The endpoint may genuinely not exist, or the server is deliberately hiding its existence from an unauthorized caller.' },
    { code: 405, name: 'Method Not Allowed', cat: '4xx',
      desc: 'The request method is known to the server but is not supported by the target resource — for example sending DELETE to a read-only endpoint.' },
    { code: 406, name: 'Not Acceptable', cat: '4xx',
      desc: 'The server cannot produce a response matching the Accept, Accept-Language, or Accept-Encoding values the client listed as acceptable in the request.' },
    { code: 407, name: 'Proxy Authentication Required', cat: '4xx',
      desc: 'Similar to 401, but the client must first authenticate itself with a proxy that sits between it and the server.' },
    { code: 408, name: 'Request Timeout', cat: '4xx',
      desc: 'The server timed out waiting for the request; the client did not produce a complete request within the time the server was prepared to wait.' },
    { code: 409, name: 'Conflict', cat: '4xx',
      desc: 'The request conflicts with the current state of the target resource, such as an edit-collision, a version mismatch, or an attempt to create a duplicate resource.' },
    { code: 410, name: 'Gone', cat: '4xx',
      desc: 'The requested resource is no longer available and no forwarding address is known. Unlike 404, this condition is expected to be permanent, which caches and crawlers can rely on.' },
    { code: 411, name: 'Length Required', cat: '4xx',
      desc: 'The server refuses to accept the request without a defined Content-Length header.' },
    { code: 412, name: 'Precondition Failed', cat: '4xx',
      desc: 'A condition given in one of the request\'s header fields (such as If-Match or If-Unmodified-Since) evaluated to false when tested against the current resource state.' },
    { code: 413, name: 'Content Too Large', cat: '4xx',
      desc: 'The request body is larger than the server is willing or able to process. The server may close the connection and may include a Retry-After header. Formerly "Payload Too Large".' },
    { code: 414, name: 'URI Too Long', cat: '4xx',
      desc: 'The URI requested by the client is longer than the server is willing to interpret, often caused by a GET request that should have been a POST.' },
    { code: 415, name: 'Unsupported Media Type', cat: '4xx',
      desc: 'The server refuses to accept the request because the payload\'s Content-Type (or Content-Encoding) is not supported for this endpoint.' },
    { code: 416, name: 'Range Not Satisfiable', cat: '4xx',
      desc: 'The range specified by the request\'s Range header cannot be fulfilled, usually because it falls outside the actual size of the target resource.' },
    { code: 417, name: 'Expectation Failed', cat: '4xx',
      desc: 'The expectation given in the request\'s Expect header field could not be met by the server.' },
    { code: 418, name: "I'm a Teapot", cat: '4xx',
      desc: 'Defined by the April Fools\' RFC 2324 (Hyper Text Coffee Pot Control Protocol); a teapot asked to brew coffee should return this. Not meant to be implemented by real servers.' },
    { code: 421, name: 'Misdirected Request', cat: '4xx',
      desc: 'The request was directed at a server that is not able to produce a response, for example due to connection reuse or IP-based virtual hosting mismatches.' },
    { code: 422, name: 'Unprocessable Content', cat: '4xx',
      desc: 'The server understands the content type and syntax of the request but was unable to process the contained instructions — the classic status for semantic validation failures.' },
    { code: 423, name: 'Locked', cat: '4xx',
      desc: 'WebDAV: the source or destination resource of a method is locked, so the operation could not be performed.' },
    { code: 424, name: 'Failed Dependency', cat: '4xx',
      desc: 'WebDAV: the method could not be performed because a previous, related step in the same request chain failed.' },
    { code: 425, name: 'Too Early', cat: '4xx',
      desc: 'The server is unwilling to risk processing a request that might be replayed, used to protect early (0-RTT) TLS data from replay attacks.' },
    { code: 426, name: 'Upgrade Required', cat: '4xx',
      desc: 'The server refuses to perform the request using the current protocol but might be willing to after the client upgrades to a different protocol, named in the Upgrade header.' },
    { code: 428, name: 'Precondition Required', cat: '4xx',
      desc: 'The origin server requires the request to be conditional, intended to prevent the "lost update" problem where two clients edit a resource without seeing each other\'s changes.' },
    { code: 429, name: 'Too Many Requests', cat: '4xx',
      desc: 'The client has sent too many requests in a given time window ("rate limiting"). The response commonly includes a Retry-After header telling the client when to try again.' },
    { code: 431, name: 'Request Header Fields Too Large', cat: '4xx',
      desc: 'The server is unwilling to process the request because its header fields are too large, either individually or in total.' },
    { code: 451, name: 'Unavailable For Legal Reasons', cat: '4xx',
      desc: 'The server is denying access to the resource as a consequence of a legal demand, such as a government-mandated content takedown or court order.' },

    // ---- 5xx Server Error ----
    { code: 500, name: 'Internal Server Error', cat: '5xx',
      desc: 'A generic, catch-all error indicating the server encountered an unexpected condition and no more specific status is appropriate — typically an unhandled exception.' },
    { code: 501, name: 'Not Implemented', cat: '5xx',
      desc: 'The server does not support the functionality required to fulfill the request, such as an unrecognized or unsupported HTTP method.' },
    { code: 502, name: 'Bad Gateway', cat: '5xx',
      desc: 'The server, acting as a gateway or proxy, received an invalid or malformed response from the upstream server it contacted while fulfilling the request.' },
    { code: 503, name: 'Service Unavailable', cat: '5xx',
      desc: 'The server is temporarily unable to handle the request, typically due to overload, maintenance, or an unavailable dependency. Expected to be a transient condition.' },
    { code: 504, name: 'Gateway Timeout', cat: '5xx',
      desc: 'The server, acting as a gateway or proxy, did not receive a timely response from the upstream server it needed to access to complete the request.' },
    { code: 505, name: 'HTTP Version Not Supported', cat: '5xx',
      desc: 'The server does not support, or refuses to support, the major version of the HTTP protocol used in the request message.' },
    { code: 506, name: 'Variant Also Negotiates', cat: '5xx',
      desc: 'An internal server configuration error: the resource chosen for content negotiation is itself configured to negotiate, creating a circular reference.' },
    { code: 507, name: 'Insufficient Storage', cat: '5xx',
      desc: 'WebDAV: the server is unable to store the representation needed to complete the request due to insufficient storage space.' },
    { code: 508, name: 'Loop Detected', cat: '5xx',
      desc: 'WebDAV: the server detected an infinite loop while processing a request with "Depth: infinity", such as a collection that binds to itself.' },
    { code: 510, name: 'Not Extended', cat: '5xx',
      desc: 'Further extensions to the request are required for the server to fulfill it, and the client should resubmit after making those extensions.' },
    { code: 511, name: 'Network Authentication Required', cat: '5xx',
      desc: 'The client needs to authenticate to gain network access, typically used by captive portals such as hotel or airport Wi-Fi login pages intercepting requests.' }
  ];

  var CAT_LABELS = {
    '1xx': '1xx Informational',
    '2xx': '2xx Success',
    '3xx': '3xx Redirection',
    '4xx': '4xx Client Error',
    '5xx': '5xx Server Error'
  };

  var WEBDAV_CODES = { 102: 1, 207: 1, 208: 1, 423: 1, 424: 1, 507: 1, 508: 1 };

  /* =================================================================
     SCENARIOS — "which code should I use?" helper
     ================================================================= */
  var SCENARIOS = [
    { q: 'A new resource was successfully created', code: 201,
      why: 'Signals success plus creation specifically — pair it with a Location header pointing at the new resource, unlike a plain 200.' },
    { q: 'Request body failed validation rules', code: 422,
      why: 'The syntax parsed fine (so it isn\'t 400), but the semantics — a missing field, bad format, failed business rule — are invalid.' },
    { q: 'Caller has no valid credentials', code: 401,
      why: 'This is about authentication, not permission — the caller isn\'t identified yet, so ask them to log in or send a valid token.' },
    { q: 'Caller is identified but not allowed to do this', code: 403,
      why: 'Identity is already known and valid; the problem is permission, so re-authenticating changes nothing.' },
    { q: 'Client is sending requests too fast', code: 429,
      why: 'The dedicated rate-limiting status — pair it with a Retry-After header so well-behaved clients know when to retry.' },
    { q: 'The requested resource does not exist', code: 404,
      why: 'The most literal match, and also the conventional way to hide a resource\'s existence from a caller who shouldn\'t know about it.' },
    { q: 'Deletion succeeded, nothing to send back', code: 204,
      why: 'The operation fully succeeded but there is no representation to return, so the body is intentionally empty rather than omitted by accident.' },
    { q: 'A long-running job was queued, not finished', code: 202,
      why: 'Tells the caller their request was accepted for asynchronous work — return a status URL so they can poll for the real outcome later.' },
    { q: 'This URL has moved for good — update your links', code: 301,
      why: 'Explicitly tells clients, caches, and search engines the change is permanent, so they should stop using the old URL going forward.' },
    { q: 'Creating this would duplicate an existing record', code: 409,
      why: 'The request is well-formed but conflicts with the resource\'s current state — a duplicate unique key is the textbook case.' },
    { q: 'Our code threw an unhandled exception', code: 500,
      why: 'The generic catch-all for an unexpected server-side failure when nothing more specific applies — a bug, not a client mistake.' },
    { q: 'A dependency or upstream service is down', code: 503,
      why: 'Signals the outage is likely temporary and not the caller\'s fault; add a Retry-After header if you know roughly how long it will last.' }
  ];

  /* ----------------------------- DOM refs ---------------------------- */
  var searchInput     = document.getElementById('searchInput');
  var btnClearSearch  = document.getElementById('btnClearSearch');
  var categoryTabs    = document.getElementById('categoryTabs');
  var codeList        = document.getElementById('codeList');
  var emptyState      = document.getElementById('emptyState');
  var resultCount     = document.getElementById('resultCount');
  var statusText      = document.getElementById('statusText');
  var scenarioGrid    = document.getElementById('scenarioGrid');
  var btnResetFilters = document.getElementById('btnResetFilters');

  var state = { search: '', cat: 'all', open: null };

  /* =================================================================
     Lookup / filter helpers
     ================================================================= */
  function findByCode(code) {
    for (var i = 0; i < DATA.length; i++) {
      if (DATA[i].code === code) return DATA[i];
    }
    return null;
  }

  function catClass(cat) { return 'cat-' + cat; }

  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function matches(item, query) {
    if (!query) return true;
    var q = query.toLowerCase().trim();
    if (!q) return true;
    return String(item.code).indexOf(q) !== -1 ||
           item.name.toLowerCase().indexOf(q) !== -1 ||
           item.desc.toLowerCase().indexOf(q) !== -1;
  }

  function filteredData() {
    return DATA.filter(function (item) {
      if (state.cat !== 'all' && item.cat !== state.cat) return false;
      return matches(item, state.search);
    });
  }

  function highlightText(text, query) {
    var escaped = WUS.escapeHtml(text);
    var q = (query || '').trim();
    if (!q) return escaped;
    try {
      var re = new RegExp('(' + escapeRegExp(q) + ')', 'ig');
      return escaped.replace(re, '<mark>$1</mark>');
    } catch (e) { return escaped; }
  }

  /* =================================================================
     RENDER — status code list
     ================================================================= */
  function renderList() {
    var items = filteredData();
    codeList.innerHTML = '';

    if (items.length === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      items.forEach(function (item) { codeList.appendChild(buildRow(item)); });
    }

    resultCount.textContent = items.length + ' of ' + DATA.length;
  }

  function buildRow(item) {
    var row = document.createElement('div');
    row.className = 'code-row';
    row.dataset.code = item.code;
    var isOpen = state.open === item.code;
    if (isOpen) row.classList.add('is-open');

    var head = document.createElement('div');
    head.className = 'code-row-head';
    head.setAttribute('role', 'button');
    head.setAttribute('tabindex', '0');
    head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    var num = document.createElement('span');
    num.className = 'code-num ' + catClass(item.cat);
    num.textContent = item.code;

    var name = document.createElement('span');
    name.className = 'code-name';
    var nameMain = document.createElement('span');
    nameMain.innerHTML = highlightText(item.name, state.search);
    var preview = document.createElement('span');
    preview.className = 'code-desc-preview';
    preview.innerHTML = highlightText(item.desc, state.search);
    name.appendChild(nameMain);
    name.appendChild(preview);

    var actions = document.createElement('span');
    actions.className = 'code-row-actions';

    var copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn--icon btn--ghost btn--sm';
    copyBtn.title = 'Copy "' + item.code + ' ' + item.name + '"';
    copyBtn.setAttribute('aria-label', 'Copy status code');
    copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    copyBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      copyCode(item);
    });

    var chevron = document.createElement('span');
    chevron.className = 'code-chevron';
    chevron.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

    actions.appendChild(copyBtn);
    actions.appendChild(chevron);

    head.appendChild(num);
    head.appendChild(name);
    head.appendChild(actions);

    head.addEventListener('click', function () { toggleRow(item.code); });
    head.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleRow(item.code);
      }
    });

    row.appendChild(head);

    if (isOpen) {
      var body = document.createElement('div');
      body.className = 'code-row-body';
      var p = document.createElement('p');
      p.textContent = item.desc;
      var meta = document.createElement('div');
      meta.className = 'code-meta';
      var specLabel = WEBDAV_CODES[item.code] ? 'RFC 9110 · WebDAV (RFC 4918)' : 'RFC 9110';
      meta.innerHTML =
        '<span>' + WUS.escapeHtml(CAT_LABELS[item.cat]) + '</span>' +
        '<span class="mono">' + WUS.escapeHtml(specLabel) + '</span>';
      body.appendChild(p);
      body.appendChild(meta);
      row.appendChild(body);
    }

    return row;
  }

  function toggleRow(code) {
    state.open = (state.open === code) ? null : code;
    renderList();
    var el = codeList.querySelector('.code-row[data-code="' + code + '"]');
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function copyCode(item) {
    WUS.copy(item.code + ' ' + item.name, 'Copied "' + item.code + ' ' + item.name + '"');
  }

  /* =================================================================
     RENDER — scenario helper cards
     ================================================================= */
  function renderScenarios() {
    scenarioGrid.innerHTML = '';
    SCENARIOS.forEach(function (s) {
      var item = findByCode(s.code);
      if (!item) return;

      var card = document.createElement('div');
      card.className = 'scenario-card';

      var q = document.createElement('p');
      q.className = 'scenario-q';
      q.textContent = s.q;

      var codeRow = document.createElement('div');
      codeRow.className = 'scenario-code-row';
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'scenario-code ' + catClass(item.cat);
      chip.textContent = item.code + ' ' + item.name;
      chip.title = 'Jump to ' + item.code + ' in the list below';
      chip.addEventListener('click', function () { jumpToCode(item.code); });
      codeRow.appendChild(chip);

      var why = document.createElement('p');
      why.className = 'scenario-why';
      why.textContent = s.why;

      card.appendChild(q);
      card.appendChild(codeRow);
      card.appendChild(why);
      scenarioGrid.appendChild(card);
    });
  }

  function jumpToCode(code) {
    state.search = '';
    state.cat = 'all';
    searchInput.value = '';
    btnClearSearch.hidden = true;
    setActiveTab('all');
    state.open = code;
    renderList();
    persist();
    var el = codeList.querySelector('.code-row[data-code="' + code + '"]');
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  /* =================================================================
     CATEGORY TABS
     ================================================================= */
  function setActiveTab(cat) {
    var btns = categoryTabs.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      var isActive = btns[i].getAttribute('data-cat') === cat;
      btns[i].setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
  }

  function setCategory(cat) {
    state.cat = cat;
    setActiveTab(cat);
    renderList();
    persist();
  }

  categoryTabs.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('button[data-cat]') : null;
    if (!btn) return;
    setCategory(btn.getAttribute('data-cat'));
  });

  /* =================================================================
     SEARCH WIRING
     ================================================================= */
  function onSearchInput() {
    state.search = searchInput.value;
    btnClearSearch.hidden = !state.search;
    renderList();
    persistDebounced();
  }

  searchInput.addEventListener('input', onSearchInput);
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (searchInput.value) {
        e.preventDefault();
        searchInput.value = '';
        onSearchInput();
      } else {
        searchInput.blur();
      }
    }
  });

  btnClearSearch.addEventListener('click', function () {
    searchInput.value = '';
    onSearchInput();
    searchInput.focus();
  });

  btnResetFilters.addEventListener('click', function () {
    searchInput.value = '';
    state.search = '';
    btnClearSearch.hidden = true;
    setCategory('all');
  });

  /* =================================================================
     PERSISTENCE
     ================================================================= */
  function persist() {
    WUS.store.set(STORE_KEY, { search: state.search, cat: state.cat });
  }
  var persistDebounced = WUS.debounce(persist, 350);

  function restore() {
    var saved = WUS.store.get(STORE_KEY, null);
    if (!saved) return;
    if (typeof saved.search === 'string') {
      state.search = saved.search;
      searchInput.value = saved.search;
      btnClearSearch.hidden = !saved.search;
    }
    if (saved.cat && (saved.cat === 'all' || CAT_LABELS[saved.cat])) {
      state.cat = saved.cat;
      setActiveTab(saved.cat);
    }
  }

  /* =================================================================
     SHORTCUTS HELP MODAL
     ================================================================= */
  var helpBackdrop = document.getElementById('helpBackdrop');
  var helpClose    = document.getElementById('helpClose');
  var shortcutRows = document.getElementById('shortcutRows');

  var SHORTCUTS = [
    { keys: ['/'], desc: 'Focus the search box' },
    { keys: ['1'], desc: 'Show 1xx Informational' },
    { keys: ['2'], desc: 'Show 2xx Success' },
    { keys: ['3'], desc: 'Show 3xx Redirection' },
    { keys: ['4'], desc: 'Show 4xx Client Error' },
    { keys: ['5'], desc: 'Show 5xx Server Error' },
    { keys: ['0'], desc: 'Show all categories' },
    { keys: ['?'], desc: 'Show this help' },
    { keys: ['Esc'], desc: 'Clear search / close dialog' }
  ];

  function buildShortcutTable() {
    var html = '';
    SHORTCUTS.forEach(function (s) {
      var kbds = s.keys.map(function (k) { return '<kbd>' + WUS.escapeHtml(k) + '</kbd>'; }).join('');
      html += '<tr><td>' + WUS.escapeHtml(s.desc) + '</td><td>' + kbds + '</td></tr>';
    });
    shortcutRows.innerHTML = html;
  }

  function openHelp() { helpBackdrop.hidden = false; helpClose.focus(); }
  function closeHelp() { helpBackdrop.hidden = true; }

  helpClose.addEventListener('click', closeHelp);
  helpBackdrop.addEventListener('click', function (e) {
    if (e.target === helpBackdrop) closeHelp();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !helpBackdrop.hidden) closeHelp();
  });

  var helpBtns = document.querySelectorAll('[data-shortcut-help]');
  for (var i = 0; i < helpBtns.length; i++) helpBtns[i].addEventListener('click', openHelp);

  /* Global keyboard shortcuts via WUS (bare keys are ignored while typing
     in a text field, per core.js, except the search input's own handler). */
  WUS.registerShortcut('/', function () { searchInput.focus(); searchInput.select(); }, 'Focus search');
  WUS.registerShortcut('1', function () { setCategory('1xx'); }, 'Show 1xx Informational');
  WUS.registerShortcut('2', function () { setCategory('2xx'); }, 'Show 2xx Success');
  WUS.registerShortcut('3', function () { setCategory('3xx'); }, 'Show 3xx Redirection');
  WUS.registerShortcut('4', function () { setCategory('4xx'); }, 'Show 4xx Client Error');
  WUS.registerShortcut('5', function () { setCategory('5xx'); }, 'Show 5xx Server Error');
  WUS.registerShortcut('0', function () { setCategory('all'); }, 'Show all categories');
  WUS.registerShortcut('?', function () { openHelp(); }, 'Show shortcuts');

  /* =================================================================
     INIT
     ================================================================= */
  function init() {
    statusText.textContent = DATA.length + ' codes';
    buildShortcutTable();
    renderScenarios();
    restore();
    renderList();
  }

  init();
})();

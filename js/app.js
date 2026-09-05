/* =====================================================================
   HTTP Status Code Reference Pro — app.js
   Searchable, filterable reference of every IANA HTTP status code, plus
   a "which code should I use?" scenario helper.
   Classic script (no modules). Depends on window.WUS (core.js).
   ===================================================================== */
(function () {
  'use strict';

  var WUS = window.WUS;
  var STORE_KEY = 'httpstatus.state';

  /* =================================================================
     DATA — real, accurate HTTP status codes (IANA registry / RFC 9110
     plus common WebDAV / extension codes actually used in the wild).
     ================================================================= */
  var STATUS_CODES = [
    { code: 100, name: 'Continue', desc: 'The server has received the request headers and the client should proceed to send the request body.' },
    { code: 101, name: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols (e.g. to WebSocket) and the server has agreed to do so.' },
    { code: 102, name: 'Processing', desc: '(WebDAV) The server has received and is processing the request, but no response is available yet.' },
    { code: 103, name: 'Early Hints', desc: 'Used to return some response headers (e.g. Link preload hints) before the final HTTP message is ready.' },

    { code: 200, name: 'OK', desc: 'The request has succeeded. The meaning depends on the HTTP method used.' },
    { code: 201, name: 'Created', desc: 'The request has succeeded and a new resource has been created as a result — typically the response to a POST.' },
    { code: 202, name: 'Accepted', desc: 'The request has been received and queued but not yet acted upon; processing may finish asynchronously.' },
    { code: 203, name: 'Non-Authoritative Information', desc: 'The returned metadata is not exactly the same as is available from the origin server, but is from a local or third-party copy.' },
    { code: 204, name: 'No Content', desc: 'The server successfully processed the request and is not returning any content — the headers may still be useful.' },
    { code: 205, name: 'Reset Content', desc: 'Tells the user agent to reset the document which sent this request, e.g. to clear a form.' },
    { code: 206, name: 'Partial Content', desc: 'Used when the Range header is sent by the client to request only part of a resource.' },
    { code: 207, name: 'Multi-Status', desc: '(WebDAV) Conveys information about multiple resources in situations where multiple status codes might be appropriate.' },
    { code: 208, name: 'Already Reported', desc: '(WebDAV) Used inside a DAV binding to avoid enumerating the internal members of multiple bindings to the same collection repeatedly.' },
    { code: 226, name: 'IM Used', desc: 'The server has fulfilled a GET request and the response is a representation of the result of one or more instance-manipulations applied.' },

    { code: 300, name: 'Multiple Choices', desc: 'The request has more than one possible response; the user agent or user should choose one of them.' },
    { code: 301, name: 'Moved Permanently', desc: 'The URL of the requested resource has changed permanently — clients and search engines should update their links.' },
    { code: 302, name: 'Found', desc: 'The URI of the requested resource has changed temporarily. Further changes may still occur, so the same URI should be used for future requests.' },
    { code: 303, name: 'See Other', desc: 'The server sends this to direct the client to fetch the requested resource at another URI with a GET request.' },
    { code: 304, name: 'Not Modified', desc: 'Used for caching: tells the client the response has not been modified, so the cached version can be reused.' },
    { code: 305, name: 'Use Proxy', desc: 'Deprecated. Indicated that the requested response had to be accessed via a proxy — removed for security reasons.' },
    { code: 307, name: 'Temporary Redirect', desc: 'The server sends this to direct the client to get the requested resource at another URI with the same method used in the original request.' },
    { code: 308, name: 'Permanent Redirect', desc: 'The resource has been moved permanently to a new URI, and the request method must not be changed when reissuing the original request.' },

    { code: 400, name: 'Bad Request', desc: 'The server cannot process the request due to a client error — malformed request syntax, invalid framing, or deceptive request routing.' },
    { code: 401, name: 'Unauthorized', desc: 'The client must authenticate itself to get the requested response. Despite the name, this means "unauthenticated", not "forbidden".' },
    { code: 402, name: 'Payment Required', desc: 'Reserved for future use — originally intended for digital payment systems, occasionally repurposed by APIs to signal billing/quota issues.' },
    { code: 403, name: 'Forbidden', desc: 'The client does not have access rights to the content — identity is known, but the server refuses to authorize the action.' },
    { code: 404, name: 'Not Found', desc: 'The server cannot find the requested resource. The endpoint may exist but the specific resource does not.' },
    { code: 405, name: 'Method Not Allowed', desc: 'The request method is known by the server but is not supported by the target resource (e.g. DELETE on a read-only endpoint).' },
    { code: 406, name: 'Not Acceptable', desc: 'The server cannot produce a response matching the list of acceptable values defined in the request\'s proactive content negotiation headers.' },
    { code: 407, name: 'Proxy Authentication Required', desc: 'Similar to 401, but authentication is needed to be done by a proxy.' },
    { code: 408, name: 'Request Timeout', desc: 'The server timed out waiting for the request — the client did not produce a request within the time the server was prepared to wait.' },
    { code: 409, name: 'Conflict', desc: 'The request conflicts with the current state of the server, e.g. an edit conflict between concurrent updates.' },
    { code: 410, name: 'Gone', desc: 'The content has been permanently deleted from the server and no forwarding address is known; unlike 404 this is intentional and permanent.' },
    { code: 411, name: 'Length Required', desc: 'The server rejected the request because the Content-Length header field is not defined and is required.' },
    { code: 412, name: 'Precondition Failed', desc: 'The client has indicated preconditions in its headers (e.g. If-Match) which the server does not meet.' },
    { code: 413, name: 'Payload Too Large', desc: 'The request entity is larger than limits defined by the server.' },
    { code: 414, name: 'URI Too Long', desc: 'The URI requested by the client is longer than the server is willing to interpret.' },
    { code: 415, name: 'Unsupported Media Type', desc: 'The media format of the requested data is not supported by the server, as indicated in the Content-Type header.' },
    { code: 416, name: 'Range Not Satisfiable', desc: 'The range specified by the Range header field in the request cannot be fulfilled — it may be outside the size of the target resource.' },
    { code: 417, name: 'Expectation Failed', desc: 'The expectation indicated by the Expect request header field cannot be met by the server.' },
    { code: 418, name: "I'm a teapot", desc: 'Defined in RFC 2324 as an April Fools\' joke; the server refuses to brew coffee because it is a teapot.' },
    { code: 421, name: 'Misdirected Request', desc: 'The request was directed at a server that is not able to produce a response — often due to connection reuse mismatches.' },
    { code: 422, name: 'Unprocessable Entity', desc: 'The request was well-formed but was unable to be followed due to semantic errors — the standard code for failed validation.' },
    { code: 423, name: 'Locked', desc: '(WebDAV) The resource that is being accessed is locked.' },
    { code: 424, name: 'Failed Dependency', desc: '(WebDAV) The request failed due to the failure of a previous request that it depended on.' },
    { code: 425, name: 'Too Early', desc: 'Indicates that the server is unwilling to risk processing a request that might be replayed (used with TLS early data / 0-RTT).' },
    { code: 426, name: 'Upgrade Required', desc: 'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades.' },
    { code: 428, name: 'Precondition Required', desc: 'The origin server requires the request to be conditional, to prevent the "lost update" problem.' },
    { code: 429, name: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time — the standard code for rate limiting.' },
    { code: 431, name: 'Request Header Fields Too Large', desc: 'The server is unwilling to process the request because its header fields are too large.' },
    { code: 451, name: 'Unavailable For Legal Reasons', desc: 'The user requested a resource that is unavailable for legal reasons, e.g. a censored or DMCA-blocked resource.' },

    { code: 500, name: 'Internal Server Error', desc: 'The server has encountered a situation it does not know how to handle — the generic catch-all for unexpected server-side failures.' },
    { code: 501, name: 'Not Implemented', desc: 'The request method is not supported by the server and cannot be handled for any resource.' },
    { code: 502, name: 'Bad Gateway', desc: 'The server, while acting as a gateway or proxy, received an invalid response from the upstream server.' },
    { code: 503, name: 'Service Unavailable', desc: 'The server is not ready to handle the request, often due to maintenance or overload. Should typically be temporary.' },
    { code: 504, name: 'Gateway Timeout', desc: 'The server, while acting as a gateway or proxy, did not get a response in time from the upstream server.' },
    { code: 505, name: 'HTTP Version Not Supported', desc: 'The HTTP version used in the request is not supported by the server.' },
    { code: 506, name: 'Variant Also Negotiates', desc: 'The server has an internal configuration error: transparent content negotiation for the request results in a circular reference.' },
    { code: 507, name: 'Insufficient Storage', desc: '(WebDAV) The server is unable to store the representation needed to complete the request.' },
    { code: 508, name: 'Loop Detected', desc: '(WebDAV) The server detected an infinite loop while processing a request.' },
    { code: 510, name: 'Not Extended', desc: 'Further extensions to the request are required for the server to fulfill it.' },
    { code: 511, name: 'Network Authentication Required', desc: 'The client needs to authenticate to gain network access, e.g. via a captive portal.' }
  ];

  function categoryOf(code) { return Math.floor(code / 100) + 'xx'; }

  /* Curated "which code should I use?" scenarios. */
  var SCENARIOS = [
    { q: 'A new resource was successfully created', code: 201, why: 'Signals successful creation; conventionally paired with a Location header pointing at the new resource.' },
    { q: 'Request validation / business-rule check failed', code: 422, why: 'The request was well-formed but semantically invalid. Use 400 instead only for malformed syntax the parser itself rejects.' },
    { q: 'User is not authenticated', code: 401, why: 'Despite the name "Unauthorized", this means no (or invalid) credentials were supplied — not "forbidden".' },
    { q: 'User is authenticated but not allowed to do this', code: 403, why: 'The server knows who is asking and refuses anyway — this is an authorization failure, not an authentication one.' },
    { q: 'Client is sending too many requests', code: 429, why: 'The standard rate-limiting response; pair it with a Retry-After header telling the client when to try again.' },
    { q: 'Resource deleted, nothing meaningful to return', code: 204, why: 'Confirms success without a response body — common after DELETE, or a PUT that does not echo the resource back.' },
    { q: 'Long-running job accepted for async processing', code: 202, why: 'The request was valid and has been queued, but processing has not completed — return a status URL if you have one.' },
    { q: 'Resource permanently moved to a new URL', code: 301, why: 'Tells clients and search engines to update bookmarks and links for good; safe to cache aggressively.' },
    { q: 'Redirect but the client must keep the same method/body', code: 307, why: 'Unlike 302/303, this guarantees the method and body are preserved across the redirect.' },
    { q: 'Unhandled exception / server crashed', code: 500, why: 'The generic catch-all for unexpected server-side failures — avoid leaking stack traces in the body.' }
  ];

  /* =================================================================
     DOM refs
     ================================================================= */
  var searchInput   = document.getElementById('searchInput');
  var btnClearSearch= document.getElementById('btnClearSearch');
  var categoryTabs  = document.getElementById('categoryTabs');
  var scenarioGrid  = document.getElementById('scenarioGrid');
  var codeList      = document.getElementById('codeList');
  var resultCount   = document.getElementById('resultCount');
  var emptyState    = document.getElementById('emptyState');
  var btnResetFilters = document.getElementById('btnResetFilters');
  var statusText    = document.getElementById('statusText');

  var state = { search: '', cat: 'all', open: {} };

  /* =================================================================
     Helpers
     ================================================================= */
  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function highlight(text, query) {
    var escaped = WUS.escapeHtml(text);
    if (!query) return escaped;
    try {
      var re = new RegExp('(' + escapeRegExp(query) + ')', 'ig');
      return escaped.replace(re, '<mark>$1</mark>');
    } catch (e) { return escaped; }
  }

  function matches(item, query, cat) {
    if (cat !== 'all' && categoryOf(item.code) !== cat) return false;
    if (!query) return true;
    var q = query.toLowerCase();
    return String(item.code).indexOf(q) > -1 ||
           item.name.toLowerCase().indexOf(q) > -1 ||
           item.desc.toLowerCase().indexOf(q) > -1;
  }

  /* =================================================================
     Rendering
     ================================================================= */
  function renderList() {
    var q = state.search.trim();
    var filtered = STATUS_CODES.filter(function (item) { return matches(item, q, state.cat); });

    codeList.innerHTML = '';
    if (!filtered.length) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      filtered.forEach(function (item) {
        codeList.appendChild(buildRow(item, q));
      });
    }

    resultCount.textContent = filtered.length + ' of ' + STATUS_CODES.length;
  }

  function buildRow(item, q) {
    var cat = categoryOf(item.code);
    var isOpen = !!state.open[item.code];

    var row = document.createElement('div');
    row.className = 'code-row' + (isOpen ? ' is-open' : '');
    row.dataset.code = item.code;

    var head = document.createElement('button');
    head.type = 'button';
    head.className = 'code-row-head';
    head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    var numSpan = document.createElement('span');
    numSpan.className = 'code-num cat-' + cat;
    numSpan.textContent = item.code;

    var nameSpan = document.createElement('span');
    nameSpan.className = 'code-name';
    nameSpan.innerHTML = highlight(item.code + ' ' + item.name, q) +
      '<span class="code-desc-preview">' + highlight(item.desc, q) + '</span>';

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
      WUS.copy(item.code + ' ' + item.name, 'Copied "' + item.code + ' ' + item.name + '"');
    });

    var chevron = document.createElement('svg');
    chevron.setAttribute('class', 'code-chevron');
    chevron.setAttribute('viewBox', '0 0 24 24');
    chevron.setAttribute('fill', 'none');
    chevron.setAttribute('stroke', 'currentColor');
    chevron.setAttribute('stroke-width', '2');
    chevron.setAttribute('stroke-linecap', 'round');
    chevron.setAttribute('stroke-linejoin', 'round');
    chevron.setAttribute('aria-hidden', 'true');
    chevron.innerHTML = '<path d="m6 9 6 6 6-6"/>';

    actions.appendChild(copyBtn);
    actions.appendChild(chevron);

    head.appendChild(numSpan);
    head.appendChild(nameSpan);
    head.appendChild(actions);

    head.addEventListener('click', function () {
      state.open[item.code] = !state.open[item.code];
      persist();
      renderList();
      var again = document.querySelector('.code-row[data-code="' + item.code + '"] .code-row-head');
      if (again) again.focus();
    });

    row.appendChild(head);

    if (isOpen) {
      var body = document.createElement('div');
      body.className = 'code-row-body';
      var p = document.createElement('p');
      p.innerHTML = highlight(item.desc, q);
      var meta = document.createElement('div');
      meta.className = 'code-meta';
      meta.innerHTML = '<span>Category: ' + cat.toUpperCase() + '</span><span>Code: ' + item.code + '</span>';
      body.appendChild(p);
      body.appendChild(meta);
      row.appendChild(body);
    }

    return row;
  }

  function renderScenarios() {
    scenarioGrid.innerHTML = '';
    SCENARIOS.forEach(function (s) {
      var item = STATUS_CODES.filter(function (c) { return c.code === s.code; })[0];
      var cat = categoryOf(s.code);

      var card = document.createElement('div');
      card.className = 'scenario-card';

      var q = document.createElement('p');
      q.className = 'scenario-q';
      q.textContent = s.q;

      var codeRow = document.createElement('div');
      codeRow.className = 'scenario-code-row';

      var codeBtn = document.createElement('button');
      codeBtn.type = 'button';
      codeBtn.className = 'scenario-code cat-' + cat;
      codeBtn.textContent = s.code + ' ' + (item ? item.name : '');
      codeBtn.title = 'Jump to this status code';
      codeBtn.addEventListener('click', function () { jumpToCode(s.code); });

      codeRow.appendChild(codeBtn);

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
    searchInput.value = String(code);
    state.search = String(code);
    state.cat = 'all';
    setActiveTab('all');
    state.open[code] = true;
    toggleClearBtn();
    persist();
    renderList();
    var row = document.querySelector('.code-row[data-code="' + code + '"]');
    if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function setActiveTab(cat) {
    var btns = categoryTabs.querySelectorAll('button[data-cat]');
    for (var i = 0; i < btns.length; i++) {
      var isActive = btns[i].getAttribute('data-cat') === cat;
      btns[i].setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
  }

  function toggleClearBtn() {
    btnClearSearch.hidden = !state.search;
  }

  /* =================================================================
     Persistence
     ================================================================= */
  function persist() {
    WUS.store.set(STORE_KEY, { search: state.search, cat: state.cat, open: state.open });
  }
  var persistDebounced = WUS.debounce(persist, 300);

  function restore() {
    var saved = WUS.store.get(STORE_KEY, null);
    if (!saved) return;
    state.search = typeof saved.search === 'string' ? saved.search : '';
    state.cat = saved.cat || 'all';
    state.open = saved.open && typeof saved.open === 'object' ? saved.open : {};
    searchInput.value = state.search;
    setActiveTab(state.cat);
    toggleClearBtn();
  }

  /* =================================================================
     Shortcuts help modal
     ================================================================= */
  var helpBackdrop = document.getElementById('helpBackdrop');
  var helpClose    = document.getElementById('helpClose');
  var shortcutRows = document.getElementById('shortcutRows');

  var SHORTCUTS = [
    { keys: ['/'], desc: 'Focus search' },
    { keys: ['Esc'], desc: 'Clear search / close dialog' },
    { keys: ['?'], desc: 'Show this help' }
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

  var helpBtns = document.querySelectorAll('[data-shortcut-help]');
  for (var i = 0; i < helpBtns.length; i++) helpBtns[i].addEventListener('click', openHelp);

  /* =================================================================
     Wiring
     ================================================================= */
  searchInput.addEventListener('input', function () {
    state.search = searchInput.value;
    toggleClearBtn();
    persistDebounced();
    renderList();
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (state.search) {
        e.preventDefault();
        searchInput.value = '';
        state.search = '';
        toggleClearBtn();
        persist();
        renderList();
      } else {
        searchInput.blur();
      }
    }
  });

  btnClearSearch.addEventListener('click', function () {
    searchInput.value = '';
    state.search = '';
    toggleClearBtn();
    persist();
    renderList();
    searchInput.focus();
  });

  categoryTabs.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('button[data-cat]') : null;
    if (!btn) return;
    state.cat = btn.getAttribute('data-cat');
    setActiveTab(state.cat);
    persist();
    renderList();
  });

  btnResetFilters.addEventListener('click', function () {
    state.search = '';
    state.cat = 'all';
    searchInput.value = '';
    setActiveTab('all');
    toggleClearBtn();
    persist();
    renderList();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !helpBackdrop.hidden) { closeHelp(); return; }
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    var typing = tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable);
    if (!typing && e.key === '/') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  WUS.registerShortcut('?', function () { openHelp(); }, 'Show shortcuts');

  /* =================================================================
     Init
     ================================================================= */
  buildShortcutTable();
  statusText.textContent = STATUS_CODES.length + ' codes';
  restore();
  renderScenarios();
  renderList();
})();

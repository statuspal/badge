import '!!style-loader!css-loader!sass-loader!../css/app.scss';
const DEFAULT_STATUS_SELECTOR = 'sp-status';
const COPY = {
  status: {
    ok: 'All systems operational',
    scheduled: 'Ongoing scheduled maintenance',
    minor: 'Ongoing minor incident',
    major: 'Ongoing major incident',
  }
};

function get (url, successCallback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () { xhr.status >= 200 && xhr.status < 300 && successCallback(xhr) };
  xhr.open('GET', url);
  xhr.send();
}

function injectStatus (options, statusEl) {
  statusEl.classList.add(DEFAULT_STATUS_SELECTOR); // in case it's a different selector

  const servicePath = options.serviceId ? `/services/${options.serviceId}` : '';
  let url = options.host + `/api/v1/status_pages/${options.subdomain}${servicePath}/status`;
  if (options.testing) url = `${url}?testing=true`;
  
  get(url, function success (xhr) {
    let status = JSON.parse(xhr.responseText);
    status = options.serviceId ? status.service : status.status_page;

    // tooltip element
    const tooltipEl = document.createElement('span');
    tooltipEl.className = `sp-tooltip sp-tooltip--${options.position}`;
    tooltipEl.innerText = options.copy.status[status.current_incident_type] || options.copy.status.ok;

    // badge element
    const badgeEl = document.createElement('span');
    badgeEl.className = `sp-status-badge sp-status-${status.current_incident_type || 'ok'}`;
    
    statusEl.appendChild(badgeEl);
    statusEl.appendChild(tooltipEl);
  });
}

window.StatuspalWidget = {
  init: function (settings = {}) {
    const options = Object.assign({
      host: 'https://statuspal.io',
      selector: `.${DEFAULT_STATUS_SELECTOR}`,
      position: 'top',
      copy: COPY,
      testing: false,
    }, settings);
    const statusEls = document.querySelectorAll(options.selector);
    if (statusEls.length > 0) {
      statusEls.forEach(el => injectStatus(options, el));
    } else {
      throw Error('Can\'t initialize StatuspalWidget, element ' + options.selector + ' not found');
    }
  }
};

if (window.statuspalWidget) window.StatuspalWidget.init(window.statuspalWidget);

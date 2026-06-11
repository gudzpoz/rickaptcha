import QRCode from 'qrcode-svg';
import isMobile from 'is-mobile';

import BG_SVG from './bg.svg?raw';

let initialized = false;

/**
 * A custom element to prevent inherited styles
 */
class Unstyled extends HTMLElement {
}

/**
 * @param {string} svg
 * @param {string} [extraStyle]
 * @param {string} [id]
 * @param {string} [extraClass]
 */
function img(svg, extraStyle, id, extraClass) {
  id = id ? ` id="${id}"` : '';
  extraClass = extraClass ? ` class="${extraClass}"` : '';
  const bg = `center / contain no-repeat url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
  return `<r-cha${id}${extraClass} style="background:${bg}; ${extraStyle}"></r-cha>`;
}

const DESKTOP = {
  header: 'Scan to Verify You\'re Human',
  hint: 'Use your phone\'s camera app to scan this QR code. This securely links your device.',
  // Material Symbols & Icons: Photo Camera
  hintIcon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z"/></svg>',
  /**
   * @param {string} url
   */
  generate(url) {
    const code = new QRCode(url);
    code.options.padding = 0;
    const svg = code.svg();
    return `<r-cha id="rcha-qr-box">${img(svg, '', 'rcha-qr')}</r-cha>`;
  },
};

/**
 * @type {typeof DESKTOP}
 */
const MOBILE = {
  header: 'Mobile Verification',
  hint: 'Verification will initialize the reCAPTCHA app on your device.',
  // Material Symbols & Icons: Mobile 2
  hintIcon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h400q33 0 56.5 23.5T760-840v124q18 7 29 22t11 34v80q0 19-11 34t-29 22v404q0 33-23.5 56.5T680-40H280Zm0-80h400v-720H280v720Zm0 0v-720 720Zm228.5-51.5Q520-183 520-200t-11.5-28.5Q497-240 480-240t-28.5 11.5Q440-217 440-200t11.5 28.5Q463-160 480-160t28.5-11.5Z"/></svg>',
  generate(url) {
    return `
<r-cha class="rcha-button" onclick='window.open(${JSON.stringify(url)}, "_blank")'>
  CLICK TO VERIFY
</r-cha>
    `;
  },
};

// Button bar actions, from Material Symbols & Icons
const BAR_ACTIONS = [
  // Refresh
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg>',
  // Headphones
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M360-120H200q-33 0-56.5-23.5T120-200v-280q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480v280q0 33-23.5 56.5T760-120H600v-320h160v-40q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480v40h160v320Zm-80-240h-80v160h80v-160Zm400 0v160h80v-160h-80Zm-400 0h-80 80Zm400 0h80-80Z"/></svg>',
  // Visibility
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z"/></svg>',
  // Info
  '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
];

/**
 * Displays a UI similar to the (newer) reCAPTCHA with URL.
 *
 * @param {HTMLElement | string} root Root element
 * @param {string} url URL to display
 * @param {{ mobile?: boolean }} [options]
 * @returns {Promise<boolean>} Returns true after the user refreshes five times
 */
export default async function rickaptcha(root, url, options) {
  if (!initialized) {
    window.customElements.define('r-cha', Unstyled);
    initialized = true;
  }

  const template = options?.mobile ?? isMobile() ? MOBILE : DESKTOP;

  const element = typeof root === 'string' ? document.querySelector(root) : root;
  element.innerHTML = `
<style>
r-cha {
  display: block;
}
.rickaptcha {
  width: 24em;
  border: 1px solid #ccc;
  background: center / contain no-repeat url('data:image/svg+xml;utf8,${encodeURIComponent(BG_SVG)}');
}
.rickaptcha, .rickaptcha * {
  font-family: sans-serif;
}

#rcha-header {
  background: #37d;
  color: #fff;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  line-height: 5em;
  margin: 8px;
}

#rcha-hint {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1em 8px;
}
#rcha-hint-icon {
  width: 4em;
  height: 4em;
  margin: 1em;
}
#rcha-hint-text {
  color: #444;
  text-align: center;
  margin-right: 2.5em;
}

#rcha-qr-box {
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 1em;
  width: fit-content;
  margin: 0 auto;
  box-shadow: 0 0 8px #0008;
}
#rcha-qr {
  width: 12em;
  height: 12em;
}

.rcha-button {
  background: #37d;
  transition: background .2s ease-in-out;
  color: #fff;

  width: fit-content;
  padding: 0 1em;
  line-height: 2.5em;
  border-radius: 100em;
  text-align: center;
  margin: 6em auto;
  cursor: pointer;
}
.rcha-button:hover {
  background: #15a;
}

.rcha-bar {
  border-top: 1px solid #ccc;
  margin-top: 3em;
  display: flex;
  flex-direction: row;
}
.rcha-bar .rcha-bar-item {
  width: 2em;
  height: 2em;
  margin: .5em;
  opacity: .6;
  cursor: not-allowed;
}
</style>

<r-cha class="rickaptcha" aria-hidden="true">
  <r-cha id="rcha-header">${template.header}</r-cha>
  <r-cha id="rcha-hint">
    ${img(template.hintIcon, '', 'rcha-hint-icon')}
    <r-cha id="rcha-hint-text">${template.hint}</r-cha>
  </r-cha>
  <r-cha id="rcha-content">${template.generate(url)}</r-cha>
  <r-cha class="rcha-bar">
    ${img(BAR_ACTIONS[0], 'opacity: 1; cursor: pointer;', 'rcha-bar-refresh', 'rcha-bar-item')}
    ${
      BAR_ACTIONS.slice(1, 3).map((svg) => img(svg, 'cursor: not-allowed;', '', 'rcha-bar-item')).join('')
    }
    ${img(BAR_ACTIONS[3], 'opacity: 1; cursor: pointer;', 'rcha-bar-info', 'rcha-bar-item')}
  </r-cha>
</r-cha>
  `;

  element.querySelector('#rcha-bar-info').addEventListener('click', () => {
    window.open('https://github.com/gudzpoz/rickaptcha', '_blank');
  });

  return new Promise((resolve) => {
    let refreshed = 0;
    element.querySelector('#rcha-bar-refresh').addEventListener('click', () => {
      refreshed += 1;
      setTimeout(() => {
        element.querySelector('#rcha-content').innerHTML = template.generate(
          url.includes('#') ? url : `${url}#${refreshed}`,
        );
      }, 500);
      if (refreshed === 5) {
        resolve(true);
      }
    });
  });
}
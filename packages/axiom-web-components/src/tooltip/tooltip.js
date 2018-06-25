import '@webcomponents/webcomponentsjs';
import popperJS from 'popper.js';

import template from '../helper/template';

class Tooltip extends HTMLElement {
  constructor() {
    super();
    const t = template`
      <div class="ax-position ax-position--arrow">
        <div class="ax-context" style="pointer-events: none;">
          <div class="ax-context__arrow"></div>
          <div class="ax-context__content">
            <div class="ax-context-content ax-context-content--padding-horizontal-small ax-context-content--padding-vertical-small">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(t);
  }

  connectedCallback() {
    this.popperjs = new popperJS(this.target, this.shadowRoot.querySelector('.ax-position'), {
      removeOnDestroy: true,
      placement: 'auto',
      modifiers: {
        arrow: {
          enabled: true,
          element: this.shadowRoot.querySelector('.ax-context__arrow'),
        }
      }
    });
  }

  disconnectedCallback() {
    this.popperjs.destroy();
  }
}

window.customElements.define('ax-tooltip', Tooltip);

export default Tooltip;

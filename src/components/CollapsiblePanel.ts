import * as React from 'react';
import * as ReactDOM from 'react-dom';
import  retargetEvents from 'react-shadow-dom-retarget-events';
import CollapsibleReact from './CollapsibleReact';
console.log("collapsible panel module");
export default class CollapsiblePanel extends HTMLElement {
  static get observedAttributes() {
    return ['title'];
  }

  mountPoint!: HTMLSpanElement;
  title!: string;
  component: any;
  constructor() {
    // Always call super first in constructor
    super();
    this.mountPoint = document.createElement('span');
    // const shadowRoot = this.attachShadow({ mode: 'open' });
    // shadowRoot.appendChild(this.mountPoint);

    // const title = this.getAttribute('title');
    // ReactDOM.render(this.createCollapsed(title), this.mountPoint);
    // retargetEvents(shadowRoot);
  }

  connectedCallback() {
      console.log("connectedCallback called");
    // this.mountPoint = document.createElement("span");
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.mountPoint);

    const title = this.getAttribute("title") as string;
    this.component = ReactDOM.render(
        React.createElement(CollapsibleReact, { title }, React.createElement('slot')),
      this.mountPoint
    );
    this.component.setState({ title });
    retargetEvents(shadowRoot);
  }

  createCollapsed(title: any) {
    return React.createElement(CollapsibleReact, { title }, React.createElement('slot'));
  }

//   connectedCallback() {
//       console.log("Connected callback called");
//     // const shadowRoot = this.attachShadow({ mode: 'open' });
//     // shadowRoot.appendChild(this.mountPoint);

//     const title = this.getAttribute('title');
//     ReactDOM.render(this.createCollapsed(title), this.mountPoint);
//     retargetEvents(shadowRoot);
//   }

attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    if (this.component && name === "title") {
      this.component.setState({ title: newValue });
    }
  }
}

window.customElements.define('collapsible-panel', CollapsiblePanel);
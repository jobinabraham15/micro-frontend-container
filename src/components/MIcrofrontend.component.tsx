// On Component mount, need to load the asset manifest
// Figure out the main.js file
// Call the renderMethod of the microfrontend
// Each Microfrontend should register a method on window thatrenders itself

import React, { Component } from "react";

declare global {
  interface Window {
    [key: string]: any;
  }
}

type document = Document;
type window = Window;
interface IMicrofrontendProps {
  name: string;
  history: any;
  host: string;
  document: document;
  window: window;
}

class Microfrontend extends Component<IMicrofrontendProps> {
  static defaultProps = {
    document: document,
    window: window
  };
  componentDidMount() {
    const { name, host, document } = this.props;
    const scriptId = `micro-frontend-script-${name}`;

    // if (document.getElementById(scriptId)) {
    //   this.renderMicroFrontend();
    //   return;
    // }

    fetch(`${host}/asset-manifest.json`)
      .then(res => res.json())
      .then(manifest => {
        let entryScripts = manifest.entrypoints;
        console.log("Got Manifest", entryScripts, this.props.host);
        let entryScriptLength = entryScripts.length;
        let loaded = 1;
        for (let i = 0; i < entryScripts.length; i++) {
          let entry = entryScripts[i];
          if (/.js$/.test(entry)) {
            const script = document.createElement("script");
            // script.id = scriptId;
            script.crossOrigin = "";
            script.src = `${host}/${entry}`;
            script.onload = () => {
              loaded++;
              console.log("entryScriptLength", entryScriptLength, loaded);
              if(loaded === entryScriptLength){
                this.renderMicroFrontend();
              }
            };
            document.head.appendChild(script);
          }
        }
      });
  }

  renderMicroFrontend = () => {
    const { name, window, history } = this.props;
    window[`render${name}`](`${name}-container`, history);
  };

  render() {
    return <main id={`${this.props.name}-container`}></main>;
  }
}

export default Microfrontend;

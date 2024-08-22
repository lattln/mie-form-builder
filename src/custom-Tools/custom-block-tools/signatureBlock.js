import { makeElement, deleteBlockBtn } from '../utilsFunction';
import { signature_icon } from '../SVGIcons';
import SignaturePad from 'signature_pad';
import "./css/signature.css"

export default class signatureBlock {
  static get toolbox() {
    return {
      title: 'Signature Block',
      icon: signature_icon,
    };
  }

  constructor({ data, api }) {
    this.api = api;
    this.data = data || {};
    this.wrapper = null;
    this.canvas = null;
  }

  render() {
    this.wrapper = makeElement('div', ['customBlockTool']);
    const signatureContainer = makeElement('div', ['signature-container']);
    this.canvas = makeElement('canvas', ['signature-canvas']);
    const clearButton = makeElement('button', ['signature-clear-button']);
    clearButton.textContent = 'Clear';
    deleteBlockBtn(this.wrapper, this.api);

    signatureContainer.appendChild(this.canvas);
    this.wrapper.appendChild(signatureContainer);
    this.wrapper.appendChild(clearButton);

    this.initSignaturePad();

    clearButton.addEventListener('click', () => {
      this.clearSignature();
    });

    return this.wrapper;
  }

  initSignaturePad() {

    // Set canvas dimensions
    this.canvas.width = 500; // Set the desired width
    this.canvas.height = 200; // Set the desired height


    this.signaturePad = new SignaturePad(this.canvas, {
      penColor: 'rgb(0, 0, 0)',
    });

    if (this.data && this.data.signature) {
      this.signaturePad.fromDataURL(this.data.signature);
    }
    
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  save() {
    return {
      signature: this.signaturePad.toDataURL()
    };
  }

  validate(savedData) {
    return true;
  }
}

import { makeElement, deleteBlockBtn } from "../Utility/utilsFunction";
import { signature_icon } from "../Utility/SVGIcons";
import SignaturePad from "signature_pad";
import "../blockTools_css/signature-block.css"

export default class SignatureBlock {
  static get toolbox() {
    return {
      title: 'Signature Block',
      icon: signature_icon
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
    clearButton.textContent = 'Clear Signature';
    deleteBlockBtn(this.wrapper, this.api);

    signatureContainer.appendChild(this.canvas);
    this.wrapper.appendChild(signatureContainer);
    this.wrapper.appendChild(clearButton);

    this.initSignaturePad();

    clearButton.addEventListener('click', () => {
      this.clearSignature();
    });

    // Add event listener for window resize
    window.addEventListener('resize', () => {
      this.adjustCanvasSize();
      this.signaturePad.clear(); // Clear the canvas on resize to avoid distortions
    });

    return this.wrapper;
  }

  initSignaturePad() {
    // Set initial canvas dimensions based on current window size
    this.adjustCanvasSize();

    this.signaturePad = new SignaturePad(this.canvas, {
      penColor: 'rgb(0, 0, 0)',
    });

    if (this.data && this.data.signature) {
      this.signaturePad.fromDataURL(this.data.signature);
    }
  }

  adjustCanvasSize() {
    // Get current window width and height
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    // Adjust the canvas size based on the window size
    this.canvas.width = Math.min(width * 0.8, 750); 
    this.canvas.height = Math.min(height * 0.5, 480); 
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

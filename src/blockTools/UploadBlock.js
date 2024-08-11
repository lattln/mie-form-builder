import { cloudUpload_icon, fileUpload_icon } from "../Utility/SVGIcons";
import { deleteBlockBtn, initalQuestion, setUpPlaceHolder, makeElement, multiAppend } from '../Utility/utilsFunction.js';
import '../blockTools_css/fileUploadQuestion.css';

export default class UploadBlock {
    static get toolbox() {
        return {
            title: 'Upload Block',
            icon: fileUpload_icon
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, api, readOnly }) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockWrapper = null;
        this.blocks = [];
        this.readOnly = readOnly;
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockWrapper = makeElement('div', ['inlineEvenSpace']);
        
        if (!this.readOnly) {
            deleteBlockBtn(this.wrapper, this.api);  
        }

        this.block(this.data[0]);
        
        multiAppend(this.wrapper, [this.blockWrapper]);
        return this.wrapper;
    }

    block(blockData = {}) {
        const blockContainer = makeElement('div', ['customBlockTool-innerContainer']);
        const questionText = makeElement('p', ['customBlockTool-questionPadding']);
        questionText.contentEditable = !this.readOnly; 

        setUpPlaceHolder(questionText, initalQuestion, blockData.question, !this.readOnly);

        const ddBoxArea = makeElement('div', ['fileUpload-ddBoxArea']);
        const ddBoxImg = makeElement('span');
        ddBoxImg.innerHTML = cloudUpload_icon;

        const ddBoxText = makeElement('p', ['fileUpload-ddBoxText']);
        ddBoxText.textContent = 'Drag & Drop';

        const ddBoxText2 = makeElement('p', ['fileUpload-ddBoxText']);
        ddBoxText2.textContent = 'or';

        const fileInput = makeElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.id = 'userDocInput';
        fileInput.accept = '.pdf,.docx';
        fileInput.disabled = !this.readOnly;  

        const fileLabel = makeElement('label', ['fileUpload-ddBoxLabel']);
        fileLabel.textContent = 'Browse';
        fileLabel.htmlFor = 'userDocInput';

        multiAppend(ddBoxArea, [ddBoxImg, ddBoxText, ddBoxText2, fileInput, fileLabel]);
        multiAppend(blockContainer, [questionText, ddBoxArea]);
        multiAppend(this.wrapper, [blockContainer]);

        if (!this.readOnly) {
            this.addEventListeners(ddBoxArea, fileInput, ddBoxText, ddBoxText2, fileLabel);
        }

        this.blocks.push({ questionText, fileInput, ddBoxText, ddBoxText2, fileLabel, ddBoxArea });
    }

    addEventListeners(ddBoxArea, fileInput, ddBoxText, ddBoxText2, fileLabel) {

        ddBoxArea.addEventListener('dragover', (event) => {
            event.preventDefault();
            this.updateDdBoxText(ddBoxText, ddBoxText2, fileLabel, 'Release to upload', '', '');
            ddBoxArea.classList.add('active');
        });

        ddBoxArea.addEventListener('dragleave', () => {
            this.resetDdBoxText(ddBoxText, ddBoxText2, fileLabel);
            ddBoxArea.classList.remove('active');
        });

        ddBoxArea.addEventListener('drop', (event) => {
            event.preventDefault();
            this.file = event.dataTransfer.files[0];
            this.handleFile(ddBoxText, ddBoxText2, fileLabel);
        });

        fileInput.addEventListener('change', (event) => {
            this.file = event.target.files[0];
            this.handleFile(ddBoxText, ddBoxText2, fileLabel);
        });
    }

    handleFile(ddBoxText, ddBoxText2, fileLabel) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const fileURL = fileReader.result;
            console.log(fileURL);
        };
        fileReader.readAsDataURL(this.file);
        this.updateDdBoxText(ddBoxText, ddBoxText2, fileLabel, 'Uploaded', '', '');
    }

    updateDdBoxText(ddBoxText, ddBoxText2, fileLabel, text1, text2, labelText) {
        ddBoxText.textContent = text1;
        ddBoxText2.textContent = text2;
        fileLabel.textContent = labelText;
    }

    resetDdBoxText(ddBoxText, ddBoxText2, fileLabel) {
        this.updateDdBoxText(ddBoxText, ddBoxText2, fileLabel, 'Drag & Drop', 'or', 'Browse');
    }

    deleteFileUI() {
        this.validType = false;
        this.blocks.forEach(block => {
            this.resetDdBoxText(block.ddBoxText, block.ddBoxText2, block.fileLabel);
            block.ddBoxArea.classList.remove('active');
        });
        this.file = null;
    }

    save() {
        return this.blocks.map(block => ({
            question: block.questionText.textContent
        }));
    }
}

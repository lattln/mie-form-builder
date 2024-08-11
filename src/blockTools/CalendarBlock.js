import { calendar_Icon } from '../Utility/SVGIcons.js';
import { deleteBlockBtn, initalQuestion, makeElement, multiAppend, setUpPlaceHolder } from '../Utility/utilsFunction.js';

export default class CalendarBlock {
    static get toolbox() {
        return {
            title: 'Calendar Block',
            icon: calendar_Icon
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
        questionText.contentEditable = !this.readOnly;  // Enable editing in non-readOnly mode

        setUpPlaceHolder(questionText, initalQuestion, blockData.question, !this.readOnly);

        const dateInput = makeElement('input', ['customBlockTool-date']);
        dateInput.type = 'date';
        dateInput.disabled = !this.readOnly;  // Enable interaction in readOnly mode

        multiAppend(blockContainer, [questionText, dateInput]);
        multiAppend(this.blockWrapper, [blockContainer]);
        this.blocks.push({ questionText, dateInput });
    }

    save() {
        return this.blocks.map(block => ({
            question: block.questionText.textContent,
            date: block.dateInput.value
        }));
    }
}

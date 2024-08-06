import { calendar_Icon } from '../Utility/SVGIcons.js';
import { deleteBlockBtn, initalQuestion, makeElement, multiAppend, setUpPlaceHolder } from '../Utility/utilsFunction.js';

export default class CalendarBlock{
    static get toolbox() {
        return {
            title: 'Calender Block',
            icon: calendar_Icon
        };
    }

    constructor({ data, api }) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockWrapper = null;
        this.blocks = [];
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockWrapper = makeElement ('div', ['inlineEvenSpace']);
        
        deleteBlockBtn(this.wrapper, this.api);
        this.block(this.data[0]);
        
        multiAppend(this.wrapper, [this.blockWrapper]);
        return this.wrapper;
    }

    block( blockData = {} ) {
        const blockContainer = makeElement('div', ['customBlockTool-innerContainer']);
        const questionText = makeElement('p', ['customBlockTool-questionPadding']);
        questionText.contentEditable = true;
        setUpPlaceHolder(questionText, initalQuestion, blockData.question);

        this.selectOption = makeElement('select');
        const dateInput = makeElement('input', ['customBlockTool-date']);
        dateInput.type = 'date'

        multiAppend(blockContainer, [questionText, dateInput]);
        multiAppend(this.wrapper, [blockContainer]);
        this.blocks.push({questionText, dateInput})
    }

    save() {
        return this.blocks.map(block => ({
            question: block.questionText.textContent,
            date: block.dateInput.value
        }))
    }

}

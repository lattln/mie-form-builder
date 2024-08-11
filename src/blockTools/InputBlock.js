import { add_table, input_Icon, sub_table } from '../Utility/SVGIcons';
import { setUpPlaceHolder, deleteBlockBtn, initalQuestion, initalGlobal, createRenderOption, maxCol, minCol, makeElement, multiAppend } from '../Utility/utilsFunction.js';

export default class InputBlock {
    static get toolbox() {
        return {
            title: 'Input Block',
            icon: input_Icon
        }
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

        if (Array.isArray(this.data)) {
            this.data.forEach(blockData => {
                this.block(blockData);
            });
        } else {
            this.block();
        }

        return this.wrapper;
    }

    block(blockData = {}) {
        if (this.blocks.length >= maxCol) {
            return;
        }

        const blockContainer = makeElement('div', ['customBlockTool-innerContainer']);
        const questionText = makeElement('p', ['customBlockTool-questionPadding']);
        questionText.contentEditable = !this.readOnly;  

        const inputField = makeElement('input', ['customBlockTool-input']);
        inputField.disabled = !this.readOnly; 

        setUpPlaceHolder(questionText, initalQuestion, blockData.question, !this.readOnly);
        setUpPlaceHolder(inputField, initalGlobal + 'answer..', null, !this.readOnly);

        multiAppend(blockContainer, [questionText, inputField]);
        multiAppend(this.blockWrapper, [blockContainer]);
        multiAppend(this.wrapper, [this.blockWrapper]);

        this.blocks.push({ blockContainer, questionText, inputField });
    }

    renderSettings() {
        if (this.readOnly) return; 

        const settings = [
            {
                name: 'Add Column',
                icon: add_table,
                action: () => this.block()
            },
            {
                name: 'Remove Column',
                icon: sub_table,
                action: () => this.removeLastBlock()
            }
        ];
        const renderWrapper = makeElement('div', ['renderSetting']);
        settings.forEach(setting => createRenderOption(setting.name, setting.icon, renderWrapper, setting.action.bind(this)));

        return renderWrapper;
    }

    removeLastBlock() {
        if (this.blocks.length > minCol) {
            const lastBlock = this.blocks.pop();
            lastBlock.blockContainer.remove();
        }
    }

    save() {
        return this.blocks.map(block => ({
            question: block.questionText.textContent,
            answer: block.inputField.value
        }));
    }
}

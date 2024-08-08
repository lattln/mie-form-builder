import { add_icon, add_table, selection_Icon, sub_table, trashCan_Icon } from '../Utility/SVGIcons';
import { createRenderBtn, createRenderOption, deleteBlockBtn, initalGlobal, initalQuestion, makeElement, multiAppend, setUpPlaceHolder } from '../Utility/utilsFunction.js';

export default class SelectionBlock {
    static get toolbox() {
        return {
            title: 'Selection Block',
            icon: selection_Icon
        };
    }

    constructor({ data, api }) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockQuestionContainer = null;
        this.blocks = [];
        this.maxBlocks = 3;
        this.currentBlockIndex = 0;
        this.blockSelector = null;
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockQuestionContainer = makeElement('div', ['inlineEvenSpace']);

        deleteBlockBtn(this.wrapper, this.api);

        if (this.data.blocks && this.data.blocks.length) {
            this.data.blocks.forEach(blockData => this.block(blockData));
        } else {
            this.block();
        }

        multiAppend(this.wrapper, [this.blockQuestionContainer]);
        return this.wrapper;
    }

    renderSettings() {
        const settings = [
            { 
                name: 'Add selection',
                icon: add_icon 
            },
            { 
                name: 'Add column', 
                icon: add_table,
                action: this.addcolumn.bind(this)
            },
            { 
                name: 'Remove column', 
                icon: sub_table,
                action: this.removecolumn.bind(this)
            }
        ];

        const renderWrapper = makeElement('div', ['renderSetting']);
        const renderOptionContainer = makeElement('div');
        const selectionInput = makeElement('input', ['renderSetting-input']);
        this.blockSelector = makeElement('select', ['renderSetting-blockSelector']);

        this.updateBlockSelector();

        this.blockSelector.addEventListener('change', (event) => {
            this.currentBlockIndex = event.target.value;
        });

        setUpPlaceHolder(selectionInput, initalGlobal + 'an option..', null);

        createRenderBtn(renderOptionContainer, settings[0].icon, renderWrapper, () => {
            const currentBlock = this.blocks[this.currentBlockIndex];
            this.addOptions(currentBlock, selectionInput.value);
            selectionInput.value = '';
        });

        selectionInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const currentBlock = this.blocks[this.currentBlockIndex];
                this.addOptions(currentBlock, selectionInput.value);
                selectionInput.value = '';
            }
        });
        settings.slice(1).forEach(setting => {
            createRenderOption(setting.name, setting.icon, renderWrapper, setting.action);
        });

        multiAppend(renderOptionContainer, [selectionInput]);
        multiAppend(renderWrapper, [this.blockSelector, renderOptionContainer]);
        return renderWrapper;
    }
    

    addcolumn() {
        if (this.blockQuestionContainer.children.length < this.maxBlocks) {
            this.block();
            this.updateBlockSelector();
        }
    }

    removecolumn() {
        if (this.blockQuestionContainer.children.length > 1) {
            const lastBlock = this.blocks.pop();
            lastBlock.blockContainer.remove();
            this.updateBlockSelector();
        }
    }

    block(blockData = {}) {
        const blockContainer = makeElement('div', ['customBlockTool-innerContainer']);
        const questionText = makeElement('p', ['customBlockTool-questionPadding']);
        questionText.contentEditable = true;

        setUpPlaceHolder(questionText, initalQuestion, blockData.question);

        const selectOption = makeElement('select', ['customBlockTool-select']);
        selectOption.addEventListener('change', () => {
            block.selectedOption = selectOption.value;
        });

        const optionsContainer = makeElement('div', ['options-container']);

        multiAppend(blockContainer, [questionText, selectOption, optionsContainer]);

        this.blockQuestionContainer.appendChild(blockContainer);

        const block = { blockContainer, questionText, selectOption, optionsContainer, options: [], selectedOption: blockData.selectedOption || '' };

        if (blockData.options) {
            blockData.options.forEach(option => this.addOptions(block, option));
            selectOption.value = block.selectedOption; // Set the initial selected option
        }

        this.blocks.push(block);
        this.updateBlockSelector();
    }

    addOptions(block, optionValue) {
        if (optionValue.trim() === '') {
            return;
        }
        const optionElement = makeElement('option');
        optionElement.value = optionValue;
        optionElement.textContent = optionValue;

        const optionWrapper = makeElement('div', ['optionWrapper']);
        const deleteBtn = makeElement('button', ['deleteBlockBtn']);
        deleteBtn.innerHTML = trashCan_Icon;
        deleteBtn.addEventListener('click', () => {
            this.removeOption(block, optionValue, optionElement, optionWrapper);
        });

        multiAppend(optionWrapper, [document.createTextNode(optionValue), deleteBtn])

        block.optionsContainer.appendChild(optionWrapper);
        block.selectOption.appendChild(optionElement);
        block.options.push({ value: optionValue, element: optionElement, wrapper: optionWrapper });
    }

    removeOption(block, optionValue, optionElement, optionWrapper) {
        block.options = block.options.filter(option => option.value !== optionValue);
        optionElement.remove();
        optionWrapper.remove();
    }

    updateBlockSelector() {
        if (!this.blockSelector) {
            return;
        }
        this.blockSelector.innerHTML = '';
        this.blocks.forEach((block, index) => {
            const option = makeElement('option');
            option.value = index;
            option.textContent = `Block ${index + 1}`;
            multiAppend(this.blockSelector, [option]);
        });
    }

    save() {
        return {
            blocks: this.blocks.map(block => ({
                question: block.questionText.textContent,
                options: block.options.map(option => option.value),
                selected: block.selectOption.value || null
            }))
        };
    }
}

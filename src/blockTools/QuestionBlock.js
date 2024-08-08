import { add_icon, checkBox_icon, question_icon, radio_Icon, remove_icon, trashCan_Icon } from "../Utility/SVGIcons";
import { createRenderOption, deleteBlockBtn, initalOption, initalQuestion, makeElement, maxCol, minCol, multiAppend, setUpPlaceHolder } from "../Utility/utilsFunction";
import '../blockTools_css/block-styles.css'

export default class QuestionBlock {

    static get toolbox() {
        return {
            title: 'Question Block',
            icon: question_icon // Default icon
        };
    }

    constructor({ block, data, api,  }) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockWrapper = null;
        this.blocks = [];
        this.id = block.id;
        this.isCheckBox = true; 
        this.renderSettingWrapper = null;
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockWrapper = makeElement('div', ['inlineEvenSpace']);
        deleteBlockBtn(this.wrapper, this.api);

        if (Array.isArray(this.data)) {
            this.data.forEach(blockData => this.Block(blockData));
        } else {
            this.Block();
        }

        this.wrapper.appendChild(this.blockWrapper);
        return this.wrapper;
    }

    Block(blockData = {}) {
        if (this.blocks.length >= maxCol) {
            return;
        }
        const blockContainer = makeElement('div', ['customBlockTool-innerContainer']);
        const questionText = makeElement('p', ['PLACER-HOLDER-QUESTIONTEXT']);
        questionText.contentEditable = true;

        setUpPlaceHolder(questionText, initalQuestion, blockData.question);
        const optionsContainer = makeElement('div', ['customBlockTool-option-container']);

        multiAppend(blockContainer, [questionText, optionsContainer]);

        const blockControls = makeElement('div', ['control-container']);
        const addChoiceBtn = makeElement('button', ['style-button-transparent']);
        addChoiceBtn.innerHTML = add_icon;
        blockControls.onclick = () => this.addOption(optionsContainer, optionIndex);

        multiAppend(blockControls, [addChoiceBtn]);
        multiAppend(blockContainer, [blockControls])
        multiAppend(this.blockWrapper, [blockContainer]);

        const optionIndex = { value: 0 };
        if (blockData.options) {
            blockData.options.forEach(option => this.addOption(optionsContainer, optionIndex, option));
        } else {
            for (let i = 0; i < 3; i++) {
                this.addOption(optionsContainer, optionIndex);
            }
        }
        
        this.blocks.push({ blockContainer, questionText, optionsContainer, optionIndex, type: this.isCheckBox ? 'checkbox' : 'radio', blockId: this.blocks.length });
    }

    addOption(optionsContainer, optionIndex, optionText = '') {
        const optionElement = makeElement('div', ['customBlockTool-option']);
        const inputElement = makeElement('input', ['questionBlock-input']);
        const labelElement = makeElement('label', ['questionBlock-label']);

        inputElement.type = this.isCheckBox ? 'checkbox' : 'radio';
        inputElement.name = this.isCheckBox ? `checkbox-${this.blocks.length}` : `radio-${this.blocks[this.blocks.length - 1].blockId}`;
        inputElement.id = `${inputElement.name}${this.id}-${optionIndex.value}`;
        labelElement.htmlFor = inputElement.id;
        labelElement.contentEditable = true;
        setUpPlaceHolder(labelElement, initalOption + optionIndex.value, optionText);

        const removeBtn = makeElement('button', ['style-button-transparent']);
        removeBtn.innerHTML = trashCan_Icon;
        removeBtn.onclick = () => { optionElement.remove(); optionIndex.value--; };

        multiAppend(optionElement, [inputElement, labelElement, removeBtn]);
        multiAppend(optionsContainer, [optionElement]);
        optionIndex.value++;
    }

    removeOption(block) {
        if (block.optionIndex.value > 1) {
            block.optionsContainer.lastElementChild.remove();
            block.optionIndex.value--;
        }
    }

    renderSettings() {
        const settings = [
            {
                name: 'Add Column',
                icon: add_icon,
                action: () => this.Block()
            },
            {
                name: 'Remove Column',
                icon: remove_icon,
                action: () => this.removeLastBlock()
            },
            {
                name: this.isCheckBox ? 'Switch to Radio' : 'Switch to Checkbox',
                icon: this.isCheckBox ? radio_Icon : checkBox_icon,
                action: () => this.toggleOptionType()
            }
        ];

        this.renderSettingWrapper = makeElement('div', ['renderSetting']);

        settings.forEach(setting => createRenderOption(setting.name, setting.icon, this.renderSettingWrapper, setting.action.bind(this)));

        return this.renderSettingWrapper;
    }

    toggleOptionType() {
        this.isCheckBox = !this.isCheckBox;
        QuestionBlock.toolbox.icon = this.isCheckBox ? checkBox_icon : radio_Icon;
        this.updateOptionTypes();
        this.updateRenderSettings();
    }

    updateOptionTypes() {
        this.blocks.forEach(block => {
            const inputs = block.optionsContainer.querySelectorAll('input');
            inputs.forEach(input => {
                input.type = this.isCheckBox ? 'checkbox' : 'radio';
                input.name = this.isCheckBox ? `checkbox-${this.blocks.length}` : `radio-${block.blockId}`;
            });
            block.type = this.isCheckBox ? 'checkbox' : 'radio'; 
        });
    }

    updateRenderSettings() {
        if (this.renderSettingWrapper) {
            const parent = this.renderSettingWrapper.parentNode;
            if (parent) {
                parent.removeChild(this.renderSettingWrapper);
            }
            this.renderSettingWrapper = this.renderSettings();
            parent.appendChild(this.renderSettingWrapper);
        }
    }

    removeLastBlock() {
        if (this.blocks.length > minCol) {
            const lastBlock = this.blocks.pop();
            lastBlock.blockContainer.remove();
        }
    }

    save() {
        return this.blocks.map(block => {
            const selectedOptions = Array.from(block.optionsContainer.querySelectorAll('input')).filter(input => input.checked).map(input => input.labels[0].textContent);
            return {
                type: block.type, 
                question: block.questionText.textContent,
                options: Array.from(block.optionsContainer.querySelectorAll('label')).map(label => label.textContent),
                selected: block.type === 'radio' ? selectedOptions[0] || null : selectedOptions
            };
        });
    }
}

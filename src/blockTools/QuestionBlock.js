import { add_icon, checkBox_icon, question_icon, radio_Icon, remove_icon, trashCan_Icon } from "../Utility/SVGIcons";
import { createRenderOption, deleteBlockBtn, initalOption, initalQuestion, makeElement, maxCol, minCol, multiAppend, setUpPlaceHolder } from "../Utility/utilsFunction";
import '../blockTools_css/block-styles.css'

export default class QuestionBlock {
    static get toolbox() {
        return {
            title: 'Question Block',
            icon: question_icon
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ block, data, api, readOnly }) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockWrapper = null;
        this.blocks = [];
        this.id = block.id;
        this.isCheckBox = this.data.type === 'checkbox';  // Set the block type from data
        this.renderSettingWrapper = null;
        this.readOnly = readOnly;
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockWrapper = makeElement('div', ['inlineEvenSpace']);

        if (!this.readOnly) {
            deleteBlockBtn(this.wrapper, this.api);  // Only show delete button in editable mode
        }

        if (Array.isArray(this.data.blocks)) {
            this.data.blocks.forEach(blockData => this.Block(blockData));
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
        questionText.contentEditable = !this.readOnly;  // Enable editing in non-readOnly mode

        setUpPlaceHolder(questionText, initalQuestion, blockData.question, !this.readOnly);
        const optionsContainer = makeElement('div', ['customBlockTool-option-container']);

        multiAppend(blockContainer, [questionText, optionsContainer]);

        if (!this.readOnly) {
            const blockControls = makeElement('div', ['control-container']);
            const addChoiceBtn = makeElement('button', ['style-button-transparent']);
            addChoiceBtn.innerHTML = add_icon;
            addChoiceBtn.onclick = () => this.addOption(optionsContainer, optionIndex, '', blockId);
            multiAppend(blockControls, [addChoiceBtn]);
            multiAppend(blockContainer, [blockControls]);
        }

        multiAppend(this.blockWrapper, [blockContainer]);

        const optionIndex = { value: 0 };
        const blockId = this.blocks.length;

        if (blockData.options) {
            blockData.options.forEach(option => this.addOption(optionsContainer, optionIndex, option, blockId));
        } else {
            for (let i = 0; i < 3; i++) {
                this.addOption(optionsContainer, optionIndex, '', blockId);
            }
        }

        this.blocks.push({
            blockContainer,
            questionText,
            optionsContainer,
            optionIndex,
            type: this.isCheckBox ? 'checkbox' : 'radio',
            blockId: blockId
        });
    }

    addOption(optionsContainer, optionIndex, optionText = '', blockId) {
        const optionElement = makeElement('div', ['customBlockTool-option']);
        const inputElement = makeElement('input', ['questionBlock-input']);
        const labelElement = makeElement('label', ['questionBlock-label']);

        inputElement.type = this.isCheckBox ? 'checkbox' : 'radio';
        inputElement.name = this.isCheckBox ? `checkbox-${blockId}` : `radio-${blockId}`;
        inputElement.id = `${inputElement.name}-${this.id}-${optionIndex.value}`;
        labelElement.htmlFor = inputElement.id;
        labelElement.contentEditable = !this.readOnly;  // Enable editing in non-readOnly mode
        inputElement.disabled = !this.readOnly;  // Disable interaction in readOnly mode

        setUpPlaceHolder(labelElement, initalOption + optionIndex.value, optionText, !this.readOnly);

        if (!this.readOnly) {
            const removeBtn = makeElement('button', ['style-button-transparent']);
            removeBtn.innerHTML = trashCan_Icon;
            removeBtn.onclick = () => {
                optionElement.remove();
                optionIndex.value--;
            };
            multiAppend(optionElement, [inputElement, labelElement, removeBtn]);
        } else {
            multiAppend(optionElement, [inputElement, labelElement]);
        }

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
        if (this.readOnly) return;  // Hide settings in readOnly mode

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
        this.updateOptionTypes();
        this.updateRenderSettings();
    }

    updateOptionTypes() {
        this.blocks.forEach(block => {
            const inputs = block.optionsContainer.querySelectorAll('input');
            inputs.forEach(input => {
                input.type = this.isCheckBox ? 'checkbox' : 'radio';
                input.name = this.isCheckBox ? `checkbox-${block.blockId}` : `radio-${block.blockId}`;
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

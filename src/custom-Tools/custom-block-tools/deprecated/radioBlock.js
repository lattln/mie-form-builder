import './css/radioQuestion.css';
import { setUpPlaceHolder, deleteBlockBtn, initalQuestion, initalOption, createRenderOption } from '../../utilsFunction';
import { add_icon, radio_Icon, remove_icon, trashCan_Icon } from '../../SVGIcons';

export default class radioBlock {
    static get toolbox() {
        return {
            title: 'Question - RadioButton',
            icon: radio_Icon
        };
    }

    constructor({data, api}) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockWrapper = null;
        this.blocks = [];
        this.maxBlocks = 3;
        this.minBlocks = 1;
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockWrapper = makeElement('div', ['inlineEvenSpace']);
        deleteBlockBtn(this.wrapper, this.api);

        if (this.data.blocks) {
            this.data.blocks.forEach(blockData => this.addBlock(blockData));
        } else {
            this.addBlock();
        }
        this.wrapper.appendChild(this.blockWrapper);
        return this.wrapper;
    }

    addBlock(blockData = {}) {
        if (this.blocks.length >= this.maxBlocks) {
            return;
        }

        const blockContainer = makeElement('div', ['customBlockTool-innerContainer']);
        const questionText = makeElement('p', ['customBlockTool-questionPadding']);
        questionText.contentEditable = true;
        setUpPlaceHolder(questionText, initalQuestion, blockData.question);

        const radioContainer = makeElement('div', ['CBQ-radioContainer', 'customBlockTool-columnAllign']);
        blockContainer.appendChild(questionText);
        blockContainer.appendChild(radioContainer);

        const blockControls = makeElement('div', ['block-controls']);
        const addChoiceBtn = makeElement('button', ['radioQuestion-removeButton']);
        addChoiceBtn.innerHTML = add_icon;
        addChoiceBtn.onclick = () => this.addOption(radioContainer, optionCount);
        blockControls.appendChild(addChoiceBtn);

        const removeChoiceBtn = makeElement('button', ['radioQuestion-removeButton']);
        removeChoiceBtn.innerHTML = remove_icon;
        removeChoiceBtn.onclick = () => this.removeOption({ radioContainer, optionCount });
        blockControls.appendChild(removeChoiceBtn);

        blockContainer.appendChild(blockControls);
        this.blockWrapper.appendChild(blockContainer);

        const optionCount = { value: 0 };

        if (blockData.options) {
            blockData.options.forEach(option => this.addOption(radioContainer, optionCount, option));
        } else {
            for (let i = 0; i < 3; i++) {
                this.addOption(radioContainer, optionCount);
            }
        }

        this.blocks.push({ blockContainer, questionText, radioContainer, optionCount });
    }

    addOption(radioContainer, optionCount, optionText = '') {
        const radioOption = makeElement('div', ['customBlockTool-padding', 'customBlockTool-radio-container']);
        const radioBtn = makeElement('input', ['customBlockTool-radio']);
        const radioLabel = makeElement('label', ['customBlockTool-radioLabel']);
        radioBtn.type = 'radio';
        radioBtn.name = `radioQuestion-${this.blocks.length}`;
        radioBtn.id = `radio-${optionCount.value}`;
        radioBtn.disabled = true; // Disable the radio button
        radioLabel.htmlFor = radioBtn.id;
        radioLabel.contentEditable = true;
        setUpPlaceHolder(radioLabel, initalOption + optionCount.value, optionText);

        const overlay = makeElement('div', ['customBlockTool-radio-overlay']);

        const removeBtn = makeElement('button', ['radioQuestion-removeButton']);
        removeBtn.innerHTML = trashCan_Icon;
        removeBtn.onclick = () => {
            radioOption.remove();
            optionCount.value--;
        };

        radioOption.appendChild(radioBtn);
        radioOption.appendChild(radioLabel);
        radioOption.appendChild(overlay);
        radioOption.appendChild(removeBtn);
        radioContainer.appendChild(radioOption);
        optionCount.value++;
    }

    removeOption(block) {
        if (block.optionCount.value > 1) {
            block.radioContainer.lastElementChild.remove();
            block.optionCount.value--;
        }
    }

    renderSettings() {
        const settings = [
            {
                name: 'Add Block',
                icon: add_icon,
                action: () => this.addBlock()
            },
            {
                name: 'Remove Last Block',
                icon: trashCan_Icon,
                action: () => this.removeLastBlock()
            }
        ];

        const renderWrapper = makeElement('div', ['renderSetting']);
        settings.forEach(setting => {
            createRenderOption(setting.name, setting.icon, renderWrapper, setting.action.bind(this));
        });

        return renderWrapper;
    }

    removeLastBlock() {
        if (this.blocks.length > this.minBlocks) {
            const lastBlock = this.blocks.pop();
            lastBlock.blockContainer.remove();
        }
    }

    save() {
        return this.blocks.map(block => ({
            question: block.questionText.textContent,
            options: Array.from(block.radioContainer.querySelectorAll('label')).map(label => label.textContent)
        }));
    }
}

function makeElement(tag, classNames = [], attributes = {}) {
    const el = document.createElement(tag);
    if (classNames.length) {
        el.classList.add(...classNames);
    }
    for (const [attr, value] of Object.entries(attributes)) {
        el.setAttribute(attr, value);
    }
    return el;
}

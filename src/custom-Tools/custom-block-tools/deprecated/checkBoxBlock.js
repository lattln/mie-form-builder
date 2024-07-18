import { add_icon, checkBox_icon, remove_icon, trashCan_Icon } from "../../SVGIcons";
import { createRenderOption, deleteBlockBtn, initalOption, initalQuestion, makeElement, setUpPlaceHolder } from "../../utilsFunction";

export default class checkBoxBlock {

    static get toolbox() {
        return {
            title: 'Question - CheckBox',
            icon: checkBox_icon
        };
    }

    constructor({ data, api }) {
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

        const checkBoxContainer = makeElement('div', ['CBQ-checkBoxContainer', 'customBlockTool-columnAllign']);
        blockContainer.appendChild(questionText);
        blockContainer.appendChild(checkBoxContainer);

        const blockControls = makeElement('div', ['block-controls']);
        const addChoiceBtn = makeElement('button', ['radioQuestion-removeButton']);
        addChoiceBtn.innerHTML = add_icon
        addChoiceBtn.onclick = () => this.addCheckBoxOption(checkBoxContainer, checkBoxIndex);
        blockControls.appendChild(addChoiceBtn);

        const removeChoiceBtn = makeElement('button', ['radioQuestion-removeButton']);
        removeChoiceBtn.innerHTML = remove_icon;
        removeChoiceBtn.onclick = () => this.removeCheckBoxOption({ checkBoxContainer, checkBoxIndex });
        blockControls.appendChild(removeChoiceBtn);


        blockContainer.appendChild(blockControls);
        this.blockWrapper.appendChild(blockContainer);

        const checkBoxIndex = { value: 0 };

        if (blockData.options) {
            blockData.options.forEach(option => this.addCheckBoxOption(checkBoxContainer, checkBoxIndex, option));
        } else {
            for (let i = 0; i < 3; i++) {
                this.addCheckBoxOption(checkBoxContainer, checkBoxIndex);
            }
        }

        this.blocks.push({ blockContainer, questionText, checkBoxContainer, checkBoxIndex });
    }

    addCheckBoxOption(checkBoxContainer, checkBoxIndex, optionText = '') {
        const checkBoxOption = makeElement('div', ['customBlockTool-padding', 'customBlockTool-checkbox-container']);
        const checkBoxBtn = makeElement('input', ['customBlockTool-checkbox']);
        const checkBoxLabel = makeElement('label', ['customBlockTool-checkboxLabel']);
        checkBoxBtn.type = 'checkbox';
        // checkBoxBtn.id = `checkbox-${checkBoxIndex.value}`;
        checkBoxBtn.disabled = true; // Disable the checkbox
        // checkBoxLabel.htmlFor = checkBoxBtn.id;
        checkBoxLabel.contentEditable = true;
        setUpPlaceHolder(checkBoxLabel, initalOption + checkBoxIndex.value, optionText);


        const removeBtn = makeElement('button', ['radioQuestion-removeButton']);
        removeBtn.innerHTML = trashCan_Icon;
        removeBtn.onclick = () => {
            checkBoxOption.remove();
            checkBoxIndex.value--;
        };

        checkBoxOption.appendChild(checkBoxBtn);
        checkBoxOption.appendChild(checkBoxLabel);

        checkBoxOption.appendChild(removeBtn);
        checkBoxContainer.appendChild(checkBoxOption);
        checkBoxIndex.value++;
    }

    removeCheckBoxOption(block) {
        if (block.checkBoxIndex.value > 1) {
            block.checkBoxContainer.lastElementChild.remove();
            block.checkBoxIndex.value--;
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
                icon: remove_icon,
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
            options: Array.from(block.checkBoxContainer.querySelectorAll('label')).map(label => label.textContent)
        }));
    }
}

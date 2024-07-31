import { add_table, Input_Icon, sub_table } from '../SVGIcons';
import {setUpPlaceHolder, deleteBlockBtn, initalQuestion, initalGlobal, createRenderOption, maxCol, minCol, makeElement, multiAppend} from '../utilsFunction';


export default class inputBlock {
    static get toolbox() {

        return {
            title: 'Input Block',
            icon: Input_Icon
        }
    }

    constructor( {data, api}) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockWrapper = null;
        this.blocks = [];
        
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockWrapper = makeElement('div', ['inlineEvenSpace']);

        deleteBlockBtn(this.wrapper, this.api);
        if (Array.isArray(this.data)) {
            this.data.forEach(blockData => {
                this.block(blockData);
            })
        }
        else {
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
        questionText.contentEditable = true;
        const inputField = makeElement('input', ['customBlockTool-input']);

        setUpPlaceHolder(questionText, initalQuestion, blockData.question);
        setUpPlaceHolder(inputField, initalGlobal + 'answer..', null);

        multiAppend(blockContainer, [questionText, inputField]);
        multiAppend(this.blockWrapper, [blockContainer]);
        multiAppend(this.wrapper, [this.blockWrapper]);

        this.blocks.push({blockContainer, questionText, inputField})
    }

    renderSettings() {
        const settings = [
            {
                name:'Add Column',
                icon: add_table,
                action: () => this.block()
            },
            {
                name:'Remove Column',
                icon: sub_table,
                action: () => this.removeLastBlock()
            }
        ]
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
        }));
    }
    
}
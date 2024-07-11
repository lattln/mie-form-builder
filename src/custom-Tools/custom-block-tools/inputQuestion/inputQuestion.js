import { add_table, Input_Icon, sub_table } from '../../SVGIcons';
import {setUpPlaceHolder, deleteBlockBtn, initalQuestion, initalGlobal, createRenderOption} from '../../utilsFunction';


export default class InputQuestion {
    static get toolbox() {

        return {
            title: 'Question - UserInput',
            icon: Input_Icon
        }
    }

    constructor( {data, api}) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockQuestionContainer = null;
        
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool')

        this.blockQuestionContainer = document.createElement('div');
        this.blockQuestionContainer.classList.add('inlineEvenSpace');

        deleteBlockBtn(this.wrapper, this.api);
        this.setupBlock();

        return this.wrapper;
    }


    setupBlock() {
        const questionText = document.createElement('p');
        questionText.classList.add("customBlockTool-questionPadding");
        questionText.contentEditable = true;

        const inputField = document.createElement('input');
        inputField.classList.add('customBlockTool-input');

        setUpPlaceHolder(questionText, initalQuestion, this.data.question);
        setUpPlaceHolder(inputField, initalGlobal + 'answer..', null);

        const container = document.createElement('div');
        container.classList.add('customBlockTool-innerContainer');

        container.appendChild(questionText);
        container.appendChild(inputField);
        this.blockQuestionContainer.appendChild(container);
        this.wrapper.append(this.blockQuestionContainer);

    }

    renderSettings() {
        const settings = [
            {
                name:'Add Column',
                icon: add_table
            },
            {
                name:'Remove Column',
                icon: sub_table
            }
        ]
        const renderWrapper = document.createElement('div');
        renderWrapper.classList.add('renderSetting');

        createRenderOption(settings[0].name, settings[0].icon, renderWrapper, this.addColumn);
        createRenderOption(settings[1].name, settings[1].icon, renderWrapper, this.removeColumn);
        
        return renderWrapper;

    }




    addColumn = () => {
        if(this.blockQuestionContainer.children.length < 3 ) {
            this.setupBlock();
        }
    }

    removeColumn = () => {
        if(this.blockQuestionContainer.children.length !== 1) {
            this.blockQuestionContainer.children[this.blockQuestionContainer.children.length - 1].remove();
        }
    }

    save() {
        const question = this.wrapper.querySelector('p').textContent;
        return {
            question,
        };
    }



}
// import './templatetool.css'

import { add_icon, checkBox_icon, remove_icon } from "../../SVGIcons";
import { createRenderOption, deleteBlockBtn, initalOption, initalQuestion, setUpPlaceHolder } from "../../utilsFunction";

export default class checkBoxQuestion {

    static get toolbox() {
        return {
            title: 'Question - CheckBox',
            icon: checkBox_icon

        };
    }

    constructor({ data , api}) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.checkBoxOptionsContainer = null;
        this.checkBoxIndex = 0;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool');
        this.checkBoxContainer = document.createElement('div');
        this.checkBoxContainer.classList.add('CBQ-checkBoxContainer')
        this.checkBoxContainer.classList.add('customBlockTool-columnAllign');
        const CBQContainer = document.createElement('div');
        CBQContainer.classList.add('customBlockTool-innerContainer');
        

        deleteBlockBtn(this.wrapper, this.api);

        const questionText = document.createElement('p');
        questionText.classList.add("customBlockTool-questionPadding");
        questionText.contentEditable = true;
        setUpPlaceHolder(questionText, initalQuestion , this.data.question);

        CBQContainer.appendChild(questionText);
        CBQContainer.appendChild(this.checkBoxContainer);

        this.wrapper.appendChild(CBQContainer);

        if (this.data.options === undefined) {
            for (let i = 0; i < 3; i++) this.addCheckBoxOption();
        } else {
            (this.data.options || []).forEach((index) => this.addCheckBoxOption(index));
        }

        return this.wrapper;
    }

    addCheckBoxOption = (index) => {
        
        const checkBoxContainer = document.createElement('div');
        const checkBoxBtn = document.createElement('input');
        const checkBoxLabel = document.createElement('label');
        checkBoxContainer.classList.add('customBlockTool-padding');

        checkBoxBtn.type = 'checkbox';
        checkBoxBtn.id = `checkbox-${this.checkBoxIndex}`
        checkBoxLabel.htmlFor = checkBoxBtn.id;
        checkBoxLabel.contentEditable = true;
        setUpPlaceHolder(checkBoxLabel, initalOption + this.checkBoxIndex, index);

        checkBoxContainer.appendChild(checkBoxBtn);
        checkBoxContainer.appendChild(checkBoxLabel);
        this.checkBoxContainer.appendChild(checkBoxContainer);
        this.checkBoxIndex++;
    }

    removeCheckBoxOption = () => {
        
        if(this.checkBoxIndex > 1) {
            this.checkBoxContainer.children[this.checkBoxContainer.children.length -1].remove();
            this.checkBoxIndex--;
        }
    }

    renderSettings() {
        const settings = [
            {
                name: 'Add CheckBox',
                icon: add_icon
            },
            {
                name: 'remove Checkbox',
                icon: remove_icon
            }
        ];

        const wrapper = document.createElement('div');
        wrapper.classList.add('renderSetting');

        createRenderOption(settings[0].name, settings[0].icon, wrapper, () => this.addCheckBoxOption());
        createRenderOption(settings[1].name, settings[1].icon, wrapper, this.removeCheckBoxOption);

        return wrapper;
    }

    save() {
        const question = this.wrapper.querySelector('p').textContent;
        const options = Array.from(this.wrapper.querySelectorAll('label')).map(label => label.textContent);
        return {
            question,
            options,
        };
    }


}

import { add_icon, selection_Icon } from '../../SVGIcons';
import { deleteBlockBtn, initalGlobal, initalQuestion, setUpPlaceHolder } from '../../utilsFunction';

export default class ddQuestion {

    static get toolbox() {
        //This is a NEEDED function for EDITORJS
        //This is what the button user will use to select the specific TOOL, This will be rendered in the Tool Selection MENU
        return {
            title: 'Question - DropDown',
            icon: selection_Icon
        };
    }

    constructor({ data, api }) {
        //CONSTRUCTOR OPTIONAL/AS needed
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.selectOption = null;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool')
        deleteBlockBtn(this.wrapper, this.api);

        const questionText = document.createElement('p');
        questionText.classList.add("customBlockTool-questionPadding");
        questionText.contentEditable = true;
        setUpPlaceHolder(questionText, initalQuestion, this.data.question);
        
        this.selectOption = document.createElement('select');

        const container = document.createElement('div');
        container.classList.add('customBlockTool-innerContainer')
        container.classList.add('customBlockTool-columnAllign');
        this.selectOption.classList.add('customBlockTool-select')

        container.appendChild(questionText);
        container.appendChild(this.selectOption);

        this.wrapper.appendChild(container);

        if (this.data.selectionOptions) {
            (this.data.selectionOptions || []).forEach((index) => this.addOptions(index));
        }

        return this.wrapper;
    }

    renderSettings() {
        const settings = {
            name: 'Add selection',
            icon:  add_icon

        }

        const wrapper = document.createElement('div');
        wrapper.classList.add('renderSetting');

        const ddContainer = document.createElement('div');
        const addButton = document.createElement('button');
        const selectionInput = document.createElement('input');

        ddContainer.classList.add('cdx-block');
        ddContainer.classList.add('renderSetting-option');
        addButton.classList.add('renderSetting-button');
        selectionInput.classList.add('renderSetting-input');

        addButton.innerHTML = settings.icon;
        setUpPlaceHolder(selectionInput, initalGlobal + 'an option..', null);
        
        addButton.addEventListener('click', () => {
            this.addOptions(selectionInput.value);
            selectionInput.value = '';
        })

        ddContainer.appendChild(addButton);
        ddContainer.appendChild(selectionInput);

        wrapper.appendChild(ddContainer);
        return wrapper;

    }

    addOptions(optionValue) {
        const customOption = document.createElement('option');
        customOption.value = optionValue;
        customOption.text = optionValue;
        this.selectOption.appendChild(customOption);
    }

    removeOptions() {
        this.selectOption.removeChild();
    }


    save() {

        const question = this.wrapper.querySelector('p').textContent;
        const selectionOptions =  Array.from(this.wrapper.querySelectorAll('option')).map(option => option.value);
        return {
            question,
            selectionOptions,
        }

    }


}

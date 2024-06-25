import { setUpPlaceHolder } from '../../utilsFunction'

export default class ddQuestion {

    static get toolbox() {
        //This is a NEEDED function for EDITORJS
        //This is what the button user will use to select the specific TOOL, This will be rendered in the Tool Selection MENU
        return {
            title: 'Question - DropDown',
            icon: `<svg class="w-[17px] h-[17px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
                    </svg>`
        };
    }

    constructor({ data }) {
        //CONSTRUCTOR OPTIONAL/AS needed
        this.data = data || {};
        this.wrapper = null;
        this.defaultText = 'Enter your question...';
        this.selectOption = null;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool')
        

        const textQuestion = document.createElement('p');
        textQuestion.contentEditable = true;
        setUpPlaceHolder(textQuestion, this.defaultText);


        this.selectOption = document.createElement('select');

        const container = document.createElement('div');
        container.classList.add('customBlockTool-columnAllign');
        this.selectOption.classList.add('customBlockTool-select')

        container.appendChild(textQuestion);
        container.appendChild(this.selectOption);

        this.wrapper.appendChild(container);

        return this.wrapper;
    }

    renderSettings() {
        //This is a OPTIONAL function for EDITORJS
        const settings = {
            name: 'Add selection',
            icon:  `<svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                        </svg>`

        }

        const wrapper = document.createElement('div');
        wrapper.classList.add('renderSetting');


        const addButton = document.createElement('button');
        addButton.classList.add('renderSetting-button');
        addButton.innerHTML = settings.icon;

        const selectionInput = document.createElement('input');
        selectionInput.classList.add('renderSetting-input');
        setUpPlaceHolder(selectionInput, 'Enter option..')


        addButton.addEventListener('click', () => {
            this.addOptions(selectionInput.value);
            selectionInput.value = '';
        })

        wrapper.appendChild(addButton);
        wrapper.appendChild(selectionInput);
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
            selectionOptions
        }

    }


}

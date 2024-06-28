// import './templatetool.css'

import { setUpPlaceHolder } from "../../utilsFunction";

export default class checkBoxQuestion {

    static get toolbox() {
        //This is a NEEDED function for EDITORJS
        //This is what the button user will use to select the specific TOOL, This will be rendered in the Tool Selection MENU
        return {
            title: 'Question - CheckBox',
            icon: `<svg class="w-[17px] h-[17px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>`

        };
    }

    constructor({ data }) {
        //CONSTRUCTOR OPTIONAL/AS needed
        this.data = data || {};
        this.isImport = data.isImport || false;
        this.wrapper = null;
        this.checkBoxOptionsContainer = null;
        this.checkBoxIndex = 0;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool');
        this.checkBoxContainer = document.createElement('div');
        this.checkBoxContainer.classList.add('customBlockTool-columnAllign');

        const questionText = document.createElement('p');
        questionText.contentEditable = true;
        setUpPlaceHolder(questionText, this.data.question ||'Enter your question...', this.isImport);


        this.wrapper.appendChild(questionText);
        this.wrapper.appendChild(this.checkBoxContainer);

        if (this.data.options === undefined) {
            for (let i = 0; i < 3; i++) this.addCheckBoxOption();
        } else {
            (this.data.options || []).forEach((index) => this.addCheckBoxOption(index));
        }




        return this.wrapper;
    }



        //renders existing data.





    addCheckBoxOption(index) {
        
        const checkBoxContainer = document.createElement('div');
        const checkBoxBtn = document.createElement('input');
        const checkBoxLabel = document.createElement('label');
        checkBoxContainer.classList.add('customBlockTool-padding');

        let ifElseLabel = !index ? `Checkbox-${this.checkBoxIndex}` : index;
        
        checkBoxBtn.type = 'checkbox';
        checkBoxBtn.id = `checkbox-${this.checkBoxIndex}`
        checkBoxLabel.htmlFor = checkBoxBtn.id;
        checkBoxLabel.contentEditable = true;
        setUpPlaceHolder(checkBoxLabel, ifElseLabel , this.isImport);


        checkBoxContainer.appendChild(checkBoxBtn);
        checkBoxContainer.appendChild(checkBoxLabel);
        this.checkBoxContainer.appendChild(checkBoxContainer);
        this.checkBoxIndex++;
    }

    removeCheckBoxOption() {
        
        if(this.checkBoxIndex > 1) {
            this.checkBoxContainer.children[this.checkBoxContainer.children.length -1].remove();
            this.checkBoxIndex--;
        }
        
        
    }



    save() {
        const question = this.wrapper.querySelector('p').textContent;
        const options = Array.from(this.wrapper.querySelectorAll('label')).map(label => label.textContent);
        const isImport = true;
        return {
            question,
            options,
            isImport
        };

    }

    renderSettings() {
        //This is a OPTIONAL function for EDITORJS

        //This function allows the user to have access to the settings of the current Tool
        //Functionality
        //Render an element into the setting menu on the selected TOOL
        //All EVENTS need to be handled to specification based on needs.
        const settings = [
            {
                name: 'Add CheckBox',
                icon:` <svg class="w-[19px] h-[19px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                        </svg>`
            },
            {
                name: 'remove Checkbox',
                icon: `<svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
                        </svg>` 
            }
            
        ];

        const wrapper = document.createElement('div');

        const addCheckBoxContainer = document.createElement('div');
        const addCheckBoxBtn = document.createElement('button');
        const addCheckBoxLabel = document.createElement('p');
        addCheckBoxContainer.classList.add('renderSetting');
        addCheckBoxBtn.classList.add('renderSetting-button')
        
        
        addCheckBoxBtn.innerHTML = settings[0].icon;
        addCheckBoxLabel.textContent = settings[0].name;
        

        addCheckBoxContainer.addEventListener('click', () => this.addCheckBoxOption(this.checkBoxIndex));
        addCheckBoxContainer.appendChild(addCheckBoxBtn);
        addCheckBoxContainer.appendChild(addCheckBoxLabel);
        wrapper.appendChild(addCheckBoxContainer);


        const removeCheckBoxContainer = document.createElement('div');
        const removeCheckBoxBtn = document.createElement('button');
        const removeCheckBoxLabel = document.createElement('p');
        removeCheckBoxContainer.classList.add('renderSetting');
        removeCheckBoxBtn.classList.add('renderSetting-button')
        
        
        removeCheckBoxBtn.innerHTML = settings[1].icon;
        removeCheckBoxLabel.textContent = settings[1].name;
        

        removeCheckBoxContainer.addEventListener('click', () => this.removeCheckBoxOption());
        removeCheckBoxContainer.appendChild(removeCheckBoxBtn);
        removeCheckBoxContainer.appendChild(removeCheckBoxLabel);
        wrapper.appendChild(removeCheckBoxContainer);

        return wrapper;

    }
}

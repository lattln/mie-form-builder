import { setUpPlaceHolder } from '../../utilsFunction';

export default class dateQuestion {

    static get toolbox() {
        //This is a NEEDED function for EDITORJS
        //This is what the button user will use to select the specific TOOL, This will be rendered in the Tool Selection MENU
        return {
            title: 'Question - Date',
            icon: `<svg class="w-[17px] h-[17px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
                    </svg>`
        };
    }

    constructor({ data }) {
        //CONSTRUCTOR OPTIONAL/AS needed
        this.data = data || {};
        this.wrapper = null;
        this.defaultText = 'Enter your question...'
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool')

        const textQuestion = document.createElement('p');
        textQuestion.contentEditable = true;
        textQuestion.textContent = this.data.question || this.defaultText;
        setUpPlaceHolder(textQuestion, this.defaultText);
        this.selectOption = document.createElement('select');

        const dateInput = document.createElement('input');
        dateInput.type = 'date'
        dateInput.classList.add('customBlockTool-date');

        const container = document.createElement('div');
        container.classList.add('customBlockTool-columnAllign');

        container.appendChild(textQuestion);
        container.appendChild(dateInput);

        this.wrapper.appendChild(container);

        return this.wrapper;
    }



    save() {
        const question = this.wrapper.querySelector('p').textContent;
        const date = this.wrapper.querySelector('input').value;
        return {
            question,
            date
        }

    }


}

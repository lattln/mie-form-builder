import './radioQuestion.css';
import { setUpPlaceHolder } from '../../utilsFunction';

export default class RadioQuestion {
    static get toolbox() {
        return {
            title: 'Question - RadioButton',
            icon: `<svg class="w-[17px] h-[17px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>`
        };
    }

    constructor({data}) {
        this.data = data || {};
        console.log("RadiOQuestion Constructor: ", this.data);
        this.isImport = data.isImport || false;
        this.wrapper = null;
        this.container = null;
        this.optionCount = 1;
        this.defaultText = 'Enter your question...';
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool')

        this.container = document.createElement('div');
        this.container.classList.add('customBlockTool-columnAllign');

        // Initialize the question text
        const questionText = document.createElement('p');
        questionText.contentEditable = true;

        setUpPlaceHolder(questionText, this.data.question || this.defaultText, this.isImport );

        // Append elements to the wrapper
        
        this.wrapper.appendChild(questionText);
        this.wrapper.appendChild(this.container);
        

        //renders existing data.
        if (this.data.options === undefined) {
            for (let i = 0; i < 3; i++) this.addOption();
        } else {
            (this.data.options || []).forEach((index) => this.addOption(index));
        }
        

        return this.wrapper;
    }

    addOption(index) {

        let ifElseLabel = !index ? `Option ${this.optionCount}` : index;

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('customBlockTool-padding');

        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'radioQuestion';
        radioInput.id = `radio-${this.optionCount}`;
        

        const label = document.createElement('label');
        label.htmlFor = radioInput.id;
        setUpPlaceHolder(label, ifElseLabel, this.isImport);
    
        label.contentEditable = true;

        const removeButton = document.createElement('button');
        removeButton.classList.add('radioQuestion-removeButton')
        removeButton.innerHTML= `<svg class="w-[17px] h-[17px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                                    </svg>`
        removeButton.onclick = () => this.removeOption(optionsContainer);

        optionsContainer.appendChild(radioInput);
        optionsContainer.appendChild(label);
        optionsContainer.appendChild(removeButton);

        this.container.appendChild(optionsContainer);
        this.optionCount++;
    }


    removeOption(optionsContainer) {
        this.optionCount--;
        this.container.removeChild(optionsContainer);
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

        const settings = {
                name: 'Add Option',
                icon:` <svg class="w-[19px] h-[19px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                        </svg>`
            };

        const wrapper = document.createElement('div');

        const addOptionContainer = document.createElement('div');
        const addOptionBtn = document.createElement('button');
        const addOptionLabel = document.createElement('p');
        addOptionContainer.classList.add('renderSetting');
        addOptionBtn.classList.add('renderSetting-button')
        
        
        addOptionBtn.innerHTML = settings.icon;
        addOptionLabel.textContent = settings.name;
        

        addOptionContainer.addEventListener('click', () => this.addOption());
        addOptionContainer.appendChild(addOptionBtn);
        addOptionContainer.appendChild(addOptionLabel);
        wrapper.appendChild(addOptionContainer);

        return wrapper;
    }
}

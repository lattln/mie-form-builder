import './radioQuestion.css';
import '../../SVGIcons'
import { setUpPlaceHolder, deleteBlockBtn, initalQuestion, initalOption } from '../../utilsFunction';
import { add_icon, radio_Icon, trashCan_Icon } from '../../SVGIcons';

export default class RadioQuestion {
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
        this.container = null;
        this.optionCount = 1;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool')
        this.container = document.createElement('div');
        this.container.classList.add('customBlockTool-columnAllign');
        deleteBlockBtn(this.wrapper, this.api);

        const RQContainer = document.createElement('div');
        RQContainer.classList.add('customBlockTool-innerContainer')

        // Initialize the question text
        const questionText = document.createElement('p');
        questionText.classList.add("customBlockTool-questionPadding");
        questionText.contentEditable = true;
        setUpPlaceHolder(questionText, initalQuestion ,this.data.question);

        // Append elements to the wrapper
        RQContainer.appendChild(questionText);
        RQContainer.appendChild(this.container);
        this.wrapper.appendChild(RQContainer);
        
        //renders existing data.
        if (this.data.options === undefined) {
            for (let i = 0; i < 3; i++) this.addOption();
        } else {
            (this.data.options || []).forEach((index) => this.addOption(index));
        }
        

        return this.wrapper;
    }

    addOption(index) {

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('customBlockTool-padding');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'radioQuestion';
        radioInput.id = `radio-${this.optionCount}`;
        
        const label = document.createElement('label');
        label.htmlFor = radioInput.id;
        setUpPlaceHolder(label, initalOption + this.optionCount, index);
        label.contentEditable = true;

        const removeButton = document.createElement('button');
        removeButton.classList.add('radioQuestion-removeButton')
        removeButton.innerHTML= trashCan_Icon;
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

    renderSettings() {

        const settings = {
                name: 'Add Option',
                icon: add_icon
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

    save() {
        
        const question = this.wrapper.querySelector('p').textContent;
        const options = Array.from(this.wrapper.querySelectorAll('label')).map(label => label.textContent);
        return {
            question,
            options,
        };
    }


}

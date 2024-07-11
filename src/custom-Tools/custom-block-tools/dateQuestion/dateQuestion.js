import { calendar_Icon } from '../../SVGIcons';
import { deleteBlockBtn, initalQuestion, setUpPlaceHolder } from '../../utilsFunction';

export default class dateQuestion {

    static get toolbox() {
        return {
            title: 'Question - Date',
            icon: calendar_Icon
        };
    }

    constructor({ data, api }) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.defaultText = 'Enter your question...'
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

        const dateInput = document.createElement('input');
        dateInput.type = 'date'
        dateInput.classList.add('customBlockTool-date');

        const container = document.createElement('div');
        container.classList.add('customBlockTool-innerContainer');
        container.classList.add('customBlockTool-columnAllign');

        container.appendChild(questionText);
        container.appendChild(dateInput);

        this.wrapper.appendChild(container);

        return this.wrapper;
    }



    save() {
        const question = this.wrapper.querySelector('p').textContent;
        //const date = this.wrapper.querySelector('input').value;
        return {
            question,
        }

    }


}

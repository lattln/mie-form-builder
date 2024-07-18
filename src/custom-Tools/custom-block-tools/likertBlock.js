import { add_icon, likert_icon, remove_icon } from '../SVGIcons';
import { setUpPlaceHolder, deleteBlockBtn, initalRating, initalQuestion, createRenderOption, multiAppend, makeElement } from '../utilsFunction';
import './css/likertQuestion.css';

export default class likertBlock {

    static get toolbox() {
        return {
            title: 'Question - Likert',
            icon: likert_icon
        };
    }

    constructor({data, api}) {
        this.data = data || {};
        this.api = api;
        this.outerWrapper = null;
        this.wrapper = null;
        this.colNum = this.data.labelRatingScale ? this.data.labelRatingScale.length + 1 : 4;
        this.questionCount = 0;
        this.radioContainer = null;
        this.columnDivQuestion = null;
    }

    render() {
        this.outerWrapper = makeElement('div', ['customBlockTool']);
        this.wrapper = makeElement('div', ['customBlockTool-innerContainer', 'likertQuestion']);
        this.radioContainer = makeElement('div', ['likertQuestion-radioContainer']);

        if (!this.data.labelRatingScale) {
            this.likertInitalRowAndColSetter();
            this.likertAddScaleRow();
        } else {
            this.likertInitalRowAndColSetter(this.data.labelRatingScale);
            (this.data.allQuestions || []).forEach((index) => this.likertAddScaleRow(index));
        }

        this.wrapper.appendChild(this.radioContainer);
        deleteBlockBtn(this.outerWrapper, this.api);
        this.outerWrapper.appendChild(this.wrapper);
        return this.outerWrapper;
    }

    likertInitalRowAndColSetter = (index) => {
        const elements = [];
        for (let i = 0; i < this.colNum; i++) {
            if (i === 0) {
                const spaceHolder = makeElement('p');
                spaceHolder.textContent = 'Question';
                this.columnDivQuestion = makeElement('div', ['likertQuestion-columnDivQuestion']);
                this.columnDivQuestion.appendChild(spaceHolder);
                this.wrapper.appendChild(this.columnDivQuestion);
            } else {
                const columnDiv = makeElement('div', ['likertQuestion-columnDiv']);
                const ratingText = makeElement('div', ['likertQuestion-ratingText']);
                ratingText.contentEditable = true;
                setUpPlaceHolder(ratingText, initalRating, index ? index[i-1] : null);
                columnDiv.appendChild(ratingText);
                elements.push(columnDiv);
            }
        }
        multiAppend(this.radioContainer, elements);
    }

    likertAddScaleRow = (index) => {

        for (let i = 0; i < this.colNum; i++) {
            if (i === 0) {
                const questionText = makeElement('p');
                questionText.contentEditable = true;
                setUpPlaceHolder(questionText, initalQuestion, index);
                this.columnDivQuestion.appendChild(questionText);
            } else {
                const radioInput = makeElement('input');
                radioInput.type = 'radio';
                radioInput.name = `question-${this.questionCount}`;
                this.radioContainer.children[i-1].appendChild(radioInput);
            }
        }
        this.questionCount++;
    }

    likertRemoveScaleRow = () => {
        if (this.questionCount > 1) {
            for (let i = 0, j = this.questionCount; i < this.colNum; i++) {
                if (i === 0) {
                    this.columnDivQuestion.children[j].remove();
                } else {
                    this.radioContainer.children[i-1].children[j].remove();
                }
            }
            this.questionCount--;
        }
    }

    likertAddScaleCol = () => {
        if (this.radioContainer.children.length < 7) {
            const elements = [];
            for (let i = 0; i < 2; i++) {
                const columnDiv = makeElement('div', ['likertQuestion-columnDiv']);
                for (let j = 0; j <= this.questionCount; j++) {
                    if (j === 0) {
                        const questionText = makeElement('p');
                        questionText.contentEditable = true;
                        setUpPlaceHolder(questionText, initalRating, null);
                        columnDiv.appendChild(questionText);
                    } else {
                        const radioInput = makeElement('input');
                        radioInput.type = 'radio';
                        radioInput.name = `question-${j-1}`;
                        columnDiv.appendChild(radioInput);
                    }
                }
                elements.push(columnDiv);
            }
            multiAppend(this.radioContainer, elements);
            this.colNum += 2;
        }
    }

    likertRemoveScaleCol = () => {
        if (this.radioContainer.children.length > 3) {
            for (let i = 0; i < 2; i++) {
                this.radioContainer.lastChild.remove();
            }
            this.colNum -= 2;
        }
    }

    renderSettings() {
        const settings = [
            {
                name: 'Add Question',
                icon: add_icon,
                action: this.likertAddScaleRow
            },
            {
                name: 'Remove Question',
                icon: remove_icon,
                action: this.likertRemoveScaleRow
            },
            {
                name: 'Add Rating',
                icon: add_icon,
                action: this.likertAddScaleCol
            },
            {
                name: 'Remove Rating',
                icon: remove_icon,
                action: this.likertRemoveScaleCol
            }
        ];
    
        const renderWrapper = makeElement('div', ['renderSetting']);
        settings.forEach(setting => createRenderOption(setting.name, setting.icon, renderWrapper, setting.action.bind(this)));
    
        return renderWrapper;
    }
    

    save() {
        const allQuestions = Array.from(this.columnDivQuestion.children).slice(1)
                                    .map(child => child.textContent);

        const labelRatingScale = Array.from(this.radioContainer.children)
                                    .map(child => child.children[0].textContent);

        return { allQuestions, labelRatingScale };
    }
}

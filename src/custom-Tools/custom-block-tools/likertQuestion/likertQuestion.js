import { add_icon, likert_icon, remove_icon } from '../../SVGIcons';
import { setUpPlaceHolder, deleteBlockBtn, initalRating, initalQuestion, createRenderOption } from '../../utilsFunction';
import './likertQuestion.css'

export default class likertQuestion {

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
        this.colNum = !this.data.labelRatingScale ? 4 : this.data.labelRatingScale.length + 1;
        this.questionCount = 0;
        this.radioContainer = null;
        this.columnDivQuestion = null;
    }

    render() {
        this.outerWrapper = document.createElement('div');
        this.outerWrapper.classList.add('customBlockTool');
        this.wrapper = document.createElement('div');
        this.radioContainer = document.createElement('div');
        this.wrapper.classList.add('customBlockTool-innerContainer')
        this.wrapper.classList.add('likertQuestion');
        this.radioContainer.classList.add('likertQuestion-radioContainer');

        if (!this.data.labelRatingScale) {
            this.likertInitalRowAndColSetter();
            this.likertAddScaleRow();
        } else {
            this.likertInitalRowAndColSetter(this.data.labelRatingScale);
            (this.data.allQuestions || []).forEach((index) => this.likertAddScaleRow(index))
        }

        this.wrapper.appendChild(this.radioContainer)
        deleteBlockBtn(this.outerWrapper, this.api)
        this.outerWrapper.appendChild(this.wrapper)
        return this.outerWrapper;
    }

    likertInitalRowAndColSetter = (index) => {
        
        for (let i = 0; i < this.colNum; i++) {

            if (i === 0) {
                const spaceHolder = document.createElement('p');
                this.columnDivQuestion = document.createElement('div');
                this.columnDivQuestion.classList.add('likertQuestion-columnDivQuestion');

                spaceHolder.textContent = 'Question';
                this.columnDivQuestion.appendChild(spaceHolder);
                this.wrapper.appendChild(this.columnDivQuestion);
            } else {
                
                const columnDiv = document.createElement('div');
                columnDiv.classList.add('likertQuestion-columnDiv');
                const ratingText = document.createElement('div');
                ratingText.contentEditable = true;
                ratingText.classList.add("likertQuestion-ratingText")
                if (!index) {
                    setUpPlaceHolder(ratingText, initalRating, null);
                }
                else {
                    setUpPlaceHolder(ratingText, initalRating, index[i-1]);
                }
                columnDiv.appendChild(ratingText);
                this.radioContainer.appendChild(columnDiv);
            }
        }
    }

    likertAddScaleRow = (index) => {
        for (let i = 0; i < this.colNum; i++) {
            if (i === 0) {
                const questionText = document.createElement('p')
                questionText.contentEditable = true;
                setUpPlaceHolder(questionText, initalQuestion, index);
                this.columnDivQuestion.appendChild(questionText);
            } else {
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = `question-${this.questionCount}`;
                this.radioContainer.children[i-1].appendChild(radioInput);
            }
        }
        this.questionCount++
        
    }

    likertRemoveScaleRow = () => {
        if (this.questionCount !== 1) {
            for (let i = 0, j = this.questionCount; i < this.colNum; i++) {
                if (i === 0) {
                    this.columnDivQuestion.children[j].remove();
                    
                }
                else {
                    this.radioContainer.children[i-1].children[j].remove();
                }
            }
            this.questionCount--;

        }
        
    }

    likertAddScaleCol = () => {
        if (this.radioContainer.children.length < 7) {
            for (let i = 0; i < 2; i++) {
                const columnDiv = document.createElement('div');
                columnDiv.classList.add('likertQuestion-columnDiv');
                for (let j = 0; j <= this.questionCount; j++) {
                    if (j === 0 ){
                        const questionText = document.createElement('p')
                        questionText.contentEditable = true;
                        setUpPlaceHolder(questionText, initalRating, null);
                        columnDiv.appendChild(questionText);
                    } else {
                        const radioInput = document.createElement('input');
                        radioInput.type = 'radio';
                        radioInput.name = `question-${j-1}`;
                        columnDiv.appendChild(radioInput);
                    }
                }
                this.radioContainer.appendChild(columnDiv);
            }
            this.colNum += 2;
        }
        
    }
    
    likertRemoveScaleCol = () => {
        if(this.radioContainer.children.length !== 3)
            {
            for (let i = 0; i < 2; i++) {
                this.radioContainer.children[this.radioContainer.children.length - 1].remove()
            }
            this.colNum -= 2;
        }
    }

    renderSettings() {
        const settings = [
            {
                name: 'Add Question',
                icon: add_icon
    
            },
            {
                name: 'Remove Question',
                icon: remove_icon
            },
            {
                name: 'Add Rating',
                icon: add_icon
            },
            {
                name: 'Remove Rating',
                icon: remove_icon
            }
        ]

        const wrapper = document.createElement('div');
        wrapper.classList.add('renderSetting');

        createRenderOption(settings[0].name, settings[0].icon, wrapper, () => this.likertAddScaleRow());
        createRenderOption(settings[1].name, settings[1].icon, wrapper, () => this.likertRemoveScaleRow());
        createRenderOption(settings[2].name, settings[2].icon, wrapper, () => this.likertAddScaleCol());
        createRenderOption(settings[3].name, settings[3].icon, wrapper, () => this.likertRemoveScaleCol());
        
        return wrapper;
    }

    save() {
        const allQuestions = [];
        const labelRatingScale = [];
        for(let i = 0; i < this.radioContainer.children.length; i++) {
            labelRatingScale.push(this.radioContainer.children[i].children[0].textContent);
        }
    
        for (let i = 1; i < this.columnDivQuestion.children.length; i++) {
            const questionText = this.columnDivQuestion.children[i].textContent; 
            allQuestions.push(questionText);
        }
    
        return {
            allQuestions,
            labelRatingScale,
        }
    }
}

import { setUpPlaceHolder } from '../../utilsFunction';
import './likertQuestion.css'

export default class likertQuestion {

    static get toolbox() {
        //This is a NEEDED function for EDITORJS
        //This is what the button user will use to select the specific TOOL, This will be rendered in the Tool Selection MENU
        return {
            title: 'Question - Likert',
            icon: `<svg class="w-[17px] h-[17px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                    </svg>`
        };
    }

    constructor({ data }) {
        //CONSTRUCTOR OPTIONAL/AS needed
        this.data = data || {};
        this.wrapper = null;
        this.colNum = 0;
        this.questionCount = 0;
        this.radioContainer = null;
        this.columnDivQuestion = null;

    }

    render() {
        this.wrapper = document.createElement('div');
        this.radioContainer = document.createElement('div');
        this.wrapper.classList.add('customBlockTool');
        this.wrapper.classList.add('likertQuestion');
        this.radioContainer.classList.add('likertQuestion-radioContainer');
        
        

        
        this.likertInitalRowAndColSetter(3);
        this.likertAddScaleRow();

        this.wrapper.appendChild(this.radioContainer)
        return this.wrapper;
    }

    likertInitalRowAndColSetter(scaleSize) {
        this.colNum = (scaleSize + 1);

        for (let i = 0; i < this.colNum; i++) {
            console.log("hi for loop");
            

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
                setUpPlaceHolder(ratingText, `Rating`);
                columnDiv.appendChild(ratingText);
                this.radioContainer.appendChild(columnDiv);
            }
            
        }
    }


    likertAddScaleRow() {
        for (let i = 0; i < this.colNum; i++) {
            
            if (i === 0) {
                const questionText = document.createElement('p')
                questionText.contentEditable = true;
                setUpPlaceHolder(questionText, 'Enter question for Likert Scale...');
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

    likertRemoveScaleRow() {
        if (this.questionCount !== 1) {
            for (let i = 0, j = this.questionCount; i < this.colNum; i++) {
                if (i === 0) {
                    console.log(this.columnDivQuestion.children[j])
                    this.columnDivQuestion.children[j].remove();
                    
                }
                else {
                    console.log(this.radioContainer.children[i-1].children[j]);
                    this.radioContainer.children[i-1].children[j].remove();
                }
            }
            this.questionCount--;

        }
        
    }

    likertAddScaleCol() {
        if (this.radioContainer.children.length < 7) {
            for (let i = 0; i < 2; i++) {
                const columnDiv = document.createElement('div');
                columnDiv.classList.add('likertQuestion-columnDiv');
                for (let j = 0; j <= this.questionCount; j++) {
                    if (j === 0 ){
                        const questionText = document.createElement('p')
                        questionText.contentEditable = true;
                        setUpPlaceHolder(questionText, 'Rating');
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
    
    likertRemoveScaleCol() {
        if(this.radioContainer.children.length !== 3)
            {
            for (let i = 0; i < 2; i++) {

                        this.radioContainer.children[this.radioContainer.children.length - 1].remove()
                    
                
            }
            this.colNum -= 2;
        }
        
        

    }

    save() {
    // Initialize an array to hold each question and its ratings
    const data = [];

    // Each question is a child of this.columnDivQuestion starting from the second child (first is the header)
    for (let i = 1; i < this.columnDivQuestion.children.length; i++) {
        const questionText = this.columnDivQuestion.children[i].textContent; 
        const ratings = [];
        let selected = false;
        let selectedText = '';

        ratings.push(`Scale: 1-${this.colNum - 1}`);
        // For each column (rating scale), collect the checked status of the radio button for this question
        for (let j = 0; j < this.radioContainer.children.length; j++) {
            const radioButtons = this.radioContainer.children[j].getElementsByTagName('input');

            if (radioButtons[i - 1] && radioButtons[i - 1].checked) {
                
                ratings.push(`Selected: ${j + 1}`); 
                selected = true;
            } 
        }

        if (selected === false) {
            selectedText = 'No selection'
            ratings.push(`Selected: ${selectedText}`);

        }

        data.push({
            question: questionText,
            ratings: ratings
        });
    }

    return data;
}

    renderSettings() {
        const setting = [
            {
                name: 'Add Question',
                icon: `<svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                        </svg>`
    
            },
            {
                name: 'Remove Question',
                icon: `<svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
                        </svg>`
            },
            {
                name: 'Add Rating',
                icon: `<svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5"/>
                        </svg>`
            },
            {
                name: 'Remove Rating',
                icon: `<svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
                        </svg>`
            }
        ]

        const wrapper = document.createElement('div');
        wrapper.classList.add('likertQuestion-renderSetting');



        //ADD QUESTION BUTTON
        const addQuestionContainer = document.createElement('div');
        const addQuestionBtn = document.createElement('button');
        const addQuestionLabel = document.createElement('p');
        addQuestionContainer.classList.add('renderSetting');
        addQuestionBtn.classList.add('renderSetting-button')
        
        addQuestionBtn.innerHTML = setting[0].icon;
        addQuestionLabel.textContent = setting[0].name;

        addQuestionContainer.addEventListener('click', () => this.likertAddScaleRow()
        )

        addQuestionContainer.appendChild(addQuestionBtn);
        addQuestionContainer.appendChild(addQuestionLabel);
        wrapper.appendChild(addQuestionContainer);



        //RREMOVE QUESTION BUTTON
        const removeQuestionContainer = document.createElement('div');
        const removeQuestioBtn = document.createElement('button');
        const removeQuestionLabel = document.createElement('p');
        removeQuestionContainer.classList.add('renderSetting');
        removeQuestioBtn.classList.add('renderSetting-button')
        
        removeQuestioBtn.innerHTML = setting[1].icon;
        removeQuestionLabel.textContent = setting[1].name;

        removeQuestionContainer.addEventListener('click', () => this.likertRemoveScaleRow())
        removeQuestionContainer.appendChild(removeQuestioBtn);
        removeQuestionContainer.appendChild(removeQuestionLabel);
        wrapper.appendChild(removeQuestionContainer);
        
        

        //ADD COLUMN BUTTON
        const addRatingContainer = document.createElement('div');
        const addRatingBtn = document.createElement('button');
        const addRatingLabel = document.createElement('p');
        addRatingContainer.classList.add('renderSetting');
        addRatingBtn.classList.add('renderSetting-button')
        
        addRatingBtn.innerHTML = setting[2].icon;
        addRatingLabel.textContent = setting[2].name;

        addRatingContainer.addEventListener('click', () => this.likertAddScaleCol());
        addRatingContainer.appendChild(addRatingBtn);
        addRatingContainer.appendChild(addRatingLabel);
        wrapper.appendChild(addRatingContainer);


        //REMOVE COLUMN BUTTON
        const removeRatingContainer = document.createElement('div');
        const removeRatingBtn = document.createElement('button');
        const removeRatingLabel = document.createElement('p');
        removeRatingContainer.classList.add('renderSetting');
        removeRatingBtn.classList.add('renderSetting-button');

        removeRatingBtn.innerHTML = setting[3].icon;
        removeRatingLabel.textContent = setting[3].name;

        removeRatingContainer.addEventListener('click', () => this.likertRemoveScaleCol());
        removeRatingContainer.appendChild(removeRatingBtn);
        removeRatingContainer.appendChild(removeRatingLabel);
        wrapper.appendChild(removeRatingContainer);
        
        return wrapper;



    }
}

import { add_icon, likert_icon, remove_icon, trashCan_Icon } from '../SVGIcons';
import { deleteBlockBtn, initalQuestion, initalRating, setUpPlaceHolder, createRenderOption, makeElement, multiAppend } from '../utilsFunction';
import './css/likertQuestion.css';

export default class likertBlock {

    static get toolbox() {
        return {
            title: 'Likert Block',
            icon: likert_icon
        };
    }

    constructor({ data, api }) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockWrapper = null;
        this.blocks = [];
        this.scale = this.data.scale || 5; // Default scale to 5
        this.firstQuestionRatings = this.data.ratings ? this.data.ratings.slice() : Array(this.scale).fill(initalRating); // Store ratings of the first question
        console.log(this.data);
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockWrapper = makeElement('div', []);
        
        deleteBlockBtn(this.wrapper, this.api);

        if (this.data.questions && this.data.questions.length > 0) {
            this.data.questions.forEach((question, index) => {
                this.addQuestion({ question }, index);
            });
        } else {
            this.addQuestion();
        }

        const addQuestionBtn = makeElement('button', ['add-question-btn']);
        addQuestionBtn.innerHTML = `${add_icon} Add Question`;
        addQuestionBtn.onclick = () => this.addQuestion();

        multiAppend(this.wrapper, [this.blockWrapper, addQuestionBtn]);
        return this.wrapper;
    }

    addQuestion(blockData = {}, index) {
        const blockContainer = makeElement('div', ['customBlockTool-innerContainer', 'questionBlock']);
        const questionText = makeElement('p', ['customBlockTool-questionPadding']);
        questionText.contentEditable = true;
        setUpPlaceHolder(questionText, initalQuestion, blockData.question);

        const radioContainer = makeElement('div', ['likertQuestion-radioContainer']);
        const ratings = blockData.ratings || this.firstQuestionRatings.slice();

        ratings.forEach((rating, i) => {
            const columnDiv = makeElement('div', ['likertQuestion-columnDiv']);
            const ratingText = makeElement('div', ['likertQuestion-ratingText']);

            if (this.blocks.length === 0) { // Only make editable for the first question
                ratingText.contentEditable = true;
                ratingText.addEventListener('input', this.updateAllRatings.bind(this, i));
                setUpPlaceHolder(ratingText, initalRating, rating);
                this.firstQuestionRatings[i] = ratingText;
            } else {
                ratingText.textContent = this.firstQuestionRatings[i].textContent || this.firstQuestionRatings[i];
            }

            const radioInput = makeElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question-${this.blocks.length}`;

            columnDiv.appendChild(ratingText);
            columnDiv.appendChild(radioInput);
            radioContainer.appendChild(columnDiv);
        });

        const deleteQuestionBtnContainer = makeElement('div', ['deteteQuestionBtn-container']);
        
        // Only add delete button if it's not the first question
        if (this.blocks.length > 0) {
            const deleteQuestionBtn = makeElement('button', ['deleteBlockBtn', 'centerItems']);
            deleteQuestionBtn.innerHTML = `${trashCan_Icon} Remove Question`;
            deleteQuestionBtnContainer.onclick = () => this.removeLikertQuestion(blockContainer);
            multiAppend(deleteQuestionBtnContainer, [deleteQuestionBtn]);
        }

        multiAppend(blockContainer, [deleteQuestionBtnContainer, questionText, radioContainer]);
        multiAppend(this.blockWrapper, [blockContainer]);

        const block = { blockContainer, questionText, radioContainer, ratings };

        if (typeof index === 'undefined') {
            this.blocks.push(block);
        } else {
            this.blocks[index] = block;
        }
        this.updateBlockData();
    }

    updateAllRatings(index) {
        const textContent = this.firstQuestionRatings[index].textContent;
        this.blocks.forEach((block, blockIndex) => {
            if (blockIndex > 0) { // Skip the first block as it contains the editable ratings
                const ratingText = block.radioContainer.children[index].querySelector('.likertQuestion-ratingText');
                ratingText.textContent = textContent;
            }
        });
    }

    removeLikertQuestion(blockContainer) {
        const index = this.blocks.findIndex(block => block.blockContainer === blockContainer);
        if (index > 0) { // Prevent removing the first question block
            this.blocks.splice(index, 1);
            blockContainer.remove();
            this.updateBlockData();
        }
    }

    updateBlockData() {
        this.blocks.forEach((block, index) => {
            block.radioContainer.querySelectorAll('input').forEach(input => {
                input.name = `question-${index}`;
            });

            if (index > 0) {
                block.radioContainer.querySelectorAll('.likertQuestion-ratingText').forEach((ratingText, i) => {
                    ratingText.textContent = this.firstQuestionRatings[i].textContent || this.firstQuestionRatings[i];
                });
            }
        });
    }

    adjustScale(increase) {
        if (increase && this.scale < 7) {
            this.scale += 2;
        } else if (!increase && this.scale > 3) {
            this.scale -= 2;
        }
        this.updateScale();
    }

    updateScale() {
        this.blocks.forEach(block => {
            const { radioContainer } = block;
            while (radioContainer.children.length < this.scale) {
                const columnDiv = makeElement('div', ['likertQuestion-columnDiv']);
                const ratingText = makeElement('div', ['likertQuestion-ratingText']);

                if (this.blocks.length === 0) { // Only make editable for the first question
                    ratingText.contentEditable = true;
                    ratingText.addEventListener('input', this.updateAllRatings.bind(this, radioContainer.children.length));
                    setUpPlaceHolder(ratingText, initalRating, '');
                    this.firstQuestionRatings.push(ratingText);
                } else {
                    ratingText.textContent = this.firstQuestionRatings[radioContainer.children.length].textContent || this.firstQuestionRatings[radioContainer.children.length];
                }

                const radioInput = makeElement('input');
                radioInput.type = 'radio';
                radioInput.name = radioContainer.querySelector('input').name;

                columnDiv.appendChild(ratingText);
                columnDiv.appendChild(radioInput);
                radioContainer.appendChild(columnDiv);
            }
            while (radioContainer.children.length > this.scale) {
                radioContainer.lastChild.remove();
            }
        });
    }

    renderSettings() {
        const settings = [
            {
                name: 'Add Question',
                icon: add_icon,
                action: () => this.addQuestion()
            },
            {
                name: 'Increase Scale',
                icon: add_icon,
                action: () => this.adjustScale(true)
            },
            {
                name: 'Decrease Scale',
                icon: remove_icon,
                action: () => this.adjustScale(false)
            },
            {
                name: 'Remove Question',
                icon: remove_icon,
                action: () => this.removeLikertQuestion(this.blocks[this.blocks.length - 1].blockContainer)
            }
        ];

        const renderWrapper = makeElement('div', ['renderSetting']);
        settings.forEach(setting => createRenderOption(setting.name, setting.icon, renderWrapper, setting.action.bind(this)));

        return renderWrapper;
    }

    save() {
        return {
            ratings: this.firstQuestionRatings.map(rating => rating.textContent),  
            questions: this.blocks.map(block => block.questionText.textContent)
        };
    }
}

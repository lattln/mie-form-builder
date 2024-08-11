import { add_icon, likert_icon, remove_icon, trashCan_Icon } from '../Utility/SVGIcons';
import { deleteBlockBtn, initalQuestion, initalRating, setUpPlaceHolder, createRenderOption, makeElement, multiAppend } from '../Utility/utilsFunction.js';

export default class LikertBlock {
    static get toolbox() {
        return {
            title: 'Likert Block',
            icon: likert_icon
        };
    }

    static get isReadOnlySupported() {
        return true;
    }

    constructor({ data, api, readOnly }) {
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.blockWrapper = null;
        this.blocks = [];
        this.scale = this.data.scale || 5;  
        this.firstQuestionRatings = this.data.ratings ? this.data.ratings.slice() : Array(this.scale).fill(initalRating);  // Store ratings of the first question
        this.readOnly = readOnly;
    }

    render() {
        this.wrapper = makeElement('div', ['customBlockTool']);
        this.blockWrapper = makeElement('div', ['likertQuestion-container']);
        
        if (!this.readOnly) {
            deleteBlockBtn(this.wrapper, this.api);  
        }

        if (this.data.questions && this.data.questions.length > 0) {
            this.data.questions.forEach((question, index) => {
                this.addQuestion({ question: question.question, selectedRating: question.selectedRating }, index);
            });
        } else {
            this.addQuestion();
        }

        if (!this.readOnly) {
            const addQuestionBtn = makeElement('button', ['blockControl-container', 'customBlockTool-innerContainer', 'centerAllChild', 'padding-bottom']);
            addQuestionBtn.innerHTML = `${add_icon} Add Question`;
            addQuestionBtn.onclick = () => this.addQuestion();
            multiAppend(this.wrapper, [this.blockWrapper, addQuestionBtn]);
        } else {
            multiAppend(this.wrapper, [this.blockWrapper]);
        }

        return this.wrapper;
    }

    addQuestion(blockData = {}, index) {
        const blockContainer = makeElement('div', ['customBlockTool-innerContainer']);
        const questionText = makeElement('p', []);
        questionText.contentEditable = !this.readOnly; 
        setUpPlaceHolder(questionText, initalQuestion, blockData.question, !this.readOnly);
    
        const radioContainer = makeElement('div', ['likert-radioContainer', 'inlineSpace']);
        const ratings = blockData.ratings || this.firstQuestionRatings.slice();
    
        ratings.forEach((rating, i) => {
            const columnDiv = makeElement('div', ['likert-rating-container']);
            const ratingText = makeElement('div', ['likert-ratingText']);
    
            if (this.blocks.length === 0) {
                ratingText.contentEditable = !this.readOnly; 
                ratingText.addEventListener('input', this.updateAllRatings.bind(this, i));
                setUpPlaceHolder(ratingText, initalRating, rating, !this.readOnly);
                this.firstQuestionRatings[i] = ratingText;
            } else {
                ratingText.textContent = this.firstQuestionRatings[i].textContent || this.firstQuestionRatings[i];
            }
    
            const radioInput = makeElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question-${this.blocks.length}`;
            radioInput.value = ratingText.textContent || rating;
            radioInput.disabled = !this.readOnly;  
    
            if (blockData.selectedRating && parseInt(blockData.selectedRating) === parseInt(rating)) {
                radioInput.checked = true;
            }
    
            columnDiv.appendChild(ratingText);
            columnDiv.appendChild(radioInput);
            radioContainer.appendChild(columnDiv);
        });
    
        if (!this.readOnly && this.blocks.length > 0) {
            const deleteQuestionBtnContainer = makeElement('div', ['deleteQuestionBtn-container']);
            const deleteQuestionBtn = makeElement('button', ['deleteBlockBtn', 'centerItems']);
            deleteQuestionBtn.innerHTML = ` Remove Question ${trashCan_Icon}`;
            deleteQuestionBtnContainer.onclick = () => this.removeLikertQuestion(blockContainer);
            multiAppend(deleteQuestionBtnContainer, [deleteQuestionBtn]);
            multiAppend(blockContainer, [deleteQuestionBtnContainer]);
        }
    
        multiAppend(blockContainer, [questionText, radioContainer]);
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
            if (blockIndex > 0) {
                const ratingText = block.radioContainer.children[index].querySelector('.likert-ratingText');
                ratingText.textContent = textContent;
            }
        });
    }

    removeLikertQuestion(blockContainer) {
        const index = this.blocks.findIndex(block => block.blockContainer === blockContainer);
        if (index > 0) {
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
                block.radioContainer.querySelectorAll('.likert-ratingText').forEach((ratingText, i) => {
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
        this.blocks.forEach((block, blockIndex) => {
            const { radioContainer } = block;

            while (radioContainer.children.length < this.scale) {
                const columnDiv = makeElement('div', ['likert-rating-container']);
                const ratingText = makeElement('div', ['likert-ratingText']);

                if (blockIndex === 0) {  
                    ratingText.contentEditable = !this.readOnly;  
                    ratingText.addEventListener('input', this.updateAllRatings.bind(this, radioContainer.children.length));
                    setUpPlaceHolder(ratingText, initalRating, '', !this.readOnly);
                    this.firstQuestionRatings.push(ratingText);
                } else {
                    ratingText.textContent = this.firstQuestionRatings[radioContainer.children.length].textContent || this.firstQuestionRatings[radioContainer.children.length];
                }

                const radioInput = makeElement('input');
                radioInput.type = 'radio';
                radioInput.name = radioContainer.querySelector('input').name;
                radioInput.disabled = !this.readOnly; 

                columnDiv.appendChild(ratingText);
                columnDiv.appendChild(radioInput);
                radioContainer.appendChild(columnDiv);
            }

            while (radioContainer.children.length > this.scale) {
                radioContainer.lastChild.remove();
                if (blockIndex === 0) {
                    this.firstQuestionRatings.pop();  
                }
            }
        });
    }

    renderSettings() {
        if (this.readOnly) return;  
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
            questions: this.blocks.map(block => ({
                question: block.questionText.textContent,
                selectedRating: Array.from(block.radioContainer.querySelectorAll('input')).find(input => input.checked)?.value || null
            }))
        };
    }
}

import {setUpPlaceHolder} from '../../utilsFunction';


export default class InputQuestion {

    //We need atleast of two methods to create a block Tool for Editor.js -- render() & save()
    //We also need to provide a toolbox() get method to display inside the toolbox of editorJS Below is what we can do

    static get toolbox() {
        //You are going to return a title: <tool name> 
        // and return a icon: <icon> 
        // looks something like below

        return {
            title: 'Question - UserInput',
            icon: `<svg class="w-[17px] h-[17px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.7" d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"/>
                    </svg>`

        }
    }

    constructor( {data}) {
        this.data = data || {};
        this.isImport = data.isImport || false
        this.wrapper = undefined;
        this.defaultText = 'Enter your question...'


    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool')

        const questionText = document.createElement('p');
        questionText.contentEditable = true;

        const inputField = document.createElement('input');
        inputField.classList.add('customBlockTool-input');

        setUpPlaceHolder(questionText, this.data.question || this.defaultText, this.isImport);
        setUpPlaceHolder(inputField, 'user entry', this.isImport);

        const container = document.createElement('div');
        container.classList.add('customBlockTool-columnAllign');

        container.appendChild(questionText);
        container.appendChild(inputField);
        this.wrapper.appendChild(container);


        return this.wrapper;
    }


    save() {
        const question = this.wrapper.querySelector('p').textContent;
        const inputField = this.wrapper.querySelector('input').value;
        const isImport = true;
        return {
            question,
            inputField,
            isImport
            
        };

        
    }



}
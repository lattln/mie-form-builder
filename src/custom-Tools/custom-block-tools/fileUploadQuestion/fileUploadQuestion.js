import { cloudUpload_icon, fileUpload_icon } from "../../SVGIcons";
import { deleteBlockBtn, initalQuestion, setUpPlaceHolder } from "../../utilsFunction";
import './fileUploadQuestion.css';

export default class fileUploadQuestion{

    static get toolbox() {

        return {
            title: 'Question - Upload',
            icon: fileUpload_icon
        };
    }

    constructor({ data, api }) {
        //CONSTRUCTOR OPTIONAL/AS needed
        this.data = data || {};
        this.api = api;
        this.wrapper = null;
        this.file = null;
        this.ddBoxText = null;
        this.ddBoxText2 = null;
        this.fileLabel = null;
        this.validType = true;
        
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('customBlockTool');
        deleteBlockBtn(this.wrapper, this.api);

        const UQContainer = document.createElement('div');
        UQContainer.classList.add('customBlockTool-innerContainer');

        const questionText = document.createElement('p');
        questionText.classList.add("customBlockTool-questionPadding");
        questionText.contentEditable = true;
        setUpPlaceHolder(questionText, initalQuestion, this.data.question);

        const ddBoxArea = document.createElement('div');
        ddBoxArea.classList.add('fileUpload-ddBoxArea');

        const ddBoxImg = document.createElement('span');
        ddBoxImg.innerHTML = cloudUpload_icon;

        this.ddBoxText = document.createElement('p');
        this.ddBoxText.classList.add('fileUpload-ddBoxText');
        this.ddBoxText.textContent = 'Drag & Drop';

        this.ddBoxText2 = document.createElement('p');
        this.ddBoxText2.classList.add('fileUpload-ddBoxText');
        this.ddBoxText2.textContent = 'or';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        fileInput.id ='userDocInput';
        fileInput.accept = '.pdf,.docx';

        this.fileLabel = document.createElement('label');
        this.fileLabel.classList.add("fileUpload-ddBoxLabel");
        this.fileLabel.textContent = 'Browse';
        this.fileLabel.htmlFor = 'userDocInput';

        ddBoxArea.appendChild(ddBoxImg);
        ddBoxArea.appendChild(this.ddBoxText);
        ddBoxArea.appendChild(this.ddBoxText2);
        ddBoxArea.appendChild(fileInput);
        ddBoxArea.appendChild(this.fileLabel);
        
        UQContainer.appendChild(questionText);
        UQContainer.appendChild(ddBoxArea);

        this.wrapper.appendChild(UQContainer);


        ddBoxArea.addEventListener('dragover', (event) => {
            this.ddBoxText.textContent = "Release to upload"
            this.ddBoxText2.textContent = '';
            this.fileLabel.textContent = '';
            ddBoxArea.classList.add('active');
            event.preventDefault();
        })

        ddBoxArea.addEventListener('dragleave', () => {
            this.ddBoxText.textContent = "Drag & Drop"
            this.ddBoxText2.textContent = 'or';
            this.fileLabel.textContent = 'Browse';
            ddBoxArea.classList.remove('active');
        })

        ddBoxArea.addEventListener('drop', (event) => {
            event.preventDefault();
            this.file = event.dataTransfer.files[0];
            this.handleFile();
        })

        fileInput.addEventListener('change', (event) => {
            this.file = event.target.files[0];
            this.handleFile();

        })


        return this.wrapper;

    }
    handleFile() {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            //Only Console logging it as of rn.
            console.log(fileURL);
        };
        fileReader.readAsDataURL(this.file);
        this.ddBoxText.textContent = 'Uploaded';
        this.ddBoxText2.textContent = '';
        this.fileLabel.textContent = '';
    }

    deleteFileUI() {
        this.validType = false;
        this.ddBoxText.textContent = "Drag & Drop";
            this.ddBoxText2.textContent = 'or';
            this.fileLabel.textContent = 'Browse';
            this.wrapper.querySelector('.fileUpload-ddBoxArea').classList.remove('active');
            this.file = '';
    }

    save() {
        const question = this.wrapper.querySelector('p').textContent;
        return {
            question
        };
    }
}

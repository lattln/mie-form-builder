import './simpleImage.css';
import { setUpPlaceHolder } from '../utilsFunction';

export default class SimpleImage {

    //We need atleast of two methods to create a block Tool for Editor.js -- render() & save()

    //We also need to provide a toolbox() get method to display inside the toolbox of editorJS Below is what we can do




    static get toolbox() {
        return { 
            //You are going to return a title: <tool name> 
            // and return a icon: <icon> 
            // looks something like below

            title: 'Image',
            icon: `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
                    </svg>`
        };
    }


    //We also need to provide a Constructor for EditorJS to render saveData into JSON
    constructor({data, api}) {
        this.api = api;
        this.data = {
            url: data.url || '',
            caption: data.caption || '',
            withBorder: data.withBorder !== undefined ? data.withBorder : false,
            withBackground: data.withBackground !== undefined ? data.withBackground : false,
            stretched: data.stretched !== undefined ? data.stretched : false,
        };

        //we added wrapper to constructor so we can access it later
        this.wrapper = undefined;

        //we moved setting into the class constructor (or getter) which allows it to be accessed from other methods.
        this.settings = [
            //these are tunes 
            {
                name: 'withBorder',
                icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
            },
            {
                name: 'stretched',
                icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
            },
            {
                name: 'withBackground',
                icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.043 8.265l3.183-3.183h-2.924L4.75 10.636v2.923l4.15-4.15v2.351l-2.158 2.159H8.9v2.137H4.7c-1.215 0-2.2-.936-2.2-2.09v-8.93c0-1.154.985-2.09 2.2-2.09h10.663l.033-.033.034.034c1.178.04 2.12.96 2.12 2.089v3.23H15.3V5.359l-2.906 2.906h-2.35zM7.951 5.082H4.75v3.201l3.201-3.2zm5.099 7.078v3.04h4.15v-3.04h-4.15zm-1.1-2.137h6.35c.635 0 1.15.489 1.15 1.092v5.13c0 .603-.515 1.092-1.15 1.092h-6.35c-.635 0-1.15-.489-1.15-1.092v-5.13c0-.603.515-1.092 1.15-1.092z"/></svg>`
            }
        ];
    }

    render() { //Needed for to make a blockTool in EditorJS.

        //Wrapper class
        this.wrapper = document.createElement('div');
        const input = document.createElement('input');

        this.wrapper.classList.add('simple-image');
        this.wrapper.appendChild(input);

        setUpPlaceHolder(input, 'Paste img URL');
        input.value = this.data && this.data.url ? this.data.url : '';

        //we are adding a event listener so when the user paste in a URL --> The URL changes into
        //an Image and add a captain label

        input.addEventListener('paste', (event) => {
            this._createImage(event.clipboardData.getData('text'));
        });

        return this.wrapper;
        
    }

    _createImage(url, captionText) {

        const image = document.createElement('img');
        //use to be input changed to --> div for the purpose of adding a inline Toolbar
        const caption = document.createElement('div')

        image.src = url;
        image.classList.add('render-image');
        caption.contentEditable = true;
        caption.innerHTML = captionText || '';

        this.wrapper.classList.add('wrapper-body')
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(image);
        this.wrapper.appendChild(caption);

        

    }

    //Save method 
    save(blockContent) { //Needed for to make a blockTool in EditorJS.
        
        const image = blockContent.querySelector('img');
        const caption = blockContent.querySelector('[contenteditable]');

        return Object.assign(this.data, {
            url: image.src,
            caption: caption.value
        });


    }

    //Validate data, if empty !-> go into JSON output
    validate(savedData) {
        if (!savedData.url.trim()){
            return false;
        }

        return true;
    }


    //For Blocksetting all you need to know is renderSettings(), it will be called
    //when user clicks on the Block Actions menu
    //we need to create our action elements and add a handlers to them

    renderSettings() {
        //we move setting into constructor so all method can access it.

        //so we are creating the wrapper div
        const wrapper = document.createElement('div');

        //so --> for each tune we are creating a div and adding into the wrapper element
        this.settings.forEach( tune => {
            let button = document.createElement('div');

            button.classList.add('cdx-settings-button');
            button.innerHTML = tune.icon;
            wrapper.appendChild(button);

            button.addEventListener('click', () => {
                this._toggleTune(tune.name);
                button.classList.toggle('cdx-settings-button--active');
            });
        });

        
        //then we return the whole wrapper
        return wrapper;

    }

    _toggleTune(tune) {
        this.data[tune] = !this.data[tune];
        this._acceptTuneView();
    }

    _acceptTuneView() {
        this.settings.forEach (tune => {
            this.wrapper.classList.toggle(tune.name, !!this.data[tune.name]);

            if (tune.name === 'stretched') {
                this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), !!this.data.stretched);
            }
        });
    }




}

//Connecting to the EditorJS is as simple as how we would connect other tools 
//--> Head to editorContext where EditorJS Objects resides
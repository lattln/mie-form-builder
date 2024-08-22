import './templatetool.css'

export default class templateTool {

    static get toolbox() {
        //This is a NEEDED function for EDITORJS
        //This is what the button user will use to select the specific TOOL, This will be rendered in the Tool Selection MENU
        return {
            title: 'name for the toolbox',
            icon: 'icon for the toolbox'
        };
    }

    constructor({ data }) {
        //CONSTRUCTOR OPTIONAL/AS needed
        this.data = data || {};
    }

    render() {
        //This is a NEEDED function for EDITORJS
        //This is what will be rendered when the user press on the tool. 
        //All events need to be handled to specification based on needs.
    }

    save() {
        //This is a NEEDED function for EDITORJS
        //Handle Data from the tool to output into a JSON FORMAT
        //EXAMPLE
        // const dataToSave = this.element.querySelector('element').textContent;
        // return {
        //     dataToSave
        // };
        //Data that is returned will be handled by EDITORJS and made into JSON --> Only need to specify the format.
    }

    renderSettings() {
        //This is a OPTIONAL function for EDITORJS
        //This function allows the user to have access to the settings of the current Tool
        //Functionality
        //Render an element into the setting menu on the selected TOOL
        //All EVENTS need to be handled to specification based on needs.
    }
}

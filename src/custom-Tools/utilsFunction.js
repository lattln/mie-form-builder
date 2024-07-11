import './SVGIcons';
import { trashCan_Icon } from './SVGIcons';

export function setUpPlaceHolder(element, defaultparm, importedData) {
    const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';

    let defaultText = defaultparm;

    importedData = importedData !== null || undefined ? importedData : defaultparm ;

    if (isInput) {
        if (!element.value) {
            element.placeholder = importedData
        }
    } else {
        if (importedData && importedData !== defaultparm) {
            element.textContent = importedData 
        }
        else if (!importedData || importedData === defaultparm) {
            element.textContent = defaultText; 
            element.classList.add('text-placeholder');

        }
        
    
        
    }


    ['click', 'focus'].forEach(function(e) {
        element.addEventListener(e, () => {
            if (!isInput && element.textContent === defaultText) {
            
                setTimeout(() => {
                    element.textContent = '';
                    element.classList.remove('text-placeholder');
                    element.focus();  
                }, 100); 
            } else if (isInput && element.value.trim() === '') {
                setTimeout(() => {
                    element.placeholder = ''; 
                    element.focus();  
                }, 100); 
            }
        })
    })

    element.addEventListener('blur', () => {
        if (!isInput && element.textContent.trim() === '') {
            element.textContent = defaultText;
            element.classList.add('text-placeholder');
        } else if (isInput && element.value.trim() === '') {
            element.placeholder = defaultText;
        }
    });


}

export function deleteBlockBtn(wrapper, api) {
    const delContainer = document.createElement('div');
    const deleteBtn = document.createElement('button');
    delContainer.classList.add('deleteBlockBtn-container');
    deleteBtn.classList.add('deleteBlockBtn')

    deleteBtn.innerHTML = trashCan_Icon;
    deleteBtn.addEventListener('click', () => api.blocks.delete());

    delContainer.appendChild(deleteBtn);
    wrapper.appendChild(delContainer);

}
export const initalQuestion ='Enter a question... ';
export const initalOption ='Enter Option... ';
export const initalRating ='Rating...'
export const initalGlobal = 'Enter ';


export function SvgImg({icon, text}) {

    const svgStr = icon;
    const svg = new Blob([svgStr], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(svg)


    const inlineStyle = {
        display: 'flex'
    }

    const margin = {
        margin: 0,
        marginLeft: 5
    }
    return (
        <div style={inlineStyle}>
        <img src={url} alt='icon'/> <p style={margin}>{text}</p>
        </div>
    )
}

export function createRenderOption(name, icon, appendTo, optionTask) {
    const optionsContainer = document.createElement('div');
    const optionIcon = document.createElement('button');
    const optionLabel = document.createElement('p');

    optionsContainer.classList.add('cdx-block');
    optionsContainer.classList.add('renderSetting-option');
    optionIcon.classList.add('renderSetting-button');
    optionLabel.classList.add('renderSetting-label');

    optionIcon.innerHTML = icon;
    optionLabel.textContent = name;
    optionsContainer.addEventListener('click', () => optionTask());
    optionsContainer.appendChild(optionIcon);
    optionsContainer.appendChild(optionLabel);
    appendTo.appendChild(optionsContainer);
}
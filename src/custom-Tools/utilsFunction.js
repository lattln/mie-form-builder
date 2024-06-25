export function setUpPlaceHolder(element, text) {
    const isInput = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';

    if (isInput) {
        if (!element.value) {
            element.placeholder = text;
        }
    } else {
        element.textContent = element.textContent.trim() || text;
        element.classList.add('text-placeholder');
    
        
    }

    ['click', 'focus'].forEach(function(e) {
        element.addEventListener(e, () => {
            if (!isInput && element.textContent === text) {
            
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
            element.textContent = text;
            element.classList.add('text-placeholder');
        } else if (isInput && element.value.trim() === '') {
            element.placeholder = text;
        }
    });
}
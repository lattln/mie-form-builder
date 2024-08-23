
function convertFHIRToEditorJS(fhirData) {
    const editorJSData = {
        time: Date.now(),
        blocks: []
    };

    // const blockList = ['calenderBlock', 'inputBlock', 'questionBlock_checkbox', 'questionBlock_radio', 'selectionBlock', 'likertBlock'];
    fhirData.item.forEach(item => {


        let block = [];
        let handledItem = groupHandler(item);

        handledItem.forEach(subItem => {

            let type = subItem.code?.[0]?.code;     

            console.log(`Type: ${type}`);
            console.log('subItems Below:');
            console.log(subItem);

            switch (type) {
                case 'calendarBlock':
                    subItem.item.forEach(item => {
                        block.push({
                            id: item.linkId,
                            type: type,
                            data: [
                                {
                                    question: item.text,
                                    date: item.initial?.[0]?.valueDate
                                }
                            ]
                        })
                    })
                    
                    break;

                default:
                    subItem.item.forEach(item => {
                        block.push({
                            id: item.linkId,
                            type: 'inputBlock',
                            data: [
                                {
                                    question: `unsupported Block ${type} --> ${item.text}`,
                                    answer: `inital value: ${item.initial?.[0]?.valueString}`
                                }
                            ]
                        })
                    })
                    
                    break;
            }
            console.log('block --> :')
            console.log(block);
        })
        editorJSData.blocks.push(block[0]);
    
    })

    console.log(editorJSData);
    return editorJSData;


}

export default convertFHIRToEditorJS;


function groupHandler (item) {
    let block = [];
    let type = item.type
    const code = item.code;
    delete item.code;

    switch(type) {
        case 'group': 
            const grouped = item.item.map( subItem => (subItem));
            block.push({
                item: grouped,
                code
            })
            break;

        default:
                block.push({
                    item: [item],
                    code
                })
                
            break; 
    }
    return block;
}



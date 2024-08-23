

function convertToFHIR(jsonData) {
    const fhirQuestionnaire = {
        resourceType: "Questionnaire",
        id: "sample-questionnaire",
        title: 'WIP', // Needs to be implemented
        status: "draft",
        date: 'WIP', // Needs to be implemented
        publisher: 'WIP', // Needs to be implemented
        description: '', // Needs to be implemented
        item: []
    };

    const system = 'https://github.com/lattln/mie-form-builder'
    let linkId = 1;
    let optionType = null;

    jsonData.blocks.forEach(block => {
        let blockType = block.type;
        let items = [];
        switch (blockType) {

            //<CalenderBlock> BlockStyle --> FHIR
            case 'calendarBlock': 
                block.data.forEach(data => {
                    items.push({
                        linkId: String(linkId++),
                        text: data.question,
                        type: 'date',
                        initial: [{
                            valueDate: data.date
                        }],
                        code: [{
                            system: system,
                            code: blockType,
                        }]
                    })
                })
                break;
                
            //<inputBlock> BlockStyle --> FHIR
            case 'inputBlock': 
                block.data.forEach(data => {
                    items.push({
                        linkId: String(linkId++),
                        text: data.question,
                        type: 'string',
                        initial: [{
                            valueString: data.answer
                        }],
                        code: [{
                            system: system,
                            code: blockType,
                        }]
                    })
                })
                break;
                
            //<questionBlock> BlockStyle --> FHIR
            case 'questionBlock': 
                block.data.forEach(data => {
                        optionType = data.type;
                        const answerOption = data.options.map(option => ({valueString: option}));
                        const initalSelected = data.selected.map(select => ({valueString: select}));
                        if(initalSelected.length > 1) {
                            answerOption.push({initalSelected: initalSelected});
                        }
                        items.push({
                            linkId: String(linkId++),
                            text: data.question,
                            type: 'choice',
                            answerOption: answerOption,
                            code: [{
                                system: system,
                                code: `${blockType}_${optionType}`,
                            }]
                        })
                })
                break;
                
            //<selectionBlock> BlockStyle --> FHIR
            case 'selectionBlock': 
                block.data.forEach(data => {
                    items.push({
                        linkId: String(linkId++),
                        text: data.question,
                        type: 'choice',
                        initial: [{
                            valueString: data.answer
                        }],
                        code: [{
                            system: system,
                            code: blockType,
                        }]
                    })
                })
                break;
                
            //<likertBlock> BlockStyle --> FHIR
            case 'likertBlock': 
                const answerOption = block.data.ratings.map(option => ({valueString: option}));
                block.data.questions.forEach(data => {
                    items.push({
                        linkId: String(linkId++),
                        text: data.question,
                        type: 'choice',
                        answerOption: answerOption,
                        initial: [{
                            valueString: data.selectedRating
                        }],
                        code: [{
                            system: system,
                            code: blockType,
                        }]
                    })
                })
                break;

            //<Unknown / UnsupportedBlock>>
            default:
                items.push({
                    linkId: String(linkId++),
                    code: [{
                        system: system,
                        code: 'unsupportedBlock'
                    }],
                    text: `unsupported block ${blockType}`
                })
                break;
        }

        blockType = blockType === 'questionBlock' ? `${blockType}_${optionType}` : block.type;

        if(items.length > 1) {
            items.forEach(item => {
                delete item.code;
            })
            
            fhirQuestionnaire.item.push({
                linkId: (String(linkId++)),
                type: 'group',
                item: items,
                code: [{
                    system: system,
                    code: blockType
                }],
            })
        }
        else if (items.length === 1) {
            fhirQuestionnaire.item.push(items[0]);
        }
        

        
    });

    return fhirQuestionnaire;
}

export default convertToFHIR;

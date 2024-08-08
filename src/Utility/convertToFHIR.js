function convertToFHIR(jsonData) {
    const fhirQuestionnaire = {
        resourceType: "Questionnaire",
        id: "sample-questionnaire",
        status: "draft",
        item: []
    };

    let linkId = 1;

    jsonData.blocks.forEach(block => {
        if (block.type === "calendarBlock") {
            block.data.forEach(data => {
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question,
                    type: "date",
                    initial: [{ valueDate: data.date }]
                });
                linkId++;
            });
        } else if (block.type === "inputBlock") {
            block.data.forEach(data => {
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question,
                    type: "string",
                    initial: [{ valueString: data.answer }]
                });
                linkId++;
            });
        } else if (block.type === "likertBlock") {
            const ratings = block.data.ratings.map(rating => ({ valueInteger: parseInt(rating) }));
            block.data.questions.forEach(question => {
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: question.question,
                    type: "choice",
                    answerOption: ratings,
                    initial: [{ valueInteger: parseInt(question.selectedRating) }]
                });
                linkId++;
            });
        } else if (block.type === "questionBlock") {
            block.data.forEach(data => {
                const answerOption = data.options.map(option => ({ valueString: option }));
                const initialAnswers = data.selected.map(selected => ({ valueString: selected }));
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question,
                    type: data.type === "checkbox" ? "choice" : "string",
                    answerOption: answerOption,
                    initial: initialAnswers
                });
                linkId++;
            });
        } else if (block.type === "selectionBlock") {
            block.data.blocks.forEach(blockData => {
                const answerOption = blockData.options.map(option => ({ valueString: option }));
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: blockData.question,
                    type: "choice",
                    answerOption: answerOption,
                    initial: [{ valueString: blockData.selected }]
                });
                linkId++;
            });
        } else if (block.type === "uploadBlock") {
            block.data.forEach(data => {
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question,
                    type: "attachment"
                });
                linkId++;
            });
        }
    });

    return fhirQuestionnaire;
}

export default convertToFHIR;

function convertToFHIR(jsonData) {
    const fhirQuestionnaire = {
        resourceType: "Questionnaire",
        id: "sample-questionnaire",
        status: "draft",
        item: []
    };

    let linkId = 1;

    jsonData.blocks.forEach(block => {
        console.log('Processing block:', block);

        // Calendar Block
        if (block.type === "calendarBlock" && Array.isArray(block.data)) {
            block.data.forEach(data => {
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question || "Enter a question...",
                    type: "date",
                    initial: [{ valueDate: data.date || null }]
                });
                linkId++;
            });

        // Input Block
        } else if (block.type === "inputBlock" && Array.isArray(block.data)) {
            block.data.forEach(data => {
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question || "Enter a question...",
                    type: "string",
                    initial: [{ valueString: data.answer || "" }]
                });
                linkId++;
            });

        // Likert Block
        } else if (block.type === "likertBlock" && block.data && Array.isArray(block.data.questions)) {
            block.data.questions.forEach(question => {
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: question.question || "Enter a question...",
                    type: "choice",
                    answerOption: block.data.ratings.map(rating => ({ valueInteger: parseInt(rating) })),
                    initial: [{ valueInteger: question.selectedRating ? parseInt(question.selectedRating) : null }]
                });
                linkId++;
            });

        // Question Block (for radio and checkbox questions)
        } else if (block.type === "questionBlock" && Array.isArray(block.data)) {
            block.data.forEach(data => {
                const answerOption = data.options.map(option => ({ valueString: option }));
                const initialAnswers = Array.isArray(data.selected) && data.selected.length > 0
                    ? data.selected.map(selected => ({ valueString: selected }))
                    : [{ valueString: null }];

                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question || "Enter a question...",
                    type: data.type === 'radio' ? "choice" : "boolean",
                    answerOption: answerOption,
                    initial: initialAnswers
                });
                linkId++;
            });

        // Selection Block
        } else if (block.type === "selectionBlock" && Array.isArray(block.data)) {
            block.data.forEach(data => {
                const answerOption = data.options.map(option => ({ valueString: option }));
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question || "Enter a question...",
                    type: "choice",
                    answerOption: answerOption,
                    initial: [{ valueString: data.selected || "" }]
                });
                linkId++;
            });

        // Upload Block
        } else if (block.type === "uploadBlock" && Array.isArray(block.data)) {
            block.data.forEach(data => {
                fhirQuestionnaire.item.push({
                    linkId: String(linkId),
                    text: data.question || "Enter a question...",
                    type: "attachment"
                });
                linkId++;
            });
        }
    });

    return fhirQuestionnaire;
}

export default convertToFHIR;

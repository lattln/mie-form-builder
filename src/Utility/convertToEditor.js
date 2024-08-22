function convertFHIRToEditorJS(fhirData) {
    const editorJSData = {
        time: Date.now(),
        blocks: []
    };

    fhirData.item.forEach((item) => {
        let block = {};

        switch (item.type) {
            case "choice":
                block = {
                    type: "questionBlock",
                    data: {
                        type: "radio", // Assuming choice translates to radio buttons
                        question: item.text,
                        options: item.answerOption.map(option => option.valueString),
                        selected: item.initial ? item.initial.map(init => init.valueString).join('') : null
                    }
                };
                break;

            case "boolean":
                block = {
                    type: "questionBlock",
                    data: {
                        type: "checkbox", // Assuming boolean translates to a checkbox
                        question: item.text,
                        options: ["Yes", "No"],
                        selected: item.initial ? (item.initial[0].valueBoolean ? "Yes" : "No") : null
                    }
                };
                break;

            case "string":
                block = {
                    type: "inputBlock",
                    data: {
                        question: item.text,
                        answer: item.initial ? item.initial[0].valueString : ""
                    }
                };
                break;

            case "date":
                block = {
                    type: "calendarBlock",
                    data: {
                        question: item.text,
                        date: item.initial ? item.initial[0].valueDate : null
                    }
                };
                break;

            default:
                console.warn(`Unsupported FHIR item type: ${item.type}`);
        }

        editorJSData.blocks.push(block);
    });

    return editorJSData;
}

//EXAMPLE DATA
const fhirData = {
    "resourceType": "Questionnaire",
    "id": "example-questionnaire",
    "status": "draft",
    "item": [
        {
        "linkId": "1",
        "text": "What is your gender?",
        "type": "choice",
        "answerOption": [
            {"valueString": "Male"},
            {"valueString": "Female"},
            {"valueString": "Other"}
        ]
        },
        {
        "linkId": "2",
        "text": "Do you have any allergies?",
        "type": "boolean"
        },
        {
        "linkId": "3",
        "text": "Please specify your allergies",
        "type": "string"
        }
    ]
};

const editorJSData = convertFHIRToEditorJS(fhirData);
console.log(editorJSData);

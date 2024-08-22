import React, { useRef } from 'react';
import convertToFHIR from '../../Utility/convertToFHIR';  // Import the function
import '../../components_css/modals_css/exportModal.css';

const ExportModal = ({ isOpen, onClose, editorInstanceRef }) => {

    const schemaTypeRef = useRef(null); // Use to determine the schema type
    const fileNameRef = useRef(null);  // Use for the file name

    const handleClose = (e) => {
        if (e.target.className === 'exportModal-overlay') {
            onClose();
        }
    };

    const exportData = async () => {
        if (editorInstanceRef.current) {
            let wasReadOnly = editorInstanceRef.current.readOnly.isEnabled;

            try {
                if (wasReadOnly) {
                    editorInstanceRef.current.readOnly.toggle();
                }

                const data = await editorInstanceRef.current.save();
                let jsonData;

                const schemaType = schemaTypeRef.current.value || 'json';
                
                // Convert to FHIR if the selected schema type is FHIR
                if (schemaType === 'fhir') {
                    const fhirData = convertToFHIR(data);
                    jsonData = JSON.stringify(fhirData, null, 2);
                } else {
                    jsonData = JSON.stringify(data, null, 2);
                }

                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const fileName = fileNameRef.current.value || 'ExportedData';

                const link = document.createElement('a');
                link.href = url;
                link.download = `${fileName}_${schemaType}.json` 

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error during export:", error);
            } finally {
                if (wasReadOnly) {
                    setTimeout(() => {
                        editorInstanceRef.current.readOnly.toggle();
                    }, 100); 
                }
            }
        } else {
            console.log("Editor instance is not available");
        }
    };

    if (!isOpen) return null;

    return (
        <div className='exportModal-overlay' onClick={handleClose}>
            <div className='exportModal-header'>Export Data</div>
            <div className='exportModal-body'>
                <label htmlFor='schemaType'>Choose a schema type to export:</label>
                <select name='schemaType' ref={schemaTypeRef}> 
                    <option value={'fhir'}>FHIR</option>
                    <option value={'block'}>JSON</option>
                </select>
                <label htmlFor='fileName'>Export File Name:</label>
                <input name='fileName' ref={fileNameRef}></input>
            </div>
            <div className='controlButton-container'>
                <button className="exportModal-closeButton" onClick={onClose}>
                    Close Export
                </button>
                <button className='exportModal-closeButton' onClick={exportData}>
                    Export data
                </button>
            </div>
        </div>
    );
}

export default ExportModal;

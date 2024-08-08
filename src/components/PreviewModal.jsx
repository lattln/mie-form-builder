import '../components_css/previewModal.css';
import { useState } from 'react';
import convertToFHIR from '../Utility/convertToFHIR';

const PreviewModal = ({ isOpen, onClose, jsonRender }) => {
    const [view, setView] = useState('form');
    const [fhirRender, setFhirRender] = useState('');

    const handleFormClick = () => {
        setView('form');
    };

    const handleJSONClick = () => {
        setView('json');
    };

    const handleFHIRClick = () => {
        if (!fhirRender) {
            const jsonData = JSON.parse(jsonRender);
            const fhirData = convertToFHIR(jsonData);
            setFhirRender(JSON.stringify(fhirData, null, 2));
        }
        setView('fhir');
    };

    if (!isOpen) return null;

    return (
        <div className="previewModal-overlay">
            <div className="previewModal-contentAllign">
                <div className="previewModal-header">
                    <button onClick={handleFormClick} className={view === 'form' ? 'activeTab' : ''}>Form</button>
                    <button onClick={handleJSONClick} className={view === 'json' ? 'activeTab' : ''}>JSON</button>
                    <button onClick={handleFHIRClick} className={view === 'fhir' ? 'activeTab' : ''}>FHIR</button>
                </div>
                <div className="previewModal-content">
                    {view === 'form' && <p>Work in progress</p>}
                    {view === 'json' && <pre>{jsonRender}</pre>}
                    {view === 'fhir' && <pre>{fhirRender}</pre>}
                </div>
            </div>
            <button className="previewModal-closeButton" onClick={onClose}>
                Close Preview
            </button>
        </div>
    );
}

export default PreviewModal;

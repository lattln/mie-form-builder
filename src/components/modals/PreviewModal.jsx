import { useState, useEffect } from 'react';
import convertToFHIR from '../../Utility/convertToFHIR';

import '../../components_css/modals_css/previewModal.css';
import "../../components_css/navBar.css";

const PreviewModal = ({ isOpen, onClose, jsonData }) => {
    const [view, setView] = useState('json');
    const [fhirJsonStringData, setFhirJsonStringData] = useState('');

    const jsonStringData = JSON.stringify(jsonData, null, 5);

    useEffect(() => {
        if (view === 'fhir') {
            const fhirJson = convertToFHIR(jsonData);
            setFhirJsonStringData(JSON.stringify(fhirJson, null, 5));
        }
    }, [view, jsonData]);

    const handleFHIRClick = () => {
        setView('fhir');
    };

    const handleJSONClick = () => {
        setView('json');
    };

    const handleOverlayClose = (e) => {
        if (e.target.className === 'previewModal-overlay') {
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div className="previewModal-overlay" onClick={handleOverlayClose}>
            <div className="previewModal-contentAllign">
                <div className="previewModal-header">
                    <button onClick={handleJSONClick} className={view === 'json' ? 'activeTab' : ''}>JSON</button>
                    <button onClick={handleFHIRClick} className={view === 'fhir' ? 'activeTab' : ''}>FHIR</button>
                </div>
                <div className="previewModal-content">
                    {view === 'fhir' && <pre>{fhirJsonStringData}</pre>}
                    {view === 'json' && <pre>{jsonStringData}</pre>}
                </div>
            </div>
            <button className="previewModal-closeButton" onClick={onClose}>
                Close Preview
            </button>
        </div>
    );
}

export default PreviewModal;

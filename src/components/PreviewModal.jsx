import '../components_css/previewModal.css';
import { useState } from 'react';

const PreviewModal = ({ isOpen, onClose, jsonRender }) => {
    const [view, setView] = useState('json');


    const handleFHIRClick = () => {
        setView('fhir');
    };

    const handleJSONClick = () => {
        setView('json');
    };

    if (!isOpen) return null;

    return (
        <div className="previewModal-overlay">
            <div className="previewModal-contentAllign">
                <div className="previewModal-header"> 
                    <button onClick={handleJSONClick} className={view === 'json' ? 'activeTab' : ''}>JSON</button>
                    <button onClick={handleFHIRClick} className={view === 'fhir' ? 'activeTab' : ''}>FHIR</button>
                </div>
                <div className="previewModal-content">
                    {view === 'fhir' && <pre>Work in Progress</pre>}
                    {view === 'json' && <pre>{jsonRender}</pre>}
                </div>
            </div>
            <button className="previewModal-closeButton" onClick={onClose}>
                Close Preview
            </button>
        </div>
    );
}

export default PreviewModal;

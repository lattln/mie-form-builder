import './css/previewModal.css';
import { useState } from 'react';

const PreviewModal = ({ isOpen, onClose, jsonRender }) => {

    // Local state to toggle between the two views
    const [view, setView] = useState('form');

    if (!isOpen) return null;

    const handleFormClick = () => {
        setView('form');
        
    };

    const handleJSONClick = () => {
        setView('json');
    };

    return (
        <div className="previewModal-overlay">
            <div className="previewModal-contentAllign">
                <div className="previewModal-header">
                    <button onClick={handleFormClick} className={view === 'form' ? 'activeTab' : ''} >Form</button>
                    <button onClick={handleJSONClick} className={view === 'json' ? 'activeTab' : ''} >JSON</button>
                </div>
                <div className="previewModal-content">
                    {view === 'form' ? <p>Work in progress</p> : <pre>{jsonRender}</pre>}
                </div>
            </div>
            <button className="previewModal-closeButton" onClick={onClose}>
                Close Preview
            </button>
        </div>
    );
}

export default PreviewModal;

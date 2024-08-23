import { useState, useContext } from "react";
import { EditorContext } from "./EditorContext";
import PreviewModal from './modals/PreviewModal.jsx';
import ExportModal from "./modals/ExportModal.jsx";
import convertFHIRToEditorJS from "../Utility/convertToEditor.js";

import "../components_css/navBar.css";

const NavBar = () => {

    const { editorInstanceRef } = useContext(EditorContext);
    const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const [jsonData, setJsonData] = useState('');
    const [tempFlag, setTempFlag] = useState(false);

    const handlePreview = async () => {
        if (editorInstanceRef.current) {
            if (editorInstanceRef.current.readOnly.isEnabled === true) {
                editorInstanceRef.current.readOnly.toggle();
                setTempFlag(true);
            }
            document.body.classList.add('disable-scroll');
            const data = await editorInstanceRef.current.save();
            setJsonData(data);
            setPreviewModalOpen(true);
        }
    }

    const handlePreviewClose = () => {
        if (tempFlag === true) {
            editorInstanceRef.current.readOnly.toggle();
            setTempFlag(false);
        }
        document.body.classList.remove('disable-scroll');
        setPreviewModalOpen(false);
    }

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file && event.target.id === 'fileInput') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const content = e.target.result;
                    let data = JSON.parse(content);

                    if (file.name.endsWith('_fhir.json')) {
                        data = convertFHIRToEditorJS(data);
                        console.log(data);
                    }
    
                    if (editorInstanceRef.current) {
                        await editorInstanceRef.current.render(data);
                        console.log("Form rendered successfully with imported data");
                    }
                } catch (error) {
                    console.error("Failed to parse file content", error);
                }
            };
            reader.readAsText(file); 
        }
    }
    

    const handleExport = () => {
        setExportModalOpen(true);
    }

    const handleExportClose = () => {
        setExportModalOpen(false);
    }

    return (
        <div className="navBar">
            <div className="navLogo">
                <img src={`${process.env.PUBLIC_URL}/MIELogo_new.png`} alt="MIE Logo" />
            </div>
            <div className="navButtons">
                <input id="fileInput" type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                <label htmlFor="fileInput" className="button mieColor-blue">Import</label>
                <button className="button mieColor-yellow" onClick={handlePreview}>Preview Data</button>
                <button className="button mieColor-green" onClick={handleExport}>Export</button>
            </div>
            <PreviewModal isOpen={isPreviewModalOpen} onClose={handlePreviewClose} jsonData={jsonData} />
            <ExportModal isOpen={isExportModalOpen} onClose={handleExportClose} content={jsonData} editorInstanceRef={editorInstanceRef} />
        </div>
    );
}

export default NavBar;

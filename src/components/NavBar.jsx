import { useState, useContext } from "react";
import { EditorContext } from "./EditorContext";
import PreviewModal from './PreviewModal';

import "../components_css/navBar.css";
import '../Utility/allQuerySelector.css';


const NavBar = () => {

    const { editorInstanceRef } = useContext(EditorContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [jsonData, setJsonData] = useState('');
    const [tempFlag, setTempFlag] = useState(false);
    

    const exportData = async () => {
        if (editorInstanceRef.current) {
            let wasReadOnly = editorInstanceRef.current.readOnly.isEnabled;
    
            try {
                if (wasReadOnly) {
                    editorInstanceRef.current.readOnly.toggle();
                }

                const data = await editorInstanceRef.current.save();
                console.log(data);
                const jsonData = JSON.stringify(data, null, 2);
    
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
    
                const link = document.createElement('a');
                link.href = url;
    
                const fileName = prompt(
                    "You're about to download the export file.\n\nName of file below:",
                    'JSONFormData'
                );
    
                if (fileName) {
                    link.download = `${fileName}.json`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
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
    
    


        const handlePreview = async () => {
            if (editorInstanceRef.current) {
                if (editorInstanceRef.current.readOnly.isEnabled === true) {
                    editorInstanceRef.current.readOnly.toggle();
                    console.log(tempFlag);
                    setTempFlag(true);
                    console.log(tempFlag);
                }
                document.body.classList.add('disable-scroll');
                const data = await editorInstanceRef.current.save();
                setJsonData(data);
                setModalOpen(true);
                
            }
        }

        const handleClose = () => {
            if (tempFlag === true) {
                editorInstanceRef.current.readOnly.toggle();
                setTempFlag(false);
            }
                document.body.classList.remove('disable-scroll');
                setModalOpen(false);
            }

        const handleImport = (event) => {
        const file = event.target.files[0];
        if (file && event.target.id === 'fileInput') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                try {
                    const data = JSON.parse(content);
                    if (editorInstanceRef.current) {
                        await editorInstanceRef.current.render(data);
                        console.log("Form rendered successfully with imported data");

                    }
                } catch (error) {
                    console.error("Failed to parse file content", error);
                }
                event.target.value = '';
            };
            reader.readAsText(file);
        }
    }

            

    return (
        <div className="navBar">
            <div className="navLogo">
                <img src={`${process.env.PUBLIC_URL}/MIELogo_new.png`} alt="MIE Logo" />
            </div>
            <div className="navButtons">
            <input id="fileInput" type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                <label htmlFor="fileInput" className="button mieColor-blue">Import</label>
                <button className="button mieColor-yellow" onClick={handlePreview} >Preview Data</button>
                <button className="button mieColor-green" onClick={exportData}>Export</button>
                
            </div>
            <PreviewModal isOpen={isModalOpen} onClose={handleClose}  jsonData={jsonData}/>


        </div>
    );
}
export default NavBar;




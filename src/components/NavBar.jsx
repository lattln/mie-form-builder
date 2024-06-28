import { useState, useContext } from "react";
import "./css/navBar.css";
import { EditorContext } from "./EditorContext";
import PreviewModal from './PreviewModal';

const NavBar = () => {

    const { editorInstanceRef } = useContext(EditorContext);
    const [isModalOpen, setModalOpen] = useState(false);
    const [jsonData, setJsonData] = useState('');


        const exportData = async () => {
            if (editorInstanceRef.current) {
                    const data = await editorInstanceRef.current.save();
                    console.log(data);
                    const jsonData = JSON.stringify(data, null, 2);
                    const blob = new Blob([jsonData], {type: 'application/json'})
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    const fileName = prompt("You're about to download the export file.\n\n" +
                                            "Name of file below:", 'JSONFormData');
                    if (fileName) {
                        link.download = `${fileName}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
                else
                {
                    console.log("Editor instance is not available");
                }
        }

        const handlePreview = async () => {
            if (editorInstanceRef.current) {
                const data = await editorInstanceRef.current.save();
                const jsonData = JSON.stringify(data, null, 2);
                setJsonData(jsonData); // Update the JSON data state

                document.body.classList.add('disable-scroll');
                setModalOpen(true);
                
            }
        }

        const handleClose = () => {
                document.body.classList.remove('disable-scroll');
                setModalOpen(false);
                
            }

        const handleImport = (event) => {
        console.log("File change triggered");
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                try {
                    const data = JSON.parse(content);
                    console.log("File content parsed successfully:", data);
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

            

    return (
        <div className="navBar">
            <div className="navLogo">
                <img src="../MIE192.png" alt="MIE Logo" /> {/* Update the path to your logo */}
            </div>
            <div className="navButtons">
            <input id="fileInput" type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                <label htmlFor="fileInput" className="button">Import</label>
                <button onClick={exportData}>Export</button>
                <button onClick={handlePreview}>Preview</button>
            </div>
            <PreviewModal isOpen={isModalOpen} onClose={handleClose}  jsonRender={jsonData}/>


        </div>
    );
}
export default NavBar;




import { useContext, useState} from "react";
import { EditorContext } from "./EditorContext";

import '../components_css/toggleReadOnly.css';

const ToggleReadOnly = () => {
    const { editorInstanceRef } = useContext(EditorContext);
    const [isReadOnly, setIsReadOnly] = useState(true);



    const handleReadOnly = () => {
        if(!isReadOnly) {
            editorInstanceRef.current.save();
            editorInstanceRef.current.readOnly.toggle();
            setIsReadOnly(false);
        }
        else {
            editorInstanceRef.current.readOnly.toggle();
        }
        
    }

    return (
        <div className="toggleReadOnly-wrapper">
            <div className="toggleReadOnly">
                <label className="switch"> 
                    <input type="checkbox" onClick={handleReadOnly}/>
                    <span className="slider round"></span>
                </label>
                <p className="toggleReadOnly-text"> Toggle ReadOnly </p>
            </div>
        </div>
    );
}

export default ToggleReadOnly;

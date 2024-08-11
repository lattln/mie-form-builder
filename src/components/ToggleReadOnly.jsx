import { useContext, useState} from "react";
import { EditorContext } from "./EditorContext";


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
        <div>
            <label className="switch"> 
                <input type="checkbox" onClick={handleReadOnly}/>
                <span className="slider round"></span>
            </label>
        </div>
    );
}

export default ToggleReadOnly;

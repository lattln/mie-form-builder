
import { useContext, useEffect, useRef } from "react";
import {EditorContext} from "./EditorContext";
import './css/editSpace.css';


const EditSpace = () => {
        const {initEditor} = useContext(EditorContext)
        const editorRef = useRef(null)
        
        useEffect(() => {
        
            if (!editorRef.current) {
                initEditor();
                editorRef.current = true;
                
            }
        }, [initEditor]);

        return (
            <div className="editorbody">
                <div id="editorjs"></div>
            </div>
        );
    }

export default EditSpace;
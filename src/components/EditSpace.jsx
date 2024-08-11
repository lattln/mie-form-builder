
import { useContext, useEffect, useRef } from "react";
import { useDroppable } from '@dnd-kit/core';
import {EditorContext} from "./EditorContext";
import CustomToolBar from "./CustomToolBar";
import '../components_css/editSpace.css';

const EditSpace = () => {
        const { initEditor } = useContext(EditorContext);
        const editorRef = useRef(null)
        const { setNodeRef } = useDroppable({
            id: 'editorjs',
        });

        useEffect(() => {
            if (!editorRef.current) {
                initEditor();
                editorRef.current = true;
            }
        }, [initEditor]);

        

        return (
            <div className = 'editorBody'>
                <CustomToolBar />
                <div className='editorWrapper'>

                    <label className="switch"> 
                        <input type="checkbox"/>
                        <span className="slider round"></span>
                    </label>

                    <div id='editorjs' ref={setNodeRef}>
                    </div>
                </div>
            </div>
        );
    }

export default EditSpace;
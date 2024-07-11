
import { useContext, useEffect, useRef } from "react";
import {EditorContext} from "./EditorContext";
import '../custom-Tools/SVGIcons'
import './css/editSpace.css';
import { clickable_icon, trashCan_Icon} from "../custom-Tools/SVGIcons";
import CustomToolBar from "./CustomToolBar";
import { SvgImg } from "../custom-Tools/utilsFunction";
import { useDroppable } from '@dnd-kit/core';


const EditSpace = () => {
        const { editorInstanceRef, initEditor } = useContext(EditorContext);
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

        const clearPage = () => {
            if(editorInstanceRef.current) {
                editorInstanceRef.current.clear();
            }
        }

        return (
            <div className = 'editorBody'>
                <div className='editorConfigPanel'>
                    <button className ='clearPageBtn customToolBar-button tool inlineSpace' onClick={clearPage}> <SvgImg icon={trashCan_Icon} text={'Clear Page'} /> <SvgImg icon={clickable_icon}/> </button>
                    <CustomToolBar/>
                </div>
                <div className='editorWrapper'>
                    <div id='editorjs' ref={setNodeRef}>
                        
                    </div>
                </div>
                
            </div>
        );
    }

export default EditSpace;
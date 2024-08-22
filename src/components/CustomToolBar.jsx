import { useEffect, useState, useContext } from "react";
import { SvgImg } from '../Utility/utilsFunction';
import { calendar_Icon, fileUpload_icon, input_Icon, likert_icon, selection_Icon, draggable_icon, question_icon } from '../Utility/SVGIcons';
import { trashCan_Icon, x_icon } from "../Utility/SVGIcons";
import { useDraggable } from '@dnd-kit/core';
import { EditorContext } from "./EditorContext";

import '../components_css/customToolBar.css';
import { SvgImg } from '../custom-Tools/utilsFunction';
import { calendar_Icon, fileUpload_icon, Input_Icon, likert_icon, selection_Icon, draggable_icon, question_icon, signature_icon } from '../custom-Tools/SVGIcons';
import { useDraggable } from '@dnd-kit/core';

const DraggableItem = ({id, icon, text}) => {
    const { attributes, listeners, setNodeRef } = useDraggable({id});
    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className='customToolBar-button'>
            <SvgImg icon={icon} text={text}/> <SvgImg icon={draggable_icon}/>
        </div>
    );
};

const CustomToolBar = () => {
    const { editorInstanceRef } = useContext(EditorContext);
    const [isComputer, setIsComputer] = useState(window.innerWidth > 1030);

    useEffect(() => {
        const handleResize = () => {
            setIsComputer(window.innerWidth > 1030);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const clearPage = () => {
        if (editorInstanceRef.current) {
            editorInstanceRef.current.clear();
        }
    }
    if (!isComputer) {
        return null;
    }

    return (
        <div className='customTools editorConfigPanel'>
            <button className ='clearPageBtn customToolBar-button' onClick={clearPage}>
                <SvgImg icon={trashCan_Icon} text={'Clear Page'} /> <SvgImg icon={x_icon}/>
            </button>
            <DraggableItem id='calendarBlock' icon={calendar_Icon} text='Calendar Block' />
            <DraggableItem id='inputBlock' icon={input_Icon} text='Input Block' />
            <DraggableItem id='likertBlock' icon={likert_icon} text='Likert Block' />
            <DraggableItem id='questionBlock' icon={question_icon} text='Question Block' />
            <DraggableItem id='dropdownBlock' icon={selection_Icon} text='Selection Block' />
            <DraggableItem id='fileUploadBlock' icon={fileUpload_icon} text='Upload Block' />

        </div>
    );
}

export default CustomToolBar;

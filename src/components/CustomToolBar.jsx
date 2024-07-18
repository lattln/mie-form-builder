import '../components_css/customToolBar.css';
import { SvgImg } from '../custom-Tools/utilsFunction';
import { calendar_Icon, fileUpload_icon, Input_Icon, likert_icon, selection_Icon, draggable_icon, question_icon } from '../custom-Tools/SVGIcons';
import { useDraggable } from '@dnd-kit/core';

const DraggableItem = ({id, icon, text}) => {
    const {attirbutes, listeners, setNodeRef} = useDraggable ({id});

    return (
        <div ref={setNodeRef} {...listeners} {...attirbutes} className='customToolBar-button tool inlineSpace'>
            <SvgImg icon={icon} text={text}/> <SvgImg icon={draggable_icon}/>
        </div>
    );
};

const CustomToolBar = () => {
    return (
        <div className='customTools'>
            <DraggableItem id='calendarBlock' icon={calendar_Icon} text='Calendar Block' />
            <DraggableItem id='inputBlock' icon={Input_Icon} text='Input Block' />
            <DraggableItem id='likertBlock' icon={likert_icon} text='Likert Block' />
            <DraggableItem id='questionBlock' icon={question_icon} text='Question Block' />
            <DraggableItem id='dropdownBlock' icon={selection_Icon} text='Selection Block' />
            <DraggableItem id='fileUploadBlock' icon={fileUpload_icon} text='Upload Block' />

        </div>
    )
}

export default CustomToolBar;


//            <DraggableItem id='checkBoxBlock' icon={checkBox_icon} text='CheckBox Block' />
//            <DraggableItem id='radioBlock' icon={radio_Icon} text='Radio Block' />
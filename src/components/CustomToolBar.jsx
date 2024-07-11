import './css/customToolBar.css';
import { SvgImg } from '../custom-Tools/utilsFunction';
import { calendar_Icon, checkBox_icon, fileUpload_icon, Input_Icon, likert_icon, radio_Icon, selection_Icon, draggable_icon } from '../custom-Tools/SVGIcons';
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
            <DraggableItem id='radioQuestion' icon={radio_Icon} text='Radio Block' />
            <DraggableItem id='inputQuestion' icon={Input_Icon} text='Input Block' />
            <DraggableItem id='dropdownQuestion' icon={selection_Icon} text='Selection Block' />
            <DraggableItem id='dateQuestion' icon={calendar_Icon} text='Calendar Block' />
            <DraggableItem id='likertQuestion' icon={likert_icon} text='Likert Block' />
            <DraggableItem id='checkBoxQuestion' icon={checkBox_icon} text='CheckBox Block' />
            <DraggableItem id='fileUploadQuestion' icon={fileUpload_icon} text='Upload Block' />
        </div>
    )
}

export default CustomToolBar;
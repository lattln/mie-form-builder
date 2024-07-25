import { useContext, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import EditSpace from './components/EditSpace';
import NavBar from './components/NavBar';
import { EditorContext } from './components/EditorContext';

import { SvgImg } from './custom-Tools/utilsFunction';
import { calendar_Icon, checkBox_icon, draggable_icon, fileUpload_icon, Input_Icon, likert_icon, question_icon, radio_Icon, selection_Icon } from './custom-Tools/SVGIcons';

import './App.css';

function App() {
  const { editorInstanceRef } = useContext(EditorContext);
  const [activeId, setActiveId] = useState(null);
  const [isOverDropZone, setIsOverDropzone] = useState(false);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    console.log('Drag started:', event.active.id);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    if (over && over.id === 'dropzone') {
      setIsOverDropzone(true);
    }
  };

  const handleDragLeave = (event) => {
    const { over } = event;
    if (!over || over.id !== 'dropzone') {
      setIsOverDropzone(false);
    }
  };

  const handleDragEnd = (event) => {
    const { over } = event;
    console.log('Drag ended. Active ID:', event.active.id, 'Over dropzone:', over ? over.id : 'null');
    if (isOverDropZone && over && over.id === 'dropzone') {
      addBlock(event.active.id);
    }
    setActiveId(null);
    setIsOverDropzone(false);

    let divElement = document.getElementById('editorContainer');
    divElement.scrollTop = divElement.scrollHeight;
  };

  const addBlock = (type) => {
    if (editorInstanceRef.current) {
      const blocksCount = editorInstanceRef.current.blocks.getBlocksCount();
      console.log('Inserting block type:', type, 'at index:', blocksCount);
      editorInstanceRef.current.blocks.insert(type, {}, {}, blocksCount, true);
    }
  };

  const renderOverlay = () => {
    if (!activeId) return null;

    const iconMap = {
      calendarBlock: calendar_Icon,
      checkBoxBlock: checkBox_icon,
      inputBlock: Input_Icon,
      likertBlock: likert_icon,
      questionBlock: question_icon,
      radioBlock: radio_Icon,
      dropdownBlock: selection_Icon,
      fileUploadBlock: fileUpload_icon
    };

    const textMap = {
      calendarBlock: 'Calendar Block',
      checkBoxBlock: 'CheckBox Block',
      inputBlock: 'Input Block',
      likertBlock: 'Likert Block',
      questionBlock: 'Question Block',
      radioBlock: 'Radio Block',
      dropdownBlock: 'Selection Block',
      fileUploadBlock: 'Upload Block'
    };

    return (
      <div className="customToolBar-button tool inlineSpace pass">
        <SvgImg icon={iconMap[activeId]} text={textMap[activeId]} />
        <SvgImg icon={draggable_icon} />
      </div>
    );
  };

  return (
    <div className="app">
      <NavBar />
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay className="pass">{renderOverlay()}</DragOverlay>
        <EditSpace isOverDropzone={isOverDropZone} />
      </DndContext>
    </div>
  );
}

export default App;

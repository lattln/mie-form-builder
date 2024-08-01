import { useContext, useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import './App.css';
import EditSpace from './components/EditSpace';
import NavBar from './components/NavBar';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { EditorContext } from './components/EditorContext';
import { SvgImg } from './custom-Tools/utilsFunction';
import {
  calendar_Icon, checkBox_icon, draggable_icon, fileUpload_icon, input_Icon,
  likert_icon, question_icon, radio_Icon, selection_Icon
} from './custom-Tools/SVGIcons';

function App() {
  const { editorInstanceRef } = useContext(EditorContext);
  const [activeId, setActiveId] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [dragStarted, setDragStarted] = useState(false); 

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setDragStarted(true); 
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active } = event;
    console.log('Drag ended. Active ID:', active.id, 'Over index:', overIndex);
    if (overIndex !== null) {
      addBlock(active.id, overIndex);
    }
    setActiveId(null);
    setOverIndex(null);
    setDragStarted(false); 
  };

  const addBlock = (type, index) => {
    if (editorInstanceRef.current) {
      console.log('Inserting block type:', type, 'at index:', index);
      editorInstanceRef.current.blocks.insert(type, {}, {}, index, true);
    }
  };

  const debouncedSetOverIndex = debounce((index) => {
    setOverIndex(index);
    console.log('Debounced set over index:', index);
  }, 100); 

  const debouncedMouseLeave = debounce(() => {
    setOverIndex(null);
    console.log('Mouse left the editor area after delay, setting index to null');
  }, 100);

  const handleMouseOver = useCallback((event) => {
    let blocks = editorInstanceRef.current?.blocks.getBlocksCount() ?? 0;
    if (blocks === 0) {
      debouncedSetOverIndex(0);
      return;
    }
    for (let i = 0; i < blocks; i++) {
      const block = editorInstanceRef.current.blocks.getBlockByIndex(i);
      if (block.holder === event.target || block.holder.contains(event.target)) {
        debouncedSetOverIndex(i);
        break;
      }
    }
  }, [editorInstanceRef, debouncedSetOverIndex]);

  useEffect(() => {
    const editorElement = document.getElementById('editorjs');
    const editorWrapperElement = document.querySelector('.editorWrapper'); // Adjust selector as needed

    if (!editorElement || !dragStarted) return;

    editorElement.addEventListener('mouseover', handleMouseOver);
    editorWrapperElement.addEventListener('mouseleave', debouncedMouseLeave);

    return () => {
      if (dragStarted) {
        editorElement.removeEventListener('mouseover', handleMouseOver);
        editorWrapperElement.removeEventListener('mouseleave', debouncedMouseLeave);
      }
    };
  }, [handleMouseOver, dragStarted, debouncedMouseLeave]);

  const renderOverlay = () => {
    if (!activeId) return null;

    const iconMap = {
      calendarBlock: calendar_Icon,
      checkBoxBlock: checkBox_icon,
      inputBlock: input_Icon,
      likertBlock: likert_icon,
      questionBlock: question_icon,
      radioBlock: radio_Icon,
      selectionBlock: selection_Icon,
      fileUploadBlock: fileUpload_icon
    };

    const textMap = {
      calendarBlock: 'Calendar Block',
      checkBoxBlock: 'CheckBox Block',
      inputBlock: 'Input Block',
      likertBlock: 'Likert Block',
      questionBlock: 'Question Block',
      radioBlock: 'Radio Block',
      selectionBlock: 'Selection Block',
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
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <DragOverlay className="pass">{renderOverlay()}</DragOverlay>
        <EditSpace />
      </DndContext>
    </div>
  );
}

export default App;

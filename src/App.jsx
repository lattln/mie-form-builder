import { useContext, useState, useCallback, useEffect } from 'react';
import './App.css';
import EditSpace from './components/EditSpace';
import NavBar from './components/NavBar';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { EditorContext } from './components/EditorContext';
import { SvgImg } from './custom-Tools/utilsFunction';
import { calendar_Icon, checkBox_icon, draggable_icon, fileUpload_icon, Input_Icon, likert_icon, radio_Icon, selection_Icon } from './custom-Tools/SVGIcons';

function App() {
  const { editorInstanceRef } = useContext(EditorContext);
  const [activeId, setActiveId] = useState(null);
  const [overIndex, setOverIndex] = useState(0);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    console.log('Drag started:', event.active.id);
    addHoverEventListener();
  };

  const handleDragEnd = (event) => {
    const { active } = event;
    console.log('Drag ended. Active ID:', active.id, 'Over index:', overIndex);
    if (overIndex !== null) {
      addBlock(active.id, overIndex);
    }
    setActiveId(null);
    setOverIndex(0);
    removeHoverEventListener();
  };

  const addBlock = (type, index) => {
    if (editorInstanceRef.current) {
      console.log('Inserting block type:', type, 'at index:', index);
      editorInstanceRef.current.blocks.insert(type, {}, {}, index, true);
    }
  };

  const handleMouseOver = useCallback((event) => {
    let blocks = 0;
    try {
      blocks = editorInstanceRef.current.blocks.getBlocksCount();
    }
    catch {
      console.log(`Block not iniated or 0`);
      blocks = 0;
    }
    
    if (blocks === 0) {
      setOverIndex(0);
      return;
    }
    for (let i = 0; i < blocks; i++) {
      const block = editorInstanceRef.current.blocks.getBlockByIndex(i);
      if (block.holder === event.target || block.holder.contains(event.target)) {
        console.log(`hovering over Index ${i}`);
        setOverIndex(i);
        break;
      }
    }
  }, [editorInstanceRef]);

  const addHoverEventListener = () => {
    const editorElement = document.getElementById('editorjs');
    if (editorElement) {
      editorElement.addEventListener('mouseover', handleMouseOver);
    }
  };

  const removeHoverEventListener = () => {
    const editorElement = document.getElementById('editorjs');
    if (editorElement) {
      editorElement.removeEventListener('mouseover', handleMouseOver);
    }
  };

  useEffect(() => {
    const editorElement = document.getElementById('editorjs');
    if (!editorElement) return;

    editorElement.addEventListener('mouseover', handleMouseOver);

    return () => {
      editorElement.removeEventListener('mouseover', handleMouseOver);
    };
  }, [handleMouseOver]);

  const renderOverlay = () => {
    if (!activeId) return null;

    const iconMap = {
      radioQuestion: radio_Icon,
      inputQuestion: Input_Icon,
      dropdownQuestion: selection_Icon,
      dateQuestion: calendar_Icon,
      likertQuestion: likert_icon,
      checkBoxQuestion: checkBox_icon,
      fileUploadQuestion: fileUpload_icon
    };

    const textMap = {
      radioQuestion: 'Radio Block',
      inputQuestion: 'Input Block',
      dropdownQuestion: 'Selection Block',
      dateQuestion: 'Calendar Block',
      likertQuestion: 'Likert Block',
      checkBoxQuestion: 'CheckBox Block',
      fileUploadQuestion: 'Upload Block'
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

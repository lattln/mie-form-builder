import { useCallback, useContext, useRef, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import EditSpace from './components/EditSpace';
import NavBar from './components/NavBar';
import { EditorContext } from './components/EditorContext';
import { SvgImg } from './custom-Tools/utilsFunction';
import { draggable_icon } from './custom-Tools/SVGIcons';
import { iconMap, textMap } from './constants/constants';

import './App.css';

function App() {
  const { editorInstanceRef } = useContext(EditorContext);
  const [activeId, setActiveId] = useState(null);
  const [isOverDropZone, setIsOverDropzone] = useState(false);
  const [overIndex, setOverIndex] = useState(0);
  const [activeDropzoneId, setActiveDropzoneId] = useState(null);

  const dropzoneRegex = /^dropzone(?:-\d+)?$/;

  const dropzoneRefs = useRef([]);

  const updateDropzones = useCallback(() => {
    const editorBlocks = document.querySelectorAll('.ce-block');

    dropzoneRefs.current = Array.from(editorBlocks).map((block, index) => {
      let dropzoneId = `dropzone-${index}`;
      let dropzone = block.querySelector(`#${dropzoneId}`);
      let existingDropzone = block.querySelector('.existing-dropzone');
      let existingDropzoneId = existingDropzone ? existingDropzone.id : null;

      if (!dropzone) {
        if (existingDropzone && existingDropzoneId !== dropzoneId) {
          block.removeChild(existingDropzone);
        }
        dropzone = document.createElement('div');
        dropzone.className = 'existing-dropzone';
        dropzone.id = dropzoneId;
        block.appendChild(dropzone);
      }

      return dropzone;
    });
  }, []);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    if (over && dropzoneRegex.test(over.id)) {
      setIsOverDropzone(true);
      setActiveDropzoneId(over.id);
      let indexToBeDropped;
      if (over.id === 'dropzone') {
        indexToBeDropped = editorInstanceRef.current.blocks.getBlocksCount();
      } else {
        const parts = over.id.split("-");
        indexToBeDropped = Number(parts[1]) + 1;
      }

      setOverIndex(indexToBeDropped)
    }
  };

  const handleDragLeave = (event) => {
    const { over } = event;
    if (!over || !dropzoneRegex.test(over.id)) {
      setIsOverDropzone(false);
      setActiveDropzoneId(null);
    }
  };

  const handleDragEnd = (event) => {
    const { over } = event;
    if (over && dropzoneRegex.test(over.id)) {
      addBlock(event.active.id);
    }
    setActiveId(null);
    setIsOverDropzone(false);
    setActiveDropzoneId(null);

    let divElement = document.getElementById('editorContainer');
    if (divElement) {
      divElement.scrollTop = divElement.scrollHeight;
    }
  };

  const addBlock = useCallback((type) => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.blocks.insert(type, {}, {}, overIndex, true);
    }
  }, [editorInstanceRef, overIndex]);

  const renderOverlay = () => {
    if (!activeId) return null;

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
        <EditSpace isOverDropzone={isOverDropZone} updateDropzones={updateDropzones} dropzoneRefs={dropzoneRefs} activeDropzoneId={activeDropzoneId} />
      </DndContext>
    </div>
  );
}

export default App;

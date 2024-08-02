import { useContext, useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";

import '../components_css/editSpace.css';
import { trashCan_Icon, x_icon } from "../custom-Tools/SVGIcons";
import { SvgImg } from "../custom-Tools/utilsFunction";

import { EditorContext } from "./EditorContext";
import CustomToolBar from "./CustomToolBar";

const EditSpace = ({ isOverDropzone, dropzoneRefs, updateDropzones, activeDropzoneId }) => {
  const { editorInstanceRef, initEditor, totalBlocks, blockEvent } = useContext(EditorContext);
  const [dropzoneClass, setDropzoneClass] = useState("dropzone");
  const editorRef = useRef(null);
  const { setNodeRef } = useDroppable({ id: "dropzone" });

  useEffect(() => {
    if (!editorRef.current) {
      initEditor();
      editorRef.current = true;
    }
  }, [initEditor]);

  useEffect(() => {
    setDropzoneClass(isOverDropzone ? "dropzone existing-dropzone active" : "dropzone existing-dropzone");
  }, [isOverDropzone]);

  useEffect(() => {
    const observer = new MutationObserver(updateDropzones);
    const editorElement = document.getElementById('editorjs');
    
    if (editorElement) {
      observer.observe(editorElement, { childList: true, subtree: true });
      updateDropzones();
    }

    return () => observer.disconnect();
  }, [updateDropzones]);

  useEffect(() => {
    dropzoneRefs.current.forEach((dropzone) => {
      dropzone.className = dropzone.id === activeDropzoneId
        ? "dropzone existing-dropzone active"
        : "dropzone existing-dropzone";
    });
  }, [dropzoneClass, totalBlocks, activeDropzoneId, dropzoneRefs, blockEvent]);

  const clearPage = () => {
    editorInstanceRef.current?.clear();
  };

  return (
    <div className='editorBody'>
      <div className='editorConfigPanel'>
        <button className='clearPageBtn customToolBar-button inlineSpace' onClick={clearPage}>
          <SvgImg icon={trashCan_Icon} text={'Clear Page'} />
          <SvgImg icon={x_icon} />
        </button>
        <div className="padding"></div>
        <CustomToolBar />
      </div>
      <div className='editorWrapper'>
        <div id='editorContainer'>
          <div id="editorjs"></div>
          {dropzoneRefs.current.map((dropzone, index) => (
            <DropzoneComponent key={index} dropzone={dropzone} />
          ))}
          <div ref={setNodeRef} className={`dropzone visible ${isOverDropzone ? "active" : ""}`}>
            Drop and drop here to add a new element
          </div>
        </div>
      </div>
    </div>
  );
};

const DropzoneComponent = ({ dropzone }) => {
  const { setNodeRef } = useDroppable({ id: dropzone.id });

  useEffect(() => {
    setNodeRef(dropzone);
    return () => setNodeRef(null);
  }, [dropzone, setNodeRef]);

  return null;
};

export default EditSpace;

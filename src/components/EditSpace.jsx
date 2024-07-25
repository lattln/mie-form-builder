import { useContext, useEffect, useRef, useState } from "react";
import { EditorContext } from "./EditorContext";
import '../custom-Tools/SVGIcons';
import '../components_css/editSpace.css';
import { trashCan_Icon, x_icon } from "../custom-Tools/SVGIcons";
import CustomToolBar from "./CustomToolBar";
import { SvgImg } from "../custom-Tools/utilsFunction";

const EditSpace = ({ setDropzoneRef, isOverDropzone }) => {
  const { editorInstanceRef, initEditor } = useContext(EditorContext);
  const [dropzoneClass, setDropzoneClass] = useState("dropzone")
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      initEditor();
      editorRef.current = true;
    }
  }, [initEditor]);

  const clearPage = () => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.clear();
    }
  };

  useEffect(()=>{ 
    if(isOverDropzone){
        setDropzoneClass("dropzone active")
    } else {
        setDropzoneClass("dropzone")
    }

  }, [isOverDropzone])

  return (
    <div className='editorBody'>
      <div className='editorConfigPanel'>
        <button className='clearPageBtn customToolBar-button inlineSpace' onClick={clearPage}>
          <SvgImg icon={trashCan_Icon} text={'Clear Page'} /> <SvgImg icon={x_icon} />
        </button>
        <div className="padding"></div>
        <CustomToolBar />
      </div>
      <div className='editorWrapper'>
        <div id='editorContainer'>
            <div id="editorjs"></div>
          <div id='dropzone' ref={setDropzoneRef} className={dropzoneClass}>
            Drop and drop here to add a new element
          </div>   
        </div>
      </div>
    </div>
  );
};

export default EditSpace;

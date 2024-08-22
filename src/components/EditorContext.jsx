import {createContext, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import DragDrop from 'editorjs-drag-drop';

//import Header from '@editorjs/header';
//import Paragraph from '@editorjs/paragraph';

//Custom Block tools
import CalendarBlock from "../blockTools/CalendarBlock.js";
import InputBlock from "../blockTools/InputBlock.js";
import LikertBlock from "../blockTools/LikertBlock.js";
import QuestionBlock from "../blockTools/QuestionBlock.js";
import SelectionBlock from "../blockTools/SelectionBlock.js";
import UploadBlock from "../blockTools/UploadBlock.js";
import signatureBlock from "../custom-Tools/custom-block-tools/signatureBlock.js";

const AlignmentTuneTool = require('editorjs-text-alignment-blocktune');


export const EditorContext = createContext();

function EditorContextProvider(props) {
    const editorInstanceRef = useRef(null);

    const initEditor = () => {
        const editor = new EditorJS({

            onReady: () => {
                setTimeout(() => {
                    try {
                        new DragDrop(editor);
                    } 
                    catch(error) {
                        console.error("Fail to int dragdrop", error);
                    }
                }, 1000);
            },

            holder: 'editorjs',
            placeholder: 'add to form here.',
            autofocus: false,
            readOnly: false,
            tools: {

                textAlignmentTune: {
                    class: AlignmentTuneTool,
                    config: {
                        default: "left",
                    }
                },
                questionBlock: {
                    class: QuestionBlock
                },
                inputBlock: {
                    class: InputBlock,
                },
                selectionBlock: {
                    class: SelectionBlock,
                },
                calendarBlock: {
                    class: CalendarBlock,
                },
                likertBlock: {
                    class: LikertBlock,
                },
                UploadBlock: {
                    class: UploadBlock,
                },
            }
        });
        editorInstanceRef.current = editor
    };
    return (
        <EditorContext.Provider value={{initEditor, editorInstanceRef}}>
            {props.children}
        </EditorContext.Provider>
    );
}

export default EditorContextProvider;
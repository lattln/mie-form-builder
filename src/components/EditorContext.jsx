import {createContext, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header';
import DragDrop from 'editorjs-drag-drop';
import Paragraph from '@editorjs/paragraph';
import MarkerTool from '../custom-Tools/custom-inline-tools/markerTool/markerTool.js';
import InputQuestion from "../custom-Tools/custom-block-tools/inputQuestion/inputQuestion.js";
import RadioQuestion from "../custom-Tools/custom-block-tools/radioQuestion/radioQuestion.js";
import DropDownQuestion from "../custom-Tools/custom-block-tools/dropdownQuestion/ddQuestion.js"
import DateQuestion from "../custom-Tools/custom-block-tools/dateQuestion/dateQuestion.js";
import LikertQuestion from "../custom-Tools/custom-block-tools/likertQuestion/likertQuestion.js";
import CheckBoxQuestion from "../custom-Tools/custom-block-tools/checkBoxQuestion/checkBoxQuestion.js";


const AlignmentTuneTool = require('editorjs-text-alignment-blocktune');

export const EditorContext = createContext();

function EditorContextProvider(props) {
    const editorInstanceRef = useRef(null)
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
            placeholder: 'MIE form creator',
            autofocus: true,

            //ALL TOOLS \/\/\/\/\/\/\/
            //FOR EASE OF TRACKING --> ORDER BELOW
            // TUNE
            // INLINE TOOL
            // CUSTOM BLOCK
            // BUILTIN BLOCK TOOL
            tools: {

                //Tune
                textAlignmentTune: {
                    class: AlignmentTuneTool,
                    config: {
                        default: "left",
                    }
                },

                //InlineTool
                marker: MarkerTool,


                //Custom Block Tools ----------
                radioQuestion: RadioQuestion,
                inputQuestion:  InputQuestion,
                dropdownQuestion: DropDownQuestion,
                dateQuestion: DateQuestion,
                likertQuestion: LikertQuestion,
                checkBoxQuestion: CheckBoxQuestion,
                //--------------------------

                
                //Block Tool
                header: {
                    class: Header,
                    inlineToolbar: ['bold', 'italic', 'link', 'marker'],
                    tunes: ['textAlignmentTune'],
                    config: {
                        placeholder: "Enter a header",
                    }
                },

                //Block Tool
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: ['bold', 'italic', 'link', 'marker'],
                    tunes: ['textAlignmentTune']
                }

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
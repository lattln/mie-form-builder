import { createContext, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header';
import DragDrop from 'editorjs-drag-drop';
import Paragraph from '@editorjs/paragraph';
import MarkerTool from '../custom-Tools/custom-inline-tools/markerTool/markerTool.js';
import InputBlock from "../custom-Tools/custom-block-tools/inputBlock.js";
import SelectionBlock from "../custom-Tools/custom-block-tools/selectionBlock.js"
import CalendarBlock from "../custom-Tools/custom-block-tools/calenderBlock.js";
import LikertBlock from "../custom-Tools/custom-block-tools/likertBlock.js";
import FileUploadBlock from "../custom-Tools/custom-block-tools/uploadBlock.js";
import questionBlock from "../custom-Tools/custom-block-tools/questionBlock.js";
const AlignmentTuneTool = require('editorjs-text-alignment-blocktune');

export const EditorContext = createContext();

function EditorContextProvider(props) {
    const editorInstanceRef = useRef(null);
    const [totalBlocks, setTotalBlocks] = useState(null)

    const onBlocksChanged = (blocks) => {
        setTotalBlocks(blocks)
    }

    const initEditor = () => {
        const editor = new EditorJS({
            onChange: (api) => {
                const totalBlocks = api.blocks.getBlocksCount()
                onBlocksChanged(totalBlocks)
            },

            onReady: () => {
                setTimeout(() => {
                    try {
                        new DragDrop(editor);
                    }
                    catch (error) {
                        console.error("Fail to int dragdrop", error);
                    }
                }, 1000);
            },

            holder: 'editorjs',
            // placeholder: 'MIE form creator',
            // autofocus: true,

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
                questionBlock: {
                    class: questionBlock
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
                fileUploadBlock: {
                    class: FileUploadBlock,
                },


                //Block Tool
                header: {
                    class: Header,
                    inlineToolbar: ['bold', 'italic', 'link', 'marker'],
                    tunes: ['textAlignmentTune'],
                    config: {
                        placeholder: "Enter a header",
                    }
                },

                paragraph: {
                    class: Paragraph,
                    inlineToolbar: ['bold', 'italic', 'link', 'marker'],
                    tunes: ['textAlignmentTune']
                },

            }
        });
        editorInstanceRef.current = editor
    };
    return (
        <EditorContext.Provider value={{ initEditor, editorInstanceRef, totalBlocks }}>
            {props.children}
        </EditorContext.Provider>
    );
}

export default EditorContextProvider;
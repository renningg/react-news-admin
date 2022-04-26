import React, { useState,useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from 'draft-js';
import { EditorState, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
export default function NewsEditor(props) {
  
  // 
  useEffect(() => {
    const html = props.newsContent;
    if(html===undefined) return 
    const contentBlock = htmlToDraft(html);

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState)
    }
  }, [props.newsContent])
  const [editorState, setEditorState] = useState()

  return (
    <Editor
      editorState={editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={editorState => setEditorState(editorState)}
      onBlur={() => { props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent()))) }}
    />
  )
}

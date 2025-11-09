// react
import { useEditor, EditorContent } from '@tiptap/react'
import "./Editor.css"

// tiptap extensions
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { TableKit } from '@tiptap/extension-table'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CustomTableCell from '../../../tiptap/CustomTableCell';

// lowlight v3
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import python from 'highlight.js/lib/languages/python'
import Toolbar from './Toolbar'

const lowlight = createLowlight()
lowlight.register({ javascript, python })

const Editor = ({ name = 'goods_desc', content = '', onChange }) => {
  const editor = useEditor({
    content,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: '상품 설명을 작성해 주세요. (이미지, 표, 링크 모두 가능)',
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Typography,
      CharacterCount,
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
      Image.configure({ allowBase64: false }),
      TableKit.configure({ resizable: true }),
      CustomTableCell,
    ],
    onUpdate: ({editor}) => {
      const html = editor.getHTML()

      onChange?.({
        target: {
          name,
          value: html
        }
      })
    },
  })

  return (
    <div className="editor-wrap">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="editor" />
      <div className="editor-foot">
        {editor?.storage.characterCount.characters()} chars
      </div>
    </div>
  )
}

export default Editor
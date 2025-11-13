// react
import { useEditor, EditorContent } from '@tiptap/react'
import "./Editor.css"

// tiptap extensions
import StarterKit from '@tiptap/starter-kit'
import TipTapImage from '@tiptap/extension-image'
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
import { useEffect, useRef } from 'react'
import requestHandler from '../../../utils/requestHandler'

const lowlight = createLowlight()
lowlight.register({ javascript, python })

const toAbs = (u) => (u.startsWith('http') ? u : `http://localhost:5000${u.startsWith('/') ? u : `/${u}`}`);

const normalizeHtml = (html = '') =>
  html.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi, (m, a, src, b) => {
    const abs = encodeURI(toAbs(src));
    return `<img${a}src="${abs}"${b}>`;
  });

const Editor = ({ name = 'goods_desc', content = '', onChange }) => {
  const fileRef = useRef(null)

  const editor = useEditor({
    content: normalizeHtml(content),
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
      TipTapImage.configure({ allowBase64: false, inline:false }),
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

  const handlePickImage = async (file) => {
    if (!file || !editor) return;

    const fd = new FormData();
    fd.append("file", file);

    // requestHandler 반환 형태가 다를 수 있어 방어적으로 받기
    const resp = await requestHandler({
      method: "post",
      url: "/admin/upload",
      payload: fd,
      userImage: true,
      onError: (msg) => alert(msg || "이미지 업로드 실패"),
    }) || {};

    const ok = resp.ok ?? false;
    const data = resp.data ?? resp;  // ✅ onSuccess 스타일/리턴 스타일 모두 대응
    if (!ok && !data) return;

    // 서버 응답에서 url/path/image_path 모두 고려
    let raw = data?.url || data?.path || data?.image_path || data?.data?.url || "";
    if (!raw) return alert("업로드 응답에 이미지 경로가 없습니다.");

    const toAbs = (u) => (u.startsWith("http") ? u : `http://localhost:5000${u.startsWith("/") ? u : `/${u}`}`);
    const src = encodeURI(toAbs(raw));

    const probe = typeof window !== 'undefined' ? new window.Image() : document.createElement('img');
    probe.onload = () => {
      const chain = editor.chain().focus();
      if (editor.isActive('image')) {
        // ✅ 선택된 이미지가 있으면 src 교체
        chain.updateAttributes('image', { src, alt: file.name }).run();
      } else {
        // 선택된 이미지가 없으면 새로 삽입
        chain.setImage({ src, alt: file.name }).run();
      }
    };
    probe.onerror = () => alert(`이미지 로드 실패: ${src}`);
    probe.src = src;
  };

  useEffect(() => {
    if (!editor) return
    const incoming = normalizeHtml(content || '')
    const current = editor.getHTML()
    if (incoming && incoming !== current) {
      editor.commands.setContent(incoming, false) // emitUpdate=false
    }
  }, [content, editor])


  return (
    <div className="editor-wrap">
      <Toolbar editor={editor} onPickImage={handlePickImage} fileRef={fileRef} />
      <EditorContent editor={editor} className="editor" />
      <div className="editor-foot">
        {editor?.storage.characterCount.characters()} chars
      </div>
    </div>
  )
}

export default Editor
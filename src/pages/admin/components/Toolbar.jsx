import { useRef } from "react"
import {
  MdImage, MdLink, MdLinkOff, MdFormatBold, MdFormatItalic, MdFormatUnderlined,
  MdStrikethroughS, MdCode, MdFormatQuote, MdFormatListBulleted, MdFormatListNumbered,
  MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify,
  MdUndo, MdRedo, MdTableChart, MdAddCircleOutline, MdDelete, MdTableRows,
  MdMergeType, MdCallSplit, MdAdd, MdFormatColorText, MdFormatColorFill, MdBorderColor
} from "react-icons/md"

const Toolbar = ({ editor, onPickImage }) => {
  const fileRef = useRef(null)
  if (!editor) return null

  const isActive = (name, attrs) => editor.isActive(name, attrs) ? "is-active" : ""

  // 표 안에 커서가 있을 때만 true
  const inTable =
    editor?.isActive('table') ||
    editor?.isActive('tableCell') ||
    editor?.isActive('tableRow') ||
    editor?.isActive('tableHeader')

  return (
    <div className="tiptap-toolbar">
      {/* --- 삽입 --- */}
      <button type="button" title="사진" onClick={() => fileRef.current?.click()}>
        <MdImage />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onPickImage?.(e.target.files?.[0])}
      />

      <button
        type="button"
        title="링크"
        onClick={() => {
          const prev = editor.getAttributes("link").href || ""
          const url = window.prompt("링크 주소를 입력하세요", prev)
          if (url === null) return
          if (url === "") editor.chain().focus().unsetLink().run()
          else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
        }}
      >
        <MdLink />
      </button>
      <button type="button" title="링크 해제" onClick={() => editor.chain().focus().unsetLink().run()}>
        <MdLinkOff />
      </button>

      <span className="divider" />

      {/* --- 서식 --- */}
      <button className={isActive("bold")} title="굵게" onClick={() => editor.chain().focus().toggleBold().run()}>
        <MdFormatBold />
      </button>
      <button className={isActive("italic")} title="기울임" onClick={() => editor.chain().focus().toggleItalic().run()}>
        <MdFormatItalic />
      </button>
      <button className={isActive("underline")} title="밑줄" onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <MdFormatUnderlined />
      </button>
      <button className={isActive("strike")} title="취소선" onClick={() => editor.chain().focus().toggleStrike().run()}>
        <MdStrikethroughS />
      </button>
      <button className={isActive("code")} title="인라인 코드" onClick={() => editor.chain().focus().toggleCode().run()}>
        <MdCode />
      </button>
      <button className={isActive("blockquote")} title="인용구" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <MdFormatQuote />
      </button>

      <span className="divider" />

      {/* --- 정렬 --- */}
      <button className={isActive({ textAlign: "left" })} title="왼쪽 정렬" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <MdFormatAlignLeft />
      </button>
      <button className={isActive({ textAlign: "center" })} title="가운데 정렬" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <MdFormatAlignCenter />
      </button>
      <button className={isActive({ textAlign: "right" })} title="오른쪽 정렬" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <MdFormatAlignRight />
      </button>
      <button className={isActive({ textAlign: "justify" })} title="양쪽 정렬" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
        <MdFormatAlignJustify />
      </button>

      <span className="divider" />

      {/* --- 제목/리스트 --- */}
      <select
        title="제목"
        value={
          editor.isActive("heading", { level: 1 }) ? "h1" :
          editor.isActive("heading", { level: 2 }) ? "h2" :
          editor.isActive("heading", { level: 3 }) ? "h3" : "p"
        }
        onChange={(e) => {
          const v = e.target.value
          editor.chain().focus().setParagraph().run()
          if (v !== "p") {
            const level = Number(v.replace("h", ""))
            editor.chain().focus().toggleHeading({ level }).run()
          }
        }}
      >
        <option value="p">본문</option>
        <option value="h1">제목1</option>
        <option value="h2">제목2</option>
        <option value="h3">제목3</option>
      </select>

      <button className={isActive("bulletList")} title="글머리 기호" onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <MdFormatListBulleted />
      </button>
      <button className={isActive("orderedList")} title="번호 목록" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <MdFormatListNumbered />
      </button>

      <span className="divider" />

      {/* --- 색상 (글자/배경) --- */}
      <div className="color-tools">
        <label title="글자 색상" className="color-input">
          <MdFormatColorText />
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            value={editor.getAttributes('textStyle')?.color || '#000000'}
          />
        </label>
        <button type="button" title="글자 색상 초기화" onClick={() => editor.chain().focus().unsetColor().run()}>
          초기화
        </button>

        <label title="글자 배경색(하이라이트)" className="color-input">
          <MdFormatColorFill />
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
            value={editor.getAttributes('highlight')?.color || '#ffff00'}
          />
        </label>
        <button type="button" title="하이라이트 제거" onClick={() => editor.chain().focus().unsetHighlight().run()}>
          제거
        </button>
      </div>

      <span className="divider" />

      {/* --- 표(삽입/간단 제어: 항상 표시) --- */}
      <button title="표 삽입 (3x3)" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        <MdTableChart />
      </button>
      <button title="현재 셀 아래 행 추가" onClick={() => editor.chain().focus().addRowAfter().run()}>
        <MdAddCircleOutline />
      </button>
      <button title="표 삭제" onClick={() => editor.chain().focus().deleteTable().run()}>
        <MdDelete />
      </button>

      <span className="spacer" />

      {/* 실행취소/다시실행 */}
      <button title="실행 취소" onClick={() => editor.chain().focus().undo().run()}>
        <MdUndo />
      </button>
      <button title="다시 실행" onClick={() => editor.chain().focus().redo().run()}>
        <MdRedo />
      </button>

      {/* --- 표 편집: 표 안에서만 --- */}
      {inTable && (
        <>
          <span className="divider" />
          <div className="table-controls">
            <label title="셀 배경색" className="color-input">
              <MdBorderColor />
              <input
                type="color"
                onChange={(e) =>
                  editor.chain().focus().setCellAttribute('backgroundColor', e.target.value).run()
                }
              />
            </label>
            <button title="셀 배경 초기화"
              onClick={() => editor.chain().focus().setCellAttribute('backgroundColor', null).run()}>
              배경 초기화
            </button>

            <button title="왼쪽에 열 추가" onClick={() => editor.chain().focus().addColumnBefore().run()}>
              <MdAdd /> 열(왼쪽)
            </button>
            <button title="오른쪽에 열 추가" onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <MdAdd /> 열(오른쪽)
            </button>
            <button title="열 삭제" onClick={() => editor.chain().focus().deleteColumn().run()}>
              <MdDelete /> 열
            </button>

            <button title="위쪽에 행 추가" onClick={() => editor.chain().focus().addRowBefore().run()}>
              <MdAdd /> 행(위쪽)
            </button>
            <button title="아래쪽에 행 추가" onClick={() => editor.chain().focus().addRowAfter().run()}>
              <MdAdd /> 행(아래쪽)
            </button>
            <button title="행 삭제" onClick={() => editor.chain().focus().deleteRow().run()}>
              <MdDelete /> 행
            </button>

            <button title="셀 병합" onClick={() => editor.chain().focus().mergeCells().run()}>
              <MdMergeType /> 병합
            </button>
            <button title="셀 분할" onClick={() => editor.chain().focus().splitCell().run()}>
              <MdCallSplit /> 분할
            </button>

            <button title="헤더 전환" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
              <MdTableRows /> 헤더행
            </button>
            <button title="표 삭제" onClick={() => editor.chain().focus().deleteTable().run()}>
              <MdDelete /> 표
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Toolbar


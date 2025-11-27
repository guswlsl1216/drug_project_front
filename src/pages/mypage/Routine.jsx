import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list"
import "../../styles/Routine.css";
import { getRoutine, performRoutine } from "../../static/Routine"
import { useEffect, useRef, useState } from "react";
import useLoginRedirect from '../../utils/useLoginRedirect';
import UseNavi from "../../utils/UseNavi";

const Routine = () => {
  const [events, setEvents] = useState([])
  const [logs, setLogs] = useState([])
  const [counts, setCounts] = useState([])

  const calendarRef = useRef(null); // list
  const calRef = useRef(null); // calendar

  const { requireLogin }= useLoginRedirect();
  const {goTo} = UseNavi()

  const routine_load = async () => {
    const routine_data = await getRoutine()

    if (routine_data.ok) {
      const filterd = routine_data.routine.map((data) => ({ 'id': data.id, 'eattime': data.eattime, 'title': data.drugName, 'start': data.start_date, 'end': data.end_date + 'T23:59:00' }))
      setEvents(filterd)
      //{id: 1, eattime : [true, true, true], title: "오메가", start: "2025-10-31", end: '2025-10-31'}
      setLogs(routine_data.log)
      // 체크박스 default값 설정용 {routine.id:[ {date:년월일, performed_times:[bool,bool,bool]} ]}잇음  
      // routine.id를 키값으로 하는 딕셔너리{routine.id:[]} 안에 date:string 와 performed_times:list를 가진 딕셔너리를 요소로 하는 리스트[{}]를 가짐
      setCounts(routine_data.counts)
    }
  }

  useEffect(() => {
    requireLogin(()=>{
      routine_load()
    }, true, goTo('/routine'))
    //페이지 로드 되면 루틴리스트와 그에 해당하는 로그들을 쫙불러옴
  }, [])

  //요청전송
  const checkBoxChanged = async (eventId, date) => {
    await performRoutine(eventId, date, logs[eventId][date])
    routine_load()
  }

  //체크박스 생성 + 이벤트처리하여 반환
  const makeBox = (eventId, eattime, date, index, isChecked = false) => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = isChecked

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const now = `${y}-${m}-${d}`;
    if (date != now || eattime[index] == false) {
      checkbox.disabled = true
    }

    checkbox.addEventListener('change', (e) => {
      e.stopPropagation()
      const currentLogs = { ...logs }
      if (!currentLogs[eventId]) {
        currentLogs[eventId] = {}
      }
      if (!currentLogs[eventId][date]) {
        currentLogs[eventId][date] = [false, false, false]
      }
      currentLogs[eventId][date][index] = e.target.checked
      setLogs(currentLogs)
      checkBoxChanged(eventId, date)
    })
    return checkbox
  }

  //캘린더(daygrid) 클릭시 날짜정보 받음
  const handleDateClick = (info) => {
    goToDate(info.dateStr)
  };

  //레퍼런스로 지정한 캘린더를 지정한 날짜로 이동시킴
  const goToDate = (dateStr) => {
    const calendarApi = calendarRef.current.getApi();
    const calApi = calRef.current.getApi();

    calendarApi.gotoDate(dateStr);
    calApi.gotoDate(dateStr);
  };

  return (
    <div className="routine-page">
      <h2 className="routine-title">규칙적으로 약을 복용하세요</h2>
      <div className="routine-info">
        <p>※ 하루의 모든 루틴을 완료하면 <b>10포인트</b>를 드립니다! (매일 0시 지급)</p>
        <p>※ 당일에만 체크할 수 있습니다.</p>
      </div>

      <div className="routine-main-wrapper">
        <div className="routine-calendar-section">
          <FullCalendar
            ref={calRef}
            plugins={[dayGridPlugin, interactionPlugin]} // 플러그인 설정
            editable={true} // 이벤트의 드래그 앤 드롭, 리사이징, 이동을 허용합니다.
            droppable={true} // 캘린더에 요소를 드롭하여 이벤트를 생성할 수 있도록 허용합니다.
            selectable={true} // 사용자가 일정 범위를 선택하여 이벤트를 추가할 수 있도록 허용합니다.
            selectMirror={true} // 이벤트를 추가할 때 선택한 영역을 표시합니다.
            nowIndicator={true} // 현재 시간을 표시하는 인디케이터를 활성화합니다.
            eventBackgroundColor="#ff0000" // 이벤트의 배경색을 설정합니다.
            eventBorderColor="#0000ff" // 이벤트의 테두리 색을 설정합니다.
            allDay={true} // 이벤트가 하루 종일인지 여부를 지정합니다.
            timeZone="GMT" // 캘린더의 시간대를 GMT로 설정합니다.
            headerToolbar={{
              left: "prev", center: "title", right: "next",
            }}
            dateClick={handleDateClick} //날짜클릭시 이벤트
            dayCellClassNames={(arg) => {
              const classes = [];

              const date = arg.date;
              const y = date.getFullYear();
              const m = String(date.getMonth() + 1).padStart(2, '0');
              const d = String(date.getDate()).padStart(2, '0');
              const now = `${y}-${m}-${d}`;
              let classname = 'common'
              let outofrange = true
              //캘린더의 날짜가 오늘을 넘어갔는가?
              if (date > Date.now()) {
                return classname
              }
              //루틴이 존재하는 기간인가?
              //이거근데 map왜돌렸지 << 하루에 event가 여러개있으니까 하나도 없으면 return
              events.map((data) => {
                if (new Date(now) >= new Date(data['start']) && new Date(now) <= new Date(data['end'])) {
                  outofrange = false
                }
                else if (outofrange != false) {
                  outofrange = true
                }
              })
              if (outofrange) {
                return classname
              }
              for (const [k, v] of Object.entries(counts)) {
                classes.push(v[now])
              }
              if (classes.includes('warning')) {
                classname = 'warning'
              } else if (classes.filter(el => el === 'danger').length + classes.filter(el => el === undefined).length == classes.length) {
                classname = 'danger'
              } else if (classes.filter(el => el === 'good').length == classes.length - events.filter(el => new Date(el['start']) > new Date(now) || new Date(el['end']) < new Date(now)).length) {
                classname = 'good'
              } else {
                classname = 'warning'
              }
              return classname

            }}
          />
        </div>
        <div className="routine-list-section">
          <FullCalendar
            ref={calendarRef}
            plugins={[listPlugin]}
            initialView="listDay"
            height="auto"  // 컨텐츠 크기에 맞춤
            headerToolbar={{ left: "today", center: "title", right: "" }}
            customButtons={{
              today: {
                text: "today",
                click: function () {
                  goToDate(Date.now())
                }
              }
            }}
            timeZone="local"
            editable={true} // 이벤트의 드래그 앤 드롭, 리사이징, 이동을 허용합니다.
            droppable={true} // 캘린더에 요소를 드롭하여 이벤트를 생성할 수 있도록 허용합니다.
            selectable={true} // 사용자가 일정 범위를 선택하여 이벤트를 추가할 수 있도록 허용합니다.
            selectMirror={true} // 이벤트를 추가할 때 선택한 영역을 표시합니다.
            nowIndicator={true} // 현재 시간을 표시하는 인디케이터를 활성화합니다.
            eventBackgroundColor="#ff0000" // 이벤트의 배경색을 설정합니다.
            eventBorderColor="#0000ff" // 이벤트의 테두리 색을 설정합니다.
            allDay={false}
            nextDayThreshold="00:00"
            displayEventTime={false}
            events={events}
            eventDidMount={(info) => {
              const element = info.el.querySelector('.fc-list-event-title')
              const y = info.view.currentStart.getFullYear()
              const m = String(info.view.currentStart.getMonth() + 1).padStart(2, '0')
              const d = String(info.view.currentStart.getDate()).padStart(2, '0')
              const now = `${y}-${m}-${d}`
              //체크박스 파트
              //루틴 삭제, 추가 후 캘린더 작업
              const checkboxContainer = document.createElement('div')
              checkboxContainer.className = 'list-checkbox'
              const times = ['아침', '점심', '저녁']
              times.forEach((time, index) => {
                const label = document.createElement('label')
                const checkbox = makeBox(
                  info.event.id, //이벤트id
                  info.event._def.extendedProps.eattime, // 먹는시간
                  now, //현재시각 (string)
                  index, //아침 [0] 점심 [1] 저녁[2] times의 forEach문에서 가져왔다
                  logs[info.event.id]?.[now]?.[index] || false //ischecked(체크박스 체크여부) 해당하는 log가 없으면 false반환
                )
                label.appendChild(checkbox)
                label.appendChild(document.createTextNode(` ${time}`))
                checkboxContainer.appendChild(label)
              })
              element.appendChild(checkboxContainer)

            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Routine;

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list"
import "../../styles/Routine.css";
import getRoutine from "../../static/Routine"
import { useEffect, useState } from "react";

const Routine = () => {
  const [events, setEvents] = useState([])
  const [logs, setLogs] = useState([])

  useEffect(() => {

    const rt = async () => {
      const routine_data = await getRoutine()
      console.log(routine_data.routine)
      console.log(routine_data.log)

      if (routine_data.ok) {
        const filterd = routine_data.routine.map((data) => ({ 'id': data.id, 'title': data.drugName, 'start': data.start_date, 'end': data.end_date }))
        setEvents(filterd)
        //{id: 1, title: "오메가", start: "2025-10-31", end: '2025-10-31'}
        setLogs(routine_data.log)
        // 체크박스 default값 설정용 {routine.id:[ {date:년월일, performed_times:[bool,bool,bool]} ]}잇음  
        // routine.id를 키값으로 하는 딕셔너리{routine.id:[]} 안에 date:string 와 performed_times:list를 가진 딕셔너리를 요소로 하는 리스트[{}]를 가짐                                    
      }
    }
    rt()
  }, [])

  const checkBoxChanged = async (eventId, date, performed_times) => {
    // 해당 로그 딕셔너리 접근후 performed_times 수정
    //  log[log.id][date]:performed_times
    // /routine/performed/eventId로 요청
    console.log(eventId, date, performed_times)
  }
  const checkboxes = document.querySelectorAll('.list-checkbox input')
  console.log(checkboxes)
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      e.stopPropagation()

      const eventId = checkbox.dataset.eventId
      const date = checkbox.dataset.date
      const index = checkbox.dataset.index

      const currentLogs=logs
      currentLogs[eventId][date][index]=checkbox.checked
      setLogs(currentLogs)

      console.log(eventId, date, logs[eventId][date][index])
      checkBoxChanged(eventId, date, logs[eventId][date][index])
    })
  })
  return (
    <>
      <h2>규칙적으로 약을 복용하세요</h2>
      <div id="Routine">
        <div id="calendar">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]} // 플러그인 설정
            editable={true} // 이벤트의 드래그 앤 드롭, 리사이징, 이동을 허용합니다.
            droppable={true} // 캘린더에 요소를 드롭하여 이벤트를 생성할 수 있도록 허용합니다.
            selectable={true} // 사용자가 일정 범위를 선택하여 이벤트를 추가할 수 있도록 허용합니다.
            selectMirror={true} // 이벤트를 추가할 때 선택한 영역을 표시합니다.
            nowIndicator={true} // 현재 시간을 표시하는 인디케이터를 활성화합니다.
            eventBackgroundColor="#ff0000" // 이벤트의 배경색을 설정합니다.
            eventBorderColor="#0000ff" // 이벤트의 테두리 색을 설정합니다.
            allDay={true} // 이벤트가 하루 종일인지 여부를 지정합니다.
            timeZone="UTC" // 캘린더의 시간대를 UTC로 설정합니다.
            headerToolbar={{
              left: "prev today", center: "title", right: "next",
            }}
          />
        </div>
        <div id="list">
          <FullCalendar
            plugins={[listPlugin]}
            initialView="listDay"
            headerToolbar={{ left: "prev today", center: "title", right: "next" }}
            timeZone="local"
            editable={true} // 이벤트의 드래그 앤 드롭, 리사이징, 이동을 허용합니다.
            droppable={true} // 캘린더에 요소를 드롭하여 이벤트를 생성할 수 있도록 허용합니다.
            selectable={true} // 사용자가 일정 범위를 선택하여 이벤트를 추가할 수 있도록 허용합니다.
            selectMirror={true} // 이벤트를 추가할 때 선택한 영역을 표시합니다.
            nowIndicator={true} // 현재 시간을 표시하는 인디케이터를 활성화합니다.
            eventBackgroundColor="#ff0000" // 이벤트의 배경색을 설정합니다.
            eventBorderColor="#0000ff" // 이벤트의 테두리 색을 설정합니다.
            allDay={true}

            //  변수로 관리하고 /getRoutine에서 routine_list(dict list[{}]임) 받아올 것
            events={events}
            eventDidMount={(info) => {
              const element = info.el.querySelector('.fc-list-event-title')
              const y = info.view.currentStart.getFullYear()
              const m = String(info.view.currentStart.getMonth() + 1).padStart(2, '0')
              const d = String(info.view.currentStart.getDate()).padStart(2, '0')
              const now = `${y}-${m}-${d}`
              if (logs[info.event.id][now]) {
                element.innerHTML +=
                  `<div class="list-checkbox">                               
                <label><input type="checkbox" data-event-id=${info.event.id} data-date=${now} data-index=0 ${logs[info.event.id][now][0] ? 'checked' : ''}> 아침</label>
                <label><input type="checkbox" data-event-id=${info.event.id} data-date=${now} data-index=1 ${logs[info.event.id][now][1] ? 'checked' : ''}> 점심</label>
                <label><input type="checkbox" data-event-id=${info.event.id} data-date=${now} data-index=2 ${logs[info.event.id][now][2] ? 'checked' : ''}> 저녁</label></div>`
              } else {
                element.innerHTML +=
                  `<div class="list-checkbox">                               
                <label><input type="checkbox"> 아침</label>
                <label><input type="checkbox"> 점심</label>
                <label><input type="checkbox"> 저녁</label></div>`
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Routine;

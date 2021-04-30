import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from 'react-redux'
import moment from "moment";
import "./calendar.css";

export default function Calendar() {
  const {appointments} =  useSelector(state=>{ return state });
  const [calendar, setCalendar] = useState([]);
  const [value, setValue] = useState(moment);
  const weekdaysShort = moment.weekdaysShort(); 
  const [appoimentsA, setAppoimentsA] = useState(appointments && appointments.appointments?appointments.appointments:null);
  const [appoimentsB, setAppoimentsB] = useState(null);
  const dispatch  = useDispatch();

  useEffect(() => {
    setCalendar(buildCalendar(value));
  }, [value]);

  function buildCalendar(date) {
    const a = [];
    const startDay = date.clone().startOf("month").startOf("week");
    const endDay = date.clone().endOf("month").endOf("week");
    const _date = startDay.clone().subtract(1, "day");
    while (_date.isBefore(endDay, "day")) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => _date.add(1, "day").clone())
      );
    }
    return a;
  }

  function isSelected(day) {
    return value.isSame(day, "day");
  }

  function beforeToday(day) {
    let firstDay = moment(value).startOf('month'); 
    let lastDay = moment(value).endOf('month'); 
    return moment(day).isBefore(firstDay, "day") || moment(day).isAfter(lastDay, "day") ;
  }

  function isToday(day) {
    return moment(new Date()).isSame(day, "day");
  }

  function dayStyles(day) {
    if (beforeToday(day)) return "before";
    if (isSelected(day)) return "selected";
    if (isToday(day)) return "today";
    return "";
  }

  const currMonthName = ()=> {
    return value.format("MMMM");
  }

  const currYear = ()=> {
    return value.format("YYYY");
  }

  const nextMonth = () => {
    let dateContext = Object.assign({}, value);
    dateContext = moment(dateContext).add(1, "month");
    setValue(dateContext);
}

  const prevMonth = () => {
    let dateContext = Object.assign({}, value);
    dateContext = moment(dateContext).subtract(1, "month");
    setValue(dateContext);
  }

  function addAppoiment(day){
    const enteredAppointment = prompt('Please enter appoiment')
    if (enteredAppointment){
      let appoimenTmp = Object.assign([], appoimentsA);
      let appoiment = {info: enteredAppointment, day};
      appoimenTmp.push(appoiment)
      setAppoimentsA(appoimenTmp)
      dispatch({type:"ADD_APPOITMENTS", payload: { appointments: appoimenTmp } });
      changeInfo(day)
      changeInfo(day)
    }

  }

  function changeInfo(day){
    setValue(day);
    if (appoimentsA.length>0){
      console.log(appoimentsA)
      let info = appoimentsA.filter(element => moment(element.day).format("YYYY-MM-DD HH:mm:ss") === moment(day).format("YYYY-MM-DD HH:mm:ss"));
      setAppoimentsB(info)
    }
  }

  return (
    <div className="calendar">
      <div className="header">
        <div className="box">
          <div>
            <button onClick={()=> {prevMonth()}}>Back</button>   
            <button onClick={()=> {nextMonth()}}>Next</button>
          </div>
          <div>
            <h3>{currMonthName()} {currYear()}</h3>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="day-names">
          {weekdaysShort.map((d) => (
            <div className="week">{d}</div>
          ))}
        </div>
        {calendar.map((week, wi) => (
          <div key={wi}>
            {week.map((day, di) => (
              <div
                key={di}
                className="day"
                onClick={() => {
                  changeInfo(day);
                }}
                onDoubleClick={()=>{addAppoiment(day)}}
              >
                <div className={dayStyles(day)}>
                  {day.format("D").toString()}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{display: "flow-root", justifyContent:"center"}}>
        <h3>Appoiments</h3><br/>
        {appoimentsB?appoimentsB.map((day) => (
          <div>
            {day.info}
          </div>
        )):null}
      </div>
    </div>
  );
}
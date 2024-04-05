import React, { useEffect, useState, useMemo } from "react";
import { GetMovies } from "../getDataFromApi";
import { createContext } from "react";

const DataContext = createContext();

function Provider({ children }) {
  const [ chairs, setChairs ] = useState([]);
  const [movies, setMovies] = useState([]);
  const [chairSelecting, setChairSelecting] = useState([]);
  const [chairReserved, setChairReserved] = useState([]);
  const [chairsReservations, setReservations] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const schedules = {
    lunes: [
      "11:20 AM",
      "11:40 AM",
      "12:20 PM",
      "1:20 PM",
      "8:00 PM",
      "11:30 PM",
    ],
    martes: [
      "12:20 PM",
      "1:20 PM",
      "3:20 PM",
      "5:50 PM",
      "8:00 PM",
      "11:30 PM",
    ],
    miercoles: [
      "10:20 AM",
      "10:40 AM",
      "11:20 AM",
      "3:40 PM",
      "5:50 PM",
      "8:00 PM",
      "11:30 PM",
    ],
    jueves: [
      "10:20 AM",
      "1:20 PM",
      "1:40 PM",
      "3:20 PM",
      "8:00 PM",
      "11:30 PM",
    ],
    viernes: [
      "10:40 AM",
      "11:40 AM",
      "12:20 PM",
      "1:40 PM",
      "3:20 PM",
      "5:50 PM",
      "8:00 PM",
      "11:30 PM",
    ],
    sabado: [
      "3:20 PM",
      "3:40 PM",
      "5:50 PM",
      "8:00 PM",
      "11:30 PM"
    ],
    domingo: [
      "10:20 AM",
      "10:40 AM",
      "11:20 AM",
      "11:40 AM",
      "12:20 PM",
      "1:40 PM",
      "3:20 PM",
      "3:40 PM",
      "5:50 PM",
      "8:00 PM",
    ],
  };

  const initialSelectedDay = Object.keys(schedules)[0];
  const initialSelectedTime = schedules[initialSelectedDay][0];

  const [day, setDay] = useState(initialSelectedDay);
  const [hour, setHour] = useState(initialSelectedTime);

  
  function markChairAsBussy(chairsReservations, day, hour, id) {
    let reservations = Object.assign({}, chairsReservations);
    reservations[day] = reservations[day] || {};
    reservations[day][hour] = reservations[day][hour] || {};
    reservations[day][hour][id] = reservations[day][hour][id] || id;
    return reservations;
  }
  

  const handleClick = async (id, day, hour) => {
    let reservationsCopy = { ...chairsReservations };
  
    if (chairsReservations?.[day]?.[hour]?.[id]) {
      delete reservationsCopy[day][hour][id];
    } else {
      reservationsCopy = markChairAsBussy(reservationsCopy, day, hour, id);
    }
    setReservations(reservationsCopy);
    reservedChairs(reservationsCopy);
  
    setSelectedDay(day);
    setSelectedHour(hour);
    setChairSelecting((prevStatus) => [...prevStatus, id]);

  };
 
  // Lista de películas
  useEffect(() => {
    dataMovies();
  }, []);

  const dataMovies = async () => {
    const result = await GetMovies();
    setMovies(result);
  };

  // Resumen de sillas reservadas
const reservedChairs = (reservations) => {
  let summary = [];
  if (reservations[day] && reservations[day][hour]) {
    summary = Object.keys(reservations[day][hour]);
  }
  setChairReserved(summary); 
};

useEffect(() => {
  setChairSelecting([]);
}, [hour, day]);


const handleConfirm = () => {
  setChairReserved([]);
  setSelectedDay("lunes");
  setSelectedHour("");
  setChairSelecting([])
  backToInit()
};

  return (
    <DataContext.Provider
      value={{
        movies,
        hour,
        setHour,
        day,
        setDay,
        chairSelecting,
        setChairReserved,
        schedules,
        handleClick,
        chairs,
        chairsReservations,
        handleConfirm
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { Provider, DataContext };


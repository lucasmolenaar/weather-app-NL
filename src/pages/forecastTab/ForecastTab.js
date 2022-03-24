import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { TempContext } from '../../context/TempContextProvider';
import './ForecastTab.css';
import createDateString from "../../helpers/createDateString";

function ForecastTab({ coordinates }) {
    const [forecasts, setForecasts] = useState([]);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    const { kelvinToMetric } = useContext(TempContext);

    useEffect(() => {
      const fetchData = async () => {
          toggleError(false);
          toggleLoading(true);

          try {
              const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,current,hourly&appid=${process.env.REACT_APP_API_KEY}&lang=nl`)
              console.log(result.data);
              setForecasts(result.data.daily.slice(1, 6));
              console.log('forecasts: ' + forecasts);
          } catch (e) {
              console.error(e);
              toggleError(true);
          }
          toggleLoading(false);
      }

      if (coordinates) {
          fetchData();
      }
  }, [coordinates])



  return (
    <div className="tab-wrapper">
        {loading && <span>Loading...</span>}
        {error && <span>Er is iets mis gegaan met het ophalen van de data</span>}
        {
            !error && forecasts.length === 0 &&
                <span className='no-forecast'>Zoek eerst een locatie om het weer voor deze week te bekijken</span>
        }
        {forecasts.map((day) => {
            return (
                <article className="forecast-day" key={day.dt}>
                    <p className="day-description">
                        {createDateString(day.dt)}
                    </p>

                    <section className="forecast-weather">
                    <span>
                      {kelvinToMetric(day.temp.day)}
                    </span>

                    <span className="weather-description">
                      {day.weather[0].description}
                    </span>
                    </section>
                </article>
                )

        })}
    </div>
  );
};

export default ForecastTab;

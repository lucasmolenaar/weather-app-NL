import React, {useEffect, useState} from 'react';
import axios from "axios";

import WeatherDetail from "../../components/weatherDetail/WeatherDetail";

import './TodayTab.css';
import createTimeString from "../../helpers/createTimeString";

function TodayTab({ coordinates }) {
	const [forecasts, setForecasts] = useState([]);
	const [error, toggleError] = useState(false);
	const [loading, toggleLoading] = useState(false);

	console.log(forecasts)

	useEffect(() => {
		const fetchData = async () => {
			toggleError(false);
			toggleLoading(true);

			try {
				const result = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,current,daily&appid=${process.env.REACT_APP_API_KEY}`)
				setForecasts([
					result.data.hourly[3],
					result.data.hourly[5],
					result.data.hourly[7]
				]);
				console.log('Today tab: ' + result.data);
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

	return(
		<div className="tab-wrapper">
			<div className="chart">
				{
					forecasts.map( forecast => {
						return (
							<WeatherDetail
								temp={forecast.temp}
								type={forecast.weather[0].main}
								description={forecast.weather[0].description}
								key={forecast.dt}
							/>
						);
					})
				}
			</div>
			<div className="legend">
				{
					forecasts.map( forecast => {
						return <span key={`${forecast.dt}-timestamp`}>{createTimeString(forecast.dt)}</span>
					})
				}
			</div>

			{error && <span>Het ophalen van de voorspellingen is mislukt. Probeer het opnieuw.</span>}
			{loading && <span>Loading ...</span>}
		</div>
  );
};

export default TodayTab;

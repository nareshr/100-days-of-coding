import { useState } from 'react'
import './App.css'

function App() {
	const [celsius, setCelsius] = useState(0)
	const [fahrenheit, setfFahrenheit] = useState(32)

	const onHandleCelsiusChange = (e) => {
		const value = e.target.value
		setCelsius(value)

		const fahrenheit = (value * 9) / 5 + 32
		setfFahrenheit(fahrenheit)
	}

	const onHandleFahrenheitChange = (e) => {
		const value = e.target.value
		setfFahrenheit(value)

		const celsius = ((value - 32) * 5) / 9
		setCelsius(celsius)
	}

	return (
		<>
			<h1>Temprature Converter</h1>
			<div className="card">
				Celcius:{' '}
				<input
					type="number"
					id="celsius"
					name="celcius"
					value={celsius}
					onChange={onHandleCelsiusChange}
				/>
			</div>
			<div className="card">
				Fahrenheit:{' '}
				<input
					type="number"
					id="fahrenheit"
					name="fahrenheit"
					value={fahrenheit}
					onChange={onHandleFahrenheitChange}
				/>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	)
}

export default App

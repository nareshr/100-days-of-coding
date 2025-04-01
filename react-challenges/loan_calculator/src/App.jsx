import { useState } from 'react'

export default function App() {
	const [totalCost, setTotalCost] = useState(0)
	const [numberOfIntervals, setNumberOfIntervals] = useState(0)
	const [installment, setInstallment] = useState(0)

	const handleChange = (e) => {
		setTotalCost(e.target.value)
	}

	const handleIntervalChange = (e) => {
		setNumberOfIntervals(e.target.value)
	}

	const handleCalculate = (e) => {
		if (totalCost > 0 && numberOfIntervals > 0) {
			const installments = totalCost / numberOfIntervals
			setInstallment(Number(installments))
		}
	}

	return (
		<>
			<h1>Loan Calculator!</h1>
			Total Cost:{' '}
			<input id="totalCost" value={totalCost} onChange={handleChange} />
			No Of Monthly Payment:
			<input
				id="numberOfIntervals"
				value={numberOfIntervals}
				onChange={handleIntervalChange}
			/>
			<button type="button" id="calculate" onClick={handleCalculate}>
				Calculate
			</button>
			<div id="output">{installment.toFixed(2)}</div>
		</>
	)
}

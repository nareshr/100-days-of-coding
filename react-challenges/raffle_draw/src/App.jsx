import { useState } from 'react'

export default function App() {
	const [name, setName] = useState('')
	const [names, setNames] = useState([])
	const [randomName, setRandomName] = useState('')
	const [selectedNames, setSelectedNames] = useState([])
	const [isOpen, setIsOpen] = useState(false)

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			if (name.trim() !== '') {
				setNames((prevNames) => [...prevNames, name])
				setName('')
			}
		}
	}

	const handleRandomName = () => {
		if (names.length === 0) return
		const randomIndex = Math.floor(Math.random() * names.length)
		const chosenName = names[randomIndex]

		setRandomName(chosenName)

		setSelectedNames((prevNames) => [...prevNames, chosenName])

		setNames(names.filter((name) => name !== chosenName))

		setIsOpen(true)
	}

	return (
		<>
			<h1>Raffle Draw</h1>
			<br />
			Enter Name:{' '}
			<input
				id="nameInput"
				value={name}
				onChange={(e) => setName(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<br />
			<br />
			<div id="nameList">
				<span>Entered Names</span>
				{names.map((name) => (
					<span className="name">{name}</span>
				))}
			</div>
			<br />
			<div id="pickedList">
				<span>Managing the Picked Names</span>
				{selectedNames.map((name) => (
					<span className="name">{name}</span>
				))}
			</div>
			<br />
			<br />
			<br />
			{isOpen && (
				<dialog id="nameDialog" open>
					<div>
						🎉 Selected Name: <strong>{randomName}</strong>
					</div>
					<button onClick={() => setIsOpen(false)}>Close</button>
				</dialog>
			)}
			<button type="button" id="pick" onClick={handleRandomName}>
				Pick a Name
			</button>
		</>
	)
}

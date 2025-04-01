import { useEffect } from 'react'
import { useState } from 'react'

export default function App() {
	const [posts, setPosts] = useState([])
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true)
			try {
				const response = await fetch(
					`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
				)
				const data = await response.json()
				if (page === 1) {
					setPosts(data)
				} else {
					setPosts((prevData) => [...prevData, ...data])
				}
			} catch (error) {
				console.error('Error fetching posts:', error)
			}
			setLoading(false)
		}

		fetchPosts()
	}, [page])

	return (
		<div>
			<h2>Posts</h2>
			{loading && <p>Loading...</p>}
			<table border="1" width="100%">
				<thead>
					<tr>
						<th>ID</th>
						<th>Title</th>
						<th>Body</th>
					</tr>
				</thead>
				<tbody>
					{posts.map((post) => (
						<tr key={post.id}>
							<td>{post.id}</td>
							<td>{post.title}</td>
							<td>{post.body}</td>
						</tr>
					))}
				</tbody>
			</table>
			<button
				onClick={() => setPage((prev) => prev + 1)}
				disabled={loading}
				id="next"
			>
				Next Page
			</button>
			<button
				onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
				disabled={loading || page === 1}
				id="previous"
			>
				Previous Page
			</button>
		</div>
	)
}

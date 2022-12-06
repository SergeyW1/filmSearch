const API_URL_INFO = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'
export const API_KEY = 'f95b2b95-3a4f-444a-b085-0700a3ff3270'
export const modalEl = document.querySelector('.modal')

export async function openModal(id) {
	const response = await fetch(API_URL_INFO + id, {
		// headers нужен для того, чтобы получить доступ к этому API
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': API_KEY
		}
	})
	const respData = await response.json()

	document.querySelector('.modal__movie-backdrop').src = `${respData.posterUrl}`
	document.querySelector('.modal__movie-title').textContent =
		`${respData.nameRu ? respData.nameRu : respData.nameEn ?? respData.nameOriginal} (${respData.year})`
	respData.countries.forEach(item => {
		document.querySelector('.modal__movie-country').textContent = `${item.country}`
	})
	document.querySelector('.modal__movie-overview').textContent =
		`${respData.description === null || respData.description === 'null' ? 'Нету описания' : respData.description}`
	document.querySelector('.modal__movie-time').textContent =
		`${respData.filmLength === null || respData.filmLength === 'null' ? 'Не указано мин.' : respData.filmLength + ' мин.'}`
	document.querySelector('.modal__movie-year').textContent = `${respData.year}`
	document.querySelector('.modal__movie-site').href = `${respData.webUrl}`
	document.querySelector('.modal__movie-genre').textContent = `${respData.genres.map(item => ` ${item.genre}`).splice(0, 4)}`

	const btn = document.querySelector('.modal__button-close');
	btn.addEventListener('click', closeModal)
	modalEl.classList.add('modal__show')
}


function closeModal() {
	modalEl.classList.remove('modal__show')
}

window.addEventListener('click', (e) => {
	if (e.target === modalEl) {
		closeModal()
	}
})

window.addEventListener('keydown', (e) => {
	if (e.keyCode === 27) {
		closeModal()
	}
})

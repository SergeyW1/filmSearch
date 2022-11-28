const API_KEY = 'f95b2b95-3a4f-444a-b085-0700a3ff3270'
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const API_URL_INFO = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

async function getMovies(url) {
	try {
		// headers нужен для того, чтобы получить доступ к этому API
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': API_KEY
			}
		})
		const respData = await response.json()
		await showMovies(respData)
		console.log(respData)
	} catch (err) {
		console.error('Ошибка API:', err);
	}
}
const temp = document.querySelector('#temp__movies')
const firstClone = temp.content.cloneNode(true)
getMovies(API_URL_POPULAR)

async function showMovies(data) {
	const moviesEl = document.querySelector('.movies')

	moviesEl.innerHTML = ''

	data.films.forEach(movie => {
		const temp = document.querySelector('#temp__movies')
		const firstClone = temp.content.cloneNode(true)

		firstClone.querySelector('.movie__cover').src = `${movie.posterUrl}`;
		firstClone.querySelector('.movie__title').textContent = `${movie.nameRu ? movie.nameRu : movie.nameEn}`;
		firstClone.querySelector('.movie__year').textContent = `${movie.year}`;
		const movieCategory = firstClone.querySelector('.movie__category')
		movie.genres.forEach(item => {
			const contentGenre = document.createElement('span')
			contentGenre.textContent = item.genre
			movieCategory.append(contentGenre)
		})
		const movieAverage = firstClone.querySelector('.movie__average')
		movieAverage.textContent = `${getClassByRate(movie.rating)}`;
		if (movie.rating >= 7) {
			movieAverage.classList.add('movie__average--green')
		} else if (movie.rating >= 6) {
			movieAverage.classList.add('movie__average--grey')
		} else if (movie.rating > 0) {
			movieAverage.classList.add('movie__average--red')
		}
		firstClone.querySelector('.movie___cover--inner').addEventListener('click', () => openModal(movie.filmId))
		moviesEl.append(firstClone)
	})
}

function getClassByRate(vote) {
	let num = parseFloat(vote)

	if (num > 10) {
		return 'В ожидании'
	} else if (vote === null || vote === 'null') {
		return 'Нету рейтинга'
	} else {
		return vote;
	}
}

const form = document.querySelector('form')
const headerSearch = document.querySelector('.header__search')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	const apiSearchUrl = `${API_URL_SEARCH}${headerSearch.value}`
	if (headerSearch.value) {
		getMovies(apiSearchUrl)
	}
})

const modalEl = document.querySelector('.modal')

async function openModal(id) {
	modalEl.classList.add('modal__show')

	const response = await fetch(API_URL_INFO + id, {
		// headers нужен для того, чтобы получить доступ к этому API
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': API_KEY
		}
	})
	const respData = await response.json()
	// console.log(respData)

	document.querySelector('.modal__movie-backdrop').src = `${respData.posterUrl}`
	document.querySelector('.modal__movie-title').textContent = `${respData.nameRu ? respData.nameRu : respData.nameEn ? respData.nameEn : respData.nameOriginal} (${respData.year})`
	respData.countries.forEach(item => {
		document.querySelector('.modal__movie-country').textContent = `${item.country}`
	})
	document.querySelector('.modal__movie-overview').textContent =
		`${respData.description === null || respData.description === 'null' ? 'Нету описания' : respData.description}`
	document.querySelector('.modal__movie-time').textContent =
		`${respData.filmLength === null || respData.filmLength === 'null' ? 'Не указано' : respData.filmLength} мин.`
	document.querySelector('.modal__movie-year').textContent = `${respData.year}`
	document.querySelector('.modal__movie-site').src = `${respData.webUrl}`
	document.querySelector('.modal__movie-genre').textContent = `${respData.genres.map(item => ` ${item.genre}`)}`

	const btn = document.querySelector('.modal__button-close');
	btn.addEventListener('click', closeModal)
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







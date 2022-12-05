// import {changeTheme} from "./theme";



const API_KEY = 'f95b2b95-3a4f-444a-b085-0700a3ff3270'
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const API_URL_INFO = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/'
let films = []

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
		console.log(films)
		films = respData.films
		await showMovies(films.slice(0, 6))
		console.log(respData)
	} catch (err) {
		console.error('Ошибка API:', err);
	}
}
getMovies(API_URL_POPULAR)

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

async function showMovies(data) {
	const moviesEl = document.querySelector('.movies')
	
	moviesEl.innerHTML = ''

	data.forEach(movie => {
		const temp = document.querySelector('#temp__movies')
		const firstClone = temp.content.cloneNode(true)
		firstClone.querySelector('.movie__cover').src = `${movie.posterUrl}`;
		firstClone.querySelector('.movie__title').textContent = `${movie.nameRu ?? movie.nameEn}`;
		firstClone.querySelector('.movie__year').textContent = `${movie.year}`;
		const movieCategory = firstClone.querySelector('.movie__category')
		movieCategory.textContent = movie.genres.map(item => ` ${item.genre}`).splice(0, 3)
		const movieAverage = firstClone.querySelector('.movie__average')
		movieAverage.textContent = `${getClassByRate(movie.rating)}`;
		movieRating(movie.rating)
		firstClone.querySelector('.movie___cover--inner').addEventListener('click', () => openModal(movie.filmId))
		moviesEl.append(firstClone)
		changeTheme()
	})
}

function movieRating(movie) {
	const temp = document.querySelector('#temp__movies')
	const firstClone = temp.content.cloneNode(true)
	const movieAverage = firstClone.querySelector('.movie__average')
	if (movie >= 7) {
		movieAverage.classList.add('movie__average--green')
	} else if (movie >= 6) {
		movieAverage.classList.add('movie__average--grey')
	} else if (movie > 0) {
		movieAverage.classList.add('movie__average--red')
	}
}

const form = document.querySelector('form')
// const headerLogo = document.querySelector('.header__logo')
form.addEventListener('submit', (e) => {
	e.preventDefault()

	const apiSearchUrl = `${API_URL_SEARCH}${headerSearch.value}`
	if (headerSearch.value) {
		getMovies(apiSearchUrl)
	}
})


const modalEl = document.querySelector('.modal')

async function openModal(id) {
	const response = await fetch(API_URL_INFO + id, {
		// headers нужен для того, чтобы получить доступ к этому API
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': API_KEY
		}
	})
	const respData = await response.json()
	console.log(respData)

	document.querySelector('.modal__movie-backdrop').src = `${respData.posterUrl}`
	document.querySelector('.modal__movie-title').textContent =
		`${respData.nameRu ? respData.nameRu : respData.nameEn ? respData.nameEn : respData.nameOriginal} (${respData.year})`
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


const headerLogo = document.querySelector('.header__logo')
const headerSearch = document.querySelector('.header__search')
const togglerSlider = document.querySelector('.toggler-slider')
const modalCard = document.querySelector('.modal__card')
const modalOverview = document.querySelector('.modal__movie-overview')
const modalSite = document.querySelector('.modal__movie-site')
const btnModalClose = document.querySelector('.modal__button-close')
const paginationConteiner = document.querySelector('.pagination__conteiner')

togglerSlider.addEventListener('click', changeTheme)

function changeTheme() {
	document.body.classList.toggle('check__background-white')
	headerLogo.classList.toggle('check__color')
	headerSearch.classList.toggle('header__search-toggle')
	togglerSlider.classList.toggle('check__background-black')

	modalCard.classList.toggle('modal__card-toggle')
	modalOverview.classList.toggle('modal__overview-toggle')
	modalSite.classList.toggle('check__color')
	btnModalClose.classList.toggle('button__close-toggle')

	paginationConteiner.classList.toggle('pagination__conteiner-toggle')
}

document.querySelectorAll('.pagination__item').forEach((item, index) => {
	item.addEventListener('click', () => {
		showMovies(films.slice(index * 6, index * 6 + 6))
	})
})





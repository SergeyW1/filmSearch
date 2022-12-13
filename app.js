import { openModal, API_KEY } from './modules/modal.js'
import { changeTheme, paginationConteiner } from './modules/changeTheme.js'


const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
let films = []

async function getMovies(url) {
	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				'X-API-KEY': API_KEY
			}
		})
		const respData = await response.json()
		films = respData.films
		showMovies(films.slice(0, 6))
	} catch (err) {
		console.error('Ошибка API:', err);
	}
}

getMovies(API_URL_POPULAR)

function showMovies(data) {
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
		getByRating(movie.rating)
		firstClone.querySelector('.movie___cover--inner').addEventListener('click', () => openModal(movie.filmId))
		moviesEl.append(firstClone)
	})
	changeTheme
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

function getByRating(movie) {
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
const headerSearch = document.querySelector('.header__search')
form.addEventListener('submit', (e) => {
	e.preventDefault()

	const apiSearchUrl = `${API_URL_SEARCH}${headerSearch.value}`
	if (headerSearch.value) {
		getMovies(apiSearchUrl)
	}
})


const paginationItem = document.querySelectorAll('.pagination__item')
const el = document.querySelector('.pagination__active')
paginationConteiner.addEventListener('click', (event) => {
	if (event.target.classList.contains('pagination__item')) {
		const el = document.querySelector('.pagination__active')
		if (el) {
			el.classList.remove('pagination__active')
		}
		event.target.classList.add('pagination__active')
	}
	replacePagination(event)
})


function replacePagination(event) {
	paginationItem.forEach((item, index) => {
		item.dataset.index = index
	})
	if (event.target.classList.contains('pagination__item')) {
		const index = parseInt(event.target.dataset.index)
		showMovies(films.slice(index * 6, index * 6 + 6))
	}
}















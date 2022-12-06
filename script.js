import { modalEl, openModal, API_KEY} from './modules/modal.js'
import { changeTheme, togglerSlider } from './modules/changeTheme.js'




const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
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
		films = respData.films
		console.log(films)
		await showMovies(films.slice(0, 6))
		console.log(respData)
	} catch (err) {
		console.error('Ошибка API:', err);
	}
}
getMovies(API_URL_POPULAR)

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
		getByRating(movie.rating)
		firstClone.querySelector('.movie___cover--inner').addEventListener('click', () => openModal(movie.filmId))
		moviesEl.append(firstClone)
		changeTheme()
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

togglerSlider.addEventListener('click', changeTheme)

document.querySelectorAll('.pagination__item').forEach((item, index) => {
	console.log(showMovies(films.slice(index * 6, index * 6 + 6)))
	item.addEventListener('click', () => {
		showMovies(films.slice(index * 6, index * 6 + 6))
	})
})






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
	
	data.films.forEach(movie => {
		const temp = document.querySelector('#temp__movies')
		const firstClone = temp.content.cloneNode(true)
		back()
		firstClone.querySelector('.movie__cover').src = `${movie.posterUrl}`;
		firstClone.querySelector('.movie__title').textContent = `${movie.nameRu ? movie.nameRu : movie.nameEn}`;
		firstClone.querySelector('.movie__year').textContent = `${movie.year}`;
		const movieCategory = firstClone.querySelector('.movie__category')
		movie.genres.forEach(item => {
			const contentGenre = document.createElement('span')
			contentGenre.textContent = item.genre
			for(let i = 0; i < contentGenre.length; i++) {
				if (contentGenre[i] === contentGenre[i.length - 1]) {
					contentGenre[i]
				} else {
					contentGenre[i] + ','
				}
			}
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

const form = document.querySelector('form')
const headerSearch = document.querySelector('.header__search')



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
	document.querySelector('.modal__movie-genre').textContent = `${respData.genres.map(item => ` ${item.genre}`)}`

	const btn = document.querySelector('.modal__button-close');
	btn.addEventListener('click', closeModal)
}

form.addEventListener('submit', (e) => {
	e.preventDefault()

	const apiSearchUrl = `${API_URL_SEARCH}${headerSearch.value}`
	if (headerSearch.value) {
		getMovies(apiSearchUrl)
	}
})


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




document.querySelector('.toggler-slider').addEventListener('click', back)

function back() {
	const movieTitle = document.querySelectorAll('.movie__title ')
	const movieCategory = document.querySelectorAll('.movie__category')
	document.body.classList.toggle('check__background-white')
	if (document.body.classList.contains('check__background-white')) {
		document.querySelector('.header__logo').classList.add('check__color')
		document.querySelector('.header__search').classList.add('header__search-toggle')
		document.querySelector('.toggler-wrapper .toggler-slider').classList.add('check__background-black')
		for (let i = 0; i < movieTitle.length; i++) {
			movieTitle[i].classList.add('check__color')
		}
		for (let i = 0; i < movieCategory.length; i++) {
			movieCategory[i].classList.add('check__color-category')
		}
		document.querySelector('.modal__card').classList.add('modal__card-toggle')
		document.querySelector('.modal__movie-overview').classList.add('modal__overview-toggle')
		document.querySelector('.modal__movie-site').classList.add('check__color')
		document.querySelector('.modal__button-close').classList.add('button__close-toggle')
	} else {
		document.querySelector('.header__logo').classList.remove('check__color')
		document.querySelector('.header__search').classList.remove('header__search-toggle')
		document.querySelector('.toggler-wrapper .toggler-slider').classList.remove('check__background-black')
		for (let i = 0; i < movieTitle.length; i++) {
			movieTitle[i].classList.remove('check__color')
		}
		for (let i = 0; i < movieCategory.length; i++) {
			movieCategory[i].classList.remove('check__color-category')
		}
		document.querySelector('.modal__card').classList.remove('modal__card-toggle')
		document.querySelector('.modal__movie-overview').classList.remove('modal__overview-toggle')
		document.querySelector('.modal__movie-site').classList.remove('check__color')
		document.querySelector('.modal__button-close').classList.remove('button__close-toggle')
	}
}


// function back() {
// 	const movieTitle = document.querySelectorAll('.movie__title ')
// 	const movieCategory = document.querySelectorAll('.movie__category')
// 	document.body.classList.toggle('check__background-white')
// 	document.querySelector('.header__logo').classList.toggle('check__color')
// 	document.querySelector('.header__search').classList.toggle('header__search-toggle')
// 	document.querySelector('.toggler-wrapper .toggler-slider').classList.toggle('check__background-black')
// 	for(let i = 0; i < movieTitle.length; i++) {
// 		movieTitle[i].classList.toggle('check__color')
// 	} 
// 	for(let i = 0; i < movieCategory.length; i++) {
// 		movieCategory[i].classList.toggle('check__color-category')
// 	}
// 	document.querySelector('.modal__card').classList.toggle('modal__card-toggle')
// 	document.querySelector('.modal__movie-overview').classList.toggle('modal__overview-toggle')
// 	document.querySelector('.modal__movie-site').classList.toggle('check__color')
// 	document.querySelector('.modal__button-close').classList.toggle('button__close-toggle')
// }










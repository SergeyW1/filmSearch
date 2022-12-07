const headerLogo = document.querySelector('.header__logo')
const headerSearch = document.querySelector('.header__search')
const modalCard = document.querySelector('.modal__card')
const modalOverview = document.querySelector('.modal__movie-overview')
const modalSite = document.querySelector('.modal__movie-site')
const btnModalClose = document.querySelector('.modal__button-close')
export const paginationConteiner = document.querySelector('.pagination__conteiner')
export const togglerSlider = document.querySelector('.toggler-slider')

export function changeTheme() {
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

togglerSlider.addEventListener('click', changeTheme)


// Modal Window card info selectors

const addModalBtn = document.querySelector('.add__ad')
const addModal = document.querySelector('.modal__add')
const addModalSubmit = document.querySelector('.modal__submit')
const addModalFormSubmit = document.querySelector('.modal__btn-submit')
const modalFileBtnSpan = document.querySelector('.modal__file-btn')
const modalFileBtn = document.querySelector('.modal__file-input')
const modalImageAdd = document.querySelector('.modal__image-add')

// Modal Window card selectors

const itemModal = document.querySelector('.modal__item')

// Catalog Selecetors

const catalog = document.querySelector('.catalog')

// Search Selectors

const searchInput = document.querySelector('.search__input')
const menuContainer = document.querySelector('.menu__container')

// Other

const modalFileBtnText =  modalFileBtnSpan.textContent

const imagePath = modalImageAdd.src

const addModalSubmitElems = [...addModalSubmit.elements].filter(elem => elem.tagName != 'BUTTON')

const infoPhoto = {}

const dataBase = JSON.parse(localStorage.getItem('goods')) || []

let counter = 0

// Public functions

const saveDB = () => {

    localStorage.setItem('goods', JSON.stringify(dataBase))
}

const openListener = event => {
    if (event.target.closest('.card')) {
        itemModal.classList.remove('hide')
        document.addEventListener('keydown', closeListner)
    } else if (event.target === addModalBtn) {
        addModal.classList.remove('hide')
        addModalFormSubmit.disabled = true
        document.addEventListener('keydown', closeListner)
    }
    checkForm()
}


const closeListner = event => {
    if (event.target.classList.contains('modal__close') || event.target === addModal ||
    event.target === itemModal || event.code === 'Escape') {
        addModal.classList.add('hide')
        addModalSubmit.reset()
        itemModal.classList.add('hide')
        document.removeEventListener('keydown', closeListner)
        modalFileBtnSpan.textContent = modalFileBtnText
        modalImageAdd.src = imagePath
        checkForm()
    }
}

const checkForm = () => {
    const result = addModalSubmitElems.every(elem => elem.value)
    addModalFormSubmit.disabled = !result
    document.querySelector('.modal__btn-warning').style.display = result ? 'none' : ''
}

const photoLoad = event => {

    const reader = new FileReader()

    const file = event.target.files[0]

    infoPhoto.filename = file.name
    infoPhoto.size = file.size

    reader.readAsBinaryString(file)

    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
            modalFileBtnSpan.textContent = infoPhoto.filename
            infoPhoto.base64 = btoa(event.target.result)
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`
        } else modalFileBtnSpan.textContent = 'Файл не должен превышать 200кб'
    })
}

const saveCardInfotoDB = event => {

    event.preventDefault()

    const data = {}

    addModalSubmitElems.forEach(elem => {

        data[elem.name] = elem.value
        data.photo = infoPhoto.base64
    })
    data.id = counter++
    dataBase.push(data)
    saveDB()
    closeListner({target: addModal})
    render()
    console.log(dataBase)
}

const dataToHTML = item => `
<li class="card" data-id="${item.id}">
	<img class="card__image" src="data:image/jpeg;base64,${item.photo}" alt="test">
	<div class="card__description">
		<h3 class="card__header">${item.nameItem}</h3>
		<div class="card__price">${item.costItem}</div>
	</div>
</li>
`

function render(arr = dataBase) {
    catalog.innerHTML = arr.map(dataToHTML).join('')
}

const itemModalContent = event => {

    const modalHeaderItem = document.querySelector('.modal__header-item')
    const modalStatusItem = document.querySelector('.modal__status-item')
    const modalDescItem = document.querySelector('.modal__description-item')
    const modalCostItem = document.querySelector('.modal__cost-item')
    const modalImageItem = document.querySelector('.modal__image-item')

    const card = event.target.closest('.card')

    if (card) {
        const result = dataBase.find(item => item.id === +card.dataset.id)

        modalHeaderItem.textContent = result.nameItem
        modalStatusItem.textContent = result.status
        modalDescItem.textContent = result.descriptionItem
        modalCostItem.textContent = result.costItem
        modalImageItem.src = `data:image/jpeg;base64,${result.photo}`
    }
}

const filterName = () => {
    const filteredArr = dataBase.filter(item => 
        item.nameItem.toLowerCase().includes(searchInput.value.toLowerCase().trim()))
    render(filteredArr)
}

const filterCategory =  event => {
    if (event.target.dataset.category) {
        const filteredArr = dataBase.filter(item => event.target.dataset.category === item.category)
        render(filteredArr)
    }
}

// AddModal Listeners

addModalBtn.addEventListener('click', openListener)

addModal.addEventListener('click', closeListner)

addModalSubmit.addEventListener('input', checkForm)

modalFileBtn.addEventListener('change', photoLoad)

addModalSubmit.addEventListener('submit', saveCardInfotoDB)

// Catalog Listeners

catalog.addEventListener('click', openListener)

itemModal.addEventListener('click', closeListner)

catalog.addEventListener('click', itemModalContent)

// Search Listeners

searchInput.addEventListener('input', filterName)

menuContainer.addEventListener('click', filterCategory)

// Calls

render()

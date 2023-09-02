function app() {
	const app = document.querySelector('.app');
	const input = app.querySelector('.app__input');
	const dropDownMenu = app.querySelector('.app__list-rep');
	const savedRepsList = app.querySelector('.app__saved-list');

	async function getRepositories(inputValue) {
		const res = await fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=5`);
		const repositories = await res.json();
		if (res.ok) {
			addToDropDownMenu(repositories.items);
		} else {
			console.log('error')
		}
	}

	function searchRepositories() {
		const inputValue = input.value;
		if (inputValue && inputValue[0] != " ") {
			clearDropDownMenu();
			getRepositories(inputValue);
		} else {
			clearDropDownMenu();
		}
	}

	function addToDropDownMenu(arrReps) {
		arrReps.forEach(rep => {
			const repElement = `<li data-stars="${rep.stargazers_count}" data-owner="${rep.owner.login}" class="app__rep">${rep.name}</li>`;
			dropDownMenu.insertAdjacentHTML('beforeend', repElement);
		});
	}

	function clearDropDownMenu() {
		dropDownMenu.innerHTML = '';
	}

	function appActions(e) {
		if (e.target.closest('.app__rep')) {
			const rep = e.target.closest('.app__rep');
			const savedRep = `<li class="app__saved-rep">
										<div class="app__info">
											<span>Name:${rep.innerText}</span>
											<span>Owner:${rep.dataset.owner}</span>
											<span>Stars:${rep.dataset.stars}</span>
										</div>
										<button class="app__close"></button>
									</li>`
			savedRepsList.insertAdjacentHTML('afterbegin', savedRep);
			input.value = '';
			clearDropDownMenu();
		}
		if (e.target.closest('.app__close')) {
			e.target.closest('.app__saved-rep').remove();
		}
	}

	input.addEventListener('keyup', debounce(searchRepositories, 500));
	app.addEventListener('click', (e) => appActions(e));
}
app()

function debounce(fn, ms) {
	let timer;
	return function () {
		clearTimeout(timer);
		timer = setTimeout(() => fn.apply(this, arguments), ms);
	}
}

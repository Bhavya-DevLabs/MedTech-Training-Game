import { State } from './core/state.js';
import { Storage } from './core/storage.js';
import { Shell } from './ui/shell.js';

// Page imports
import { LoginPage } from './pages/login.js';
import { GamePage } from './pages/game.js';
import { QuestionPage } from './pages/question.js';

const App = {
	shellRendered: false,

	init() {
		const saved = Storage.load();
		if (saved) {
			State.set(saved);
		}

		// Persist state changes to storage
		State.subscribe((state) => {
			Storage.save(state);
		});

		this.setupRouter();
		this.route();
	},

	setupRouter() {
		window.addEventListener('hashchange', () => this.route());
	},

	ensureShell() {
		if (!this.shellRendered) {
			Shell.render();
			this.shellRendered = true;
		}
	},

	route() {
		const state = State.get();
		const hash = window.location.hash || '#/login';
		const route = hash.substring(2).split('?')[0];

		// Force login if no user
		if (!state.user?.name && route !== 'login') {
			window.location.hash = '#/login';
			return;
		}

		// Login renders outside the shell
		if (route === 'login') {
			this.shellRendered = false;
			LoginPage.render();
			return;
		}

		// All other pages render inside the persistent shell
		this.ensureShell();

		switch (route) {
			case 'game':
				GamePage.render();
				break;
			case 'question':
				QuestionPage.render();
				break;
			default:
				window.location.hash = '#/game';
		}
	}
};

App.init();

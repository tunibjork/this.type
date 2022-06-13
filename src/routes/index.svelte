<script>
	import CodeSnippet from '../components/CodeSnippet.svelte';
	import Accuracy from '../components/Accuracy.svelte';
	import WordsPerMin from '../components/WordsPerMin.svelte';

	import {
		correctInput,
		incorrectInput,
		totalKeypresses,
		correctKeypresses,
		enterCount,
		activeError,
		typingMode,
		timerRunning,
		startTime,
		codeSnippets
		// snippet
		// snippetArr,
		// nextKey
	} from '../stores';

	// let correctInput = '';
	// let incorrectInput = '';
	// let totalKeypresses = 0;
	// let correctKeypresses = 0;
	// let incorrectKeypresses = 0;
	// let enterCount = 0;
	// $: accuracy = ($correctKeypresses / $totalKeypresses) * 100;

	// let activeError = false;
	// let typingMode = false;
	// let timerRunning = false;
	// let startTime;
	// let endTime;
	let wpm;
	let wpmInterval;

	let snippet;
	let nextKey;
	let snippetArr;

	// const snippets = [
	// 	`function twoAdds (num) {\n\treturn function (second_num) {\n\t\treturn num + second_num;\n\t};\n}`,
	// 	`function reverseString (str) {\n\treturn str.split(' ').reverse().join(' ');\n}`,
	// 	`function isPalindrome (str) {\n\treturn str === str.split('').reverse().join('')\n}`,
	// 	`function shuffleArray (arr) {\n\treturn arr.sort(() => 0.5 - Math.random());\n}`,
	// 	`function findUniqueValues (arr) {\n\treturn arr.filter(el => {\n\t\treturn arr.indexOf(el) === arr.lastIndexOf(el);\n\t})\n}`
	// ];

	init();

	function init() {
		const random = Math.floor(Math.random() * $codeSnippets.length);
		snippet = $codeSnippets[random];
		nextKey = snippet[0];
		snippetArr = snippet.split('');
	}

	function getAnother() {
		reset();
		init();
		typingMode.set(false);
	}

	function startTimer() {
		startTime.set(Date.now());
		timerRunning.set(true);
		wpmInterval = setInterval(calculateWpm, 3000);
	}

	function calculateWpm() {
		const minutes = getElapsedMinutes($startTime, Date.now());
		wpm = $correctKeypresses / 5 / minutes;
	}

	function getElapsedMinutes(start, end) {
		return (end - start) / 1000 / 60;
	}

	function handleCorrectInput() {
		if (!$timerRunning) {
			startTimer();
		}
		const char = snippetArr.shift();
		correctInput.update((prev) => (prev += char));
		snippetArr = snippetArr;
		if (!snippetArr.length) {
			typingMode.set(false);
			timerRunning.set(false);
			// endTime = Date.now();
			clearInterval(wpmInterval);
			wpmInterval = null;
		}
		updateCorrectKeypresses();
		setNextKey();
		if ($correctInput.length > 2) {
			calculateWpm();
		}
	}

	function handleIncorrectInput(char) {
		if ($timerRunning) {
			activeError.set(true);
			incorrectInput.update((prev) => (prev += char));
			updateIncorrectKeypresses();
			setNextKey();
		}
	}

	function updateIncorrectKeypresses() {
		totalKeypresses.update((nr) => (nr += 1));
		// incorrectKeypresses += 1;
	}

	function updateCorrectKeypresses() {
		totalKeypresses.update((nr) => (nr += 1));
		correctKeypresses.update((nr) => (nr += 1));
	}

	function setNextKey() {
		if ($incorrectInput) {
			nextKey = 'Backspace';
		} else if (snippetArr[0] === '\n') {
			nextKey = 'Enter';
		} else if (snippetArr[0] === '\t') {
			nextKey = 'Tab';
		} else if (snippetArr[0] === ' ') {
			nextKey = 'Space';
		} else {
			nextKey = snippetArr[0];
		}
		return nextKey;
	}

	function handleKeypress(event) {
		if ($typingMode && !$activeError) {
			event.preventDefault();
			switch (event.key) {
				case 'Escape':
				case 'CapsLock':
				case 'Shift':
				case 'Control':
				case 'Alt':
				case 'Meta':
				case 'ArrowLeft':
				case 'ArrowRight':
				case 'ArrowUp':
				case 'ArrowDown':
				case 'F1':
				case 'F2':
				case 'F3':
				case 'F4':
				case 'F5':
				case 'F6':
				case 'F7':
				case 'F8':
				case 'F9':
				case 'F10':
				case 'F11':
				case 'F12':
				case 'Dead':
					// case 'Backspace':
					break;

				case 'Backspace':
					if ($correctInput) {
						const char = $correctInput.slice(-1);
						correctInput.update((prev) => prev.slice(0, -1));
						snippetArr = [char, ...snippetArr];
						totalKeypresses.update((nr) => (nr += 1));
						correctKeypresses.update((nr) => (nr -= 1));
						setNextKey();
						if (char === '\n') {
							enterCount.update((nr) => (nr -= 1));
						}
						if ($correctInput.length === 0) {
							reset();
						}
					}
					break;

				case 'Enter':
					if (snippetArr[0] === '\n') {
						enterCount.update((nr) => (nr += 1));
						handleCorrectInput();
					} else {
						handleIncorrectInput(' ');
					}
					break;

				case 'Tab':
					if (snippetArr[0] === '\t') {
						handleCorrectInput();
					} else {
						handleIncorrectInput(' ');
					}
					break;

				case ' ':
					if (snippetArr[0] === ' ') {
						handleCorrectInput();
					} else {
						handleIncorrectInput(' ');
					}
					break;

				default:
					if (snippetArr[0] === event.key) {
						handleCorrectInput();
					} else {
						handleIncorrectInput(event.key);
					}
			}
		} else if ($typingMode && $activeError) {
			event.preventDefault();
			switch (event.key) {
				case 'Escape':
				case 'CapsLock':
				case 'Shift':
				case 'Control':
				case 'Alt':
				case 'Meta':
				case 'ArrowLeft':
				case 'ArrowRight':
				case 'ArrowUp':
				case 'ArrowDown':
				case 'F1':
				case 'F2':
				case 'F3':
				case 'F4':
				case 'F5':
				case 'F6':
				case 'F7':
				case 'F8':
				case 'F9':
				case 'F10':
				case 'F11':
				case 'F12':
				case 'Dead':
					break;
				case 'Backspace':
					incorrectInput.update((prev) => prev.slice(0, -1));
					if (!$incorrectInput) {
						activeError.set(false);
						setNextKey();
					}
					break;
				case 'Enter':
					incorrectInput.update((prev) => (prev += ' '));
					updateIncorrectKeypresses();
					break;

				case 'Tab':
					incorrectInput.update((prev) => (prev += ' '));
					updateIncorrectKeypresses();
					break;

				case ' ':
					incorrectInput.update((prev) => (prev += ' '));
					updateIncorrectKeypresses();
					break;

				default:
					incorrectInput.update((prev) => (prev += event.key));
					updateIncorrectKeypresses();
			}
		}
	}

	function reset() {
		if ($typingMode) {
			timerRunning.set(false);
			activeError.set(false);
			typingMode.set(true);

			clearInterval(wpmInterval);
			wpmInterval = null;

			correctInput.set('');
			incorrectInput.set('');
			totalKeypresses.set(0);
			correctKeypresses.set(0);
			// incorrectKeypresses = 0;
			enterCount.set(0);

			startTime.set();
			// endTime = undefined;

			wpm = undefined;

			snippetArr = snippet.split('');
			nextKey = snippet[0];
		}
	}

	function start() {
		typingMode.set(!$typingMode);
	}
</script>

<svelte:window on:keydown={handleKeypress} />

<div class="grid-container">
	<h1 class="title"><em>this.</em>Type()</h1>

	<h2 class="acc-label">Accuracy</h2>
	<div class="acc">
		<Accuracy />
	</div>

	<h2 class="wpm-label">WPM</h2>
	<div class="wpm">
		<WordsPerMin {wpm} />
	</div>

	{#if nextKey && $typingMode}
		<h2 class="next-key-label">Next key</h2>
		<div class="next-key"><kbd class="kbd">{nextKey}</kbd></div>
	{/if}
	{#if !$typingMode}
		<h2 class="instruction" on:click={start}>Click to start typing</h2>
	{/if}
	<div class="code-snippet" on:click={start}>
		<CodeSnippet {snippetArr} />
	</div>
	<div class="restart">
		<button class="btn btn-primary" on:click={reset}>reset</button>
	</div>
	<div class="start">
		<button class="btn btn-primary" on:click={getAnother}>get new</button>
	</div>
</div>

<style>
	h1 {
		font-family: 'JetBrains Mono', sans-serif;
		font-weight: 800;
		font-size: 3rem;
		color: #e5c17bff;
		margin-bottom: 2rem;
		margin-top: 2rem;
	}

	h2 {
		font-family: 'IBM Plex Sans', sans-serif;
		font-size: 1rem;
		font-weight: 500;
		align-self: flex-start;
		justify-self: end;
		color: #5e6a82;
	}
	.grid-container {
		max-width: 1280px;
		height: 100vh;
		margin: 0 auto;
		padding: 1rem;
		display: grid;
		grid-template-columns: 2fr 7fr 2fr;
		grid-template-rows: auto auto auto 3.5rem 1fr auto;
		gap: 1rem;
	}

	.title {
		justify-self: flex-start;
		grid-column: 2/3;
	}

	.acc-label {
		grid-column: 1/2;
		grid-row: 3/4;
	}
	.acc {
		/* margin-bottom: 2rem; */
		grid-column: 2/3;
		grid-row: 3/4;
	}
	.wpm-label {
		grid-column: 1/2;
		grid-row: 2/3;
	}
	.wpm {
		grid-column: 2/3;
		grid-row: 2/3;
	}
	.next-key-label {
		grid-column: 1/2;
		grid-row: 4/5;
	}
	.next-key {
		font-size: 1.5em;
		font-weight: 900;
		justify-self: flex-start;
		grid-column: 2/3;
		grid-row: 4/5;
	}
	.code-snippet {
		justify-self: flex-start;
		grid-column: 2/3;
		grid-row: 5/6;
	}
	.code-snippet:hover {
		cursor: pointer;
	}
	.kbd {
		color: #272c35;
		background-color: #5e6a82;
	}
	.hidden {
		visibility: hidden;
	}
	.restart {
		grid-column: 3/4;
		grid-row: 2/3;
	}
	.start {
		grid-column: 3/4;
		grid-row: 3/4;
	}
	.instruction {
		color: #e5c17bff;
		align-self: center;
		justify-self: center;
		grid-column: 2/3;
		grid-row: 4/5;
	}
	.instruction:hover {
		cursor: pointer;
	}
</style>

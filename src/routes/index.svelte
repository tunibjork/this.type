<script>
	import CodeSnippet from '../components/CodeSnippet.svelte';
	import Accuracy from '../components/Accuracy.svelte';
	import WordsPerMin from '../components/WordsPerMin.svelte';

	let correctInput = '';
	let incorrectInput = '';
	let totalKeypresses = 0;
	let correctKeypresses = 0;
	let incorrectKeypresses = 0;
	let enterCount = 0;
	$: accuracy = (correctKeypresses / totalKeypresses) * 100;

	let activeError = false;
	let typingMode = true;
	let timerRunning = false;
	let startTime;
	let endTime;
	let nextKey = code[0];

	let wpm;
	let wpmInterval;

	const code =
		'function twoAdds (num) {\n\treturn function (second_num) {\n\t\treturn num + second_num;\n\t};\n};';
	// const code = 'function {\n\treturn;\n}';

	let codeArr = code.split('');

	function startTimer() {
		startTime = Date.now();
		timerRunning = true;
		wpmInterval = setInterval(calculateWpm, 3000);
	}

	function getElapsedMinutes(startTime, endTime) {
		return (endTime - startTime) / 1000 / 60;
	}

	function calculateWpm() {
		const minutes = getElapsedMinutes(startTime, Date.now());
		wpm = correctKeypresses / 5 / minutes;
		console.log(wpm.toFixed(2));
	}

	function handleCorrectInput() {
		if (!timerRunning) {
			startTimer();
		}
		const char = codeArr.shift();
		correctInput += char;
		codeArr = codeArr;
		if (!codeArr.length) {
			typingMode = false;
			timerRunning = false;
			endTime = Date.now();
			clearInterval(wpmInterval);
			wpmInterval = null;
		}
		updateCorrectKeypresses();
		setNextKey();
		if (correctInput.length > 2) {
			calculateWpm();
		}
	}

	function handleIncorrectInput(char) {
		if (timerRunning) {
			activeError = true;
			incorrectInput += char;
			updateIncorrectKeypresses();
			setNextKey();
		}
	}

	function updateIncorrectKeypresses() {
		totalKeypresses += 1;
		incorrectKeypresses += 1;
	}

	function updateCorrectKeypresses() {
		totalKeypresses += 1;
		correctKeypresses += 1;
	}

	function setNextKey() {
		if (incorrectInput) {
			nextKey = 'Backspace';
		} else if (codeArr[0] === '\n') {
			nextKey = 'Enter';
		} else if (codeArr[0] === '\t') {
			nextKey = 'Tab';
		} else if (codeArr[0] === ' ') {
			nextKey = 'Space';
		} else {
			nextKey = codeArr[0];
		}
		return nextKey;
	}

	function handleKeypress(event) {
		if (typingMode && !activeError) {
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
				case 'Backspace':
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

				case 'Enter':
					if (codeArr[0] === '\n') {
						enterCount += 1;
						handleCorrectInput();
					} else {
						handleIncorrectInput(' ');
					}
					break;

				case 'Tab':
					if (codeArr[0] === '\t') {
						handleCorrectInput();
					} else {
						handleIncorrectInput(' ');
					}
					break;

				case ' ':
					if (codeArr[0] === ' ') {
						handleCorrectInput();
					} else {
						handleIncorrectInput(' ');
					}
					break;

				default:
					if (codeArr[0] === event.key) {
						handleCorrectInput();
					} else {
						handleIncorrectInput(event.key);
					}
			}
		} else if (typingMode && activeError) {
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
					incorrectInput = incorrectInput.slice(0, -1);
					if (!incorrectInput) {
						activeError = false;
						setNextKey();
					}
					break;
				case 'Enter':
					incorrectInput += ' ';
					updateIncorrectKeypresses();
					break;

				case 'Tab':
					incorrectInput += ' ';
					updateIncorrectKeypresses();
					break;

				case ' ':
					incorrectInput += ' ';
					updateIncorrectKeypresses();
					break;

				default:
					incorrectInput += event.key;
					updateIncorrectKeypresses();
			}
		}
	}
</script>

<svelte:window on:keydown|preventDefault={handleKeypress} />

<div class="grid-container">
	<h1 class="title">Type It!</h1>

	<h2 class="acc-label">Accuracy</h2>
	<div class="acc">
		<Accuracy {accuracy} />
	</div>

	<h2 class="wpm-label">WPM</h2>
	<div class="wpm">
		<WordsPerMin {wpm} />
	</div>

	{#if nextKey && typingMode}
		<h2 class="next-key-label">Next key</h2>
		<div class="next-key"><kbd class="kbd">{nextKey}</kbd></div>
	{/if}
	<div class="code-snippet">
		<CodeSnippet {correctInput} {incorrectInput} {codeArr} {typingMode} {enterCount} />
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
		grid-column: 2/4;
		grid-row: 5/6;
	}
	.kbd {
		color: #272c35;
		background-color: #5e6a82;
	}
	.hidden {
		visibility: hidden;
	}
</style>

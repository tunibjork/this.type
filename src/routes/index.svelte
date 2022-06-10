<script>
	let correctInput = '';
	let incorrectInput = '';
	// let allInput = '';
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
	$: elapsedMinutes = (endTime - startTime) / 1000 / 60;
	let nextKey = code[0];

	// $: wpm = correctKeypresses / 5 / elapsedMinutes;
	let wpm;
	let wpmInterval;
	// const code =
	// 	'function twoAdds (num) {\n\treturn function (second_num) {\n\t\treturn num + second_num;\n\t};\n};';
	const code = 'function {\n\treturn;\n}';

	let codeArr = code.split('');

	function getElapsedMinutes(startTime, endTime) {
		return (endTime - startTime) / 1000 / 60;
	}

	function calculateWpm() {
		const minutes = getElapsedMinutes(startTime, Date.now());
		wpm = correctKeypresses / 5 / minutes;
	}

	function handleCorrectInput() {
		if (!timerRunning) {
			startTime = Date.now();
			timerRunning = true;
			wpmInterval = setInterval(calculateWpm, 2000);
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
		calculateWpm();
	}

	function handleIncorrectInput(pressedKey) {
		activeError = true;
		incorrectInput += pressedKey;
		updateIncorrectKeypresses();
		setNextKey();
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

				default:
					if (codeArr[0] === event.key) {
						handleCorrectInput();
					} else {
						handleIncorrectInput(event.key);
					}
			}
		} else if (typingMode && activeError) {
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

				default:
					incorrectInput += event.key;
					updateIncorrectKeypresses();
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeypress} />

<!-- <h1 class="text-3xl">Type It!</h1> -->
<!-- <pre class="bottom">{code}</pre> -->

<pre class="bottom">
{correctInput}{incorrectInput}{codeArr.join('')}
</pre>
<pre class="top"><span class="correct"
		>{correctInput}<span class="incorrect">{incorrectInput}</span></span
	><span style="top: {enterCount * 1.5}em" class="caret" /></pre>

<!-- <div>All Input: {allInput}</div> -->
<!-- <div>All Input Length: {allInput.length}</div> -->
<!-- <div>Correct Input: {correctInput}</div> -->
<!-- <div>Incorrect Input: {incorrectInput}</div>
<!-- <div>Incorrect Input Length: {incorrectInput.length}</div> -->
<div>Total Keypresses: {totalKeypresses}</div>
<div>Correct Keypresses: {correctKeypresses}</div>
<div>Incorrect Keypresses: {incorrectKeypresses}</div>
<!-- <div>{codeArr.length}</div> -->
<!-- <div>Enter count: {enterCount}</div> -->

<div>
	Accuracy: {accuracy ? `${Math.round(accuracy)} %` : `0 %`}
</div>
{#if nextKey}
	<div>Next key: <kbd>{nextKey}</kbd></div>
{/if}

<div>Start time: {startTime}</div>
<div>End time: {endTime}</div>
<div>Elapsed seconds: {elapsedMinutes * 60}</div>
<div>WPM: {!wpm || wpm === Infinity ? 0 : Math.round(wpm)}</div>

<style>
	.bottom {
		/* background-color: #272c35; */
		color: rgb(192, 192, 192);
		position: relative;
	}

	.top {
		position: absolute;
		top: 0;
		color: rgb(177, 69, 69);
	}
	.caret {
		animation: blinkCaret 1.3s;
		animation-iteration-count: infinite;
		position: absolute;
		/* right: -0.1em; */
		width: 0.1em;
		height: 1.5em;
		background-color: rgb(72, 115, 215);
	}

	pre {
		margin: 20px;
		line-height: 1.5em;
		font-family: Courier, monospace;
		font-weight: 600;
		font-size: larger;
		letter-spacing: 0.05em;
	}

	kbd {
		background-color: #eee;
		border-radius: 4px;
		font-size: 1rem;
		padding: 0.2em 0.5em;
		border-top: 5px solid rgba(255, 255, 255, 0.5);
		border-left: 5px solid rgba(255, 255, 255, 0.5);
		border-right: 5px solid rgba(0, 0, 0, 0.2);
		border-bottom: 5px solid rgba(0, 0, 0, 0.2);
		color: #555;
	}

	.incorrect {
		color: rgb(255, 100, 100);
		background-color: rgb(255, 200, 200);
	}

	.correct {
		color: rgb(88, 88, 88);
		/* background-color: rgb(183, 255,  */
	}

	@keyframes blinkCaret {
		from {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>

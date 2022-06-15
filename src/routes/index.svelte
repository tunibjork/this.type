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
		typingMode,
		activeError,
		finished,
		timerRunning,
		startTime,
		codeSnippets
		// wpmInterval
		// wpm
		// snippet
		// snippetArr,
		// nextKey
	} from '../stores';

	let wpmInterval;
	let wpm;

	let snippet;
	let nextKey;
	let snippetArr;

	init();

	function init() {
		const random = Math.floor(Math.random() * $codeSnippets.length);
		snippet = $codeSnippets[random];
		// snippet = `function deleteDuplicates (arr) {\n\treturn [...new Set(arr)];\n};`;
		nextKey = snippet[0];
		snippetArr = snippet.split('');
	}

	function startTyping() {
		if (!$finished) {
			typingMode.set(true);
		}
	}

	function reset() {
		correctInput.set('');
		incorrectInput.set('');
		totalKeypresses.set(0);
		correctKeypresses.set(0);
		enterCount.set(0);
		typingMode.set(false);
		activeError.set(false);
		finished.set(false);
		startTime.set();
		stopTimer();
		wpm = undefined;
	}

	function resetCurrentSnippet() {
		if ($typingMode || $finished) {
			reset();
			snippetArr = snippet.split('');
			nextKey = snippet[0];
			typingMode.set(true);
			finished.set(false);
		}
	}

	function getNewSnippet() {
		reset();
		init();
		typingMode.set(false);
	}

	function startTimer() {
		startTime.set(Date.now());
		wpmInterval = setInterval(calculateWpm, 1000);
		timerRunning.set(true);
	}

	function stopTimer() {
		clearInterval(wpmInterval);
		wpmInterval = null;
		timerRunning.set(false);
	}

	function calculateWpm() {
		const elapsedMinutes = (Date.now() - $startTime) / 1000 / 60;
		wpm = $correctKeypresses / 5 / elapsedMinutes;
	}

	function handleKeypress(event) {
		console.log(event);
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
							typingMode.set(true);
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
					event.preventDefault();
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
			// event.preventDefault();
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
					event.preventDefault();

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

	function handleCorrectInput() {
		if (!$timerRunning) {
			startTimer();
		}
		const char = snippetArr.shift();
		correctInput.update((prev) => (prev += char));
		snippetArr = snippetArr;
		if (!snippetArr.length) {
			typingMode.set(false);
			finished.set(true);
			stopTimer();
		}
		updateCorrectKeypresses();
		setNextKey();
		if ($correctInput.length > 4) {
			calculateWpm();
		}
	}

	function updateCorrectKeypresses() {
		totalKeypresses.update((nr) => (nr += 1));
		correctKeypresses.update((nr) => (nr += 1));
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
	}

	function setNextKey() {
		if ($incorrectInput) {
			nextKey = 'Backspace';
		} else if (snippetArr[0] === '\n') {
			nextKey = 'Enter';
		} else if (snippetArr[0] === undefined) {
			nextKey = '';
		} else if (snippetArr[0] === '\t') {
			nextKey = 'Tab';
		} else if (snippetArr[0] === ' ') {
			nextKey = 'Space';
		} else {
			nextKey = snippetArr[0];
		}
		return nextKey;
	}
</script>

<svelte:window on:keydown={handleKeypress} />

<div class="grid-container">
	<h1 class="title"><em>this</em>.Type()</h1>
	<!-- <h2 class="wpm-label"><em>this</em>.wpm()</h2> -->
	<h2 class="wpm-label {$typingMode ? '' : 'yellow'}">WPM</h2>
	<div class="wpm">
		<WordsPerMin {wpm} />
	</div>
	<div class="reset">
		<button
			class="btn btn-square no-animation {$typingMode ? '' : 'btn-primary'}"
			on:click={resetCurrentSnippet}><span class="material-symbols-rounded"> undo </span></button
		>
	</div>
	<!-- <h2 class="reset-label"><em>this</em>.reset()</h2> -->
	<h2 class="reset-label {$typingMode ? '' : 'yellow'}">RESET</h2>
	<!-- <h2 class="acc-label"><em>this</em>.accuracy()</h2> -->
	<h2 class="acc-label {$typingMode ? '' : 'yellow'}">ACCURACY</h2>
	<div class="acc">
		<Accuracy />
	</div>
	<div class="new">
		<button
			class="btn btn-square no-animation {$typingMode ? '' : 'btn-primary'}"
			on:click={getNewSnippet}><span class="material-symbols-rounded"> sync </span></button
		>
	</div>
	<!-- <h2 class="new-label"><em>this</em>.new()</h2> -->
	<h2 class="new-label {$typingMode ? '' : 'yellow'}">NEW</h2>
	{#if nextKey && $typingMode}
		<div class="next-key-group">
			<!-- <h2 class="next-key-label"><em>this</em>.nextKey()</h2> -->
			<h2 class="next-key-label">NEXT KEY</h2>
			<div class="next-key"><kbd class="kbd">{nextKey}</kbd></div>
		</div>
	{/if}
	{#if !$typingMode && !$finished}
		<h2 class="instruction" on:click={startTyping}>click to start typing</h2>
	{/if}
	<div class="code-snippet" on:click={startTyping}>
		<CodeSnippet {snippetArr} />
	</div>
</div>

<style>
	h1 {
		font-family: 'JetBrains Mono', monospace;
		font-weight: 800;
		font-size: 3rem;
		letter-spacing: -0.1rem;
		color: #e5c17bff;
	}

	h2 {
		/* font-family: 'IBM Plex Sans', sans-serif; */
		font-family: 'JetBrains Mono', monospace;
		font-size: 1rem;
		font-weight: 600;
		/* letter-spacing: 0.05rem; */
		color: #abb2bf;
	}
	.grid-container {
		max-width: 1280px;
		height: 100vh;
		margin: 0 auto;
		padding: 1rem;
		display: grid;
		grid-template-columns: 2fr 5fr 3fr 5fr 2fr;
		grid-template-rows: auto 3rem 3em 7rem 1fr auto;
		gap: 1rem;
	}

	.title {
		margin-bottom: 3rem;
		margin-top: 6rem;
		justify-self: center;
		align-self: center;
		grid-column: 2/5;
		grid-row: 1/2;
	}

	.acc-label {
		align-self: center;
		justify-self: flex-end;
		grid-column: 2/3;
		grid-row: 3/4;
	}
	.acc {
		align-self: center;
		justify-self: flex-start;
		grid-column: 3/4;
		grid-row: 3/4;
	}
	.wpm-label {
		align-self: center;
		justify-self: flex-end;
		grid-column: 2/3;
		grid-row: 2/3;
	}
	.wpm {
		align-self: center;
		justify-self: flex-start;
		grid-column: 3/4;
		grid-row: 2/3;
	}
	.next-key-label {
		/* font-size: 1.2em; */
		/* justify-self: center; */
		align-self: center;
	}
	.next-key {
		font-size: 1.5em;
		font-weight: 900;
		align-self: center;
		/* justify-self: center; */
	}
	.code-snippet {
		/* display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center; */
		grid-column: 2/5;
		grid-row: 5/6;
	}
	.code-snippet:hover {
		cursor: pointer;
	}
	.kbd {
		color: #272c35;
		background-color: #abb2bf;
	}

	.reset {
		align-self: center;
		justify-self: flex-end;
		grid-column: 3/4;
		grid-row: 2/3;
	}
	.new {
		align-self: center;
		justify-self: flex-end;
		grid-column: 3/4;
		grid-row: 3/4;
	}
	.instruction {
		font-size: 1.5rem;
		color: #e5c17bff;
		align-self: center;
		justify-self: center;
		grid-column: 2/5;
		grid-row: 4/5;
	}
	.instruction:hover {
		cursor: pointer;
	}

	.reset-label {
		align-self: center;
		justify-self: flex-start;
		grid-column: 4/5;
		grid-row: 2/3;
	}
	.new-label {
		align-self: center;
		justify-self: flex-start;
		grid-column: 4/5;
		grid-row: 3/4;
	}

	.next-key-group {
		display: flex;
		flex-direction: column;
		align-self: center;
		gap: 0.7rem;
		grid-column: 3/4;
		grid-row: 4/5;
	}

	.yellow {
		color: #e5c17bff;
	}
</style>

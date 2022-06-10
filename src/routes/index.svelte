<script>
	let correctInput = '';
	let incorrectInput = '';
	let allInput = '';
	let totalKeypresses = 0;
	let correctKeypresses = 0;
	let incorrectKeypresses = 0;
	let enterCount = 0;
	$: accuracy = (correctKeypresses / totalKeypresses) * 100;

	let activeError = false;
	let typingMode = true;

	const code =
		'function twoAdds (num) {\n\treturn function (second_num) {\n\t\treturn num + second_num;\n\t};\n};';
	// const code = 'function {\n\treturn;\n}';

	let codeArr = code.split('');

	function handleCorrectInput() {
		const char = codeArr.shift();
		correctInput += char;
		codeArr = codeArr;
		if (!codeArr.length) {
			typingMode = false;
		}
		updateCorrectKeypresses();
	}

	function handleIncorrectInput(pressedKey) {
		activeError = true;
		incorrectInput += pressedKey;
		updateIncorrectKeypresses();
	}

	function updateIncorrectKeypresses() {
		totalKeypresses += 1;
		incorrectKeypresses += 1;
	}

	function updateCorrectKeypresses() {
		totalKeypresses += 1;
		correctKeypresses += 1;
	}

	function handleKeypress(event) {
		console.log(accuracy);
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
<pre class="bottom">{correctInput}{incorrectInput}{codeArr.join('')}</pre>
<pre class="top"><span class="correct"
		>{correctInput}<span class="incorrect">{incorrectInput}</span></span
	><span style="top: {enterCount * 1.5}em" class="caret" /></pre>

<div>All Input: {allInput}</div>
<div>All Input Length: {allInput.length}</div>
<div>Correct Input: {correctInput}</div>
<div>
	Incorrect Input: <pre>{incorrectInput}</pre>
</div>
<div>Incorrect Input Length: {incorrectInput.length}</div>
<div>Correct Keypresses: {correctKeypresses}</div>
<div>Incorrect Keypresses: {incorrectKeypresses}</div>
<div>Total Keypresses: {totalKeypresses}</div>
<div>Next key: <kbd>{incorrectInput ? 'Backspace' : codeArr[0]}</kbd></div>
<div>{codeArr.length}</div>
<div>Enter count: {enterCount}</div>

<div>
	Accuracy: {accuracy ? `${Math.round(accuracy)} %` : `0 %`}
</div>

<style>
	.bottom {
		color: lightgray;
		position: relative;
	}

	.top {
		position: absolute;
		top: 0;
		color: #555;
	}
	.caret {
		/* transition: 0.3s; */
		position: absolute;
		/* top: 1.2em; */
		width: 0.1em;
		height: 1.5em;
		background-color: #555;
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
		/* color: rgb(89, 164, 46); */
		/* background-color: rgb(183, 255, 164); */
	}
</style>

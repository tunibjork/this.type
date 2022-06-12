<script>
	export let correctInput;
	export let incorrectInput;
	export let codeArr;
	export let typingMode;
	export let enterCount;
</script>

<code>
	<pre class="bottom">{correctInput}{incorrectInput}{codeArr.join('')}</pre>
</code>
<code>
	<pre class="top"><span class="correct"
			>{correctInput}<span class="incorrect">{incorrectInput}</span></span
		>{#if typingMode}<span style="top: {enterCount * 1.5}em" class="caret" />{/if}</pre>
</code>

<style>
	pre {
		position: absolute;
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.5em;
		font-weight: 600;
		line-height: 2.25rem;
		letter-spacing: 0.05rem;
	}

	.bottom {
		color: #5e6a82;
		/* position: absolute; */
	}

	/* .top {
		position: absolute;
	} */

	.correct {
		color: #d0d8e9;
	}

	.incorrect {
		color: #e06c75ff;
		background-color: rgb(255, 210, 214);
	}

	.caret {
		position: absolute;
		width: 0.1em;
		height: 1.5em;
		background-color: #61afefff;
		animation: blinkCaret 1.3s;
		animation-iteration-count: infinite;
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

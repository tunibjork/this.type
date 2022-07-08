<script>
	export let snippetArr;
	import { correctInput, incorrectInput, enterCount, typingMode } from '../stores';
</script>

<div class="container">
	<pre class="bottom">{$correctInput}{$incorrectInput}{#if snippetArr}{snippetArr.join('')}{/if}<pre
			class="top"><span class="correct"
				>{$correctInput}<span class="incorrect">{$incorrectInput}</span></span
			>{#if $typingMode}<span style="top: {$enterCount * 1.5}em" class="caret" />{/if}</pre></pre>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		overflow: scroll;
	}
	pre {
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 2.25rem;
		letter-spacing: 0.05rem;
	}

	.bottom {
		position: relative;
		color: #5e6a82;
	}

	.top {
		position: absolute;
		left: 0;
		top: 0;
	}

	.correct {
		color: #d0d8e9;
	}

	.incorrect {
		color: #e06c75ff;
		background-color: #ffc1c6;
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

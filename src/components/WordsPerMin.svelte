<script>
	import { typingMode, finished } from '../stores';
	// import { wpm } from '../stores';
	export let wpm;
</script>

<h1 class={$typingMode ? '' : 'yellow'}>
	{!wpm || wpm === Infinity ? '0' : Math.round(wpm)}
</h1>

<style>
	h1 {
		font-family: 'JetBrains Mono', monospace;
		font-size: 2.5rem;
		line-height: 2.5rem;
		font-weight: bold;
		color: #abb2bf;
	}
	.yellow {
		color: #e5c17bff;
	}
</style>

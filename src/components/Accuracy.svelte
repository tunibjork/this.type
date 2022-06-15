<script>
	import { accuracy, typingMode } from '../stores';
</script>

<h1 class={$typingMode ? '' : 'yellow'}>
	{$accuracy ? `${Math.round($accuracy)}` : `0`}<span>{$accuracy ? '%' : ''}</span>
</h1>

<style>
	h1 {
		font-family: 'JetBrains Mono', monospace;
		font-size: 2.5rem;
		line-height: 2.5rem;
		font-weight: bold;
		color: #abb2bf;
	}
	span {
		font-size: 2rem;
		margin-left: 0.4rem;
	}
	.yellow {
		color: #e5c17bff;
	}
</style>

<script>
	export let wpm;
</script>

<h1>{!wpm || wpm === Infinity ? '0' : Math.round(wpm)}</h1>

<style>
	h1 {
		font-family: 'JetBrains Mono', monospace;
		font-size: 2.5rem;
		line-height: 2.5rem;
		font-weight: bold;
		color: #5e6a82;
	}
</style>

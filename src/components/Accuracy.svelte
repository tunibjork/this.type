<script>
	export let accuracy;
</script>

<h1>{accuracy ? `${Math.round(accuracy)}` : `0`}<span>{accuracy ? '%' : ''}</span></h1>

<style>
	h1 {
		font-family: 'JetBrains Mono', monospace;
		font-size: 2.5rem;
		line-height: 2.5rem;
		font-weight: bold;
		color: #5e6a82;
	}
	span {
		font-size: 2rem;
		margin-left: 0.4rem;
	}
</style>

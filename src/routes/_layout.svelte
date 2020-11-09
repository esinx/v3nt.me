<style lang="scss">
	.root {
		display: block;
		width: 100vw;
		max-width: 500px;
		margin: 20px auto;
		padding: 20px;
		.title {
			font-size: 15px;
		}
		.subtitle {
			font-size: 12px;
		}
	}
</style>

<div class="root">
	<div class="title">v3nt.me</div>
	<div class="subtitle">for all your venting needs</div>
	<slot />
</div>

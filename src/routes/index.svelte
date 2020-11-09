<script context="module">
	export async function preload(page, session) {
		const res = await this.fetch("/data/vents");
		const vents = await res.json();
		return { vents };
	}
</script>

<script>
	import { onMount } from "svelte";

	let socket = null;
	export let vents = [];
	let venttext = "";

	const refreshVent = async () => {
		const res = await fetch("/data/vents");
		vents = await res.json();
	};

	onMount(async () => {
		// client only script
		socket = io();
		socket.on("refresh", () => {
			refreshVent();
		});
	});

	const sendVent = async (vent) => {
		const res = await fetch("/data/vents", {
			method: "POST",
			body: JSON.stringify({ vent }),
			headers: {
				"content-type": "application/json",
			},
		});
		if (Math.floor(res.status / 100) != 2) {
			throw new Error("Failed to vent. You can vent about this.");
		} else {
			socket.emit("refresh");
		}
	};

	const padtwo = (num) => (String(num).length >= 2 ? String(num) : "0" + num);

	const formatTime = (datestring) => {
		const date = new Date(datestring);
		return `${date.getFullYear()}.${padtwo(date.getMonth() + 1)}.${padtwo(
			date.getDate()
		)} - ${padtwo(date.getHours() % 12)}:${padtwo(date.getMinutes())}:${padtwo(
			date.getSeconds()
		)} ${date.getHours() >= 12 ? "PM" : "AM"}`;
	};
</script>

<style lang="scss">
	textarea {
		width: 100%;
		display: block;
		font-family: inherit;
		font-size: 12px;
		line-height: 20px;
		margin: 5px auto;
		padding: 5px 10px;
		border: solid #000 1px;
		resize: none;
		outline: none;
	}
	.button {
		text-align: center;
		font-size: 12px;
		color: #fff;
		background: #000;
		margin: 5px auto;
		padding: 5px 10px;
	}
	.vents {
		.vent {
			padding: 10px 0;
			font-size: 12px;
			&:not(:last-child) {
				border-bottom: dotted #ccc 1px;
			}
			.meta {
				color: #777;
			}
		}
	}
	:global(:target) {
		background: #efefef;
	}
</style>

<div class="vents">
	{#each vents as { vent, id, date }}
		<div class="vent" id={`vent-${id}`}>
			<div class="meta"><a href={`/#vent-${id}`}>#{id} • {formatTime(date)}</a></div>
			<div class="content">{vent}</div>
		</div>
	{/each}
</div>
<textarea
	bind:value={venttext}
	on:keydown={(e) => {
		if ((e.ctrlKey || e.metaKey) && e.key == 'Enter') {
			if (venttext && venttext.length > 0) sendVent(venttext);
			venttext = '';
		}
	}} />
<div
	class="button"
	on:click={() => {
		if (venttext && venttext.length > 0) sendVent(venttext);
		venttext = '';
	}}>
	vent
</div>

<a href="/about">what the fuck is this?</a>

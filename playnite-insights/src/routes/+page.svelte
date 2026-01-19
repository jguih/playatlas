<script lang="ts">
	import Dashboard from "$lib/client/components/bottom-nav/Dashboard.svelte";
	import Home from "$lib/client/components/bottom-nav/Home.svelte";
	import Settings from "$lib/client/components/bottom-nav/Settings.svelte";
	import BottomNav from "$lib/client/components/BottomNav.svelte";
	import Header from "$lib/client/components/header/Header.svelte";
	import BaseAppLayout from "$lib/client/components/layout/BaseAppLayout.svelte";
	import Main from "$lib/client/components/Main.svelte";
</script>

<BaseAppLayout>
	<Header></Header>
	<Main></Main>

	<BottomNav>
		<Home selected={true} />
		<Dashboard />
		<Settings />
	</BottomNav>
</BaseAppLayout>

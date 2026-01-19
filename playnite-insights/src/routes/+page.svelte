<script lang="ts">
	import Dashboard from "$lib/ui/components/bottom-nav/Dashboard.svelte";
	import Home from "$lib/ui/components/bottom-nav/Home.svelte";
	import Settings from "$lib/ui/components/bottom-nav/Settings.svelte";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import BaseAppLayout from "$lib/ui/components/layout/BaseAppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
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

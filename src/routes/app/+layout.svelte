<script lang="ts">
	// State and utility imports
	import { userState } from '$lib/stores/userStore.svelte';
	import { addBodyClass, removeBodyClass } from '$lib/utils/bodyClassUpdater';
    
	// Type imports
	import type { PageData } from './$types';
	import type { Snippet } from 'svelte';

	// Component props
	type Props = {
		data: PageData;
		children: Snippet;
	};

	let { data, children }: Props = $props();

	// Sync user profile from server data to state
	$effect(() => {
		userState.profile = data.userProfile || null;
	});

	// Add 'logged-in' body class when component mounts, remove on unmount
	$effect(() => {
		addBodyClass('logged-in');
		return () => {
			removeBodyClass('logged-in');
		};
	});
</script>

<!-- Render child route content -->
<div class="flex flex-col p-3 lg:p-8 max-w-3xl mx-auto">
    {@render children()}
</div>



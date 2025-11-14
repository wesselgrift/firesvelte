<script lang="ts">
	// Stores and utilities
	import { userProfile as userProfileStore } from '$lib/stores/userStore';
	import { addBodyClass, removeBodyClass } from '$lib/utils/bodyClassUpdater';
	import type { PageData } from './$types';
	import type { Snippet } from 'svelte';

	// Component props
	type Props = {
		data: PageData;
		children: Snippet;
	};

	let { data, children }: Props = $props();

	// Sync userProfile store with server data
	$effect(() => {
		userProfileStore.set(data.userProfile || null);
	});

	// Add logged-in class to body when layout is active
	$effect(() => {
		addBodyClass('logged-in');
		return () => {
			removeBodyClass('logged-in');
		};
	});
</script>

<!-- Render child routes -->
{@render children()}



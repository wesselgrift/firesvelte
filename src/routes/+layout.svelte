<script lang="ts">
	// Global styles and Svelte lifecycle
	import '../app.css';
	import { onMount } from 'svelte';
	// Firebase auth initialization and user state
	import { initializeAuth } from '$lib/firebase/auth';
	import { userState } from '$lib/stores/userStore.svelte';
	import type { User } from 'firebase/auth';

	// Layout children slot
	let { children } = $props();

	// Auth state unsubscribe function
	let unsubscribe: (() => void) | null = null;

	// Initialize Firebase auth on mount and clean up on unmount
	onMount(() => {
		unsubscribe = initializeAuth(
			(user: User | null) => {},
			(isLoading: boolean) => {
				userState.loading = isLoading;
			}
		);

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});
</script>

<!-- Render child routes -->
{@render children()}

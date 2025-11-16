<script lang="ts">
	// Root layout component - wraps all pages in the app
	import '../app.css';
	import { onMount } from 'svelte';
	import { initializeAuth } from '$lib/firebase/auth';
	import { loading } from '$lib/stores/userStore';
	import type { User } from 'firebase/auth';

	// Get the child components/pages to render
	let { children } = $props();

	// Store the unsubscribe function so we can clean it up later
	let unsubscribe: (() => void) | null = null;

	// Run this code when the component mounts (loads)
	onMount(() => {
		// Set up Firebase auth state listener
		// This watches for changes in user authentication status
		unsubscribe = initializeAuth(
			// Callback when user state changes (login/logout)
			(user: User | null) => {
				// User state is handled by auth functions
			},
			// Callback when loading state changes
			// initializeAuth calls this with true/false to indicate if auth is still loading
			(isLoading: boolean) => {
				// Update the global loading store so other components know auth status
				loading.set(isLoading);
			}
		);

		// Cleanup function - runs when component is destroyed
		// This prevents memory leaks by unsubscribing from the auth listener
		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});
</script>

{@render children()}

<script lang="ts">
	// Global styles and Svelte lifecycle
	import '../app.css';
	import { onMount } from 'svelte';
	// Firebase auth initialization and user store
	import { initializeAuth } from '$lib/firebase/auth';
	import { loading } from '$lib/stores/userStore';
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
				loading.set(isLoading);
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

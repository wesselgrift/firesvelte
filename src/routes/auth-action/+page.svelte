<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Spinner } from '$lib/components/ui/spinner';

	// Extract parameters from URL
	const mode = $derived(page.url.searchParams.get('mode'));
	const oobCode = $derived(page.url.searchParams.get('oobCode'));

	let processing = $state(true);
	let error = $state('');

	// Handle Firebase redirect - extract parameters from URL if coming from Firebase's handler
	onMount(() => {
		if (typeof window === 'undefined') return;

		const urlParams = page.url.searchParams;
		let finalMode = urlParams.get('mode');
		let finalOobCode = urlParams.get('oobCode');

		// If parameters are missing, check if they're in the hash (Firebase sometimes uses hash)
		if (!finalOobCode || !finalMode) {
			const hash = window.location.hash;
			if (hash && hash.includes('oobCode')) {
				const hashParams = new URLSearchParams(hash.substring(1));
				const hashOobCode = hashParams.get('oobCode');
				const hashMode = hashParams.get('mode');
				if (hashOobCode && hashMode) {
					finalMode = hashMode;
					finalOobCode = hashOobCode;
					// Redirect with proper query parameters
					const newUrl = new URL(window.location.href);
					newUrl.searchParams.set('mode', hashMode);
					newUrl.searchParams.set('oobCode', hashOobCode);
					newUrl.hash = '';
					goto(newUrl.pathname + newUrl.search, { replaceState: true });
					return;
				}
			}
		}

		// Route based on mode
		if (!finalMode || !finalOobCode) {
			error = 'Invalid or missing action link.';
			processing = false;
			setTimeout(() => goto('/login'), 3000);
			return;
		}

		// Create query params string to pass along
		const queryParams = new URLSearchParams({
			mode: finalMode,
			oobCode: finalOobCode
		});

		// Add other query params that might be present
		for (const [key, value] of urlParams.entries()) {
			if (key !== 'mode' && key !== 'oobCode') {
				queryParams.set(key, value);
			}
		}

		const queryString = queryParams.toString();

		// Route based on mode
		if (finalMode === 'resetPassword') {
			// Redirect to password reset page
			goto(`/set-new-password?${queryString}`, { replaceState: true });
		} else if (finalMode === 'verifyEmail') {
			// Redirect to email verification handler
			goto(`/verify-email-success?${queryString}`, { replaceState: true });
		} else {
			// Unknown or unsupported mode
			error = `Unsupported action: ${finalMode}`;
			processing = false;
			setTimeout(() => goto('/login'), 3000);
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="flex flex-col items-center gap-4">
		{#if error}
			<div class="text-center">
				<p class="text-destructive mb-4">{error}</p>
				<p class="text-sm text-muted-foreground">Redirecting to login...</p>
			</div>
		{:else}
			<Spinner class="size-8" />
			<p class="text-sm text-muted-foreground">Processing your request...</p>
		{/if}
	</div>
</div>

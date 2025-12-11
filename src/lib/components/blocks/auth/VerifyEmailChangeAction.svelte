<script lang="ts">
	// UI component imports
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { CircleCheck, CircleAlert, LoaderCircle } from '@lucide/svelte';

	// Firebase imports
	import { applyActionCode } from 'firebase/auth';
	import { auth } from '$lib/firebase/firebase';
	import { logout } from '$lib/firebase/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	// Extract oobCode from URL query parameters
	const oobCode = $derived(page.url.searchParams.get('oobCode'));

	// States
	let verified = $state(false);
	let error = $state('');
	let loading = $state(true);
	let codeInvalidatedByFirebase = $state(false);
	let redirecting = $state(false);

	// Check if code is invalid from URL
	const invalidCodeFromUrl = $derived(!oobCode);
	const invalidCode = $derived(invalidCodeFromUrl || codeInvalidatedByFirebase);

	// Verify email change on mount
	$effect(() => {
		if (!oobCode || verified || error) return;

		verifyEmailChange();
	});

	async function verifyEmailChange() {
		if (!oobCode) {
			error = 'Invalid or missing verification link. Please request a new email change.';
			loading = false;
			codeInvalidatedByFirebase = true;
			return;
		}

		loading = true;
		error = '';

		try {
			// Apply the action code to change the email
			await applyActionCode(auth, oobCode);
			verified = true;

			// Email has been changed - user needs to sign in again with new email
			// Sign them out and redirect to login
			setTimeout(() => {
				redirecting = true;
				logout('/login');
			}, 3000);
		} catch (err: any) {
			// Handle specific Firebase errors
			if (err.code === 'auth/invalid-action-code' || err.code === 'auth/expired-action-code') {
				error = 'This verification link has expired or is invalid. Please request a new email change.';
				codeInvalidatedByFirebase = true;
			} else if (err.code === 'auth/user-disabled') {
				error = 'This account has been disabled. Please contact support.';
			} else if (err.code === 'auth/user-not-found') {
				error = 'No account found for this verification link.';
			} else {
				error = err.message || 'Failed to verify email change. Please try again.';
			}
		} finally {
			loading = false;
		}
	}

	function handleContinue() {
		redirecting = true;
		logout('/login');
	}
</script>

{#if invalidCode}
	<Alert variant="destructive">
		<CircleAlert />
		<AlertTitle>Email change failed</AlertTitle>
		<AlertDescription>{error || 'Invalid or missing verification link. Please request a new email change.'}</AlertDescription>
	</Alert>
	<Button onclick={() => goto('/login')}>
		Go to login
	</Button>
{:else if verified}
	<Alert>
		<CircleCheck />
		<AlertTitle>Email changed successfully</AlertTitle>
		<AlertDescription>
			Your email has been updated. Please sign in with your new email address.
		</AlertDescription>
	</Alert>
	<Button onclick={handleContinue} disabled={redirecting}>
		{#if redirecting}
			<Spinner class="size-5" />
			Redirecting to login...
		{:else}
			Go to login
		{/if}
	</Button>
{:else if loading}
	<Alert>
		<LoaderCircle class="animate-spin" />
		<AlertTitle>Verifying your email change</AlertTitle>
		<AlertDescription>
			This may take a few seconds.
		</AlertDescription>
	</Alert>
{:else if error}
	<Alert variant="destructive">
		<CircleAlert />
		<AlertTitle>Email change failed</AlertTitle>
		<AlertDescription>{error}</AlertDescription>
	</Alert>
	<Button onclick={() => goto('/login')}>
		Go to login
	</Button>
{/if}

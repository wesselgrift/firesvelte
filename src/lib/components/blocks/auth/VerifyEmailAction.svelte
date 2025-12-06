<script lang="ts">
	// UI component imports
	import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Spinner } from '$lib/components/ui/spinner';
	import { CircleCheck, CircleAlert } from '@lucide/svelte';

	// Firebase imports
	import { applyActionCode } from 'firebase/auth';
	import { auth } from '$lib/firebase/firebase';
	import { ensureServerSession } from '$lib/firebase/auth';
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

	// Verify email on mount
	$effect(() => {
		if (!oobCode || verified || error) return;

		verifyEmail();
	});

	async function verifyEmail() {
		if (!oobCode) {
			error = 'Invalid or missing verification link. Please request a new verification email.';
			loading = false;
			codeInvalidatedByFirebase = true;
			return;
		}

		loading = true;
		error = '';

		try {
			await applyActionCode(auth, oobCode);
			verified = true;
			
			// Refresh the current user's token to get updated emailVerified status
			// Note: User may not be logged in when verifying email, which is fine
			const user = auth.currentUser;
			if (user) {
				await user.reload();
				await ensureServerSession(user, true);
				// Auto-redirect to app after 3 seconds if logged in
				setTimeout(() => {
					redirecting = true;
					goto('/app');
				}, 3000);
			} else {
				// If not logged in, redirect to login after verification
				setTimeout(() => {
					redirecting = true;
					goto('/login');
				}, 3000);
			}
		} catch (err: any) {
			// Handle specific Firebase errors
			if (err.code === 'auth/invalid-action-code' || err.code === 'auth/expired-action-code') {
				error = 'This verification link has expired or is invalid. Please request a new verification email.';
				codeInvalidatedByFirebase = true;
			} else if (err.code === 'auth/user-disabled') {
				error = 'This account has been disabled. Please contact support.';
			} else if (err.code === 'auth/user-not-found') {
				error = 'No account found for this verification link.';
			} else {
				error = err.message || 'Failed to verify email. Please try again.';
			}
		} finally {
			loading = false;
		}
	}

	function handleContinue() {
		redirecting = true;
		// Redirect to app if logged in, otherwise to login
		const user = auth.currentUser;
		goto(user ? '/app' : '/login');
	}
</script>

{#if invalidCode}
	<Alert variant="destructive">
		<CircleAlert />
		<AlertTitle>Verification failed</AlertTitle>
		<AlertDescription>{error || 'Invalid or missing verification link. Please request a new verification email.'}</AlertDescription>
	</Alert>
{:else if verified}
	<Alert>
		<CircleCheck />
		<AlertTitle>Email verified successfully</AlertTitle>
		<AlertDescription>
			Your email has been verified. {redirecting ? 'Redirecting...' : 'Redirecting you in a moment...'}
		</AlertDescription>
	</Alert>
	<Button onclick={handleContinue} class="w-full" disabled={redirecting}>
		{#if redirecting}
			<Spinner class="size-5" />
			Redirecting...
		{:else}
			Continue
		{/if}
	</Button>
{:else if loading}
	<div class="flex flex-col items-center gap-4 py-8">
		<Spinner class="size-8" />
		<p class="text-sm text-muted-foreground">Verifying your email...</p>
	</div>
{:else if error}
	<Alert variant="destructive">
		<CircleAlert />
		<AlertTitle>Verification failed</AlertTitle>
		<AlertDescription>{error}</AlertDescription>
	</Alert>
{/if}

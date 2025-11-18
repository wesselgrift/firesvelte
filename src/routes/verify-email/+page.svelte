<script lang="ts">
	// Svelte and SvelteKit imports
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	// UI component imports
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Logo } from '$lib/components/ui/logo';
	import { Spinner } from '$lib/components/ui/spinner';
	
	// Firebase imports
	import { auth } from '$lib/firebase/firebase';
	import { sendVerificationEmail, ensureServerSession, logout } from '$lib/firebase/auth';
	import { onAuthStateChanged, type User } from 'firebase/auth';

	// Component state
	let user = $state<User | null>(null);
	let loading = $state(true);
	let sending = $state(false);
	let error = $state('');

	// Monitor auth state and redirect if already verified
	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			user = currentUser;
			loading = false;

			if (currentUser?.emailVerified) {
				handleVerified();
			}
		});

		return unsubscribe;
	});

	// Poll user object every 4 seconds to check if email was verified
	$effect(() => {
		if (!user || user.emailVerified) return;

		const interval = setInterval(async () => {
			await user?.reload();
			if (user?.emailVerified) {
				clearInterval(interval);
				handleVerified();
			}
		}, 4000);

		return () => clearInterval(interval);
	});

	// Redirect to app after successful verification
	async function handleVerified() {
		if (user) {
			await ensureServerSession(user, true);
			goto('/app');
		}
	}

	// Resend verification email to user
	async function handleResend() {
		if (!user) return;

		sending = true;
		error = '';

		try {
			const result = await sendVerificationEmail(user);
			if (result.error) {
				error = result.error;
			}
		} catch (err: any) {
			error = err.message || 'An error occurred';
		} finally {
			sending = false;
		}
	}

	// Logout and redirect to account page to use different email
	async function handleTryAnotherEmail() {
		await logout('/account');
	}
</script>

<!-- Main layout container with split view on large screens -->
<div class="w-full lg:flex lg:h-screen">
	<!-- Left side: verification content -->
	<div class="flex w-full items-start justify-center lg:w-1/2 lg:items-center">
		<div class="w-full max-w-md p-5">
			<!-- Logo header -->
			<div class="mb-[80px] lg:mb-10">
				<Logo />
			</div>
			
			<!-- Error alert display -->
			{#if error}
				<div class="mb-5">
					<Alert variant="destructive">
						<AlertTitle>Whoops</AlertTitle>
						<AlertDescription>
							<p>
								{#if error === "Firebase: Error (auth/too-many-requests)."}
									You've tried too many times, try again in 15 minutes.
								{:else}
									We ran into an unknown problem.
								{/if}
							</p>
						</AlertDescription>
					</Alert>
				</div>
			{/if}
			
			<!-- Page heading -->
			<h2 class="text-color-foreground mb-4 text-2xl font-medium leading-tight">
				Check your email
			</h2>
			
			<!-- Verification instructions and action buttons -->
			<div class="flex flex-col items-start gap-5 mb-25 lg:mb-0">
				<p class="mb-2 text-sm">
					We've sent a verification email to <span class="font-medium">{user?.email}</span>. Please
					check your email and click the link to verify your account.
				</p>

				<div class="flex gap-2">
					<Button variant="outline" size="sm" onclick={handleResend}>
						{#if sending}
							<Spinner class="size-5" />
							Sending email
						{:else}
							Resend email
						{/if}
					</Button>

					<Button variant="ghost" size="sm" onclick={handleTryAnotherEmail}>
						Sign up with another email
					</Button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Right side: background image -->
	<div class="sign-up-img animate-fade-in flex h-[200px] w-full bg-zinc-950 p-8 lg:h-auto lg:w-1/2"></div>
</div>

<style>
	/* Background image styling for right side panel */
	.sign-up-img {
		background-image: url('/abstract-img.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
</style>


<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
    import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert'
    import { Logo } from '$lib/components/ui/logo'
	import { Spinner } from '$lib/components/ui/spinner';
	import { auth } from '$lib/firebase/firebase';
	import { sendVerificationEmail, ensureServerSession, logout } from '$lib/firebase/auth';
	import { goto } from '$app/navigation';
	import { onAuthStateChanged, type User } from 'firebase/auth';

	// State
	let user = $state<User | null>(null);
	let loading = $state(true);
	let sending = $state(false);
	let error = $state('');

	// Initialize auth state listener
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

	// Poll for email verification status every 4 seconds
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

	// Handlers
	async function handleVerified() {
		if (user) {
			// Force token refresh to get updated email_verified status
			await ensureServerSession(user, true);
			goto('/app');
		}
	}

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

	async function handleTryAnotherEmail() {
		await logout('/account');
	}
</script>

<!-- Two-column layout: form on left, image on right -->
<div class="w-full lg:flex lg:h-screen">
	<!-- Left column: verification form -->
	<div class="flex w-full items-start justify-center lg:w-1/2 lg:items-center">
		<div class="w-full max-w-md p-5">
			<!-- Logo -->
			<div class="mb-[80px] lg:mb-10">
				<Logo />
			</div>
			
			<!-- Error message -->
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
			
			<!-- Page title and instructions -->
			<h2 class="text-color-foreground mb-4 text-2xl font-medium leading-tight">
				Check your email
			</h2>
			<div class="flex flex-col items-start gap-5 mb-25 lg:mb-0">
				<p class="mb-2 text-sm">
					We've sent a verification email to <span class="font-medium">{user?.email}</span>. Please
					check your email and click the link to verify your account.
				</p>

				<!-- Action buttons -->
				<div class="flex gap-2">
					<!-- Resend email button with loading/success states -->
					<Button variant="outline" size="sm" onclick={handleResend}>
						{#if sending}
                            <Spinner class="size-5" />
							Sending email
						{:else}
							Resend email
						{/if}
					</Button>

					<!-- Try different email button -->
					<Button variant="ghost" size="sm" onclick={handleTryAnotherEmail}>
						Sign up with another email
					</Button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Right column: decorative image -->
	<div class="sign-up-img animate-fade-in flex h-[200px] w-full bg-zinc-950 p-8 lg:h-auto lg:w-1/2">
		<!-- Promo space -->
	</div>
</div>

<style>
	/* Background image styling for right column */
	.sign-up-img {
		background-image: url('/abstract-img.png');
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}
</style>


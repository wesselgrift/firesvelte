<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert'
    import { CircleAlert } from '@lucide/svelte';
	import { login } from '$lib/firebase/auth';
    import { Spinner } from '$lib/components/ui/spinner';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	onMount(() => {
		// Load last email from localStorage
		if (typeof window !== 'undefined') {
			const lastEmail = localStorage.getItem('lastEmail');
			if (lastEmail) {
				email = lastEmail;
			}
		}
	});

	async function handleSubmit() {
		error = '';
		loading = true;

		try {
			const result = await login(email, password);
			if (result.error) {
				error = result.error;
			}
		} catch (err: any) {
			error = err.message || 'An error occurred';
		} finally {
			loading = false;
		}
	}
</script>

{#if error}
    <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>We couldn't sign you in.</AlertTitle>
        <AlertDescription>
            <p>
                {#if error === "Firebase: Error (auth/invalid-credential)."}
                    Please check your email and password, or reset your password if you've forgotten it.
                {:else}
                    We ran into a problem: <br> {error}
                {/if}
            </p>
        </AlertDescription>
    </Alert>
{/if}

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-5">
	<div class="space-y-2.5">
		<Label for="email">Email</Label>
		<Input
			id="email"
			type="email"
			bind:value={email}
			required
			disabled={loading}
		/>
	</div>

	<div class="space-y-2.5">
		<div class="flex flex-row justify-between">
			<Label for="password">Password</Label>
			<a href="/reset-password" class="text-sm leading-none text-muted-foreground hover:text-foreground">Forgot?</a>
		</div>
		<Input
			id="password"
			type="password"
			bind:value={password}
			required
			disabled={loading}
		/>
	</div>

	<Button type="submit" class="w-full -mt-1" disabled={loading}>
		{#if loading}
			<Spinner class="size-5" />
		{/if}
        Log in
	</Button>
</form>


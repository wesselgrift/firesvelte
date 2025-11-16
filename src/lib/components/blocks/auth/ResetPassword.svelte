<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { Spinner } from '$lib/components/ui/spinner';
    import { Alert, AlertTitle, AlertDescription } from '$lib/components/ui/alert'
    import { CircleAlert, CircleCheck } from '@lucide/svelte';
	import { resetPassword } from '$lib/firebase/auth';

	let email = $state('');
	let error = $state('');
	let success = $state(false);
	let loading = $state(false);

	async function handleSubmit() {
		error = '';
		success = false;
		loading = true;

		try {
			const result = await resetPassword(email);
			if (result.error) {
				error = result.error;
			} else {
				success = true;
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
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
    </Alert>
{/if}

{#if success}
    <Alert class="text-green-700 dark:text-green-500">
        <CircleCheck/>
        <AlertTitle>You've got mail</AlertTitle>
        <AlertDescription>We've sent you an email with a password reset link.</AlertDescription>
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
        <p class="block text-left text-sm text-muted-foreground">
            Fill in your email address and we'll send you a link to reset your password.
        </p>
	</div>

	<Button type="submit" class="w-full" disabled={loading}>
		{#if loading }
            <Spinner class="size-5" />
            Sending
        {:else}
            Send reset mail
        {/if}
	</Button>
</form>


<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { resetPassword } from '$lib/firebase/auth';
	import { auth } from '$lib/firebase/firebase';

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

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
	<div class="space-y-2">
		<Label for="email">Email</Label>
		<Input
			id="email"
			type="email"
			placeholder="you@example.com"
			bind:value={email}
			required
			disabled={loading}
		/>
	</div>

	{#if error}
		<div class="text-sm text-destructive">{error}</div>
	{/if}

	{#if success}
		<div class="text-sm text-green-600">
			Password reset email sent! Check your inbox.
		</div>
	{/if}

	<Button type="submit" class="w-full" disabled={loading}>
		{loading ? 'Sending...' : 'Send reset email'}
	</Button>
</form>


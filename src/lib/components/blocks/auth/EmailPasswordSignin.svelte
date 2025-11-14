<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { login } from '$lib/firebase/auth';

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

	<div class="space-y-2">
		<Label for="password">Password</Label>
		<Input
			id="password"
			type="password"
			placeholder="••••••••"
			bind:value={password}
			required
			disabled={loading}
		/>
	</div>

	{#if error}
		<div class="text-sm text-destructive">{error}</div>
	{/if}

	<Button type="submit" class="w-full" disabled={loading}>
		{loading ? 'Signing in...' : 'Sign in'}
	</Button>
</form>


<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { register, ensureServerSession } from '$lib/firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/firebase';
	import PasswordIndicator from './PasswordIndicator.svelte';

	let email = $state('');
	let password = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit() {
		error = '';
		loading = true;

		try {
			const result = await register(email, password, firstName, lastName);
			if (result.error) {
				error = result.error;
				loading = false;
				return;
			}

			if (result.user) {
				// Ensure server session is created
				await ensureServerSession(result.user);
				// Redirect to verify email page
				goto('/verify-email');
			}
		} catch (err: any) {
			error = err.message || 'An error occurred';
			loading = false;
		}
	}
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-4">
	<div class="grid grid-cols-2 gap-4">
		<div class="space-y-2">
			<Label for="firstName">First Name</Label>
			<Input
				id="firstName"
				type="text"
				placeholder="John"
				bind:value={firstName}
				disabled={loading}
			/>
		</div>

		<div class="space-y-2">
			<Label for="lastName">Last Name</Label>
			<Input
				id="lastName"
				type="text"
				placeholder="Doe"
				bind:value={lastName}
				disabled={loading}
			/>
		</div>
	</div>

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
		<PasswordIndicator {password} />
	</div>

	{#if error}
		<div class="text-sm text-destructive">{error}</div>
	{/if}

	<Button type="submit" class="w-full" disabled={loading}>
		{loading ? 'Creating account...' : 'Create account'}
	</Button>
</form>


<script lang="ts">
	import EmailPasswordSignin from '$lib/components/blocks/auth/EmailPasswordSignin.svelte';
	import ContinueWithGoogle from '$lib/components/blocks/auth/ContinueWithGoogle.svelte';
	import { loading } from '$lib/stores/userStore';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
</script>

<Card class="mx-auto max-w-md">
	<CardHeader>
		<CardTitle>Sign in</CardTitle>
		<CardDescription>
			Enter your credentials to access your account
		</CardDescription>
	</CardHeader>
	<CardContent class="space-y-4">
		{#if $loading}
			<div class="flex items-center justify-center py-8">
				<div class="text-muted-foreground">Loading...</div>
			</div>
		{:else}
			<EmailPasswordSignin />
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<Separator />
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>
			<ContinueWithGoogle />
			<div class="text-center text-sm">
				Don't have an account?{' '}
				<a href="/account" class="text-primary underline">Sign up</a>
			</div>
			<div class="text-center text-sm">
				<a href="/reset-password" class="text-primary underline">Forgot password?</a>
			</div>
		{/if}
	</CardContent>
</Card>


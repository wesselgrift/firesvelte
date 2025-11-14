<script lang="ts">
	import EmailPasswordSignup from '$lib/components/blocks/auth/EmailPasswordSignup.svelte';
	import ContinueWithGoogle from '$lib/components/blocks/auth/ContinueWithGoogle.svelte';
	import { loading } from '$lib/stores/userStore';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
</script>

<div class="container mx-auto grid min-h-screen grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 md:px-8">
	<div class="flex flex-col justify-center">
		<Card>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information to get started
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				{#if $loading}
					<div class="flex items-center justify-center py-8">
						<div class="text-muted-foreground">Loading...</div>
					</div>
				{:else}
					<EmailPasswordSignup />
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
						Already have an account?{' '}
						<a href="/login" class="text-primary underline">Sign in</a>
					</div>
				{/if}
			</CardContent>
		</Card>
	</div>
	<div class="hidden flex-col justify-center md:flex">
		<div class="space-y-4">
			<h2 class="text-3xl font-bold">Welcome to our platform</h2>
			<p class="text-muted-foreground">
				Join thousands of users who are already building amazing things with us.
			</p>
		</div>
	</div>
</div>


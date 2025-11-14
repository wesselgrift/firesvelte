<script lang="ts">
	import ResetPassword from '$lib/components/blocks/auth/ResetPassword.svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<Card class="mx-auto max-w-md">
	<CardHeader>
		<CardTitle>Reset password</CardTitle>
		<CardDescription>
			Enter your email address and we'll send you a link to reset your password
		</CardDescription>
	</CardHeader>
	<CardContent>
		<ResetPassword />
		<div class="mt-4 text-center text-sm">
			<a href="/login" class="text-primary underline">Back to sign in</a>
		</div>
	</CardContent>
</Card>


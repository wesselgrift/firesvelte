<script lang="ts">
	import { userProfile } from '$lib/stores/userStore';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { logout } from '$lib/firebase/auth';
</script>

<div class="container mx-auto space-y-8 px-4 py-12">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Dashboard</h1>
			<p class="text-muted-foreground">Welcome back, {$userProfile?.firstName || 'User'}!</p>
		</div>
		<Button variant="outline" onclick={() => logout()}>Sign out</Button>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>Your account information</CardDescription>
			</CardHeader>
			<CardContent class="space-y-2">
				<div>
					<div class="text-sm font-medium">Email</div>
					<div class="text-sm text-muted-foreground">{$userProfile?.email || 'N/A'}</div>
				</div>
				{#if $userProfile?.firstName || $userProfile?.lastName}
					<div>
						<div class="text-sm font-medium">Name</div>
						<div class="text-sm text-muted-foreground">
							{$userProfile?.firstName} {$userProfile?.lastName}
						</div>
					</div>
				{/if}
				<div>
					<div class="text-sm font-medium">Email Verified</div>
					<div class="text-sm text-muted-foreground">
						{$userProfile?.emailVerified ? 'Yes' : 'No'}
					</div>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
				<CardDescription>Common tasks</CardDescription>
			</CardHeader>
			<CardContent class="space-y-2">
				<p class="text-sm text-muted-foreground">
					This is a sample dashboard page. You can customize it to fit your needs.
				</p>
			</CardContent>
		</Card>
	</div>
</div>


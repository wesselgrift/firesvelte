<script lang="ts">
	import { userProfile } from '$lib/stores/userStore';
	import { Button } from '$lib/components/ui/button';
	import { logout } from '$lib/firebase/auth';
</script>


<div class="flex flex-col gap-6 p-5">
    <div class="flex flex-col gap-1">
        <h3 class="text-lg font-medium mb-2">Logged in</h3>
        <p class="text-sm"><span class="text-muted-foreground w-32 inline-block">First Name:</span> {$userProfile?.firstName ?? 'N/A'}</p>
        <p class="text-sm"><span class="text-muted-foreground w-32 inline-block">Last Name:</span> {$userProfile?.lastName ?? 'N/A'}</p>
        <p class="text-sm"><span class="text-muted-foreground w-32 inline-block">Email:</span> {$userProfile?.email}</p>
        <p class="text-sm"><span class="text-muted-foreground w-32 inline-block">Email Verified:</span> {$userProfile?.emailVerified ? 'Yes' : 'No'}</p>
    </div>
    <Button size="sm" class="w-fit" variant="outline" onclick={() => logout()}>Sign out</Button>
</div>

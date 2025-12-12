<script lang="ts">
	// User profile store for accessing current user data
	import { userProfile } from '$lib/stores/userStore';
    
	// UI components
    import { UserProfile } from '$lib/components/blocks/auth';
</script>

<!-- Main container displaying user profile information -->
<div class="flex flex-col p-5">
    <h2 class="text-2xl font-semibold mb-2">Hey {$userProfile?.firstName}, <br> welcome to SV Starter 👋</h2>
    <p class="text-muted-foreground text-sm mb-5">Here you'll find a simple user profile component which you can use anywhere in your app.</p>
    <UserProfile />
</div>

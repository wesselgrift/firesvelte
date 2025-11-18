<script lang="ts">
	// Check if code is running in browser environment
	import { browser } from '$app/environment';
	// UI components
	import { Button } from '$lib/components/ui/button';
	import { Telescope } from '@lucide/svelte';

	// Navigate back to previous page in browser history
	function goBack() {
		if (browser) window.history.back();
	}
</script>

<!-- Error page container - centered full-screen layout -->
<div class="flex flex-col min-h-screen items-center justify-center p-5">
	<!-- Error content wrapper with max width constraint -->
	<div class="max-w-2xl flex flex-col items-center justify-center gap-4">
		<!-- Error icon -->
		<Telescope size="40" strokeWidth="1.3"/>
		<!-- Error message -->
		<p class="text-base">Whoops, we couldn't find that page.</p>
		<!-- Back navigation button -->
		<Button variant="outline" onclick={goBack}>Go back</Button>
	</div>
</div>
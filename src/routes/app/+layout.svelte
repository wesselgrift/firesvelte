<script lang="ts">
	import { userProfile as userProfileStore, loading } from '$lib/stores/userStore';
	import { lockScroll } from '$lib/stores/uiStore';
	import { addBodyClass, removeBodyClass, toggleBodyClass } from '$lib/utils/bodyClassUpdater';
	import type { PageData } from './$types';

	let { data, children }: { data: PageData; children: import('svelte').Snippet } = $props();

	// Sync userProfile store with server data
	$effect(() => {
		if (data.userProfile) {
			userProfileStore.set(data.userProfile);
		}
	});

	// Add logged-in class to body
	$effect(() => {
		addBodyClass('logged-in');
		return () => {
			removeBodyClass('logged-in');
		};
	});

	// Toggle lock-scroll class based on store
	$effect(() => {
		toggleBodyClass('lock-scroll', $lockScroll);
	});
</script>

<div class="min-h-screen">
	{@render children()}
</div>

<!-- Portal mount points for modals/drawers -->
<div id="example-modal"></div>
<div id="settings-modal"></div>
<div id="example-drawer"></div>


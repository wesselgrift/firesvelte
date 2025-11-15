<script lang="ts">
	import { cn } from "$lib/utils.js";
    import { LoaderCircle } from '@lucide/svelte';
	import type { ComponentProps } from "svelte";

	let { class: className, ...restProps }: ComponentProps<typeof LoaderCircle> = $props();
</script>

<LoaderCircle
	role="status"
	aria-label="Loading"
	class={cn("size-4 animate-spin", className)}
	{...restProps}
/>
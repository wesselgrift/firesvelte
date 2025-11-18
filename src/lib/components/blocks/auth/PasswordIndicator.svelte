<script lang="ts">
	// Component props
	interface Props {
		password: string;
	}

	let { password }: Props = $props();

	// Calculate password strength score (0-5) based on length and character variety
	const strength = $derived.by(() => {
		if (!password) return 0;

		let score = 0;

		// Length check
		if (password.length >= 8) score += 1;
		if (password.length >= 12) score += 1;

		// Character variety checks
		if (/[a-z]/.test(password)) score += 1;
		if (/[A-Z]/.test(password)) score += 1;
		if (/[0-9]/.test(password)) score += 1;
		if (/[^a-zA-Z0-9]/.test(password)) score += 1;

		return Math.min(score, 5);
	});

	// Convert strength score to human-readable label
	const strengthLabel = $derived.by(() => {
		if (strength <= 2) return 'Weak';
		if (strength <= 3) return 'Fair';
		if (strength <= 4) return 'Good';
		return 'Strong';
	});

	// Background color class based on strength level
	const strengthColor = $derived.by(() => {
		if (strength <= 2) return 'bg-destructive';
		if (strength <= 3) return 'bg-yellow-500';
		if (strength <= 4) return 'bg-blue-500';
		return 'bg-green-500';
	});

	// Text color class based on strength level
	const strengthTextColor = $derived.by(() => {
		if (strength <= 2) return 'text-destructive';
		if (strength <= 3) return 'text-yellow-500';
		if (strength <= 4) return 'text-lime-500';
		return 'text-green-500';
	});

	// Returns the appropriate color class for each strength bar based on its index
	const getBarClass = (index: number) => {
		if (index >= strength) return 'bg-muted';
		if (strength <= 2) return 'bg-destructive';
		if (strength <= 3) return 'bg-yellow-500';
		if (strength <= 4) return 'bg-lime-500';
		return 'bg-green-500';
	};
</script>

{#if password}
	<!-- Password strength indicator display -->
	<div class="space-y-1.5 h-12">
		<!-- Visual strength bars (5 bars total) -->
		<div class="flex gap-1">
			{#each Array(5) as _, i}
				<div class="h-1 flex-1 rounded-full {getBarClass(i)}"></div>
			{/each}
		</div>
		<!-- Strength label text -->
		<div class="flex items-center justify-between text-sm">
			<span class={strengthTextColor}>
				{strengthLabel} password
			</span>
		</div>
	</div>
{:else}
	<!-- Password requirements helper text when no password is entered -->
	<p class="bloc h-12 text-left text-sm text-muted-foreground/80">
		Use a password with at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number
		and 1 special character.
	</p>
{/if}


<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
	$: ({ session } = $page.data);
</script>

<nav>
	{#if session}
		<span>Welcome, {session.user?.name}!</span>
		<button on:click={() => signOut()}>Sign out</button>
	{:else}
		<button on:click={() => signIn('github')}>Sign in with GitHub</button>
	{/if}
</nav>

<slot />

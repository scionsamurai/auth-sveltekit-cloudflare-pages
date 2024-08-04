<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { PUBLIC_WORKER_URL } from '$env/static/public';

    let updates: string[] = [];
    let socket: WebSocket;

    onMount(() => {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${PUBLIC_WORKER_URL}/notifications`;
        socket = new WebSocket(wsUrl);
        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'USER_UPDATED') {
                updates = [...updates, `${data.user.name} just updated their profile!`];
            }
        });
    });

    onDestroy(() => {
        if (socket) socket.close();
    });
    </script>

    <div class="updates-container">
        <h3>Real-time Updates</h3>
        {#each updates as update}
            <p>{update}</p>
        {/each}
    </div>

    <style>
    .updates-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        max-width: 300px;
        background: #f0f0f0;
        border-radius: 5px;
        padding: 10px;
    }
    </style>
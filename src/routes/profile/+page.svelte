<script lang="ts">
	export let data;
	const { user } = data;
</script>

<h1>User Profile</h1>
<img src={user.image} alt={user.name} style="width: 100px; height: 100px; border-radius: 50%;" />
<p>Name: {user.name}</p>
<p>Email: {user.email}</p>

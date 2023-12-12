<MenuBar />
<div class="main-background fade">
    {#if loading}
        <Loading />
    {:else if $user.access_token}
        {#if $user.access_token}
            <AdminMenuBar />
            <div class="main-container">
                <slot />
            </div>
        {/if}
    {:else}
        <LogIn />
    {/if}
</div>

<script>
// @ts-nocheck
// @ts-ignore
import '@fortawesome/fontawesome-free/css/all.css';
import { onMount } from 'svelte';
import { user } from '$stores/user.js';
import MenuBar from '$components/MenuBar.svelte';
import AdminMenuBar from '$components/AdminMenuBar.svelte';
import LogIn from '$components/LogIn.svelte';
import Loading from '$components/Loading.svelte';

let loading = true;
let local_user_obj = null;

onMount(() => {
    local_user_obj = localStorage.getItem('logged_in_user');
    if (!local_user_obj) {
        loading = false;
        return;
    }
    local_user_obj = JSON.parse(local_user_obj);
    if (
        local_user_obj.id &&
        local_user_obj.access_token &&
        local_user_obj.username
    ) {
        $user = local_user_obj;
    }
    loading = false;
});
</script>

<style>
</style>
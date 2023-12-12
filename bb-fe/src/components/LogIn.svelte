
<div class="login-container">
    <div class="login-box shadow">
        <div class="mb-1">
            <div class="label">{show_sign_up ? 'New ' : ''}Username</div>
            <input bind:value={username} class="login-input" type="text" />
        </div>
        <div class="mb-1">
            <div class="label">{show_sign_up ? 'New ' : ''}Password</div>
            <input bind:value={password} class="login-input" type="password" />
        </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="login-button text-white shadow py-0.5"
                on:click={show_sign_up ? sign_up_attempt : login_attempt}
            >
                {show_sign_up ? 'Sign Up' : 'Login'}
            </div>
        
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="register"
        on:click={switch_sign_up}
    >
        {#if !show_sign_up}
            Register Now
        {:else}
            Cancel
        {/if}
    </div>

</div>


<script>
import http from '$http';
import { goto } from '$app/navigation';
import { user } from '$stores/user.js';
export let username = 'admin';
export let password = 'q7oXZekTrI96';
let show_sign_up = false;

const login_attempt = async () => {
    await http.axios.post('/admin/users/log-in', {
        username,
        password
    }).then(
        succ => {
            if (succ.data.access_token) {
                let d = succ.data;
                $user = {
                    id: d.id,
                    access_token: d.access_token,
                    username: d.username
                }
                localStorage.setItem('logged_in_user', JSON.stringify($user));
                goto('/admin/stock');
            } else alert(succ.data.message);
        },
        error => {console.log(error)}
    );
}

const sign_up_attempt = async () => {
    await http.axios.post('/admin/users/sign-up', {
        username,
        password
    }).then(
        succ => {
            alert(succ.data.message)
            show_sign_up = false;
        },
        error => {console.log(error)}
    );
}

const switch_sign_up = () => {
    show_sign_up = !show_sign_up
}
</script>

<style>
.login-container {
    align-items: center;
    color: white;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    margin: auto;
    width: fit-content;
}

.login-box {
    background-color: var(--main);
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 20vw;
    padding: 1rem;
}

.login-button {
    background-color: var(--accent);
    border-radius: 0.5rem;
    cursor: pointer;
    padding: 0.25rem;
    text-align: center;
}

/* .register {
    font-size: 0.6rem;
    font-weight: bold;
    cursor: pointer;
    color: black;
}

.register:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
} */
</style>
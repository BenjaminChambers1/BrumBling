import { writable } from 'svelte/store';

export let user = writable({
    id: null,
    access_token: null,
    username: null
});
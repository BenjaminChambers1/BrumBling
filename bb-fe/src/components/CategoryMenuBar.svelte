<div class="menu-container mb-0.5">
    {#each categories as category}
        {#key selected}
            <div 
                class={category.id === selected ? 'selected menu-items' : ' menu-items' }
                on:click={select(category)}
            >
                {category.name}
            </div>
        {/key}
    {/each}
</div>

<script>
import http from '$http';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

let categories = [];
let selected = null;

const select = (category) => {
    selected = category.id;
    $page.url.searchParams.set('category', category.id);
    if ($page.url.searchParams.get('item')) $page.url.searchParams.delete('item');
    goto(`?${$page.url.searchParams.toString()}`);
    dispatch('category_change');
}

const get_categories = async() => {
    await http.axios.get('/categories/get').then(
        succ => {
            if (succ.data.found_categories) {
                categories = [{id: 0, name: 'All'}, ...succ.data.found_categories];;
            }
        },
        error => {console.log(error)}
    );
    if ($page.url.searchParams.get('category')) {
        selected = Number($page.url.searchParams.get('category'));
    }
}

onMount(get_categories)
</script>

<style>
.menu-container {
    width: fit-content;
    min-height: 2rem;
    display: flex;
    margin: auto;
    align-items: center;
    color: var(--accent);
    font-size: 0.75rem;
    overflow-x: auto;
}

.menu-items {
    padding: 0.75rem;
    cursor: pointer;
    margin-top: 0.5rem;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
}

.menu-items:hover {
    border-bottom: 2px solid var(--main);
    padding-bottom: calc(0.75rem - 2px);
    background-color: var(--light-grey);
}

.selected {
    border-bottom: 2px solid var(--main);
    padding-bottom: calc(0.75rem - 2px);
}
</style>
<button
    class="0.75 bg button shadow simple-button text-white {classes}"
    class:bold
    class:cm-blue={blue}
    class:full-width={full_width}
    class:green={green}
    class:grey
    class:my-1={!no_margin}
    class:red
    class:search
    class:white
    {disabled}
    on:click|stopPropagation={() => dispatch('click')}
>
    {#if icon}
        <i class="{icon}"></i>
    {/if}
    {text}
    <slot />
</button>

<script>
import { createEventDispatcher } from 'svelte';

export let icon = '';
export let text = '';
export let disabled = false;

/* Classes */
export let classes = '';
export let blue = false;
export let bold = false;
export let green = false;
export let grey = false;
export let red = false;
export let search = false;
export let white = false;
export let full_width = false;
export let no_margin = false;

const dispatch = createEventDispatcher();
</script>

<style>
button {
    transition: all 0.2s;
    border: 0;
}

button:disabled {
    background-color: #a1a1aa !important;
    filter: none;
    cursor: not-allowed;
}

button:hover {
    background-image: linear-gradient(#ffffff30, #ffffff30);
}

.green {
    background-color: var(--green) !important;
}

.red {
    background-color: var(--red) !important;
}

.simple-button.search {
    margin-bottom: 1px;
}

.white {
    color: var(--green) !important;
}

.white:disabled {
    background-color: white;
    opacity: 0.4;
}
</style>
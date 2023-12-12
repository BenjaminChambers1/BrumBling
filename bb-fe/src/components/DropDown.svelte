<div class="{!no_margin ? 'my-0.5' : ''} relative">
    {#if label}
        <div 
            class="label"
            class:top={label_top}
        >{label}</div>
    {/if}
    <select bind:value class="dropdown input {classes}" class:full_width on:change={() => dispatch('change')}>
        {#each items as option}
            <option value={option.value || option}>{option[value_key] || option.key || option}</option>
        {/each}
    </select>
</div>

<script>
import { createEventDispatcher } from 'svelte';

export let classes = '';
export let items;
export let full_width = false;
export let label;
export let label_top = false;
export let no_margin = false;
export let value;
export let value_key;
const dispatch = createEventDispatcher();
</script>

<style>
.dropdown {
    min-width: 200px !important;
    width: unset !important;
    font-size: 1rem;
    border: 2px solid black;
    border-radius: 0.5rem;
    padding: 0.25rem;
    background-color: #FFF
}

.full_width {
    width: 100% !important;
}

.relative {
    position: relative;
}

.top {
    background-color: #FFF;
    font-size: 0.5rem;
    font-weight: bold;
    left: 0.5rem;
    line-height: 0.5rem;
    padding-left: 0.2rem;
    padding-top: 0.2rem;
    position: absolute;
    text-shadow: 0 0 3px #FFF;
    text-transform: uppercase;
    top: -0.35rem;
    z-index: 1;
}

.main {
    border: 2px solid #DDD !important;
    height: 2rem;
    font-size: 0.75rem;
}
</style>
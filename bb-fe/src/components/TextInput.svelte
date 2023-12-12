<div class="input" class:full_width class:dynamic_width>
    {#if label}
        <div class="label" class:top={label_top}>{label}</div>
    {/if}
    {#if password}
        <input
            {disabled}
            {placeholder}
            {readonly}
            class="{classes}"
            type="password"
            bind:value
            on:input={() => dispatch('change')}
            on:keydown
            on:focus
        />
    {:else if number}
        <input
            {disabled}
            {placeholder}
            {readonly}
            class="{classes}"
            type="number"
            bind:value
            on:input={() => dispatch('change')}
            on:keydown
            on:focus
        />
    {:else}
        <input
            {autocomplete}
            {disabled}
            {placeholder}
            {readonly}
            {grey_border}
            class="{classes}"
            type="text"
            bind:value
            on:input={() => dispatch('change')}
            on:keydown
            on:focus
        />
    {/if}
</div>

<script>
import { createEventDispatcher } from 'svelte';

export let autocomplete = false;
export let classes = '';
export let disabled = false;
export let dynamic_width = false;
export let full_width = false;
export let grey_border = false;
export let label;
export let label_top = false;
export let number = false;
export let password = false;
export let placeholder = '';
export let readonly = false;
export let value;

const dispatch = createEventDispatcher();
</script>

<style>
.dynamic_width {
    width: unset !important;
}

.input { 
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
}

.main {
    border: 2px solid #DDD !important;
    font-size: 0.75rem;
}
</style>
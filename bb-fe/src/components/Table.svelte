{#if $$slots.table_actions || allow_select}
    <div class="row">
        <div class="column narrow mr-0.5">
            <div class="row">
                <slot name="table_actions" />
            </div>
        </div>
        <div class="column narrow">
            {#if allow_select}
                <Button
                    no_margin
                    text="Deselect all"
                    disabled={!selected.length}
                    on:click={() => selected = []}
                />
            {/if}
        </div>
    </div>
{/if}

<table class="table">
    <thead>
        <tr>
            {#each headers as { label }}
                <th>{label}</th>
            {/each}
            {#if allow_edit || allow_delete || $$slots.actions}
                <th class="actions">Actions</th>
            {/if}
        </tr>
    </thead>
    <tbody>
        {#if is_loading}
            <td colspan={loading_colspan}>
                <div class="loading-container">
                    <Loading size="50" />
                </div>
            </td>
        {:else}
            {#each data as row}
                <tr
                    class:row_clickable={row_clickable || allow_select}
                    class:selected={selected.includes(row.id)}
                    on:click={() => handle_row_click(row)}
                >
                    {#if allow_select}
                    <td data-label="Selected">
                        <div class="selectbox-container">
                            {#key row.id}
                                <input
                                    class="cursor-pointer"
                                    type="checkbox"
                                    checked={is_selected(row.id)}
                                    on:click|stopPropagation={() => toggle_select(row.id)}
                                />
                            {/key}
                        </div>
                    </td>
                    {/if}
                    {#each headers as { label, value }}
                        <td data-label={label}>
                            {Array.isArray(value) ? get_value_from_array(row, value) : row[value] || replace_blanks}
                        </td>
                    {/each}
                    {#if allow_edit || allow_delete || $$slots.actions }
                        <td data-label="Actions" class="actions">
                            <div class="row y-centered actions-row">
                                {#if $$slots.actions}
                                    <slot name="actions" {row}></slot>
                                {/if}
                                {#if allow_edit}
                                    <div class="column narrow">
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <i
                                            class="cursor-pointer fa-solid fa-pencil mr-0.5 text-orange"
                                            on:click|stopPropagation={() => dispatch('edit', { row })}>
                                        </i>
                                    </div>
                                {/if}
                                {#if allow_delete}
                                    <div class="column narrow">
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <i
                                            class="cursor-pointer fa-solid fa-trash mr-0.5 text-mjj-red"
                                            on:click|stopPropagation={() => dispatch('delete', { row })}>
                                        </i>
                                    </div>
                                {/if}
                            </div>
                        </td>
                    {/if}
                </tr>
            {/each}
        {/if}
    </tbody>
</table>
{#if num_of_pages > 1}
    <div class="row centered pagination">
        {#if page_num !== 1}
            {@const page_jump = Math.min(page_num - 1, 5) * -1}
            <div class="column narrow">
                <Button
                    no_margin
                    text="<<"
                    on:click={() => change_page(-page_num + 1)}
                />
            </div>
            <div class="column narrow">
                <Button
                    no_margin
                    text="{page_jump}"
                    on:click={() => change_page(page_jump)}
                />
            </div>
            <div class="column narrow">
                <Button
                    no_margin
                    on:click={() => change_page(-1)}
                >
                    <i class="fa-solid fa-chevron-left"></i>
                </Button>
            </div>
        {/if}
        <p class="mb-0 column narrow page-text">Page {page_num}/{num_of_pages}</p>
        {#if page_num !== num_of_pages}
            {@const page_jump = Math.min(5, num_of_pages - page_num)}
            <div class="column narrow">
                <Button
                    no_margin
                    on:click={() => change_page(1)}
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </Button>
            </div>
            <div class="column narrow">
                <Button
                    no_margin
                    text="+{page_jump}"
                    on:click={() => change_page(page_jump)}
                />
            </div>
            <div class="column narrow">
                <Button
                    no_margin
                    text=">>"
                    on:click={() => change_page(num_of_pages)}
                />
            </div>
        {/if}
    </div>
{/if}

<script>
import { createEventDispatcher } from 'svelte';

import Button from '$components/Button.svelte';
import Loading  from '$components/Loading.svelte';

export let allow_edit = false;
export let allow_delete = false;
export let allow_select = false;
export let data = [];
export let headers = [];
export let is_loading = false;
export let page_num = 1;
export let page_size = 10;
export let replace_blanks = '';
export let row_clickable = false;
export let selected = [];
export let total_results = 0;

const dispatch = createEventDispatcher();

$: is_selected = id => selected.includes(id);
$: loading_colspan = headers.length + (allow_select && 1) + (allow_edit || allow_delete || $$slots.actions && 1);
$: num_of_pages = Math.ceil(total_results / page_size);

$: page_num, selected = [];
$: data, selected = selected.filter(id => data.some(row => row.id === id));

$: {
    if (page_num > num_of_pages && num_of_pages > 0) {
        page_num = num_of_pages;
        dispatch('page_change');
    }
}

const change_page = difference => {
    if (page_num === num_of_pages && difference > 0) return;
    if (page_num === 1 && difference < 0) return;
    page_num += difference;
    dispatch('page_change');
};

const handle_row_click = row => {
  if (row_clickable) dispatch('row_clicked', row);
  if (allow_select) toggle_select(row.id);
};

const toggle_select = id => {
    const index = selected.indexOf(id);
    if (index === -1) selected.push(id);
    else selected.splice(index, 1);
    selected = selected;
};

const get_value_from_array = (row, array_of_values) => {
    for (const key of array_of_values) {
        if (row[key]) return row[key];
    }
    return '';
};
</script>

<style>
.loading-container {
    align-items: center;
    display: flex;
    height: 20rem;
    justify-content: center;
    width: 100%;
}

.pagination {
    column-gap: 8px;
}

.row_clickable {
    cursor: pointer;
}

.selected {
  background-color: #21c55e42 !important;
  border-bottom-color: white !important;
}

.table {
    border-collapse: collapse;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    font-family: sans-serif;
    font-size: 0.75rem;
    margin: 25px 0;
    width: 100%;
}

.table thead tr {
    background-color: var(--main);
    color: #ffffff;
    text-align: left;
    user-select: none;
}

.table th,
.table td {
    padding: 0.25rem 0.5rem;
    max-width: 50%;
    min-width: 30%;
    word-wrap: break-word;
}

.table tbody tr {
    border-bottom: 1px solid #dddddd;
}

.table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.table tbody tr:last-of-type {
    border-bottom: 2px solid var(--mjj-green);
}

.selectbox-container {
    display: flex;
    justify-content: center;
}

@media screen and (max-width: 850px) {
    .actions-row {
        justify-content: flex-end;
    }

    .page-text {
        font-size: 0.75rem;
    }

    .table {
        border: 0;
    }

    .table thead {
        border: none;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
    }

    .table tr {
        border-bottom: 3px solid var(--mjj-green) !important;
        display: block;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .table td {
        border-bottom: 1px solid #ddd;
        display: block;
        font-size: 0.8em;
        max-width: unset;
        text-align: right;
    }

    .table td::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        text-transform: uppercase;
    }

    .table td:last-child {
        border-bottom: 0;
    }

    .table tbody tr:nth-of-type(even) {
        background-color: unset;
    }

    .table tbody tr:last-of-type {
        border-bottom: unset;
    }

    .selectbox-container {
        height: 40px;
        justify-content: flex-end;
    }
}
</style>

<MenuBar />
<CategoryMenuBar on:category_change={get_items_by_category}/>
<div class="main-container">
    {#if !selected_item?.id}
        <div class="columns my-0.25">
            <div class="column">
                <TextInput
                    classes="main"
                    label="Search"
                    label_top
                    grey_border
                    bind:value={search_term}
                    on:change={reset_page_and_refresh}
                />  
            </div>
            <div class="column">
                <DropDown
                    classes="main"
                    items={sorting_options}
                    label="Sort"
                    label_top
                    
                    full_width
                    bind:value={sorting_option}
                    on:change={reset_page_and_refresh}
                />
            </div>
        </div>
        {#if loading}
            <Loading />
        {:else}
            {#if items.length}
                <div class="item-container">
                    {#each items as item}
                        <div
                            class="item-card"
                            on:click={select_item(item)}
                        >
                            <div class="image-section">
                                <img
                                    class="image"
                                    src="{item.image_url}" 
                                />
                            </div>
                            <div class="info-section">
                                <div class="name">{item.name}</div>
                                <div class="price">£{item.price}</div>
                                {#if !item.stock}
                                    <div class="out-of-stock">Out of Stock</div>
                                {:else}
                                    <div class="stock">{item.stock} available</div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="row centered">No Results</div>
            {/if}
        {/if}
        {#key total_results}
            {#if num_of_pages > 1}
                <div class="row centered pagination my-0.5">
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
                    <p class="mb-0 column page-text">Page {page_num}/{num_of_pages}</p>
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
        {/key}
    {:else}
        <SelectedItem bind:selected_item/>
    {/if}
</div>

<script>
import http from '$http';
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import debounce from 'just-debounce-it';
import { page } from '$app/stores';

import Button from '$components/Button.svelte';
import MenuBar from '$components/MenuBar.svelte';
import CategoryMenuBar from '$components/CategoryMenuBar.svelte';
import Loading from '$components/Loading.svelte';
import TextInput from '$components/TextInput.svelte';
import DropDown from '$components/DropDown.svelte';
import SelectedItem from '$components/SelectedItem.svelte';

let items = [];
let search_term = '';
let loading = true;
let page_num = 1;
let page_size = 12;
let total_results = 0;
let category_id = 0;
const sorting_options = [
    { key: 'Name', value: 'name' },
    { key: 'Price', value: 'price' },
    { key: 'Stock', value: 'stock' }
];

let selected_item = null;

let sorting_option = 'name';

$: num_of_pages = Math.ceil(total_results / page_size);

const get_items_by_category = debounce(async () => {
    loading = true;
    selected_item = null;
    category_id = Number($page.url.searchParams.get('category'));
    const response = await http.axios.post(`/items/get-by-category?page=${page_num}&page_size=${page_size}&search_term=${search_term}&sort=${sorting_option}&category_id=${category_id}`)
        .catch(console.log);

    loading = false;
    if (!response) return alert('Error fetching categories');

    items = response.data.items;
    total_results = response.data.total_results || [];
}, 500);

const get_item_by_id = debounce(async (item_id) => {
    loading = true;
    const response = await http.axios.post('/items/get-by-id', { item_id })
        .catch(console.log);

    loading = false;
    if (!response) return alert('Error fetching categories');

    selected_item = response.data.item[0];
}, 500);

const reset_page_and_refresh = () => {
    page_num = 1;
    get_items_by_category();
};

const change_page = difference => {
    if (page_num === num_of_pages && difference > 0) return;
    if (page_num === 1 && difference < 0) return;
    page_num += difference;
    get_items_by_category();
};

const select_item = (item) => {
    $page.url.searchParams.set('item', item.id);
    goto(`?${$page.url.searchParams.toString()}`);
    selected_item = item;
}

onMount(() => {
    if ($page.url.searchParams.get('item')) {
        get_item_by_id($page.url.searchParams.get('item'));
    } else {
        get_items_by_category();
    }
});
</script>

<style>
.column {
    width: 50%;
}

.columns {
    display: flex;
    gap: 1rem;
}

.item-container {
    display: flex;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    padding-bottom: 1rem
}

.item-card {
    width: calc((100% / 3));
    height: 15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    cursor: pointer;
}

.item-card:hover {
    background-image: linear-gradient(0deg, var(--main) -120%, transparent 40%);
}

.image-section {
    display: flex;
    justify-content: center;
    align-items: center;
}

.info-section {
    padding: 1rem;
}

.image {
    width: 60%;
    border-radius: 0.5rem;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.price {
    color: var(--main);
}

.out-of-stock {
    color: var(--red);
}

.pagination {
    column-gap: 8px;
    width: fit-content;
    margin: auto;
}

.narrow {
    width: 2rem;
}

.page-text {
    width: min-content;
    text-wrap: nowrap;
}

@media only screen and (max-width: 768px) {
    .columns  {
        flex-direction: column;
    }
    .column {
        width: 100%;
    }
    .item-card {
        width: calc((100% / 2));
    }
}
</style>
<Button
    classes="fit-content"
    text="Create New Item"
    green
    no_margin
    on:click={open_new_item_modal}
/>
<div class="column narrow mt-0.25">
    <div class="row">
        <div class="column narrow">
            <TextInput
                label="Search"
                label_top
                bind:value={search_term}
                on:change={reset_page_and_refresh}
            />    
        </div>
        <div class="column narrow ml-1">
          <DropDown
            items={sorting_options}
            label="Sort"
            label_top
            bind:value={sorting_option}
            on:change={reset_page_and_refresh}
          />
        </div>
    </div>
</div>
<Table
    headers={[
        { label: 'Name', value: 'name' },
        { label: 'Price', value: 'price' },
        { label: 'Stock', value: 'stock' },
        { label: 'Reserved', value: 'reserved' }
    ]}
    replace_blanks="-"
    data={items}
    is_loading={loading}
    bind:page_num
    bind:page_size
    bind:total_results
    on:page_change={get_items}
>
    <svelte:fragment slot="actions" let:row>
        <Button
            classes="mr-1"
            text="Edit"
            green
            no_margin
            on:click={() => open_edit_modal(row)}
        />
        <Button
            text="Delete"
            red
            no_margin
            on:click={delete_item(row)}            
        />
    </svelte:fragment>
</Table>

<AddNewItem
    bind:show_new_item_modal
    on:added={get_items}
/>

<Modal
    title="Edit product"
    bind:visible={show_edit_item_modal}
>
    <TextInput
        label="Product Name"
        label_top
        bind:value={edit_item.name}
    />
    <TextInput
        label="Product Description"
        label_top
        bind:value={edit_item.description}
    />
    <DropDown
        items={found_categories}
        bind:value={edit_item.category_id}
        no_margin
        label_top
        full_width
        label="Category"
        value_key="name"
    />
    <TextInput
        label="Price"
        number
        label_top
        bind:value={edit_item.price}
    />
    <TextInput
        label="Stock"
        number
        label_top
        bind:value={edit_item.stock}
    />
    <p>Select an image for the product</p>
    {#if loading}
        <Loading />
    {/if}
    {#if image.image}
        <div class="row mb-0.25">
            <div
                class="column uploaded-image narrow"
                style={render_background}
            />
        </div>
    {/if}
    <div class="row mb-1">
        <input
            type="file"
            accept="image/*"
            name="image"
            bind:this={input}
            on:change|stopPropagation={handle_change}
        />
    </div>

    <div class="row">
        <div class="column narrow mr-0.5">
            <Button
                text="Submit"
                no_margin
                disabled={!edit_item.name}
                on:click={Save}
            />
        </div>
        <div class="column narrow">
            <Button
                text="Cancel"
                red
                no_margin
                on:click={() => show_edit_item_modal = false}
            />
        </div>
    </div>
</Modal>

<script>
import imageCompression from 'browser-image-compression';
import debounce from 'just-debounce-it';
import { onMount } from 'svelte';
import http from '$http';
import Modal from '$components/Modal.svelte';
import DropDown from '$components/DropDown.svelte';
import AddNewItem from '$components/AddNewItem.svelte';
import TextInput from '$components/TextInput.svelte';
import Button from '$components/Button.svelte';
import Table from '$components/Table.svelte';
let show_new_item_modal = false;
let show_edit_item_modal = false;

let items = [];
let search_term = '';
let loading = true;
let page_num = 1;
let page_size = 10;
let total_results = 0;
const sorting_options = [
  { key: 'Name', value: 'name' },
  { key: 'Price', value: 'price' },
  { key: 'Stock', value: 'stock' }
];
let sorting_option = 'name';

let image = {
    image: null,
    image_name: `image-${Number(new Date())}.jpg`,
    preview: null
};
let input;
let found_categories = [];
let edit_item = {
    name: '',
    description: '',
    category_id: null,
    price: 0,
    stock: 0,
};
let categories = {};
const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1920,
    useWebWorker: true
};

const reset_page_and_refresh = () => {
    page_num = 1;
    get_items();
};

const handle_change = async (e) => {
    image.preview = null;
    image.image = null;
    const file = e.target.files[0];
    let compressed_file;
    
    loading = true;
    try {
        compressed_file = await imageCompression(file, options);
    } catch (error) {
        loading = false;
        alert('File selected must be an image');
        return;
    }

    image.preview = URL.createObjectURL(compressed_file);
    loading = false;
    if (compressed_file.type) image.image = new Blob([compressed_file], { type: 'image/jpeg' });
    else image.image = new Blob([compressed_file]);
};

const get_items = debounce(async () => {
    loading = true;
    const response = await http.axios.post(`/items/get?page=${page_num}&page_size=${page_size}&search_term=${search_term}&sort=${sorting_option}`)
        .catch(console.log);

    loading = false;
    if (!response) return alert('Error fetching categories');

    items = response.data.items;
    total_results = response.data.total_results || [];
}, 500);

const open_new_item_modal = () => {
    show_new_item_modal = true;
}

const open_edit_modal = async (row) => {
    await http.axios.get('/categories/get').then(
        succ => {
            if (succ.data.found_categories) {
                found_categories = succ.data.found_categories;
            }
        },
        error => {console.log(error)}
    );
    show_edit_item_modal = true;

    let index_of_category = found_categories.findIndex(category => category.name === row.category)
    edit_item = {
        id: row.id,
        name: row.name,
        image_url: row.image_url,
        description: row.description,
        category_id: found_categories[index_of_category],
        price: row.price,
        stock: row.stock,
    };
}

const Save = async () => {
    let form = new FormData();
    if (image) form.append('file', image.image);
    if (edit_item.image_url) form.append('image_url', edit_item.image_url);
    if (edit_item.id) form.append('id', edit_item.id);
    if (edit_item.name) form.append('name', edit_item.name);
    if (edit_item.description) form.append('description', edit_item.description);
    if (edit_item.category_id) form.append('category_id', edit_item.category_id.id);
    if (edit_item.price) form.append('price', edit_item.price);
    if (edit_item.stock) form.append('stock', edit_item.stock);

    await http.axios.post('/admin/items/edit', form, {
        headers: { 'content-type': 'multipart/form-data' }
    }).then(
        succ => {
            console.log(succ);
        },
        error => {console.log(error)}
    );
    // console.log(response);
    // if (!response) return alert('There was an error uploading the image');
    show_edit_item_modal = false;
    get_items();
};

const delete_item = async (row) => {
    if (!confirm(`Are you sure you want to delete ${row.name}?`)) return;
    await http.axios.post('/admin/items/delete', { id: row.id }).then(
        error => {console.log(error)}
    );
    get_items();
}

onMount(() => {
    get_items();
});
</script>

<style>
.uploaded-image {
    width: 10rem;
    height: 10rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    border: 4px solid var(--main);
}
p {
    margin: 0
}

@media only screen and (max-width: 768px) {
    .uploaded-image  {
        display: none;
    }
}
</style>
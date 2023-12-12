<Modal
    title="Create a new product"
    bind:visible={show_new_item_modal}
>
    <TextInput
        label="Product Name"
        label_top
        bind:value={new_item.name}
    />
    <TextInput
        label="Product Description"
        label_top
        bind:value={new_item.description}
    />
    <DropDown
        items={found_categories}
        bind:value={new_item.category_id}
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
        bind:value={new_item.price}
    />
    <TextInput
        label="Stock"
        number
        label_top
        bind:value={new_item.stock}
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
                disabled={!new_item.name}
                on:click={Save}
            />
        </div>
        <div class="column narrow">
            <Button
                text="Cancel"
                red
                no_margin
                on:click={close_upload_image_modal}
            />
        </div>
    </div>
</Modal>

<script>
import { createEventDispatcher } from 'svelte';
import imageCompression from 'browser-image-compression';
import http from '$http';
const dispatch = createEventDispatcher();
import { onMount } from 'svelte';

import Button from '$components/Button.svelte';
import DropDown from '$components/DropDown.svelte';
import Modal from '$components/Modal.svelte';
import Loading from '$components/Loading.svelte';
import TextInput from '$components/TextInput.svelte';

let loading = false;
let image = {
    image: null,
    image_name: `image-${Number(new Date())}.jpg`,
    preview: null
};
let input;
let found_categories = [];
let new_item = {
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

export let show_new_item_modal = false;

$: render_background = image ? `background-image: url("${image.preview}")` : '';

const close_upload_image_modal = () => {
    show_new_item_modal = false;
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

const Save = async () => {
    let form = new FormData();
    if (image) form.append('file', image.image);
    if (new_item.name) form.append('name', new_item.name);
    if (new_item.description) form.append('description', new_item.description);
    if (new_item.category_id) form.append('category_id', new_item.category_id.id);
    if (new_item.price) form.append('price', new_item.price);
    if (new_item.stock) form.append('stock', new_item.stock);

    await http.axios.post('/admin/items/create', form, {
        headers: { 'content-type': 'multipart/form-data' }
    }).then(
        error => {console.log(error)}
    );
    close_upload_image_modal();
    
    dispatch('added');
};

onMount(async () => {
    await http.axios.get('/categories/get').then(
        succ => {
            if (succ.data.found_categories) {
                found_categories = succ.data.found_categories;
            }
        },
        error => {console.log(error)}
    );
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
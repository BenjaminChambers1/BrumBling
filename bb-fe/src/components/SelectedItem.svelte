<div class="main-container item">
    <div class="image-section central">
        <img
            class="image"
            src="{selected_item.image_url}" 
        />
    </div>
    <div class="info-section">
        <div class="name">{selected_item.name}</div>
        <div class="price">£{selected_item.price}</div>
        {#if !selected_item.stock}
            <div class="out-of-stock">Out of Stock</div>
        {:else}
            <div class="stock">{selected_item.stock}  available</div>
        {/if}
        <div class="row central">
            <Button
                text="Reserve"
                no_margin
                disabled={!selected_item.stock}
                on:click={() => show_reserve_modal = true}
            />
        </div>
        <p class="mt-1">{selected_item.description}</p>
    </div>
</div>
<Modal
    title="Reserve item in store"
    bind:visible={show_reserve_modal}
>
    <TextInput
        label="Email"
        label_top
        email
        bind:value={reserve_data.email}
    />

    <TextInput
        label="Name"
        label_top
        text
        bind:value={reserve_data.name}
    />
    <p>Reserved items will be held in store for a maximum of 3 days</p>
    <div class="row">
        <div class="column narrow mr-0.5">
            <Button
                text="Submit"
                no_margin
                disabled={!reserve_data.email && !reserve_data.name}
                on:click={reserve_item}
            />
        </div>
        <div class="column narrow">
            <Button
                text="Cancel"
                red
                no_margin
                on:click={() => show_reserve_modal = false}
            />
        </div>
    </div>
</Modal>
<script>
import http from '$http';
import Button from '$components/Button.svelte';
import Modal from '$components/Modal.svelte';
import TextInput from '$components/TextInput.svelte';

export let selected_item = null;

let show_reserve_modal = false;
let reserve_data = {
    email: '',
    name: '',
    item_id: null
}

const reserve_item = async() => {
    if (!reserve_data.email || !reserve_data.name) return alert('Please enter your email and name')
    reserve_data.item_id = selected_item.id;
    await http.axios.post('/reserve/item', { reserve_data })
        .catch(console.log);
    selected_item.stock--;
    show_reserve_modal = false;
}
</script>

<style>
.image {
    width: 300px;
    border-radius: 0.5rem;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.item {
    background-color: rgb(241, 241, 241);
    padding: 1rem;
    border-radius: 0.5rem;
}
.central {
    display: flex;
    align-items: center;
    justify-content: center;
}
.price {
    color: var(--red);
}
.info-section {
    text-align: center;
}
</style>
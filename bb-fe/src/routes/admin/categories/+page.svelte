<Button
    classes="fit-content"
    text="Create New Category"
    green
    no_margin
    on:click={open_new_modal}
/>
<TextInput
    classes="mt-0.25"
    label="Search"
    label_top
    bind:value={search_term}
    on:change={reset_page_and_refresh}
/>    

<Table
    headers={[
        { label: 'Name', value: 'name' },
    ]}
    replace_blanks="-"
    data={categories}
    is_loading={loading}
    bind:page_num
    bind:page_size
    bind:total_results
    on:page_change={get_categories}
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

<Modal
    title="Create New Category"
    bind:visible={show_new_modal}
>
    <TextInput
        label="Category"
        label_top
        bind:value={new_category}
    />
    
    <div class="row">
        <div class="column narrow mr-0.5">
            <Button
                text="Submit"
                no_margin
                disabled={!new_category}
                on:click={create}
            />
        </div>
        <div class="column narrow">
            <Button
                text="Cancel"
                red
                no_margin
                on:click={() => show_new_category_modal = false}
            />
        </div>
    </div>
</Modal>

<Modal
    title="Edit Category"
    bind:visible={show_edit_modal}
>
    <TextInput
        label="Category"
        label_top
        bind:value={edit_category.name}
    />
    
    <div class="row">
        <div class="column narrow mr-0.5">
            <Button
                text="Submit"
                no_margin
                disabled={!edit_category.name}
                on:click={Save}
            />
        </div>
        <div class="column narrow">
            <Button
                text="Cancel"
                red
                no_margin
                on:click={() => show_edit_modal = false}
            />
        </div>
    </div>
</Modal>

<script>
import debounce from 'just-debounce-it';
import { onMount } from 'svelte';
import http from '$http';
import Modal from '$components/Modal.svelte';
import TextInput from '$components/TextInput.svelte';
import Button from '$components/Button.svelte';
import Table from '$components/Table.svelte';
let show_new_modal = false;
let show_edit_modal = false;

let categories = [];
let search_term = '';
let loading = true;
let page_num = 1;
let page_size = 10;
let total_results = 0;

let new_category = '';

let edit_category = {
    id: null,
    name: ''
}

const reset_page_and_refresh = () => {
    page_num = 1;
    get_categories();
};

const get_categories = debounce(async () => {
    loading = true;
    const response = await http.axios.post(`/admin/categories/get?page=${page_num}&page_size=${page_size}&search_term=${search_term}`)
        .catch(console.log);
    loading = false;
    if (!response) return alert('Error fetching categories');

    categories = response.data.categories;
    total_results = response.data.total_results || [];
}, 500);

const open_new_modal = () => {
    show_new_modal = true;
}

const open_edit_modal = async (row) => {
    show_edit_modal = true;
    edit_category = {
        id: row.id,
        name: row.name
    };
}

const create = async () => {
    await http.axios.post('/admin/categories/create', { name: new_category }).then(
        error => {console.log(error)}
    );
    show_new_modal = false;
    get_categories();
};

const Save = async () => {
    await http.axios.post('/admin/categories/edit', { id: edit_category.id, name: edit_category.name }).then(
        error => {console.log(error)}
    );
    show_edit_modal = false;
    get_categories();
};

const delete_item = async (row) => {
    if (!confirm(`Are you sure you want to delete ${row.name}?`)) return;
    await http.axios.post('/admin/categories/delete', { id: row.id }).then(
        error => {console.log(error)}
    );
    get_categories();
}

onMount(() => {
    get_categories();
});
</script>
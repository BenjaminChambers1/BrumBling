<Button
    classes="fit-content"
    text="Export"
    green
    no_margin
    on:click={export_csv}
/>



<div class="column narrow mt-0.25">
    <div class="row">
        <div class="column narrow">
            <TextInput
                classes="mt-0.25"
                label="Search"
                label_top
                bind:value={search_term}
                on:change={reset_page_and_refresh}
            /> 
        </div>
        <div class="column narrow ml-1">
            <DatePicker
                label="Date picker"
                bind:this={date_picker}
                bind:minimum_date
                bind:maximum_date
                on:change={reset_page_and_refresh}
            />
        </div>
    </div>
</div>

<Table
    headers={[
        { label: 'Name', value: 'name' },
        { label: 'Category', value: 'category' },
        { label: 'Price', value: 'price' },
        { label: 'Date Collected', value: 'date_collected' },
    ]}
    replace_blanks="-"
    data={collections}
    is_loading={loading}
    bind:page_num
    bind:page_size
    bind:total_results
    on:page_change={get_collections}
>
    <svelte:fragment slot="actions" let:row>
        <!-- <Button
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
        /> -->
    </svelte:fragment>
</Table>


<script>
import debounce from 'just-debounce-it';
import DatePicker from '$components/DatePicker.svelte';
import { onMount } from 'svelte';
import http from '$http';
import TextInput from '$components/TextInput.svelte';
import Button from '$components/Button.svelte';
import Table from '$components/Table.svelte';

let date_picker;
let collections = [];
let search_term = '';
let loading = true;
let page_num = 1;
let page_size = 10;
let total_results = 0;
let maximum_date;
let minimum_date;
let today = new Date();

const reset_page_and_refresh = () => {
    page_num = 1;
    get_collections();
};

const get_collections = debounce(async () => {
    loading = true;
    const response = await http.axios.post(`/admin/collections/get?page=${page_num}&page_size=${page_size}&search_term=${search_term}&maximum_date=${maximum_date}&minimum_date=${minimum_date}`)
        .catch(console.log);
    loading = false;
    if (!response) return alert('Error fetching categories');

    
    collections = response.data.collections;
    for (const collection of collections) {
        collection.date_collected = collection.date_collected.split('T')[0];
    }
    total_results = response.data.total_results || [];
}, 500);

const set_date_picker_to_this_month = () => {
    const d1 = today;
    d1.setDate(1);
    const d2 = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    date_picker.set_date_range(d2, d1);
    maximum_date = d1;
    minimum_date = d2;
};

const export_csv = async() => {
    const response = await http.axios.post(`/admin/collections/get-export?search_term=${search_term}&maximum_date=${maximum_date}&minimum_date=${minimum_date}`)
        .catch(console.log);

    if (!response.data) alert('Error getting gift codes');
    let encodedUri = encodeURI(response.data);
    window.open(encodedUri);
}

onMount(() => {
    set_date_picker_to_this_month();
    get_collections();
});
</script>
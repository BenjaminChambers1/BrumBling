<TextInput
    classes="mt-0.25"
    label="Search"
    label_top
    bind:value={search_term}
    on:change={reset_page_and_refresh}
/>

<Table
    headers={[
        { label: 'ID', value: 'display_number' },
        { label: 'Item', value: 'name' },
        { label: 'Name', value: 'collection_name' },
        { label: 'Email', value: 'email' },
        { label: 'Reserved From', value: 'date_reserved' }
    ]}
    replace_blanks="-"
    data={reservations}
    is_loading={loading}
    bind:page_num
    bind:page_size
    bind:total_results
    on:page_change={get_reservations}
>
    <svelte:fragment slot="actions" let:row>
        <Button
            classes="mr-1"
            text="Confirm"
            green
            no_margin
            on:click={() => confirm_reservation(row)}
        />
        <Button
            text="Delete"
            red
            no_margin
            on:click={delete_reservation(row)}         
        />
    </svelte:fragment>
</Table>

<script>
import debounce from 'just-debounce-it';
import { onMount } from 'svelte';
import http from '$http';
import TextInput from '$components/TextInput.svelte';
import Button from '$components/Button.svelte';
import Table from '$components/Table.svelte';

let reservations = [];
let search_term = '';
let loading = true;
let page_num = 1;
let page_size = 10;
let total_results = 0;

const reset_page_and_refresh = () => {
    page_num = 1;
    get_reservations();
};

const get_reservations = debounce(async () => {
    loading = true;
    const response = await http.axios.post(`/admin/reservations/get?page=${page_num}&page_size=${page_size}&search_term=${search_term}`)
        .catch(console.log);
    loading = false;
    if (!response) return alert('Error fetching categories');

    reservations = response.data.reservations;

    for (const reservation of reservations) {
        reservation.date_reserved = reservation.date_reserved.split('T')[0];
        reservation.display_number = reservation.id.toString().substr(-4);
    }
    
    total_results = response.data.total_results || [];
}, 500);

const confirm_reservation = async (row) => {
    if (!confirm(`Confirm that ${row.collection_name} has purchased the ${row.name}?`)) return;
    await http.axios.post('/admin/reservation/confirm', { id: row.id }).then(
        error => {console.log(error)}
    );
    get_reservations();
};

const delete_reservation = async (row) => {
    if (!confirm(`Are you sure you want to delete ${row.collection_name}'s reservation for a ${row.name}?`)) return;
    await http.axios.post('/admin/reservation/delete', { id: row.id }).then(
        error => {console.log(error)}
    );
    get_reservations();
}

onMount(() => {
    get_reservations();
});
</script>
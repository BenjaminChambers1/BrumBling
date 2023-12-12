<div class="relative">
    {#if label}
        <div class="label">{label}</div>
    {/if}
    {#key browser}
        <input
            class="date-picker mb-0.5"
            id="date_filter"
        />
    {/key}
</div>

<script>
import { browser } from '$app/environment';
import { DateTime } from 'luxon';
import { createEventDispatcher } from 'svelte';

export let label;
export let minimum_date;
export let maximum_date;

const dispatch = createEventDispatcher();

let date_picker;

$: if (browser) init_litepicker();

const init_litepicker = async () => {
    const Litepicker = (await import('litepicker')).default;
    await import('litepicker/dist/plugins/ranges');
    date_picker = new Litepicker({
        element: document.getElementById("date_filter"),
        plugins: ['ranges'],
        ranges: {
            customRanges: {
                'Today': [DateTime.now().toJSDate(), DateTime.now().toJSDate()],
                'Yesterday': [DateTime.now().minus({ days: 1 }).toJSDate(), DateTime.now().minus({ days: 1 }).toJSDate()],
                'Last 7 days': [DateTime.now().minus({ days: 6 }).toJSDate(), DateTime.now().toJSDate()],
                'Last 30 days': [DateTime.now().minus({ days: 29 }).toJSDate(), DateTime.now().toJSDate()],
                'This Month': this_month(new Date()),
                'Last Month': last_month(new Date()),
                'All time': [new Date('2018-01-01'), new Date()] // first start date then end date.
            }
        },
        setup: (picker) =>
            picker.on('selected', (date1, date2) => {
                const format_date = (date) =>
                    `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                    ).padStart(2, '0')}-${String(date.getDate()).padStart(
                        2,
                        '0'
                    )}`;

                minimum_date = format_date(date1.dateInstance);
                maximum_date = format_date(date2.dateInstance);
                dispatch('change');
            }),
    });
    date_picker.setDateRange(minimum_date, maximum_date);
};

export const set_date_range = (date1, date2) => date_picker?.setDateRange(date1, date2);

const last_month = (date) => {
    const d1 = new Date(date);
    d1.setDate(1);
    d1.setMonth(date.getMonth() - 1);
    const d2 = new Date(date.getFullYear(), date.getMonth(), 0);

    return [d1, d2];
};

const this_month = (date) => {
    const d1 = new Date(date);
    d1.setDate(1);
    const d2 = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return [d1, d2];
};
</script>

<style>
.date-picker {
    border-radius: 0.5rem;
    box-sizing: border-box;
    font-size: 0.75rem;
    line-height: 1.05rem;
    margin-top: 0.75rem;
    padding: 0.25rem;
    height: 2rem;
    width: 100%;
}

.date-picker:active {
    border-color: var(--timesheet-blue);
}

.label {
    background-color: #FFF;
    font-size: 0.5rem;
    font-weight: bold;
    left: 0.5rem;
    line-height: 0.5rem;
    padding: 0.2rem;
    position: absolute;
    text-shadow: 0 0 3px #FFF;
    text-transform: uppercase;
    top: 0.25rem;
    z-index: 1;
}

.relative {
    position: relative;
}
</style>
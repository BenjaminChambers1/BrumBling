<div class="menu-container mb-0.5">
    <div 
        class="menu-items"
        on:click={() => navigate('/admin/stock')}
    >
        Stock
    </div>
    <div 
        class="menu-items"
        on:click={() => navigate('/admin/reservations')}
    >
        Reservations
    </div>
    <div 
        class="menu-items"
        on:click={() => navigate('/admin/collections')}
    >
        Collections
    </div>
    <div 
        class="menu-items"
        on:click={() => navigate('/admin/categories')}
    >
        Categories
    </div>
</div>

<script>
import { goto } from '$app/navigation';

const navigate = (url) => {
    goto(url);
}
</script>

<style>
.menu-container {
    width: 100%;
    min-height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--accent);
    font-size: 0.75rem;
    overflow-x: auto;
}

.menu-items {
    padding: 0.75rem;
    cursor: pointer;
    margin-top: 0.5rem;
}

.menu-items:hover {
    border-bottom: 2px solid var(--main);
    padding-bottom: calc(0.75rem - 2px);
    background-color: var(--light-grey);
}
</style>
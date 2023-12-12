<div
    class="menu-container"
    on:click={() => goto('/')}
>
    <div class="clickable">Birmingham Bling</div>
</div>

<script>
import { goto } from '$app/navigation';
</script>

<style>
.menu-container {
    width: 100%;
    min-height: 2.5rem;
    background-color: var(--main);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--secondary);
    font-size: 1.25rem;
    background-image: linear-gradient(var(--main), #c24728);
    overflow-x: auto;
}

.clickable {
    cursor: pointer;
}
</style>
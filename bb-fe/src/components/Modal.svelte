{#if visible}
    <div class="modal">
        <div
            class="modal-container white"
            use:click_outside
            on:clicked_outside={clicked_outside}
        >
            <div class="title-banner">
                <div class="modal-title">
                    <div>
                        {title}
                    </div>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <i
                        class="fa-solid fa-times"
                        on:click={() => visible = false}
                    ></i>
                </div>
            </div>

            <div class="modal-slot">
                <slot />
            </div>
        </div>
    </div>
{/if}

<script>
import { browser } from '$app/environment';
import { click_outside } from '$directives/click-outside';

export let title = '';
export let visible = false;

const clicked_outside = () => {
    if (browser && document.getElementById('image-modal')) return;
    visible = false;
};
</script>

<style>
.modal-container {
    max-width: min(90%, 700px);
    background-color: var(--secondary);
}

.modal {
    background-color: rgba(0, 0, 0, 0.75);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    min-width: 100%;
    z-index: 999;
    overflow-y: scroll;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-title {
    font-size: 1rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem
}

.title-banner {
    background-color: var(--main);
    color: white;
}

.modal-slot {
    padding: 1rem;
}

.fa-solid {
    display: flex;
    align-items: center;
}
</style>
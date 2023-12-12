<div class="kebab-menu-container">
    <div class="dots" on:click|stopPropagation={handle_click}>
        <i class="fa-solid fa-ellipsis-vertical px-0.5"></i>
    </div>
    {#if is_open}
        <div
            class="kebab-menu"
            style={is_to_right ? `left: ${x}px;` : `left: ${-x}px;`}
            use:click_outside
            on:clicked_outside={() => is_open = false}
            on:click|stopPropagation={() => is_open = false}
        >
            <slot />
        </div>
    {/if}
</div>

<script>
import { click_outside } from '$directives/click-outside';

export let is_to_right = false;
export let key;

let is_open = false;
let x;

const handle_click = e => {
    const element = e.target;
    x = is_to_right ? 25 : 90;
    is_open = true;
}
</script>

<style>
.kebab-menu {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    cursor: pointer;
    position: absolute;
    z-index: 10000;
    overflow: hidden;
    width: fit-content;
}

.kebab-menu-container {
    align-items: center;
    display: flex;
}
</style>
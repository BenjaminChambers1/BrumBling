/* Sourced originally from: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7 */
export const click_outside = node => {
    const handle_click = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('clicked_outside', node)
            );
        }
    }

    document.addEventListener('click', handle_click, true);

    return {
        destroy() {
            document.removeEventListener('click', handle_click, true);
        }
    }
}
<div class="loading" />
<style>
.loading {
    margin: auto;
    background-image: url("/SpinnerDark.png");
    height: 5rem;
    width: 5rem;
    background-size: 5rem 5rem;
    background-repeat: no-repeat;
    animation-name: spin;
    animation-duration: 2000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: 2;
}

@keyframes spin {
    from {
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
}
</style>
<div class="banner">
    <div class="overlay" />
    <div class="title-section main-container">
        <h1 class="title">Birmingham Bling</h1>
        <p class="sub-title">
            Discover Birmingham Bing Jewellery Store, where Birmingham's 
            essence meets exquisite craftsmanship, offering an array of rings, 
            necklaces, and cufflinks that embody elegance and style.
        </p>
        <div
            class="button"
            on:click={navigate}
        >
            Shop Now
        </div>
        {#if !scrolled}
            <div
                class="scroll-icon"
                on:click={scroll_down}
            >
                <i class="fas fa-angles-down"></i>
            </div>
        {/if}
    </div>
</div>
<div class="info-section">
    <div class="image-section">
        <img class="ring-image" src="/gold-ring.jpg">
        <div
            class="info button"
            href="/store"
            on:click={navigate}
        >
            Shop Now
        </div>
    </div>
    <div class="text-section">
        <h4>Birmingham Bling</h4>
        Absolutely! Here's a description for your Birmingham-based jewellery store:
        "Welcome to our exquisite Birmingham Bing Jewellery Store, where elegance meets craftsmanship in the heart of this vibrant city. Nestled in the cultural hub, we pride ourselves on curating a stunning collection of fine jewellery, ranging from timeless rings that whisper tales of love and commitment to necklaces that effortlessly elevate any ensemble. Our array of cufflinks blends sophistication with individuality, adding a touch of refinement to every gentleman's wardrobe.

        Each piece in our collection is meticulously crafted, reflecting both contemporary trends and classic designs. As a proud purveyor of quality, we offer a diverse range of styles, ensuring there's something to enchant every taste and occasion.
        Step into our store, where passion for jewellery and dedication to customer satisfaction merge seamlessly. Our knowledgeable team is here to guide you through your jewellery journey, whether you're seeking the perfect engagement ring or a dazzling accessory for a special celebration.

        At Birmingham Bing Jewellery Store, we don't just sell jewellery; we create cherished moments and timeless memories, making every purchase a treasured experience."
        Feel free to tweak or customize it to better fit your store's personality and branding!
    </div>
</div>
<div class="footer">
    <div class="map-section">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9718.258799391842!2d-1.920383080480624!3d52.48701686748402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870bcedc7ccbf23%3A0x7475c2360ebf1512!2sJewellery%20Quarter%2C%20Birmingham!5e0!3m2!1sen!2suk!4v1702400854104!5m2!1sen!2suk" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="contact">
        <p><b>Contact Us</b></p>
        <p class="m-0">07784 376 155</p>
        <p class="m-0">0121 009 677</p>
        <p class="border-bot">info@birminghambling.com</p>
        <p><b>Address</b></p>
        <p class="m-0">Bling Street, Jewellery Quarter</p>
        <p>Birmingham, B17 3EN</p>
    </div>
</div>

<script>
import { goto } from '$app/navigation';
import { onMount } from 'svelte';
import { browser } from '$app/environment';
let scrolled = false;

const navigate = () => {
    goto('/store', {});
}

const handle_scroll = () => {
    if (browser) scrolled = window.scrollY > 1;
};

const scroll_down = () => {
    const element = document.querySelector('.info-section');
    const top_of_element = element.getBoundingClientRect().y;
    let padding_top = window.getComputedStyle(element, null).getPropertyValue('padding-top');
    padding_top = parseInt(padding_top.substring(0, padding_top.length - 2));

    window.scrollTo({
        top: top_of_element - padding_top,
        left: 0,
        behavior: 'smooth'
    });
};

onMount(() => {
    if (browser) {
        window.addEventListener('scroll', handle_scroll);
        handle_scroll();
    }
});

</script>

<style>
.banner {
    background-image: url('/home-banner.jpg');
    background-position: center; /* Center the image */
    background-size: cover;
    height: 100vh;
    position: relative;
}

.border-bot {
    padding-bottom: 1rem;
    border-bottom: solid 2px white;
}

.button {
    background-color: var(--main) !important;
    animation: 1s ease 1 fadeFromBottom;
    padding: 0.5rem 1rem;
    transition: all 300ms ease-in-out, color 300ms ease-in-out;
}

.button:hover {
    transform: scale(1.05);
}

.contact {
    width: calc(50% - 1rem);
    color: white
}

.fa-angles-down {
    animation: 4s ease infinite bounce;
}

.footer {
    align-items: center;
    justify-content: center;
    background-color: var(--main);
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.image-section {
    display: flex;
    width: calc(50% - 10rem);
    flex-direction: column;
    justify-content: center;
    padding: 0rem 4.5rem;
    align-items: center;
}

.info {
    margin-top: auto;
}

.info-section {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 3rem 0;
}

.text-section {
    display: flex;
    width: calc(50% - 1rem);
    flex-direction: column;
    font-size: 0.75rem;
}

.map-section {
    width: calc(50% - 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    font-size: 3rem !important;
    animation: 2s ease 1 fadeIn;
    text-align: center;
    line-height: 3rem;
}

.ring-image {
    width: 300px;
    margin-top: auto;
}

.sub-title {
    animation: 2s ease 1 fadeIn;
    font-size: 0.75rem !important;
    max-width: 800px;
    text-align: center;
}

.overlay {
    position: absolute;
    background-color: black;
    opacity: 0.75;
    height: 100vh;
    width: 100%;
}

.title-section {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    position: relative;
    z-index: 2;
}

.scroll-icon {
    align-items: center;
    background-color: transparent;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    height: 2.5rem;
    justify-content: center;
    left: 50%;
    margin-top: auto;
    position: absolute;
    top: calc(100vh - 3rem);
    transform: translateX(-1.25rem);
    width: 2.5rem;
}

.scroll-icon:hover {
    background-color: #cccccc31;
}

@keyframes bounce {
    0%, 60%   { transform: translateY(0rem); }
    20%  { transform: translateY(0.5rem); }
    40%  { transform: translateY(-0.5rem); }
}

@keyframes fadeFromBottom {
    0% {
        opacity: 0;
        transform: translateY(20%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    0%  { opacity: 0; }
    100%  { opacity: 1; }
}

@media only screen and (max-width: 1160px) {
    .info-section {
        flex-direction: column-reverse;
        margin: 1rem;
    }
    .image-section {
        width: fit-content;
        margin: auto;
    }

    .text-section {
        width: fit-content;
        padding: 1rem;
    }
}

@media only screen and (max-width: 865px) {
    .title {
        font-size: 2.5rem !important;
    }
    .sub-title {
        font-size: 1rem !important;
    }
    .footer {
        flex-direction: column;
    }
    .map-section {
        width: auto;
    }
    .contact {
        width: auto;
        text-align: center;
    }
}

@media only screen and (max-width: 481px) {
    .title {
        font-size: 2rem !important;
    }
    .sub-title {
        font-size: 0.75rem !important;
    }
}
</style>
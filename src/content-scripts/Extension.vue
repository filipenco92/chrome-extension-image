<template>
    <div v-if="result.show" class="yosemite-result">
        {{result.message}}
    </div>
    <div v-else-if="showList" class="yosemite-list">
        <img class="yosemite-list__image" :src="selectedImage" alt="">
        <button @click="showList = false">close</button>
    </div>

    <div v-else-if="imageTooltip" :id="popupId"  class="yosemite-image-tooltip" :style="{top: popupTop, left: popupLeft}">
        <p class="yosemite-image-tooltip__text">yosemite</p>
        <div class="yosemite-image-tooltip__favorite" @click="addToLikes"></div>
        <div class="yosemite-image-tooltip__plus" @click="addToList"></div>
    </div>

</template>

<script>
import { defineComponent } from "vue";
import { POPUP_ID } from './extension.js';

export default defineComponent({
    data: () => ({
        isActive: true,
        imageTooltip: false,
        popupTop: 0,
        popupLeft: 0,
        imageSrc: '',
        result: {
            show: false,
            message: ''
        },
        showList: false,
        selectedImage: '',
    }),
    computed: {
        popupId() {
            return POPUP_ID
        }
    },
    methods: {
        addToLikes() {
            this.result.message = 'added to Likes!'
            this.result.show = true;

            setTimeout(() => {
                this.result.show = false;
                this.result.message = '';
            }, 1000)
        },
        addToList() {
            this.selectedImage = this.imageSrc;
            this.showList = true;
        }
    }
});
</script>

<style lang="scss">
@font-face {
  font-family: 'Archivo-Black';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('@/assets/fonts/ArchivoBlack-Regular.ttf') format('truetype');
}

#yosemite-extension {
    position: static !important;
}
.yosemite-image-tooltip {
    position: absolute;
    min-width: 50px;
    height: 28px;
    z-index: 9999;
    color: #0097D8;
    background-color: #D9D9D9;
    border-radius: 14px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding-left: 15px;
    padding-right: 2px;
    &__text {
        font-family: "Archivo-Black";
        font-size: 12px;
        padding: 0;
        margin-right: 10px;
        margin-top: 0;
        margin-bottom: 0;
    }
    &__favorite, &__plus {
        display: inline-block;
        position: relative;
        width: 24px;
        height: 24px;
        background-color: #006F9F;
        border-radius: 50%;
        &:before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            content: '';
            width: 16px;
            height: 16px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        }

        &:hover {
            cursor: pointer;
            &:before {
                opacity: 0.5;
            }
        }
    }
    &__favorite {
        margin-right: 5px;
        &:before {
            background-image: url('@/assets/favorite.png');
        }

    }
    &__plus {
        &:before {
            background-image: url('@/assets/plus.png');
        }
    }
}

.yosemite-list, .yosemite-result {
    position: fixed;
    background-color: #D9D9D9;
    width: 300px;
    padding: 20px;
    top: 50px;
    right: 20px;
    z-index: 9999;
    &__image {
        width: 100%;
        max-width: 100%;
        height: auto;
    }
}
.yosemite-list {
    padding: 20px;
}
</style>

<template>
  <div>
    <div>
      <button @click="addSword(num)">Добавить меч</button>
      <button @click="addPotion(num)">Добавить зелье</button>
      <button @click="useItemFromBackpack(num)">Использовать предмет</button>
      <button @click="swapItemsInBackpack([1, 2])">Поменять местами 1/2</button>
      <input type="number" v-model="num"/>
    </div>
    <br>
    <h2 v-text="health"/>
    <h5 v-text="impactHealthLogLast5"/>
    <pre v-text="JSON.stringify(playerBackpack, null, 2)"/>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import Sword from '@/modules/cells/Sword';
import Potion from '@/modules/cells/Potion';

export default {
  name: 'IndexPage',

  layout: 'index',

  data: () => ({
    num: 1
  }),

  computed: {
    ...mapState('player', ['health']),
    ...mapGetters('player', ['impactHealthLogLast5']),
    ...mapGetters('backpack', ['playerBackpack']),
  },

  methods: {
    ...mapActions('backpack', ['useItemFromBackpack']),
    ...mapMutations('backpack', ['putItemInBackpack', 'swapItemsInBackpack']),

    addSword(slotBackpackId) {
      const item = new Sword();
      this.putItemInBackpack({ item, slotBackpackId });
    },

    addPotion(slotBackpackId) {
      const item = new Potion();
      this.putItemInBackpack({ item, slotBackpackId });
    }
  },

};
</script>

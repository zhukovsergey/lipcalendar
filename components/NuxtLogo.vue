<template>
  <v-app-bar app color="white" flat>
    <v-container fluid class="py-0 fill-height">
      <v-avatar class="mr-10" color="grey darken-1" size="32" />

      <v-btn v-for="link in links" :key="link._id" text>
        <nuxt-link :to="link.src">
          {{ link.h1 }}
        </nuxt-link>
      </v-btn>
      <v-menu open-on-hover top offset-y>
        <template #activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on" text>
            Dropdown
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in links" :key="index">
            <nuxt-link :to="item.src"></v-list-item-title><v-list-item-title>{{ item.h1 }}</v-list-item-title></nuxt-link>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-spacer />

      <v-responsive max-width="260">
        <v-text-field dense flat hide-details rounded solo-inverted />
      </v-responsive>
    </v-container>
  </v-app-bar>
</template>
<script>
export default {
  data: () => ({
    links: [
      { h1: 'Главная', src: '/' },
      { h1: 'Запись', src: '/notes' },
      { h1: 'Фото', src: '/' },
      { h1: 'Контакты', src: '/' }
    ]
  })
}
</script>

<style></style>

<template>
  <v-app>
    <v-content>
      <dictation />
    </v-content>
  </v-app>
</template>

<script>
import Dictation from './components/Dictation'
export default {
  name: 'App',
  components: {
    Dictation
  }
}
</script>
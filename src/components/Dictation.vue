<template>
  <v-container fluid grid-list-md>
    <v-form>
      <v-layout row wrap>
        <v-flex
          xs12
          md6>
          <v-textarea
            outline
            v-model="main"
            label="Main sentence"
          ></v-textarea>
        </v-flex>
        <v-flex 
          xs12
          md6>
          <v-textarea
            outline
            v-model="student"
            label="Student sentence"
          ></v-textarea>
        </v-flex>
      </v-layout>

      <v-btn @click.prevent="handleSubmit" type="submit" outline block color="indigo" large>Submit</v-btn>
      <h2>{{ result }}</h2>
    </v-form>
  </v-container>
</template>

<script>
import levenshtein from '../helpers/levenshteinDistance';
export default {
  name: 'Dictation',
  data: () => ({
    main: 'the quick brown fox jumps over the lazy dog.',
    student: 'the brown quick fox xxx yyy jups the a lazy cat.',
    result: '',
  }),
  methods: {
    handleSubmit() {
      var { main, student } = this;
      this.result = this.computeAvailable(main, student);
    },
    computeAvailable(first, second) {
      // O(m) = [n-index...]
      let Om = [];
      let mStr = first.split(" ");
      let nStr = second.split(" ");

      for (let m = 0; m < mStr.length; m++) {
        let n;
        for (n = 0; n < nStr.length; n++) {
          if (!Om.includes(n)) {
            if (mStr[m] == nStr[n]) {
              Om.push(n);
              n = -1;
              break;
            }
          }
        }
        if (n > 0) {
          Om.push(-1);
        }
      }
      return this.computeLevenshtein(first, second, Om);
    },
    computeLevenshtein(first, second, Om) {
      let mStr = first.split(" ");
      let nStr = second.split(" ");

      for (let m = 0; m < mStr.length; m++) {
        if (Om[m] != -1) continue;
        let cl = [];
        for (let n = 0; n < nStr.length; n++) {
          if (Om.includes(n)) cl.push(100);
          else cl.push(levenshtein(mStr[m], nStr[n]));
        }
        const min = Math.min.apply(Math, cl);
        Om[m] = min == 1 ? cl.indexOf(min) : -1; //this.findMinIndex(cl);
      }

      // time complexity of On
      let On = [];
      for (let n = 0; n < nStr.length; n++) {
        On.push(Om.indexOf(n))
      }
      return On;
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

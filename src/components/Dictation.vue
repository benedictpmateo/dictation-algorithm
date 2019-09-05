<template>
  <v-container>
    <v-card class="mb-3">
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
        </v-form>
      </v-container>
    </v-card>

    <v-card>
      <v-container>
        <result :items="result"/>
      </v-container>
    </v-card>
    
  </v-container>
</template>

<script>
import Result from './Result';
import levenshtein from '../helpers/levenshteinDistance';

export default {
  name: 'Dictation',
  components: {
    Result,
  },
  data: () => ({
    main: 'the quick brown fox jumps over the lazy dog.',
    student: 'the brown quick fox xxx yyy jups the a lazy cat.',
    result: [],
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

      // Time Complexity O(m)
      // get the same string on increment
      for (let m = 0; m < mStr.length; m++) {
        let n;
        for (n = 0; n < nStr.length; n++) {
          if (!Om.includes(n)) {
            if (mStr[m].replace(/[?!.,]/g, '') == nStr[n].replace(/[?!.,]/g, '')) {
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

      // Time Complexity O(m)
      // get the index of a string in array with levenshtein movement of 1
      for (let m = 0; m < mStr.length; m++) {
        if (Om[m] != -1) continue;
        let cl = [];
        for (let n = 0; n < nStr.length; n++) {
          if (Om.includes(n)) cl.push(100); // i put 100 to have a high value
          else cl.push(levenshtein(mStr[m].replace(/[?!.,]/g, ''), nStr[n].replace(/[?!.,]/g, '')));
        }
        const min = Math.min.apply(Math, cl);
        Om[m] = min == 1 ? cl.indexOf(min) : -1;
      }

      // time complexity of On
      let On = [];
      for (let n = 0; n < nStr.length; n++) {
        On.push(Om.indexOf(n))
      }

      let result = [];
      let n = 0;
      for (let m = 0; m < Om.length; ) {
        if (On[n] == m) {
          result.push({ 
            action: "NORMAL",
            original: mStr[m], 
            word: nStr[n], 
            index: n, 
          });
          n++;
          m++;
        } else if (n + 1 < On.length && On[n] == m + 1 && On[n + 1] == m) {
          result.push({
            action: "ORDER",
            status: "UP",
            original: mStr[m + 1],
            word: nStr[n],
            index: n,
          });
          result.push({
            action: "ORDER",
            status: "DOWN",
            original: mStr[m],
            word: nStr[n + 1],
            index: n + 1,
          });
          n+=2;
          m+=2;
        } else if (On[n] == -1) {
          result.push({
            action: "DELETE",
            word: nStr[n],
            index: n,
          })
          n++;
        } else if (!On.includes(m)) {
          result.push({
            action: "INSERT",
            original: mStr[m],
          });
          m++;
        } else {
          // if nothing catches the index
          On[n] = -1;
        }
      }
      return result;
    }
  },
}
</script>

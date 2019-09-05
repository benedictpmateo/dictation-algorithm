<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="100"
        ></v-img>
        <h1 class="font-weight-bold mb-3">
          Dictation Marking Page
        </h1>
      </v-flex>
      <v-flex xs12 md12>
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-textarea
                  outline
                  name="model"
                  label="Model sentences"
                  no-resize
                  height="200px"
                  v-model="main"
                  :rules="[(v) => Boolean(v) || 'Input teacher\'s model sentences.']"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 md6>
                <v-textarea
                  outline
                  name="model"
                  label="Student sentences"
                  no-resize
                  height="200px"
                  v-model="student"
                  :rules="[(v) => Boolean(v) || 'Input student\'s answer sentences.']"
                ></v-textarea>
              </v-flex>
            </v-layout>
            <v-btn large color="primary" @click.prevent="handleSubmit">Mark</v-btn>
          </v-container>
        </v-form>
      </v-flex>
      <v-flex class="text-sm-left">
        <v-container>
          <v-card color="#26c6da" dark>
            <v-card-title>
              <span class="title font-weight-light">Marking Result</span>
            </v-card-title>
            <v-card-text class="pb-5">
              <result :items="result"/>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Result from './Result';
import { formatStr } from '../helpers/utilities';
import levenshtein from '../helpers/levenshteinDistance';

export default {
  name: 'Dictation',
  components: {
    Result,
  },
  data: () => ({
    main: '',
    student: '',
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
            if (formatStr(mStr[m]) == formatStr(nStr[n])) {
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
          else cl.push(levenshtein(formatStr(mStr[m]), formatStr(nStr[n])));
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
      for (; n < On.length; n++) {
        result.push({
          action: "DELETE",
          word: nStr[n],
          index: n,
        })
      }
      return result;
    }
  },
}
</script>

<template>
  <div v-if="item">
    <div v-if="isSame()">{{ item.word }}</div>
    <div v-else class="row">
      <div class="col" v-for="(action, i) of actions" :key="i" :class="action.type">
        <span class="float">{{ action.letter }}</span>
        <span v-if="action.type == 'insert'" class="hide">{{ action.letter }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Normal",
  props: ['item'],
  data: () => ({
    actions: []
  }),
  watch: {
    item () {
      this.actions = this.getItemActions();
    }
  },
  created () {
    this.actions = this.getItemActions();
  },
  methods: {
    isSame () {
      return this.item.word == this.item.original;
    },
    getItemActions() {
      let result = [];
      let mStr = this.item.original.split('');
      let nStr = this.item.word.split('');
      let n = 0;
      for (let m = 0; m < mStr.length; ) {
        if (nStr[n] == mStr[m]) {
          result.push({ n, letter: nStr[n], type: 'normal' });
          nStr[n] = null;
          n++;
          m++;
        } else if (nStr[n] == mStr[m].toUpperCase()) {
          result.push({ n, letter: nStr[n], type: 'toLower' });
          nStr[n] = null;
          n++;
          m++;
        } else if (nStr[n] == mStr[m].toLowerCase()) {
          result.push({ n, letter: nStr[n], type: 'toUpper' });
          nStr[n] = null;
          n++;
          m++;
        } else if (!nStr.includes(mStr[m])) {
          result.push({ n, letter: mStr[m], type: 'insert' });
          mStr[m] = null;
          m++;
        } else {
          result.push({ n, letter: nStr[n], type: 'remove' });
          nStr[n] = null;
          n++;
        }
      }
      for (; n < nStr.length; n++) {
        result.push({ n, letter: nStr[n], type: 'remove' });
      }
      return result || [];
    }
  }
}
</script>

<style scoped>
.row {
  display: flex;
}
.col {
  position: relative;
}
.hide {
  opacity: 0;
}
.insert {
  margin: 0 3px;
}
.insert > .float {
  position: absolute;
  top: -20px;
}
.insert::before {
  background: red;
  top: 15px;
  content: " ";
  display: block;
  height: 2px;
  left: calc(50% - 8px);
  position: absolute;
  transform: rotate(55deg);
  width: 10px;
}
.insert::after {
  background: red;
  top: 15px;
  content: " ";
  display: block;
  height: 2px;
  position: absolute;
  right: calc(50% - 8px);
  transform: rotate(125deg);
  width: 10px;
}

.remove:before {
  border-top: 3px solid red;
  content: " ";
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 50%;
}

.toLower::after {
  background: red;
  content: " ";
  display: block;
  height: 3px;
  left: -5px;
  position: absolute;
  top: 15px;
  transform: rotate(110deg);
  width: 25px;
  -webkit-transform: rotate(110deg);
}
.toUpper::after {
  border-bottom: 3px solid red;
  bottom: -11px;
  content: " ";
  display: block;
  left: 0;
  position: absolute;
  width: 100%;
}

.toUpper::before {
  border-bottom: 3px solid red;
  border-top: 3px solid red;
  bottom: -6px;
  content: " ";
  display: block;
  height: 8px;
  left: 0;
  position: absolute;
  width: 100%;
}

</style>
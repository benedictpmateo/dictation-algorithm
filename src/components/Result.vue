<template>
  <div>
    <template v-if="items.length > 0">
      <div class="row">
        <div class="col" v-for="(item, i) of items" :key="i">
          <div v-if="item.action == 'NORMAL'">
            <normal :item="item" />
          </div>
          <div v-if="item.action == 'ORDER'">
            <div :class="item.status == 'UP' ? 'col__order--up' : 'col__order--down'"></div>
            <normal :item="item" />
          </div>
          <div v-if="item.action == 'DELETE'" class="col__delete">
            <span>{{ item.word }}</span>
          </div>
          <div v-if="item.action == 'INSERT'" class="col__insert">
            <div class="float">{{ item.original }}</div>
            <span class="hide">{{ item.original }}</span>
          </div>
        </div>
      </div>
    </template>
    <div v-else>No result..</div>
  </div>
</template>

<script>
import Normal from './Normal';
export default {
  name: 'Result',
  components: {
    Normal
  },
  props: ['items'],
  methods: {
      
  }
}
</script>

<style scoped>
* {
  font-size: 24px;
}
.hide {
  opacity: 0;
}
.row {
  display: inline-flex;
  flex-wrap: wrap;
}
.col {
  margin-left: 10px;
  position: relative;
  margin-bottom: 30px;
}
.col__order--up::before {
  background: red;
  content: " ";
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
}
.col__order--up::after {
  background: red;
  content: ' ';
  display: block;
  height: 3px;
  position: absolute;
  right: -22px;
  transform: rotate(70deg);
  top: 16px;
  width: 35px;
  z-index: 1;
  -webkit-transform: rotate(70deg);
}

.col__order--down::before {
  background: red;
  content: " ";
  display: block;
  position: absolute;
  bottom: 0;
  height: 3px;
  width: 100%;
}
.col__delete:before {
  border-top: 3px solid red;
  content: " ";
  display: block;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 50%;
}

.col__insert {
  margin: 0 5px;
}
.col__insert > .float {
  position: absolute;
  top: -20px;
}
.col__insert::before {
  background: red;
  top: 17px;
  content: " ";
  display: block;
  height: 2px;
  left: calc(50% - 12px);
  position: absolute;
  transform: rotate(55deg);
  width: 15px;
}
.col__insert::after {
  background: red;
  top: 17px;
  content: " ";
  display: block;
  height: 2px;
  position: absolute;
  right: calc(50% - 12px);
  transform: rotate(125deg);
  width: 15px;
}
</style>
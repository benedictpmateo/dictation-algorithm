<template>
  <div>
    <template v-if="items.length > 0">
      <div class="row">
        <div class="col" v-for="(item, i) of items" :key="i">
          <div v-if="item.action == 'NORMAL'">
            <span>{{ item.word }}</span>
          </div>
          <div v-if="item.action == 'ORDER'">
            <div :class="item.status == 'UP' ? 'col__order--up' : 'col__order--down'"></div>
            <span>{{ item.word }}</span>
          </div>
          <div v-if="item.action == 'DELETE'" class="col__delete">
            <span>{{ item.word }}</span>
          </div>
          <div v-if="item.action == 'INSERT'" class="col__insert">
            <span>{{ item.original }}</span>
          </div>
        </div>
      </div>
    </template>
    <div v-else>No result..</div>
  </div>
</template>

<script>
export default {
  name: 'Result',
  props: ['items'],
  methods: {
      
  }
}
</script>

<style scoped>
.row {
  display: inline-flex;
}
.col {
  margin-left: 5px;
  position: relative;
}
.col__order--up::before {
  background: red;
  content: " ";
  display: block;
  position: absolute;
  height: 1px;
  width: 100%;
}
.col__order--down::before {
  background: red;
  content: " ";
  display: block;
  position: absolute;
  bottom: 0;
  height: 1px;
  width: 100%;
}
.col__delete {
  text-decoration: line-through;
}
.col__insert {
  color: blue;
}
</style>
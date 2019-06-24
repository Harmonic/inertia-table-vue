import Vue from 'vue'
import InertiaTable from './InertiaTable.vue'

// Vue.config.productionTip = false

const Components = {
  InertiaTable
}

Object.keys(Components).foreach(ame => {
  Vue.component(name, Components[name])
})

export default Components

// new Vue({
//   render: h => h(InertiaTable)
// }).$mount('#app')

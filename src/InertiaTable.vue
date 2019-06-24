<template>
  <div>
    <div v-if="form" class="mb-6 flex justify-between items-center">
      <search-filter v-model="form.search" class="w-full max-w-md mr-4" @reset="reset">
        <label class="mt-4 block text-grey-darkest">Trashed:</label>
        <select v-model="form.trashed" class="mt-1 w-full form-select">
        <option :value="null" />
        <option value="with">With Trashed</option>
        <option value="only">Only Trashed</option>
        </select>
      </search-filter>
      <inertia-link v-if="createLink" class="btn-primary" :href="route(createLink)">
        <span>Create</span>
        <span class="hidden md:inline">{{ entityName }}</span>
      </inertia-link>
    </div>
    <div class="bg-white rounded shadow overflow-x-auto">
    <table class="w-full whitespace-no-wrap">
      <tr class="text-left font-bold">
        <th v-for="header in columns" class="px-6 pt-6 pb-4 cursor-pointer" :class="{'cursor-pointer': order}" :key="header" @click="orderBy(header)">{{ sentanceCase(header) }}</th>
      </tr>
      <tr v-for="(item) in data" :key="item[id]" @click="$emit('item-selected', item)" class="hover:bg-gray-100 focus-within:bg-gray-100 cursor-pointer">
      <td v-for="(column, index) in columns" :key="index" class="border-t" v-bind:class="{ 'px-6 py-4 flex items-center': index === 0 }">
        {{ columnData(item, column) }}
      </td>
      <td class="border-t w-px">
        <p class="px-4 flex items-center">
        <icon name="cheveron-right" class="block w-6 h-6 fill-grey" />
        </p>
      </td>
      </tr>
      <tr v-if="data.length === 0">
      <td class="border-t px-6 py-4" colspan="4">No data found.</td>
      </tr>
    </table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Icon from './components/Icon'
import SearchFilter from './components/SearchFilter'
import Pluralize from 'pluralize'

export default {
  components: {
    Icon,
    SearchFilter
  },
  props: {
    filters: {
      type: Object,
      default: null
    },
    order: {
      type: Object,
      default: null
    },
    columns: {
      type: Array,
      default: null
    },
    data: Array,
    columnDefs: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: 'id'
    },
    routeName: String,
    createLink: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      item: null,
      form: null,
      entityName: ''
    }
  },
  watch: {
    form: {
      handler: _.throttle(function () {
        let query = _.pickBy(this.form)
        this.$inertia.replace(this.route(this.routeName, Object.keys(query).length ? query : { remember: 'forget' }))
      }, 150),
      deep: true
    },
    filters: {
      handler: function () {
        this.createFormData()
      },
      deep: true
    },
    order: {
      handler: function () {
        this.createFormData()
      },
      deep: true
    }
  },
  created: function () {
    if (this.columns === null) {
      // If no specific columns mentioned, use keys from data array
      this.columns = Array.from(this.data.keys())
    }
    if (this.filters !== null || this.order !== null) {
      this.createFormData()
    }
    this.entityName = Pluralize.singular(this.routeName)
  },
  methods: {
    columnData: function (item, column) {
      if (item.hasOwnProperty(column)) {
        return item[column]
      }

      var columnData = this.columnDefs.find(columnDef => {
        return columnDef.hasOwnProperty(column)
      })

      if (columnData !== undefined) {
        return columnData[column](item)
      }

      return 'Column data not found'
    },
    sentanceCase: function (text) {
      const result = text.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1')
      return result.charAt(0).toUpperCase() + result.slice(1)
    },
    formHasChanged: function () {
      if (this.form == null) {
        if (this.filters !== null || this.orderBy !== null) {
          return true
        }
      }

      if (this.filters.search !== this.form.search) {
        return true
      }
      if (this.filters.trashed !== this.form.trashed) {
        return true
      }
      if (this.order.orderColumn !== this.form.orderColumn) {
        return true
      }
      if (this.order.orderDirection !== this.form.orderDirection) {
        return true
      }
      return false
    },
    createFormData: function () {
      // Don't change anything if form data and filter/order data match
      if (!this.formHasChanged()) {
        return
      }

      var filters = {
        search: '',
        trashed: ''
      }
      var order = {
        orderColumn: '',
        orderDirection: 'asc'
      }
      if (this.filters !== null) {
        filters = this.filters
      }
      if (this.order !== null) {
        order = this.order
      }

      this.form = {
        search: filters.search,
        orderColumn: order.orderColumn,
        orderDirection: order.orderDirection,
        trashed: filters.trashed
      }
    },
    reset () {
      this.form = _.mapValues(this.form, () => null)
    },
    orderBy (column) {
      if (this.order == null) {
        return
      }
      var direction = 'asc'
      if (this.form.orderColumn === column) {
        if (this.form.orderDirection === 'asc') {
          direction = 'desc'
        }
      }
      this.form.orderColumn = column
      this.form.orderDirection = direction
    }
  }
}
</script>

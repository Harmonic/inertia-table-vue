# Inertia JS Table for Vue

A Vue component for quickly and easily creating Inertia JS powered tables. Suggested usage with [Inertia table for Laravel](https://github.com/harmonic/inertia-table).

[![Laravel Preset - Click for video](https://github.com/Harmonic/laravel-preset/raw/master/docs/laravel-preset-screenshot.png)](https://www.youtube.com/watch?v=K_d_RboHBbI&feature=youtu.be)

## Project setup

Requires [Inertia JS](https://github.com/inertiajs) to be installed in your project.

```
npm install --save inertia-table
```

or

```
yarn add inertia-table
```

## Using inertia table

### Installing globally

In your main js file:

``` js
import InertiaTable from 'inertia-table'
Vue.use(InertiaTable);
```

### Using within a component

In your component .vue file

``` js
import InertiaTable from 'inertia-table'

export default {
  components: {
	InertiaTable,
	...
  },
  ...
```

Once installed simply use as any other component:

``` html
<inertia-table></inertia-table>
```

## Configuration

The table can be configured with a number of paramaters:

| Paramater  | Required | Type   | Values                                                                                            | Default                    | Description                                                                                                                                                                                                                                                                                                              |
|------------|----------|--------|---------------------------------------------------------------------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| columns    | No       | Array  | ['column1', 'column2']                                                                            | All columns in data array. | The name of the columns (found in the data array) to display in the table.                                                                                                                                                                                                                                               |
| data       | Yes      | Array  | [ 'column1' => 'value1', 'column2' => 'value2' ] [ 'column1' => 'value3', 'column2' => 'value4' ] | None                       | The data that can be displayed in the table.                                                                                                                                                                                                                                                                             |
| id         | No       | String | "ID"                                                                                              | id                         | The name of the column that contains a unique ID. Used to identify a unique row for CRUD operations.                                                                                                                                                                                                                     |
| routeName  | Yes      | String | "users"                                                                                           | None                       | The name of the Inertia JS route related to the data being displayed.                                                                                                                                                                                                                                                    |
| createLink | No       | String | "users.create"                                                                                    | null                       | The route name to follow (via an inertia-link) when create button is clicked.  Will not display create button if set to null (default).                                                                                                                                                                                  |
| filters    | No       | Object | { search: '', trashed: '' }                                                                       | null                       | Data filter information returned from server (see [Inertia Table for Laravel](https://github.com/harmonic/inertia-table) server example.)                                                                                                                                                                                |
| order      | No       | Object | { orderColumn: 'column1', orderDirection: 'asc' }                                                 | null                       | Select a column to order (by column name) and the direction to order (asc or desc).                                                                                    |                                                                           
## Custom columns

By default the table will look for the data value in your data array parameter. If you wish to format your column differently, or add additional columns to your table you can do this using Vue's scoped slots. Your slot name will be the column name and the row data is availabe in the column object. A basic example:

``` js     
<inertia-table 
  :data="users" 
  id="id" 
  :order="order" 
  :filters="filters" 
  :columns="columns" 
  routeName="users" 
  createLink="users.create" 
  @item-selected="show">
    <template slot-scope="column" slot="company">
      {{ column.item.companyName }}
    </template>
</inertia-table>                                                     
```
In the above example we are creating a new column "company" (as per the slot attribute). The slot-scope attribute contains the column details so we can then display them however we want. You can simplify your code to access just the column item if you prefer:

``` js     
<inertia-table 
  :data="users" id="id" 
  :order="order" 
  :filters="filters" 
  :columns="columns" 
  routeName="users" 
  createLink="users.create" 
  @item-selected="show">
    <template slot-scope="{ item }" slot="company">
      {{ item.companyName }}
    </template>
</inertia-table>                                                     
```

This technique allows you to completely customise what is displayed in any column of the table, this may include HTML or other Vue components, eg.

``` js
<inertia-table 
  :data="users" id="id" 
  :order="order" 
  :filters="filters" 
  :columns="columns" 
  routeName="users" 
  createLink="users.create" 
  @item-selected="show">
    <a slot-scope="{ item }" slot="subscription" :href="`/subscriptions?search=${item.id}`" class="underline" v-on:click.stop="">View</a>
</inertia-table>   
```
The above example generates an HTML link to display in a subscription column.

## Events

| Event         | Description                                                  |
|---------------|--------------------------------------------------------------|
| item-selected | Returns the details of the data row clicked on in the table. |

## Example

The below example assumes you are using [harmonic/inertia-table for Laravel](https://github.com/harmonic/inertia-table) to create a backend controller that handles delivery of a User array and filters/orders the data.

``` html
<inertia-table 
  :data="users" 
  id="id" 
  :order="order" 
  :filters="filters" 
  :columns="columns" 
  routeName="users" 
  createLink="users.create" 
  @item-selected="show">
</inertia-table>
```

``` js
<script>
import InertiaTable from 'inertia-table'

export default {
  components: {
    InertiaTable
  },
  props: {
    users: Array,
    filters: Object,
    order: Object,
  },
  data() {
    return {
      columns: ["name", "email"],
    }
  },
  methods: {
    show(user) {
      this.$inertia.replace(this.route('users.edit', user.id));
    }
  },
}
</script>
```
# inertia-table for Vue

A Vue component for quickly and easily creating Inertia JS powered tables. Suggested usage with [Inertia table for Laravel](https://github.com/harmonic/inertia-table).

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
| columnDefs | No       | Array  | [ 'columnName' => function(items) {     return 'value'; }                                         | []                         | Add additional columns that do not exist in the actual data.  Useful for calculating additional fields or manipulating data.  Eg. If you had a first name and last name column and wanted to simply return the full name:  ``` js [ 'name' -> function(items) {    return items.firstName + ' ' + items.lastName } ] ``` |
| id         | No       | String | "ID"                                                                                              | id                         | The name of the column that contains a unique ID. Used to identify a unique row for CRUD operations.                                                                                                                                                                                                                     |
| routeName  | Yes      | String | "users"                                                                                           | None                       | The name of the Inertia JS route related to the data being displayed.                                                                                                                                                                                                                                                    |
| createLink | No       | String | "users.create"                                                                                    | null                       | The route name to follow (via an inertia-link) when create button is clicked.  Will not display create button if set to null (default).                                                                                                                                                                                  |
| filters    | No       | Object | { search: '', trashed: '' }                                                                       | null                       | Data filter information returned from server (see [Inertia Table for Laravel](https://github.com/harmonic/inertia-table) server example.)                                                                                                                                                                                |
| order      | No       | Object | { orderColumn: 'column1', orderDirection: 'asc' }                                                 | null                       | Select a column to order (by column name) and the direction to order (asc or desc).                                                                                                                                                                                                                                      |

## Events

| Event         | Description                                                  |
|---------------|--------------------------------------------------------------|
| item-selected | Returns the details of the data row clicked on in the table. |

### Example

The below example assumes you are using [harmonic/inertia-table for Laravel](https://github.com/harmonic/inertia-table) to create a backend controller that handles delivery of a User array and filters/orders the data.

``` html
<inertia-table :data="users" id="id" :order="order" :filters="filters" :columns="columns" routeName="users" createLink="users.create" @item-selected="show"></inertia-table>
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
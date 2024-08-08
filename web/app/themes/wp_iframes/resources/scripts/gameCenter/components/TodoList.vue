<template>
    <h1>Todo App</h1>
  
    <input
      type="text"
      v-model="todo"
      placeholder="Type item and hit enter"
      @keyup.enter="addTodo"
    />
  
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <input type="checkbox" v-model="todo.completed" />
        {{ todo.title }}
      </li>
    </ul>
  
    <div class="total">
      <span>Completed: {{ numberOfCompletedTodos }}</span>
    </div>
  </template>
  
  <script>
  import { computed, ref, watch } from "vue";
  export default {
    setup() {
      let id = 0;
      console.log("Todo List");
  
      const todo = ref("");
      const todos = ref([]);
  
      const numberOfCompletedTodos = computed(
        () => todos.value.filter((todo) => todo.completed).length
      );
  
      const addTodo = () => {
        todos.value.push({
          id: id,
          title: todo.value.trim(),
          completed: false,
        });
  
        todo.value = "";
  
        id++;
      };
  
      watch(
        todos,
        (newValue) => {
          console.log(`New value: ${newValue.length}`);
        },
        { deep: true }
      );
  
      return {
        todo,
        todos,
        addTodo,
        numberOfCompletedTodos,
      };
    },
  };
  </script>
  
 
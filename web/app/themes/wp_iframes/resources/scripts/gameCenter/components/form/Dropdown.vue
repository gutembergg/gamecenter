<template>
    <div class="dropdown">
      <button @click="toggleDropdown" class="dropdown-button">
        {{ btnTitle }}
        <span
          class="chevron"
          :class="{ rotated: dropdownVisible }"
        >&#9662;</span> <!-- Use chevron down character -->
      </button>
      <div
        ref="dropdownContent"
        class="dropdown-content"
        :style="{ height: dropdownVisible ? contentHeight : '0px' }"
      >
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, nextTick } from 'vue';
  
  export default {
    props: {
        btnTitle: String
    },

    setup() {
      const dropdownVisible = ref(false);
      const dropdownContent = ref(null);
  
      const contentHeight = computed(() => {
        return dropdownVisible.value && dropdownContent.value
          ? `${dropdownContent.value.scrollHeight}px`
          : '0px';
      });
  
      const toggleDropdown = () => {
        dropdownVisible.value = !dropdownVisible.value;
  
        // Force re-calculation of height after DOM updates
        nextTick(() => {
          contentHeight.value;
        });
      };
  
      return {
        dropdownVisible,
        dropdownContent,
        contentHeight,
        toggleDropdown,
      };
    },
  };
  </script>
  
  <style scoped>
  .dropdown {
    position: relative;
    display: inline-block;
    width: 70%;
  }
  
  .dropdown-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    text-align: left;
    border: none;
    border-bottom: 2px solid #ccc;
    background-color: #f9f9f9;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    outline: none;
    transition: border-color 0.3s ease;
  }
  
  .dropdown-button:hover {
    border-bottom-color: #888;
  }
  
  .chevron {
    transition: transform 0.3s ease;
    display: inline-block;
  }
  
  .chevron.rotated {
    transform: rotate(180deg);
  }
  
  .dropdown-content {
    overflow: hidden;
    transition: height 0.3s ease;
  }
  </style>
  
<template>
        <el-select
        v-model="value"
        placeholder="Select"
        size="large"
        style="width: 240px"
        effect="dark"
        v-bind="$attrs"
        @change="$emit('update:modelValue', $event.target.value)"
        >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
        </el-select>
</template>

<script>
import { ref } from "vue";

export default {
    props: {
        options: Array
    },
    emits: ['update:modelValue'],
    
    setup (props) {
        const options = ref([]);
        const value = ref({});
        options.value = props.options


        return {
            options,
            value
        }
    }
}
</script>

<style lang="css" scoped>

</style>
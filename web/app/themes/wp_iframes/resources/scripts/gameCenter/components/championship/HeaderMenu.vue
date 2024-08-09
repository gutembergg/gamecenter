<template>
    <div id="gc_submenu" class="gc_submenu-container">
       <div class="gc_submenu-content">
           <div id="gc_submenu-header" class="gc_submenu-header">
               <button id="current" @click="($event) => selectSession($event)" :class="['gc_submenu-buttons', { active: activedSession === 'current' }]">Actuel</button>
               <button id="results" @click="($event) => selectSession($event)" :class="['gc_submenu-buttons', { active: activedSession === 'results' }]">Resultats</button>
               <button id="table" @click="($event) => selectSession($event)" :class="['gc_submenu-buttons', { active: activedSession === 'table' }]">Tableau</button>
               <button id="matchPlans" @click="($event) => selectSession($event)" :class="['gc_submenu-buttons', { active: activedSession === 'matchPlans' }]">Plans de matches</button>
           </div>
       </div>
   </div>
</template>

<script>
import { ref } from "vue";

export default {
    emits: ['selectedSession'],
    setup (props, { emit }) {
        const activedSession = ref("current");

        const selectSession = (event) => {
            const id = event.target.id;
            activedSession.value = id;
            emit('selectedSession', { id })
        }
        return { activedSession, selectSession }
    }
}
</script>

<style lang="css" scoped>

.gc_submenu-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
}

.gc_submenu-content {
    width: 80%;
    margin: 0 auto;
}

.gc_submenu-header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 3px;
    padding: 10px;
}

.gc_submenu-buttons {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.3s ease, border-bottom 0.3s ease;
    text-align: center;
    background-color: #d40018;
    color: white;
    height: 3rem;
}

.gc_submenu-buttons:focus {
    outline: none;
    background: #8B0000;
}
    .gc_submenu-buttons.active {
        outline: none;
        background: #8B0000;
    }

.gc_submenu-result {
    margin-top: 20px;
    padding: 20px;
    background-color: #f9f9f9;
}

.gc_submenu-buttons:hover {
    background: #8B0000 !important;
}

#gc_submenu {
    /* display: none; */
}

</style>
<template>
    <div>
        <HeaderMenu v-if="games.current || games.results || games.matchPlans" @selectedSession="selectedSession" />
        <Games v-if="activedSession === 'current'" :games="games.current" />
        <Games v-if="activedSession === 'results'" :games="games.results" />
        <Games v-if="activedSession === 'matchPlans'" :games="games.matchPlans" />
    </div>
</template>

<script>
import { ref } from 'vue';
import HeaderMenu from './HeaderMenu.vue';
import Games from '../games/Games';


export default {
    props: {
        games: Array
    },
    components: {
        HeaderMenu,
        Games
    },
    setup (props) {
        const activedSession = ref('current');

        const selectedSession = (session) => {
            activedSession.value = session.id;
        }

        return { activedSession, selectedSession }
    }
}
</script>

<style lang="css" scoped>

</style>
<template>
    <div>
        <HeaderMenu v-show="games.current || games.results || games.matchPlans" @selectedSession="selectedSession" />
        <Games v-show="activedSession === 'current'" :games="games.current" @selectedTeamId="selectedTeam" />
        <Games v-show="activedSession === 'results'" :games="games.results" @selectedTeamId="selectedTeam"/>
        <Games v-show="activedSession === 'matchPlans'" :games="games.matchPlans" @selectedTeamId="selectedTeam"/>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import HeaderMenu from './HeaderMenu.vue';
import Games from '../games/Games';


export default {
    props: {
        games: Object,
        sessionActived: String
    },
    components: {
        HeaderMenu,
        Games
    },
    emits: ['activedSession'],

    setup (props, ctx) {
        const activedSession = ref('current');

        onMounted(() => {
            if(props.sessionActived === 'championship'){
                activedSession.value = 'current'
            }
        });

        const selectedSession = (session) => {
            activedSession.value = session.id;
        }

        const selectedTeam = (event) => {
            const id = event.id;
            activedSession.value = 'teams';
            ctx.emit('activedSession', { activedSession, id });
        }

        return { activedSession, selectedSession, selectedTeam }
    }
}
</script>

<style lang="css" scoped>

</style>
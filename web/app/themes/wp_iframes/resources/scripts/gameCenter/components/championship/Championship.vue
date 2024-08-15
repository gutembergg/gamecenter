<template>
    <div>
        <HeaderMenu v-show="games.current || games.results || games.matchPlans" @selectedSession="selectedSession" />
        <Games v-show="activedSession === 'current'" :games="games.current" @selectedTeamData="selectedTeam" />
        <Games v-show="activedSession === 'results'" :games="games.results" @selectedTeamData="selectedTeam"/>
        <Games v-show="activedSession === 'matchPlans'" :games="games.matchPlans" @selectedTeamData="selectedTeam"/>
        <div class="rank-wrapper">
            <RankTable v-show="activedSession === 'table'" :teamsRank="games.table" :group="selectedOption" @selectedTeam="selectedTeam" />
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import HeaderMenu from './HeaderMenu.vue';
import Games from '../games/Games';
import RankTable from "./RankTable";


export default {
    props: {
        games: Object,
        sessionActived: String,
        selectedOption: Object
    },
    components: {
        HeaderMenu,
        Games,
        RankTable
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
            const caption = event.caption;
            activedSession.value = 'teams';
            ctx.emit('activedSession', { activedSession, id, caption });
        }

        return { activedSession, selectedSession, selectedTeam }
    }
}
</script>

<style lang="css" scoped>

.rank-wrapper {
    width: 78%;
    margin: 0 auto;
}

</style>
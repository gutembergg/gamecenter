<template>
    <div>
        <HeaderMenu v-show="games.current || games.results || games.matchPlans" @selectedSession="selectedSession" />
        <div v-if="isLoading">
            <div class="loading-icon_championship">
                <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#d40018" d="m6.4046645 6.6961643c-.021775-.89502-.2080687-1.76101-.5492045-2.55685-2.1968182 1.02564-3.8105601 2.96082-4.3621841 5.24432.3242001.7450397.7959837 1.4102597 1.3766404 1.9617897.5492045-1.9158297 1.7951973-3.5752397 3.5347482-4.6492597z"/>
                    <path fill="gray" d="m5.5119046 3.4450643c-.3629104-.6386-.8346941-1.2119-1.3887373-1.71021-2.201657 1.20465-3.50329593 3.69861-3.0242541 6.34254.8080807-2.01016 2.3806927-3.67683 4.4129914-4.63233z"/>
                    <path fill="gray" d="m10.050705 7.4385843c.208069-2.41413-.6604969-4.77746-2.358918-6.39575-.3556522-.0411-1.2484121-.13304002-2.3927898.20561 1.386318 1.43445 2.2016569 3.34302 2.262142 5.38704.7863061.42816 1.6282584.7015 2.4895658.8031z"/>
                    <path fill="gray" d="m7.0337093 7.6683843c-.7645314.46686-1.4201897 1.06193-1.9403614 1.75617 1.9839106 1.3860697 4.463799 1.8166497 6.7138441 1.1562697.476622-.6386097.827436-1.3739697 1.020988-2.1746497-.643561.15965-1.29922.25157-1.957297.25157-1.3209943-.002-2.6347303-.34107-3.8371737-.98936z"/>
                    <path fill="#d40018" d="m4.6554359 10.080104c-.3677493.62893-.6217866 1.31591-.7766285 2.03677.9096957.55636 1.9766526.88292 3.1234497.88292 1.475836 0 2.8234436-.53459 3.8686259-1.41752-2.7315064.38946-4.9186469-.5999-6.2154471-1.50217z"/>
                    <path fill="#d40018" transform="translate(1,0)" d="m8.0176199 1.3572943c1.3379301 1.70296 1.9960081 3.89938 1.8048751 6.13451.733079.005 1.463738-.11611 2.170204-.34349 0-.0484.0073-.0968.0073-.14514 0-2.60765-1.66213-4.81617-3.982338-5.64588z"/>
                </svg>
            </div>
        </div>
        <div v-else class="championship-content">
            <Games v-show="activedSession === 'current'" :games="games.current" @selectedTeamData="selectedTeam" />
            <Games v-show="activedSession === 'results'" :games="games.results" @selectedTeamData="selectedTeam"/>
            <Games v-show="activedSession === 'matchPlans'" :games="games.matchPlans" @selectedTeamData="selectedTeam"/>
            <div class="rank-wrapper">
                <RankTable v-show="activedSession === 'table'" :teamsRank="games.table" :group="selectedOption" @selectedTeam="selectedTeam" />
            </div>
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
        selectedOption: Object,
        isLoading: Boolean
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

.championship-content {
    width: 78%;
    margin: 0 auto;
}

.rank-wrapper {
    width: 100%;
    margin: 0 auto;
}

.loading-icon_championship {
    margin: 80px auto;
    width: 50px;
    height: 50px;
    animation: rotate 2s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media(max-width: 560px){
    .championship-content {
    width: 93%;
    }
}

@media(max-width: 560px){
    .championship-content {
    width: 93%;
    }
}


</style>
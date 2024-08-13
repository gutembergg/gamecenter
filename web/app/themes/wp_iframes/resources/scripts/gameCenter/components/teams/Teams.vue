<template>
    <div class="container">
       <div v-if="teams" class="select-search-box">
            <Vueform>
                <SelectElement
                    :default="teamOptions.label"
                    name="select"
                    :search="true"
                    :native="false"
                    :strict="true"
                    :items="teams"
                    @change="handlerTeamsOptions"
                />
            </Vueform>
       </div>

       <div class="team-content">
        <div>Logo du Club</div>
            <div class="team-images">
                <div v-if="team !== null && team.teamlogo" class="team-logo">
                    <img :src="team.teamlogo" alt="team logo"/>
                </div>
                <div v-if="team !== null && team.staff" v-for="teamImg in team.staff" class="team-images-box">
                    <img :src="teamImg.image" alt="club image" />
                </div>
            </div>

            <div class="team-dropdowns">
                <div>Tableau</div>
                <div>Plans de matches</div>
            </div>
       </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useApiFetch } from "../../hooks/useApiFetch";
import {usePopulateOptions} from '../../hooks/usePopulateOptions';


export default {
    props: {
        selectedTeamInfo: Object,
    },
    setup (props) {

        const { isLoading, response, error, fetchData } = useApiFetch();
        const { populateTeamsOptions, getTeamApiByCaption } = usePopulateOptions();

        const listTeams = ref(null);
        const teamOptions = ref({ value: props.selectedTeamInfo.id, label: props.selectedTeamInfo.caption });
        const teams = ref(null);
        const team = ref(null);

        onMounted(async () => {
            if(props.selectedTeamInfo){
                await fetchData('teams', props.selectedTeamInfo.id);
                team.value = response.value;
                listTeams.value = await populateTeamsOptions({ region: 'SVRG', gender: 'f' });
                teams.value = formatObject(listTeams.value); 
            }
        });

        const handlerTeamsOptions = async (newValue) => {
            const result =  getTeamByCaption(listTeams.value, newValue);
            team.value = result;

        }

        const getTeamsOptions = async () => {
           return await populateTeamsOptions({ region: 'SVRG', gender: 'f' });
        }

        function getTeamByCaption(arr, caption) {
            return arr.find(obj => obj.caption === caption);
        }

        const formatObject = (data) => {
        return data.map(obj => obj.caption);
    }
        
        return { teamOptions, teams, team, handlerTeamsOptions, getTeamsOptions }
    }
}
</script>

<style lang="css" scoped>

.container {
    width: 80%;
    margin: 0 auto;
}

.team-content {
    padding-top: 25px;
}

.select-search-box {
    max-width: 300px;
}

.team-images {
    display: flex;
    flex-direction: row;
    margin-top: 1.4rem;
}

.team-logo {
    max-width: 20%;
}

.team-images-box {
    max-width: 40%;
}

</style>
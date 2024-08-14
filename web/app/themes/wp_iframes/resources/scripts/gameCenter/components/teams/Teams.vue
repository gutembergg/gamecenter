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

       <div class="team-container">
            <div class="team-row">
                <div class="logo-text">Logo du Club</div>

                <div v-if="team !== null && team.teamlogo" class="team-logo">
                    <img :src="team.teamlogo" alt="team logo"/>
                </div>
                <div v-if="team !== null && team.staff" v-for="teamImg in team.staff" class="team-images-box">
                    <img :src="teamImg.image" alt="club image" />
                </div>
            </div>

            <div class="team-leagues">{{ selectedTeamInfo.leagues }}</div>
            <div v-if="team" class="team-dropdowns">
                <Dropdown btnTitle="Tableau">
                    <RankTable :clubId="team.club.clubId" />
                </Dropdown>

                <Dropdown btnTitle="Plans de matches">
                    <div>Plans de matches</div>
                </Dropdown>
            </div>
       </div>

       
    </div>

   
</template>

<script>
import { onMounted, ref } from 'vue';
import { useApiFetch } from "../../hooks/useApiFetch";
import { usePopulateOptions } from '../../hooks/usePopulateOptions';
import { convertObjectToStringArray, getByCaption } from "../../helpers/formaterFunctions";
import Dropdown from "../form/Dropdown";
import RankTable from "../championship/RankTable";


export default {
    props: {
        selectedTeamInfo: Object,
    },
    components: {
        Dropdown,
        RankTable
    }, 

    setup (props) {

        const { isLoading, response, error, fetchData } = useApiFetch();
        const { populateTeamsOptions } = usePopulateOptions();

        const listTeams = ref(null);
        const teamOptions = ref({ value: props.selectedTeamInfo.id, label: props.selectedTeamInfo.caption });
        const teams = ref(null);
        const team = ref(null);

        onMounted(async () => {
            if(props.selectedTeamInfo){
                await fetchData('teams', props.selectedTeamInfo.id);
                team.value = response.value;
                listTeams.value = await populateTeamsOptions({ region: 'SVRG', gender: props.selectedTeamInfo.gender });
                teams.value = convertObjectToStringArray(listTeams.value); 
            }

            console.log("team:::", team.value.club.clubId);
        });

        const handlerTeamsOptions = async (newValue) => {
            const result =  getByCaption(listTeams.value, newValue);
            team.value = result;

        }

        const getTeamsOptions = async () => {
           return await populateTeamsOptions({ region: 'SVRG', gender: 'f' });
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

.team-container {
  min-height: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.team-row {
  display: flex;
  width: 100%;
}

.team-logo {
    width: 40%;
}

.team-image {
  width: 60%;
}

.team-logo img,
.team-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.team-other-images {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.team-other-images img {
  width: calc(100% / 3);
  height: auto;
  margin: 5px;
}

.team-dropdowns {
    display: flex;
    flex-direction: column;
}

.team-leagues {
    color: #d40018;
}

.select-search-box {
    margin-bottom: 2rem;
}

/* .team-content {
    padding-top: 25px;
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
} */

</style>
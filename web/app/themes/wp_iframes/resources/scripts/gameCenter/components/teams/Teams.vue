<template>
    <div class="teams-container">
       <div class="select-search-box">
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

       <div v-if="team"  class="team-container">
            <div class="logo-text">Logo du Club</div>
            <div class="team-row">
                <div v-if="team !== null && team.teamlogo" class="team-logo">
                    <img :src="team.teamlogo" alt="team logo"/>
                </div>
                <div  class="team-images-box">
                    <img :src="'data:image/jpeg;base64,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'" alt="club image" />
                </div>
            </div>

            <div class="team-leagues">{{ selectedTeamInfo.leagues?.caption }}</div>
            <div v-if="team" class="team-dropdowns">
                <Dropdown btnTitle="Tableau">
                    <RankTable :teamsRank="teamsRank" :currentTeam="team" />
                </Dropdown>

                <Dropdown btnTitle="Plans de matches">
                    <Games v-if="teamPlanMatchs" :games="teamPlanMatchs" />
                </Dropdown>

                <Dropdown btnTitle="Club">
                    <div>Club</div>
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
import Games from "../games/Games";

//v-if="team !== null && team.staff" v-for="teamImg in team.staff"
export default {
    props: {
        selectedTeamInfo: Object,
    },
    components: {
        Dropdown,
        RankTable,
        Games
    }, 

    setup (props) {

        const { isLoading, response, error, fetchData } = useApiFetch();
        const { populateTeamsOptions, populateGames } = usePopulateOptions();

        const listTeams = ref(null);
        const teamOptions = ref({ value: props.selectedTeamInfo.id, label: props.selectedTeamInfo.caption });
        const teams = ref(null);
        const team = ref(null);
        const teamsRank = ref(null);
        const teamPlanMatchs = ref(null);

        console.log("props.selectedTeamInfo: ", props.selectedTeamInfo);

        onMounted(async () => {
           await initData();
        });

        const handlerTeamsOptions = async (newValue) => {
            const result =  getByCaption(listTeams.value, newValue);
            team.value = result;
            await getClubRank(result.teamId);
        }

        const getTeamsOptions = async () => {
           return await populateTeamsOptions({ region: 'SVRG', gender: 'f' });
        }

        const getClubRank = async (id) => {
            await fetchData('ranking', id);
            teamsRank.value = response.value;
        }

        const getTeamPlansMatch = async () => {
            teamPlanMatchs.value = await populateGames('upcomingGames',
                { 
                    region: 'SVRG',
                    gender: props.selectedTeamInfo.gender,
                    leagueId: props.selectedTeamInfo.leagues.id,
                    phaseId: props.selectedTeamInfo.phases,
                    groupId: props.selectedTeamInfo.groups,
                    teamId: props.selectedTeamInfo.id
                });
        }

        const initData = async () => {
            if(props.selectedTeamInfo.id && props.selectedTeamInfo.groups && props.selectedTeamInfo.leagues){
                await fetchData('teams', props.selectedTeamInfo.id);
                team.value = response.value;
                listTeams.value = await populateTeamsOptions({ region: 'SVRG', gender: props.selectedTeamInfo.gender });
                teams.value = convertObjectToStringArray(listTeams.value); 
                await getClubRank(props.selectedTeamInfo.groups);
                await getTeamPlansMatch();
            } else {
                listTeams.value = await populateTeamsOptions({ region: 'SVRG' });
                teams.value = convertObjectToStringArray(listTeams.value);
            }
        }

        return { teamOptions, teams, team, teamsRank, teamPlanMatchs, handlerTeamsOptions, getTeamsOptions }
    }
}
</script>

<style lang="css" scoped>

.teams-container {
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
  justify-content: space-between;
  align-items: center;
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
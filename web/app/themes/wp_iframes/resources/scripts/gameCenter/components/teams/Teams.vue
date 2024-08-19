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
                >
                    <template v-slot:option="{ option }">
                        <div>
                            <div>{{ option.label }}</div>
                        </div>
                    </template>
                </SelectElement>
            </Vueform>
       </div>

       <div v-if="team" class="team-container">
            <div class="logo-text">Logo du Club</div>
            <div class="team-row">
                <div v-if="team !== null && team.teamlogo" class="team-logo">
                    <img :src="team.teamlogo" alt="team logo"/>
                </div>
                <div v-if="team !== null && team.staff" v-for="teamImg in team.staff" class="team-images-box">
                    <img :src="teamImg.image" alt="club image" />
                </div>
            </div>

            <div class="team-leagues">{{ team.league?.caption }}</div>
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
import { convertObjectToStringArray } from "../../helpers/formaterFunctions";
import Dropdown from "../form/Dropdown";
import RankTable from "../championship/RankTable";
import Games from "../games/Games";

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
        const { populateTeamsOptions, populateGames, populateClubs } = usePopulateOptions();

        const listTeams = ref(null);
        const teamOptions = ref({ value: props.selectedTeamInfo.id, label: props.selectedTeamInfo.caption });
        const teams = ref(null);
        const team = ref(null);
        const teamsRank = ref(null);
        const teamPlanMatchs = ref(null);

        onMounted(async () => {
           await initData();
        });

        const handlerTeamsOptions = async (newValue) => {
            const result = getByCaption(listTeams.value, newValue);
            team.value = result;

            // await fetchData('ranking', null, {clubId: team.value.club.clubId});
            // teamsRank.value = response.value;
        }

        const getClubRank = async (id) => {
            await fetchData('ranking', id);
            teamsRank.value = response.value;
        }

        const getTeamPlansMatch = async () => {
            teamPlanMatchs.value = await populateGames('upcomingGames',
                { 
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

                console.log("team.value:: ", team.value)
                
                await getClubRank(props.selectedTeamInfo.groups);
                await getTeamPlansMatch();
            } 
                listTeams.value = await populateTeamsOptions({ region: 'SVRG' });
                teams.value = convertObjectToStringArray(listTeams.value);
        }

        const getByCaption = (arr, caption) => {
            return arr.find(obj => obj.caption === caption);
        }

        return { teamOptions, teams, team, teamsRank, teamPlanMatchs, handlerTeamsOptions }
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
    max-width: 340px;
    margin-bottom: 2rem;
}

@media(max-width: 560px){
    .teams-container {
        width: 93%;
    }
}


</style>
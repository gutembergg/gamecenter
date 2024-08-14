<template>
  <div class="container">
    <table border="1">
      <thead>
        <tr>
          <th>Rang</th>
          <th>Equipe</th>
          <th>Matches</th>
          <th>V</th>
          <th>V+</th>
          <th>V-</th>
          <th>D</th>
          <th>D+</th>
          <th>D-</th>
          <th class="center">Sets</th>
          <th class="center">Balles</th>
          <th class="end">Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="team in teams" :key="team.teamId" class="row-border">
          <td>{{ team.rank }}</td>
          <td @click="selectTeams(team.teamId, team.teamCaption)" class="team-caption">{{ team.teamCaption }}</td>
          <td>{{ team.games }}</td>
          <td>{{ team.wins }}</td>
          <td>{{ team.winsClear }}</td>
          <td>{{ team.winsNarrow }}</td>
          <td>{{ team.defeats }}</td>
          <td>{{ team.defeatsClear }}</td>
          <td>{{ team.defeatsNarrow }}</td>
          <td class="center">{{ team.setsWon }} : {{ team.setsLost }}</td>
          <td class="center">{{ team.ballsWon }} : {{ team.ballsLost }}</td>
          <td class="end">{{ team.points }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useApiFetch } from "../../hooks/useApiFetch";

export default {
    props:{
        teams: Array,
        group: Object,
        clubId: Number || String

    },
    emits: ['selectedTeam'],

    setup (props, ctx) {
        const teams = ref(null);
        const { isLoading, response, error, fetchData } = useApiFetch();

        onMounted(async () => {
          if(props.group){
            await fetchData('ranking', props.group.groups);
            teams.value = response.value;
          } 

          if(props.clubId){
            await fetchData('ranking', null, { clubId: props.clubId});
            teams.value = response.value;
          }
        });

        const selectTeams = (id, caption) => {
          ctx.emit('selectedTeam', { id, caption })
        }
    
        return {
            teams,
            selectTeams
        }
    }
}
</script>

<style lang="css" scoped>

.container {
  width: 78%;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  color: #666;
}

th, td {
  padding: 8px;
  text-align: left;
}

.center {
  text-align: center;
} 

.end {
  text-align: end;
} 
.row-border {
  border-bottom: 1px solid #d9d9d9;
}

.team-caption {
cursor: pointer;
}

.team-caption:hover {
  color: #d40018;
  text-decoration: underline #d40018;
}

</style>
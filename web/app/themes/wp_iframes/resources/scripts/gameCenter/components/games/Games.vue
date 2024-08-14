<template>
  <div>
    <div v-for="item in games" :key="item.date" class="games_container">
      <h3 class="game-date">{{ convertDate(item.date) }}</h3>
      <ul>
        <Game
          v-for="game in item.games"
          :key="game.gameId"
          :game="game"
          @selectedTeamInfo="selectedTeam"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import Game from './Game';
export default {
    props: {
        games: Array,
  },
  components: {
    Game
  },
  emits: ['selectedTeamData'],

  setup (props, ctx) {
        
      const convertDate = (dateStr) => {
          const date = new Date(dateStr);

          // Create a formatter for the full weekday name in French
          const optionsWeekday = { weekday: 'long' };
          const weekdayFormatter = new Intl.DateTimeFormat('fr-FR', optionsWeekday);
          const weekday = weekdayFormatter.format(date);

          // Create a formatter for the date in dd.MM.yyyy format
          const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
          const dateFormatter = new Intl.DateTimeFormat('fr-FR', optionsDate);
          const formattedDate = dateFormatter.format(date);

          return `${weekday}, ${formattedDate}`;
      }

      const selectedTeam = (event) => {
        const id = event.id;
        const caption = event.caption;
        ctx.emit('selectedTeamData', { id, caption });
      }
        return { convertDate, selectedTeam }
    }
}
</script>

<style lang="css" scoped>
.games_container {
    width: 78%;
    margin: 0 auto;
    padding-bottom: 14px;
}

.game-date {
  background-color: #707070;
  color: white;
  padding-left: 5px;
  width: 20%;
  border-top-left-radius: 4px;  
  border-top-right-radius: 4px;
}


@media (max-width: 1150px) {
  .game-date {
  width: 40%;

  }
}

@media (max-width: 600px) {
  .game-date {
  width: 100%;
  }
}

</style>
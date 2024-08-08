<template>
    <div v-for="item in games" :key="item.date" class="games_container">
      <h3 class="game-date">{{ convertDate(item.date) }}</h3>
      <ul>
        <Game
          v-for="game in item.games"
          :key="game.gameId"
          :game="game"
        />
      </ul>
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
    setup (props) {
        
      function convertDate(dateStr) {
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
        return {convertDate}
    }
}
</script>

<style lang="css" scoped>
.games_container {
    width: 79%;
    margin: 0 auto;
}

</style>
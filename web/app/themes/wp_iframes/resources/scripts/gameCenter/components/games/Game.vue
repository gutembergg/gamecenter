<template>
  <li class="game-item-wrapper" @click="openDropdown">
    <div class="game-item">
    <div class="game-time">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#d40018">
          <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clip-rule="evenodd" />
      </svg>
      <div class="game-hours">{{ convertHours(game.playDate) }}</div>
    </div>
    <div class="game-teams game-teams_home">
      <span id="${game.teams.home.teamId}" class="game-teams_text">{{ game.teams.home.caption }}</span>
    </div>
    <div class="game-vs">
          <span class="vs">VS</span>
    </div>
    <div class="game-teams game-teams_away">
      <span id="${game.teams.away.teamId}" class="game-teams_text">{{ game.teams.away.caption }}</span>
    </div>
    <div class="game-teams_mobile">
      <div class="">
        <span>{{ game.teams.home.caption }}</span>
      </div>
      <div class="">
        <span class="">{{ game.teams.away.caption }}</span>
      </div>
    </div>
    <div class="game-hall-info">
      <div class="game-hall-info_icon">
          <a :href="`https://www.google.ch/maps/search/?api=1&query=${game.hall.street} ${game.hall.number} ${game.hall.zip} ${game.hall.city}`" target="_blank"><svg width="15px" height="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#d40018" fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg></a>
      </div>
      <div class="hall-name">{{ game.hall.caption }}, {{ game.hall.street }}, {{ game.hall.number }}, {{ game.hall.zip }}, {{ game.hall.city }}</div>
    </div>
      <div class="icon-chevron">
          <svg width="10" height="10" viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,0 3,2.5 0,5" fill="black" />
          </svg>
      </div>
    </div>
    <div class="game-dropdown" :class="{active: activeDropdown}">
      <div class="game-dropdown-content">
        <div class="game-hall-info_mobile">
          <div class="hall-name">
            <div class="hall-name_text">Salle:</div>
            <div class="game-hall-info_icon-mobile">
              <a href="https://www.google.ch/maps/search/?api=1&query=${game.hall.street} ${game.hall.number} ${game.hall.zip} ${game.hall.city}" target="_blank"><svg width="15px" height="15px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#d40018" fill-rule="evenodd" d="M11.291 21.706 12 21l-.709.706zM12 21l.708.706a1 1 0 0 1-1.417 0l-.006-.007-.017-.017-.062-.063a47.708 47.708 0 0 1-1.04-1.106 49.562 49.562 0 0 1-2.456-2.908c-.892-1.15-1.804-2.45-2.497-3.734C4.535 12.612 4 11.248 4 10c0-4.539 3.592-8 8-8 4.408 0 8 3.461 8 8 0 1.248-.535 2.612-1.213 3.87-.693 1.286-1.604 2.585-2.497 3.735a49.583 49.583 0 0 1-3.496 4.014l-.062.063-.017.017-.006.006L12 21zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clip-rule="evenodd"/></svg></a>
            </div>
            <div>{{ game.hall.caption }}</div>
          </div>
          <div class="hall-name">Lieu: {{ game.hall.street }}, {{ game.hall.number }}, {{ game.hall.zip }}, {{ game.hall.city }}</div>
          <div>No de match: 33456</div>
       </div>
      </div>
    </div>
  </li>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    game: Object
  },
    setup (props) {
        const activeDropdown = ref(false);

        const openDropdown = () => {
          activeDropdown.value = !activeDropdown.value; 
        }

        const convertHours = (dateTimeStr) => {
            const date = new Date(dateTimeStr);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        return { convertHours, activeDropdown, openDropdown }
    }
}
</script>

<style lang="css" scoped>

.game-item-wrapper {
    cursor: pointer;
}

.game-item {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #f9f9f9;
}

.game-time {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.game-date {
    background-color: #d9d9d9;
    max-width: 400px;
    padding-left: 5px;
}

.game-hours {
    margin-left: 13px;
}

.game-teams_home {
    width: 32%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.game-teams_away {
    width: 32%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.game-hall-info_icon {
  margin-right: 8px;
}

.game-teams_mobile {
    display: none;
}

.team {
    margin: 0 5px;
}

.vs {
    margin: 0 10px;
    font-weight: bold;
    color: #d40018 !important;
    font-size: 0.7rem;
}

.game-hall-info {
    width: 41%;
    font-size: 0.9em;
    color: #666;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.game-dropdown {
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.4s
}

.game-dropdown.active {
    max-height: 200px;
}

</style>
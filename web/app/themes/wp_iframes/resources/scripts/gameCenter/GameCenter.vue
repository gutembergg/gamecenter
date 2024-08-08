<template>
  <div>GameCenter</div>
  <main class="gc_container">
    <div class="gc_box">
        <div class="gc_content">
            <div id="gc_header" class="gc_header">
                <button id="championship" @click="($event) => selectSession($event)" :class="['gc_buttons', { active: activedSession === 'championship' }]">Championnats</button>
                <button id="swsscup" @click="($event) => selectSession($event)" :class="['gc_buttons', { active: activedSession === 'swsscup' }]">Swiss Cup</button>
                <button id="topscore" @click="($event) => selectSession($event)" :class="['gc_buttons', { active: activedSession === 'topscore' }]">Topscore</button>
                <button id="teams" @click="($event) => selectSession($event)" :class="['gc_buttons', { active: activedSession === 'teams' }]">Equipes</button>
            </div>
        </div>
    </div>
    <div v-if="activedSession === 'championship'" class="selects-box">
      <Vueform>
        <SelectElement
          name="select gender"
          placeholder="Select gender"
          @change="handlerGender"
          :value="selectedOption.gender"
          :native="false"
          :items="[{ value: 'm', label: 'Homme'}, { value: 'f', label: 'Femme'}]"
          class="select-filters"
        />
      </Vueform>
      <Vueform>
        <SelectElement
          name="select leagues"
          placeholder="Select league"
          @change="handlerLeagues"
          :native="false"
          :items="leaguesOptions"
          class="select-filters"
        />
    </Vueform>
    <Vueform>
        <SelectElement
          name="select phases"
          placeholder="Select phase"
          @change="handlerPhases"
          :native="false"
          :items="phasesOptions"
          class="select-filters"
        />
    </Vueform>
    <Vueform>
        <SelectElement
          name="select gropues"
          placeholder="Select groupe"
          @change="handlerGroups"
          :native="false"
          :items="groupsOptions"
          class="select-filters"
        />
    </Vueform>
    </div>

    <Championship v-if="activedSession === 'championship'" :games="games" />

    <Teams v-if="activedSession === 'teams'" />

  </main>
</template>

<script>
  import { ref, reactive, onMounted } from "vue";
  import {usePopulateOptions} from './hooks/usePopulateOptions';
  import Championship from './components/championship/Championship';
  import Teams from './components/teams/Teams';
  

  export default {
    components: {
      Championship,
      Teams
    },

  setup() {
    const leaguesOptions = ref([]);
    const phasesOptions = ref([]);
    const groupsOptions = ref([]);

    const selectedOption = reactive({
      gender: "",
      leagues: "",
      phases: "",
      group: ""
    });

    const games = reactive({
      current: null,
      results: null,
      table: null,
      matchPlans: null
    });

    const activedSession = ref("championship");

    const { populateLeaguesOptions, populatePhasesOptions, populateGroupsOptions, populateGames } = usePopulateOptions();

    const handlerGender = async (newValue) => {
      selectedOption.gender = newValue;
      leaguesOptions.value = await populateLeaguesOptions(newValue);
    }

    const handlerLeagues = async (newValue) => {
      selectedOption.leagues = newValue;
      phasesOptions.value = await populatePhasesOptions(newValue);

      console.log("Leagues: ", newValue);
    }

    const handlerPhases = async (newValue) => {
      selectedOption.phases = newValue;
      groupsOptions.value = await populateGroupsOptions(newValue);
      console.log("Phases: ", newValue);

    }

    const handlerGroups = async (newValue) => {
      selectedOption.group = newValue;
      games.current = await populateGames();
      games.results = await populateGames({dateStart: "2022-10-10", dateEnd: "2023-08-16",});
      games.matchPlans = await populateGames({dateStart: "2022-02-15"});
      console.log("Groups: ", newValue);

    }

    const selectSession = (event) => {
      activedSession.value = event.target.id;
    }

    return {
        selectedOption,
        leaguesOptions,
        phasesOptions,
        groupsOptions,
        games,
        activedSession,
        handlerGender,
        handlerLeagues,
        handlerPhases,
        handlerGroups,
        selectSession
    }
  }
}
</script>

<style lang="css" scoped>
.gc_container {
    min-height: 70vh;
}

.gc_content {
    margin: 0 auto;
    max-width: 90vw;
}

.gc_header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 3px;
    padding: 10px;
}

.gc_header .gc_buttons {
    height: 4rem;
    width: 100%;
    border: none;
    border-radius: 4px;
    background-color: #424242;
    color: white;
}
.gc_header .gc_buttons:hover {
    background-color: #202020 !important;
}

.gc_header .gc_buttons:focus {
    background: #202020 !important;
    color: white;
}

.gc_buttons.active {
    background: #202020 !important;
}
.gc_box {
  margin-bottom: 1.4rem;
}

.selects-box {
 max-width: 80%;
 margin: 0 auto;
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
 row-gap: 5px;
 column-gap: 10px;
}
/* .select-filters {

} */

</style>

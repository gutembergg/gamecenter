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
    <div v-show="activedSession === 'championship'" class="selects-box">
      <Vueform class="filter-form-box" :columns="{  sm: 12, md: 6, lg: 3 }" >
          <SelectElement
            name="select_gender"
            placeholder="Sélectionnez le sexe"
            @change="handlerGender"
            :value="selectedOption.gender"
            :native="false"
            :items="[{ value: 'm', label: 'Homme'}, { value: 'f', label: 'Femme'}]"
            class="select-filters"
            
                        
          />
          <SelectElement
            ref="selectLeaguesRef"
            name="select_leagues"
            id="select_leagues"
            placeholder="Sélectionnez la ligue"
            @change="handlerLeagues"
            :native="false"
            :items="leaguesOptions"
            class="select-filters"
            
          />
          <SelectElement
            name="select_phases"
            placeholder="Sélectionnez la phase"
            @change="handlerPhases"
            :native="false"
            :items="phasesOptions"
            class="select-filters"
            
          />
          <SelectElement
            name="select_groups"
            placeholder="Sélectionnez le groupe"
            @change="handlerGroups"
            :native="false"
            :items="groupsOptions"
            class="select-filters"
            
          />
    </Vueform>
    </div>

    <Championship v-if="activedSession === 'championship'" :sessionActived="activedSession" :games="games" @activedSession="selectTeamSession" />

    <Teams v-if="activedSession === 'teams'" :selectedTeamId="selectedTeamId" />

  </main>
</template>

<script>
  import { ref, reactive } from "vue";
  import {usePopulateOptions} from './hooks/usePopulateOptions';
  import Championship from './components/championship/Championship';
  import Teams from './components/teams/Teams';
  import { getDateOneYearAgo, getCurrentDate } from './helpers/formaterFunctions';
  

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
    const selectedTeamId = ref(null);
    const selectLeaguesRef = ref(null);

    const { populateLeaguesOptions, populatePhasesOptions, populateGroupsOptions, populateGames } = usePopulateOptions();

    const handlerGender = async (newValue, oldValue, el$) => {
      const select = el$.form$.el$('select_leagues');
      select.clear()
      selectedOption.gender = newValue;

      if(selectedOption.gender){
        leaguesOptions.value = await populateLeaguesOptions( selectedOption.gender);

        if(leaguesOptions.value.length === 1){
          const defaultValue = leaguesOptions.value[0].value;
          selectedOption.leagues = leaguesOptions.value[0];

          //handlerLeagues(defaultValue, "", select);
          // const element = document.getElementsByClassName("vf-multiselect-single-label");
          //element.click()
          //selectLeaguesRef.value.open();
        //  selectLeaguesRef.value.$el.click();

        }

      }
    }

    const handlerLeagues = async (newValue, oldValue, el$) => {
      const select = el$.form$.el$('select_phases');
      select.clear()
      selectedOption.leagues = newValue;

      if(selectedOption.leagues){
       phasesOptions.value = await populatePhasesOptions(selectedOption.leagues);
      }
    }

    const handlerPhases = async (newValue, oldValue, el$) => {
      const select = el$.form$.el$('select_groups');
      select.clear()
      selectedOption.phases = newValue;

      if(selectedOption.phases){
        groupsOptions.value = await populateGroupsOptions(selectedOption.phases);
      }
    }

    const handlerGroups = async (newValue, oldValue, el$) => {
      const limitDataByYearAgo = getDateOneYearAgo();
      const currentDate = getCurrentDate();
      selectedOption.group = newValue;
      
      if(selectedOption.group){
        games.current = await populateGames('upcomingGames', { gender: selectedOption.gender, leagueId: selectedOption.leagues, phaseId: selectedOption.phases, groupId: selectedOption.group});
      games.results = await populateGames('games', { gender: selectedOption.gender, leagueId: selectedOption.leagues, phaseId: selectedOption.phases, groupId: selectedOption.group, dateStart: limitDataByYearAgo, dateEnd: currentDate});
      games.matchPlans = await populateGames('games', { gender: selectedOption.gender, leagueId: selectedOption.leagues, phaseId: selectedOption.phases, groupId: selectedOption.group, dateStart: "2022-02-15"});
      }
    }
     

    const selectSession = (event) => {
      activedSession.value = event.target.id;
    }

    const selectTeamSession = (event) => {
      selectedTeamId.value = event.id;
      activedSession.value = event.activedSession.value;
    }

    return {
        selectedOption,
        leaguesOptions,
        phasesOptions,
        groupsOptions,
        games,
        activedSession,
        selectedTeamId,
        selectLeaguesRef,
        handlerGender,
        handlerLeagues,
        handlerPhases,
        handlerGroups,
        selectSession,
        selectTeamSession
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
  width: 80%;
  margin: 0 auto;
}

.filter-form-box  {

}
.select-filters {
  /* max-width: 300px !important; */
}

@media (max-width: 1200px) {
  /* .vf-layout-inner-wrapper.vf-multiselect.vf-multiselect-wrapper.vf-multiselect-placeholder {
    font-size: 5px;
    color: red;
  } */
}

</style>

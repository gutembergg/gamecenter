<template>
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
            ref="selectGenderRef"
            @mounted="setAutoFocus"
            id="Gender_select"
            name="select_gender"
            placeholder="Sélectionnez le sexe"
            @change="handlerGender"
            :native="false"
            :items="[{ value: 'm', label: 'Homme'}, { value: 'f', label: 'Femme'}]"
            class="focus:outline-none focus:ring focus:ring-violet-300 select-filters"
            
                        
          />
          <SelectElement
            ref="selectLeaguesRef"
            :default="selectedOption.leagues.label"
            name="select_leagues"
            id="select_leagues"
            placeholder="Sélectionnez la ligue"
            @change="handlerLeagues"
            :native="false"
            :items="leaguesOptions.options"
            class="select-filters"
            
          />
          <SelectElement
            ref="selectPhasesRef"
            :default="selectedOption.phases.label"
            name="select_phases"
            placeholder="Sélectionnez la phase"
            @change="handlerPhases"
            :native="false"
            :items="phasesOptions.options"
            class="select-filters"
            
          />
          <SelectElement
            ref="selectGroupsRef"
            value-prop="value"
            :default="selectedOption.groups.label"
            name="select_groups"
            placeholder="Sélectionnez le groupe"
            @change="handlerGroups"
            :native="false"
            :items="groupsOptions.options"
            class="select-filters"
            
          />
    </Vueform>
    </div>

    <Championship v-if="activedSession === 'championship'" :sessionActived="activedSession" :isLoading="isLoading" :games="games" :selectedOption="selectedOption" @activedSession="async (event) => selectTeamSession(event)" />

    <Teams v-if="activedSession === 'teams'" :selectedTeamInfo="selectedTeamInfo" />

  </main>
</template>

<script>
  import { ref, reactive, watch } from "vue";
  import { usePopulateOptions } from './hooks/usePopulateOptions';
  import Championship from './components/championship/Championship';
  import Teams from './components/teams/Teams';
  import { getDateOneYearAgo, getCurrentDate } from './helpers/formaterFunctions';
  import { convertObjectToStringArray, getByCaption } from "./helpers/formaterFunctions";
 
  export default {
    components: {
      Championship,
      Teams,
    },

  setup() {
    const leaguesOptions = reactive({
      apiData: null,
      options: []
    });

    const phasesOptions = reactive({
      apiData: null,
      options: []
    });

    const groupsOptions = reactive({
      apiData: null,
      options: []
    });

    const selectedOption = reactive({
      gender: { label: null, value: null},
      leagues: { label: null, value: null},
      phases: { label: null, value: null},
      groups: { label: null, value: null}
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
    const selectPhasesRef = ref(null);
    const selectGroupsRef = ref(null);
    const selectGenderRef = ref(null);

    const selectedLeaguesCaption = ref(null);

    const selectedTeamInfo = reactive({
      id: null,
      caption: null,
      gender: null,
      leagues: null,
      groups: null,
      phases: null
    });

    const isLoading = ref(false);

    const { populateLeaguesOptions, populatePhasesOptions, populateGroupsOptions, populateGames, populateTeamsRank } = usePopulateOptions();

    const getSelectClick = (el) => {
      console.log("Click!!", el);
    }
   
    const watchSelected = (el) => {
      console.log("watchSelected: ", selectLeaguesRef.value);

    }

    const handlerGender = async (newValue, oldValue, el$) => {
      const selectLeague = el$.form$.el$('select_leagues');
      selectLeague.clear();
      selectLeague.update();

      if(newValue){
        selectedOption.gender.value = newValue;
        const leaguesData = await populateLeaguesOptions(newValue);
        leaguesOptions.options = convertObjectToStringArray(leaguesData.data);
      
       leaguesOptions.apiData = leaguesData.data.map(league => ({
          label: league.caption,
          value: league.leagueId
        }));

        if(leaguesOptions.apiData.length === 1){
          const defaultValue = leaguesOptions.apiData[0];
          selectedOption.leagues.label = defaultValue.label;
          selectedOption.leagues.value = defaultValue.value;

          handlerLeagues(selectedOption.leagues.label, null, selectLeague);
        } else {
          selectLeaguesRef.value.focus();
          selectedOption.leagues.label = null;
        }
      }
    }

    const handlerLeagues = async (newValue, oldValue, el$) => {
      const selectPhases = el$.form$.el$('select_phases');
      selectPhases.clear();
      selectPhases.update();

      if(newValue){
       selectedOption.leagues.label = newValue;
       const getSelectedOption = getByCaption(leaguesOptions.apiData, newValue);
       selectedOption.leagues.value = getSelectedOption.value;
       const phasesData = await populatePhasesOptions(getSelectedOption.value);
       phasesOptions.options = convertObjectToStringArray(phasesData.data);

       phasesOptions.apiData = phasesData.data.map(phase => ({
          label: phase.caption,
          value: phase.phaseId
        }));

       if(phasesOptions.apiData.length === 1){
          const defaultValue = phasesOptions.apiData[0];
          selectedOption.phases.label = defaultValue.label;
          selectedOption.phases.value = defaultValue.value;

          handlerPhases(selectedOption.phases.label, null, selectPhases);
       } else {
         selectPhasesRef.value.focus();
         selectedOption.phases.label = null;
       }
      } 
    }

    const handlerPhases = async (newValue, oldValue, el$) => {
      const selectGroup = el$.form$.el$('select_groups');
      selectGroup.clear();
      selectGroup.update();
      
      if(newValue){
        selectedOption.phases.label = newValue;

        const getSelectedPhases = getByCaption(phasesOptions.apiData, newValue);
        const groupsData = await populateGroupsOptions(getSelectedPhases.value);
        selectedOption.phases.value = getSelectedPhases.value;

        groupsOptions.options = convertObjectToStringArray(groupsData.data);
        groupsOptions.apiData = groupsData.data.map(group => ({
          label: group.caption,
          value: group.groupId
        }));

        if(groupsOptions.apiData.length === 1){
          const defaultValue = groupsOptions.apiData[0];
          selectedOption.groups.label = defaultValue.label;
          selectedOption.groups.value = defaultValue.value;

          handlerGroups(selectedOption.groups.label);

        } else {
         selectGroupsRef.value.focus();
         selectedOption.groups.label = null;
        }
      }
    }

    const handlerGroups = async (newValue, oldValue, el$) => {
      const limitDataByYearAgo = getDateOneYearAgo();
      const currentDate = getCurrentDate();

      if(newValue){
        selectedOption.groups.label = newValue;
        const selectedGroupsData = getByCaption(groupsOptions.apiData, newValue);
        selectedOption.groups.value = selectedGroupsData.value;

        try {
          isLoading.value = true;

          games.current = await populateGames('upcomingGames', { gender: selectedOption.gender.value, leagueId: selectedOption.leagues.value, phaseId: selectedOption.phases.value, groupId: selectedGroupsData.value});
          
          games.results = await populateGames('games', { gender: selectedOption.gender.value, leagueId: selectedOption.leagues.value, phaseId: selectedOption.phases.value, groupId: selectedGroupsData.value, dateStart: limitDataByYearAgo, dateEnd: currentDate});
          games.matchPlans = await populateGames('games', { gender: selectedOption.gender.value, leagueId: selectedOption.leagues.value, phaseId: selectedOption.phases.value, groupId: selectedGroupsData.value, dateStart: "2022-02-15"});
          games.table = await populateTeamsRank(selectedGroupsData.value);
            
        } catch (error) {
          console.log("Error");
        } finally {
          isLoading.value = false;

        }
       
      }
    }

    const selectSession = (event) => {
      activedSession.value = event.target.id;
    }

    const selectTeamSession = async (event) => {
      selectedTeamId.value = event.id;
      selectedTeamInfo.id = event.id;
      selectedTeamInfo.caption = event.caption;
      selectedTeamInfo.gender = selectedOption.gender.value;
      selectedTeamInfo.leagues = { caption: selectedOption.leagues.label, id: selectedOption.leagues.value }
      selectedTeamInfo.groups = selectedOption.groups.value;
      selectedTeamInfo.phases = selectedOption.phases.value;
      activedSession.value = event.activedSession.value;
    }

    const setAutoFocus = (element) => {
      selectGenderRef.value.focus();
    }


    return {
        selectedOption,
        leaguesOptions,
        phasesOptions,
        groupsOptions,
        games,
        activedSession,
        selectedTeamId,
        selectedTeamInfo,
        selectedLeaguesCaption,
        selectLeaguesRef,
        selectPhasesRef,
        selectGroupsRef,
        selectGenderRef,
        isLoading,
        handlerGender,
        handlerLeagues,
        handlerPhases,
        handlerGroups,
        selectSession,
        selectTeamSession,
        setAutoFocus,
        watchSelected,
        getSelectClick
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3px;
  padding: 10px;
  margin: 0 auto;
  padding-bottom: 2rem;
  z-index: 9999;
}

.filter-form-box  {

}
.select-filters {
  /* max-width: 300px !important; */
}

@media (max-width: 560px) {
 .gc_content {
  max-width: 100vw;
 }

 .selects-box {
  width: 100%;
}
}

@media (max-width: 1200px) {
  /* .vf-layout-inner-wrapper.vf-multiselect.vf-multiselect-wrapper.vf-multiselect-placeholder {
    font-size: 5px;
    color: red;
  } */
}

</style>

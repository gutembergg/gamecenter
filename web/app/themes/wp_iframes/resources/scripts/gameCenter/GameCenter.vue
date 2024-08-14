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
            :default="optionDefaultValue.leagues"
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
            :default="optionDefaultValue.phases"
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
            :default="optionDefaultValue.groups"
            name="select_groups"
            placeholder="Sélectionnez le groupe"
            @change="handlerGroups"
            :native="false"
            :items="groupsOptions.options"
            class="select-filters"
            
          />
    </Vueform>
    </div>

    <Championship v-if="activedSession === 'championship'" :sessionActived="activedSession" :games="games" :selectedOption="selectedOption" @activedSession="async (event) => selectTeamSession(event)" />

    <Teams v-if="activedSession === 'teams'" :selectedTeamInfo="selectedTeamInfo" />

  </main>
</template>

<script>
  import { ref, reactive, nextTick } from "vue";
  import {usePopulateOptions} from './hooks/usePopulateOptions';
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
      options: null
    });

    const phasesOptions = reactive({
      apiData: null,
      options: null
    });

    const groupsOptions = reactive({
      apiData: null,
      options: null
    });

    const selectedOption = reactive({
      gender: "",
      leagues: "",
      phases: "",
      groups: ""
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

    const selectedLeaguesCaption = ref(null);

    const selectedTeamInfo = reactive({
      id: null,
      caption: null,
      gender: null,
      leagues: null
    });

    const optionDefaultValue = reactive({
      leagues: null,
      phases: null,
      groups: null
    })

    const { populateLeaguesOptions, populatePhasesOptions, populateGroupsOptions, populateGames, populateTeamsOptions } = usePopulateOptions();

    const handlerGender = async (newValue, oldValue, el$) => {
      const selectLeague = el$.form$.el$('select_leagues');
      selectLeague.clear();
      selectLeague.update();

      if(newValue){
        selectedOption.gender = newValue;
        const leaguesData = await populateLeaguesOptions(selectedOption.gender);

        leaguesOptions.options = convertObjectToStringArray(leaguesData.data);
        leaguesOptions.apiData = leaguesData.data;

        optionDefaultValue.leagues = null;

        if(leaguesOptions.options.length === 1){
          const defaultValue = leaguesOptions.options[0];
          optionDefaultValue.leagues = defaultValue;

          const selectedLeagueData = getByCaption(leaguesOptions.apiData, defaultValue);
          selectedOption.leagues = selectedLeagueData.leagueId;

          handlerLeagues(selectedLeagueData.caption, null, selectLeague);
        } else {
          selectLeaguesRef.value.focus();
        }
      }
    }

    const handlerLeagues = async (newValue, oldValue, el$, defaultIdValue = null) => {
      const selectPhases = el$.form$.el$('select_phases');
      selectPhases.clear();
      selectPhases.update();

      if(newValue){
       selectedLeaguesCaption.value = newValue;
       selectedOption.leagues = getByCaption(leaguesOptions.apiData, newValue).leagueId;
       const phasesData = await populatePhasesOptions(selectedOption.leagues);

       phasesOptions.options = convertObjectToStringArray(phasesData.data);
       phasesOptions.apiData = phasesData.data;

       if(phasesOptions.options.length === 1){
          const defaultValue = phasesOptions.options[0];
          optionDefaultValue.phases = defaultValue;

          const selectedPhasesData = getByCaption(phasesOptions.apiData, defaultValue);
          selectedOption.phases = selectedPhasesData.phaseId;

          handlerPhases(selectedPhasesData.caption, null, selectPhases);
       } else {
         selectPhasesRef.value.focus();
       }
      } 
      
    }

    const handlerPhases = async (newValue, oldValue, el$) => {
      const selectGroup = el$.form$.el$('select_groups');
      selectGroup.clear();
      selectGroup.update();


      if(newValue){
        selectedOption.phases = getByCaption(phasesOptions.apiData, newValue).phaseId;
        const groupsData = await populateGroupsOptions(selectedOption.phases);

        groupsOptions.options = convertObjectToStringArray(groupsData.data);
        groupsOptions.apiData = groupsData.data;

        if(groupsOptions.options.length === 1){
          const defaultValue = groupsOptions.options[0];
          optionDefaultValue.groups = defaultValue;

          const selectedGroupsData = getByCaption(groupsOptions.apiData, defaultValue);
          selectedOption.groups = selectedGroupsData.groupId;

          handlerGroups(selectedGroupsData.caption, null, selectGroup);

        } else {
         selectGroupsRef.value.focus();
        }
      }
    }

    const handlerGroups = async (newValue, oldValue, el$) => {
      const limitDataByYearAgo = getDateOneYearAgo();
      const currentDate = getCurrentDate();

      if(newValue){
        games.current = await populateGames('upcomingGames', { gender: selectedOption.gender, leagueId: selectedOption.leagues, phaseId: selectedOption.phases, groupId: selectedOption.groups});
        games.results = await populateGames('games', { gender: selectedOption.gender, leagueId: selectedOption.leagues, phaseId: selectedOption.phases, groupId: selectedOption.groups, dateStart: limitDataByYearAgo, dateEnd: currentDate});
        games.matchPlans = await populateGames('games', { gender: selectedOption.gender, leagueId: selectedOption.leagues, phaseId: selectedOption.phases, groupId: selectedOption.groups, dateStart: "2022-02-15"});
      }
    }

    const selectSession = (event) => {
      activedSession.value = event.target.id;
    }

    const selectTeamSession = async (event) => {
      selectedTeamId.value = event.id;
      selectedTeamInfo.id = event.id;
      selectedTeamInfo.caption = event.caption;
      selectedTeamInfo.gender = selectedOption.gender;
      selectedTeamInfo.leagues = selectedLeaguesCaption.value;
      activedSession.value = event.activedSession.value;
    }


    return {
        selectedOption,
        leaguesOptions,
        phasesOptions,
        groupsOptions,
        games,
        optionDefaultValue,
        activedSession,
        selectedTeamId,
        selectedTeamInfo,
        selectedLeaguesCaption,
        selectLeaguesRef,
        selectPhasesRef,
        selectGroupsRef,
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
  padding-bottom: 2rem;
  z-index: 9999;
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

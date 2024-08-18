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

      <v-select v-model="selectedOption.gender.label" @update:modelValue="handlerGender" :searchable="false" :clearable="false" :options="[{ value: 'm', label: 'Homme'}, { value: 'f', label: 'Femme'}]" placeholder="Sélectionnez le sexe"></v-select>
      <v-select v-model="selectedOption.leagues.label" @update:modelValue="handlerLeagues" :dropdown-should-open="leaguesShouldOpen" :searchable="false" :clearable="false" :options="leaguesOptions.options" label="label" placeholder="Sélectionnez la ligue" />
      <v-select v-model="selectedOption.phases.label" @update:modelValue="handlerPhases" :searchable="false" :clearable="false" :options="phasesOptions.options" label="label" placeholder="Sélectionnez la phase" />
      <v-select v-model="selectedOption.groups.label" @update:modelValue="handlerGroups" :searchable="false" :clearable="false" :options="groupsOptions.options" label="label" placeholder="Sélectionnez le groupe" />
      <!-- <v-select :options="phasesOptions.options"></v-select>
      <v-select :options="groupsOptions.options"></v-select> -->
      <!-- <Vueform class="filter-form-box" :columns="{  sm: 12, md: 6, lg: 3 }" >
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
    </Vueform> -->
    </div>

    <Championship v-if="activedSession === 'championship'" :sessionActived="activedSession" :games="games" :selectedOption="selectedOption" @activedSession="async (event) => selectTeamSession(event)" />

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
  import 'vue-select/dist/vue-select.css';

  

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

    const optionDefaultValue = reactive({
      leagues: null,
      phases: null,
      groups: null
    })

    const { populateLeaguesOptions, populatePhasesOptions, populateGroupsOptions, populateGames, populateTeamsRank } = usePopulateOptions();

    const leaguesShouldOpen = (el) => {
      //leaguesShouldOpen.value = true

      console.log("leaguesOptions.options", el.selectedValue.length === 1 );

      return  el.selectedValue.length === 1 ? false : true;

    }

    const handlerGender = async (genderValue) => {

      console.log("handlerGender-----------------", genderValue);
      // const selectLeague = el$.form$.el$('select_leagues');
      // selectLeague.clear();
      // selectLeague.update();
      //optionDefaultValue.leagues = null;

      console.log("genderValue: ", genderValue);

      if(genderValue){
        selectedOption.gender.value = genderValue.value;
        const leaguesData = await populateLeaguesOptions(selectedOption.gender.value);

       // leaguesOptions.options = convertObjectToStringArray(leaguesData.data);
       leaguesOptions.options = leaguesData.data.map(league => ({
          label: league.caption,
          value: league.leagueId
        }));
        //leaguesOptions.apiData = leaguesData.data;

        if(leaguesOptions.options.length === 1){
          const defaultValue = leaguesOptions.options[0];
          //optionDefaultValue.leagues = defaultValue.label;


          //const selectedLeagueData = getByCaption(leaguesOptions.apiData, defaultValue);
          selectedOption.leagues.label = defaultValue.label;
          selectedOption.leagues.value = defaultValue.value;


          handlerLeagues(defaultValue);
        } else {
          selectedOption.leagues.label = '';
          //leaguesShouldOpen.value = true;
        }
      }
    }

    const handlerLeagues = async (leagueValue) => {
      // const selectPhases = el$.form$.el$('select_phases');
      // selectPhases.clear();
      // selectPhases.update();
      // optionDefaultValue.phases = null;

      if(leagueValue){
      // selectedLeaguesCaption.value = newValue;
       //selectedOption.leagues = getByCaption(leaguesOptions.apiData, newValue).leagueId;
       const phasesData = await populatePhasesOptions(leagueValue.value);

       //selectedOption.leagues.label = leagueValue.label;

       phasesOptions.options = phasesData.data.map(phase => ({
          label: phase.caption,
          value: phase.phaseId
        }));
       //phasesOptions.options = convertObjectToStringArray(phasesData.data);
      // phasesOptions.apiData = phasesData.data;

       if(phasesOptions.options.length === 1){
          const defaultValue = phasesOptions.options[0];
          //optionDefaultValue.phases = defaultValue;

          //const selectedPhasesData = getByCaption(phasesOptions.apiData, defaultValue);
          selectedOption.phases.label = defaultValue.label;

          handlerPhases(defaultValue);
       } else {
         //selectPhasesRef.value.focus();
         selectedOption.phases.label = '';
       }
      } 
      
    }

    const handlerPhases = async (phasesValue) => {
      // const selectGroup = el$.form$.el$('select_groups');
      // selectGroup.clear();
      // selectGroup.update();
      // optionDefaultValue.groups = null;

      if(phasesValue){
        //selectedOption.phases = getByCaption(phasesOptions.apiData, newValue).phaseId;
        //selectedOption.groups.label = null;
        const groupsData = await populateGroupsOptions(phasesValue.value);

        groupsOptions.options = groupsData.data.map(group => ({
          label: group.caption,
          value: group.groupId
        }));
        //groupsOptions.apiData = groupsData.data;

        if(groupsOptions.options.length === 1){
          const defaultValue = groupsOptions.options[0];
         // optionDefaultValue.groups = defaultValue;

          //const selectedGroupsData = getByCaption(groupsOptions.apiData, defaultValue);
          selectedOption.groups.label = defaultValue.label;

          handlerGroups(defaultValue);

        } else {
         //selectGroupsRef.value.focus();
         selectedOption.groups.label = '';
        }
      }
    }

    const handlerGroups = async (groupValue) => {
      const limitDataByYearAgo = getDateOneYearAgo();
      const currentDate = getCurrentDate();

      if(groupValue){
        console.log("groupValue: ", groupValue);
        //selectedOption.groups.label = null;
        games.current = await populateGames('upcomingGames', { gender: selectedOption.gender.value, leagueId: selectedOption.leagues.value, phaseId: selectedOption.phases.value, groupId: groupValue.value});
        games.results = await populateGames('games', { gender: selectedOption.gender.value, leagueId: selectedOption.leagues.value, phaseId: selectedOption.phases.value, groupId: groupValue.value, dateStart: limitDataByYearAgo, dateEnd: currentDate});
        games.matchPlans = await populateGames('games', { gender: selectedOption.gender.value, leagueId: selectedOption.leagues.value, phaseId: selectedOption.phases.value, groupId: groupValue.value, dateStart: "2022-02-15"});
        games.table = await populateTeamsRank(groupValue.value);
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
      selectedTeamInfo.leagues = { caption: selectedLeaguesCaption.value, id: selectedOption.leagues }
      selectedTeamInfo.groups = selectedOption.groups;
      selectedTeamInfo.phases = selectedOption.phases;
      activedSession.value = event.activedSession.value;
    }

    const setAutoFocus = (element) => {
      console.log("setAutoFocus--", element);
      //selectGenderRef.value.focus();
     //element.focus();
    }


    return {
        selectedOption,
        leaguesOptions,
        phasesOptions,
        groupsOptions,
        games,
        optionDefaultValue,
        leaguesShouldOpen,
        activedSession,
        selectedTeamId,
        selectedTeamInfo,
        selectedLeaguesCaption,
        selectLeaguesRef,
        selectPhasesRef,
        selectGroupsRef,
        selectGenderRef,
        handlerGender,
        handlerLeagues,
        handlerPhases,
        handlerGroups,
        selectSession,
        selectTeamSession,
        setAutoFocus
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

@media (max-width: 1200px) {
  /* .vf-layout-inner-wrapper.vf-multiselect.vf-multiselect-wrapper.vf-multiselect-placeholder {
    font-size: 5px;
    color: red;
  } */
}

</style>

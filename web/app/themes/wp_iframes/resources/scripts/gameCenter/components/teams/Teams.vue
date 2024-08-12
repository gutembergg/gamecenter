<template>
    <div>
        Teams

        <pre>
            {{ team }}
        </pre>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useApiFetch } from "../../hooks/useApiFetch";

export default {
    props: {
        selectedTeamId: Number
    },
    setup (props) {
        const { isLoading, response, error, fetchData } = useApiFetch();
        const team = ref({});

        onMounted(async () => {
            console.log("PropsTeam: ", props.selectedTeamId);

            if(props.selectedTeamId){
                team.value = await fetchData('teams', props.selectedTeamId);

                console.log("team.value: ", team.value);
            }

        });
        
        return {team}
    }
}
</script>

<style lang="css" scoped>

</style>
<template>
    <div>
        Teams
    </div>
</template>

<script>
export default {
    props: {
        selectedTeamId: Number
    },
    setup (props) {
        
        console.log("PropsTeam: ", props.selectedTeamId);
        return {}
    }
}
</script>

<style lang="css" scoped>

</style>
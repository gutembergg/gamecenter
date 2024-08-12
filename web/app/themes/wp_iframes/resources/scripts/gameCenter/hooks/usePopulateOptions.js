import { useApiFetch } from '../hooks/useApiFetch.js'
import { useFormaterResonse } from '../hooks/useFormaterResponse';

const { isLoading, response, error, fetchData } = useApiFetch();
const { formater } = useFormaterResonse();

const endpoints = {
    leagues: 'leagues',
    phases: 'phases',
    groups: 'groups',
    games: 'games',
    teams: 'teams',
    ranking: 'ranking',
    upcomingGames: 'upcomingGames'
};


export function usePopulateOptions() {
    const populateLeaguesOptions = async (params) => {
        await fetchData(endpoints.leagues, "SVRG", { gender: params, includeCup: "1" });
        return formater(response.value, "leagueId", "caption");
    }

    const populatePhasesOptions = async (params) => {
        await fetchData(endpoints.phases, params, {});
        return formater(response.value, "phaseId", "caption");
    }

    const populateGroupsOptions = async (params) => {
        await fetchData(endpoints.groups, params, {});
        return formater(response.value, "groupId", "caption");
    }

    const populateGames = async (url, params = {}) => {
        const game_params = {
            region: "SVRG",
        }
        const mergedParams = Object.assign({}, game_params, params);

        console.log("mergedParams: ", mergedParams);

        await fetchData(url, null, mergedParams);

        console.log("response.value: ", response.value);

        const groupedByPlayDate = response.value.reduce((acc, game) => {
            const playDateDateOnly = game.playDate.split(" ")[0];
            game.playDateDateOnly = playDateDateOnly;
       
            if (!acc[playDateDateOnly]) {
                acc[playDateDateOnly] = [];
            }
            acc[playDateDateOnly].push(game);
       
            return acc;
        }, {});
       
        const groupedArray = Object.keys(groupedByPlayDate).map(date => ({
            date,
            games: groupedByPlayDate[date]
        }));

        return groupedArray;
    }

    return { populateLeaguesOptions, populatePhasesOptions, populateGroupsOptions, populateGames }
};
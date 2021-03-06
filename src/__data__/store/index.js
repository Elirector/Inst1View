import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import * as types from '../constants/mutation-types';
import {API_URLS} from '../constants/api-urls';
import {API_KEY} from '../constants/api-key'

Vue.use(Vuex);

const createUrl = (url, additional = {}) =>Object.entries(additional).reduce((memo, [key, value]) => memo.replace(`{{${key}}}`,value), url);

export default new Vuex.Store(
    {
        state: {
            movie: null,
            ID: 550,
            movie_list: [],
            config: {}
        },
        actions: {
            async getMovie({commit}, params) {
                try {
                    const res = await axios.get(createUrl(API_URLS.MOVIE, {ID: params.ID}),
                        {
                            params: {
                                api_key: API_KEY
                            }
                        }
                    );
                    if (res) {
                        const results = [res.data];
                        console.log('results', results);
                        commit(types.GET_MOVIE, results);

                    }
                } catch (e) {
                    console.log(e);

                }
            },
            async getTopMovies({commit}, params) {
                try {
                    console.log("params",params);
                    const res = await axios.get(API_URLS.TOP_MOVIES,
                        {
                            params: {
                                api_key: API_KEY,
                                sort_by: params.sort_by??"popularity.desc",
                                "release_date.gte": params.year_from==null?null:params.year_from+"-01-01",
                                "release_date.lte": params.year_to==null?null:params.year_to+"-12-31"

                            }
                        }
                    );
                    if (res) {
                        const {results} = res.data;
                        console.log('results', results);
                        commit(types.GET_TOP_MOVIES, results);
                    }
                } catch (e) {
                    console.log(e);

                }
            },
            async getConfig({commit}) {
                try {
                    const res = await axios.get(API_URLS.CONFIG,
                        {
                            params: {
                                api_key: API_KEY
                            }
                        }
                    );
                    if (res) {
                        const results = res.data;
                        console.log('config', results);
                        commit(types.CONFIG, results);
                    }
                } catch (e) {
                    console.log(e);

                }
            }
        },
        mutations: {
            [types.GET_MOVIE](state, results) {
                state.movie = results;
            },
            [types.GET_TOP_MOVIES](state, results) {
                state.movie_list = results;
            },
            [types.CONFIG](state,config) {
                state.config = config;
            },
            setId(state, ID) {
                state.ID = ID;
                this.dispatch("getMovie");
            }
        },
        getters: {
            getMovie: (state) => state.movie,
            getID: (state) => state.ID,
            getConfig: (state)=>state.config,
            getTopMovies: (state) => state.movie_list
        },

    }
)
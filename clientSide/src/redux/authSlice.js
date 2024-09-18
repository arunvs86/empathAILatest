import {createSlice} from "@reduxjs/toolkit"

const carerSlice = createSlice({
    name:"carer",
    initialState:{
        carer:null,
        suggestedCarers:[],
        carerProfile:null,
        selectedCarer:null,
    },
    
    reducers:{
        setCarerAuthentication:(state,action) => {
            state.carer = action.payload;
        },
        setSuggestedCarers:(state,action) => {
            state.suggestedCarers = action.payload;
        },
        setCarerProfile:(state,action) => {
            state.carerProfile = action.payload;
        },
        setSelectedCarer:(state,action) => {
            state.selectedCarer = action.payload;
        },
        setBot:(state,action) => {
            state.bot = action.payload;
        }
    }
});

export const {
    setCarerAuthentication, 
    setSuggestedCarers, 
    setCarerProfile,
    setSelectedCarer,
    setBot
} = carerSlice.actions;


export default carerSlice.reducer;
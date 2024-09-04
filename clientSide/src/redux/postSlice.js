import { createSlice } from "@reduxjs/toolkit";
const thoughtSlice = createSlice({
    name:'thought',
    initialState:{
        thoughts:[],
        selectedThought:null,
    },
    reducers:{
        //actions
        setThoughts:(state,action) => {
            state.thoughts = action.payload;
        },
        setSelectedThought:(state,action) => {
            state.selectedThought = action.payload;
        }
    }
});
export const {setThoughts, setSelectedThought} = thoughtSlice.actions;
export default thoughtSlice.reducer;
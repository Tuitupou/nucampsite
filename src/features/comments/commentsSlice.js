import { createSlice } from '@reduxjs/toolkit';
// import { COMMENTS } from '../../app/shared/COMMENTS';
import { baseURL } from '../../app/shared/baseURL';

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async () => {
        const response = await fetch(baseUrl + 'comments');
        if (!response.ok) {
            return Promise.reject('Unable to fetch, status: ' + response.status);
        }
        const data = await response.json();
        return data;
    }
);

export const postComments = createAsyncThunk (
    'comments/postComment',
    async(comment, {dispatch}) => {
        const response = await fetch(baseUrl + 'comments', {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: { 'Content-Type': 'application/json'}
        });
        if (!response.ok) {
            return Promise.reject(response.status);
        }
        const data = await response.json();
        dispatch(addComment(data));
    }
);
const initialState = {
    commentsArray: [],
    isLoading: true,
    errMsg: ''
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        addComment: (state, action) => {
            const newComment = {
                id: state.commentsArray.length + 1,
                ...action.payload
            };
            state.commentsArray.push(newComment);
        }
    },
    extraReducers: {
            [fetchComments.pending]: (state) => {
                state.isLoading = true;
            },
            [fetchComments.fulfilled]: (state, action) => {
                state.isLoading = false;
                state.errMsg = '';
                state.commentsArray = action.payload;
            },
            [fetchComments.rejected]: (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error ? action.error.message : 'Fetch failed';
            }
            [postComments.rejected]: (state, action) => {
                alert(
                    'Your comment could not be posted\nError: ' +
                    (action.error ? action.error.message: 'Fetch failed')
                );
            }
        }
});

export const commentsReducer = commentsSlice.reducer;

export const { addComment } = commentsSlice.actions;

export const selectCommentsByCampsiteId = (campsiteId) => (state) => {
    return state.comments.commentsArray.filter(
        (comment) => comment.campsiteId === parseInt(campsiteId)
    );
};

import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {apiSlice} from "../api/apiSlice";
import {backend} from "../../util/backend";

const transferRequestsAdapter = createEntityAdapter({
    selectId: (transferRequest) => transferRequest.transferRequestId,
    sortComparer: (a, b) => b.transferRequestId - a.transferRequestId
});

const initialState = transferRequestsAdapter.getInitialState()

export const transferRequestsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllTransferRequests: builder.query({
            query: () => backend.transferRequests.getAllUrl,
            transformResponse: responseData => {
                console.log("responseData is : ", responseData)
                if (responseData?.data?.transferRequests) {
                    const transferRequests = responseData?.data?.transferRequests
                    return transferRequestsAdapter.setAll(initialState, transferRequests)
                }
            },
            providesTags: (result, error, arg) => [
                {type: 'TransferRequest', id: "LIST"},
                ...result?.ids.map(id => ({type: 'TransferRequest', id}))
            ]
        }),
        getTransferRequestsByClientId: builder.query({
            query: (clientId) => `${backend.transferRequests.getAllByClientIdUrl}?clientId=${clientId}`,
            transformResponse: responseData => {
                if (responseData?.data?.transferRequests) {
                    const transferRequests = responseData?.data?.transferRequests
                    return transferRequestsAdapter.setAll(initialState, transferRequests)
                }
            },
            providesTags: (result, error, arg) => [
                {type: 'TransferRequest', id: "LIST"},
                ...result?.ids.map(id => ({type: 'TransferRequest', id}))
            ]
        }),

        createTransferRequest: builder.mutation({
            query: transferRequestInfo => ({
                url: backend.transferRequests.createRequestUrl,
                method: 'POST',
                body: transferRequestInfo
            }),
            invalidatesTags: [
                {type: 'TransferRequest', id: 'LIST'},
                {type: 'TransferRequest', id: 'LIST'},
            ],
            transformResponse: (responseData) => {
                return responseData;
            },
        }),
        getTransferRequestByTransferRequestId: builder.query({
            query: (transferRequestId) => ({
                url: `${backend.transferRequests.getByIdUrl}?transferRequestId=${transferRequestId}`,
                method: 'GET',
            }),
            transformResponse: (responseData) => {
                let transferRequestArray = responseData?.data?.transferRequest || [];
                return transferRequestsAdapter.setAll(initialState, transferRequestArray);
            },
            providesTags: (result, error, arg) =>
                result
                    ? [
                        {type: 'TransferRequest', id: arg},
                        ...result.ids.map((id) => ({type: 'TransferRequest', id})),
                    ]
                    : [{type: 'TransferRequest', id: arg}],
        }),

        deleteTransferRequest: builder.mutation({
            query: transferRequest => ({
                url: `${backend.transferRequests.deleteUrl}/${transferRequest.transferRequestId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, arg) => [
                {type: 'TransferRequest', id: arg.transferRequestId},
                {type: 'TransferRequest', id: 'LIST'},
            ],
        }),
    })
})

// -----Exporting our auto-generated hooks ----------------------------------------------------------------------
export const {
    useCreateTransferRequestMutation,
    useGetAllTransferRequestsQuery,
    useGetTransferRequestsByClientIdQuery,
    useGetTransferRequestByTransferRequestIdQuery,
    useDeleteTransferRequestMutation
} = transferRequestsApiSlice
//------------------------------------------------------------------------------------------------------------------


//---- returning the query result objects-------------------------------------------------------------------------
export const selectAllTransferRequestsResult = transferRequestsApiSlice.endpoints.getAllTransferRequests.select();
export const selectTransferRequestsByClientIdResult = (clientId) => transferRequestsApiSlice.endpoints.getTransferRequestsByClientId.select(clientId)
export const selectTransferRequestByTransferRequestIdResult = (transferRequestId) => transferRequestsApiSlice.endpoints.getTransferRequestByTransferRequestId.select(transferRequestId)
//------------------------------------------------------------------------------------------------------------------

//----  Creates memoized selectors (takes 2 or more functions as input) ---------------------------------------
export const selectAllTransferRequestsData = createSelector(
    selectAllTransferRequestsResult,
    allTransferRequestsResult => allTransferRequestsResult.data
)
export const selectTransferRequestsByClientIdData = (clientId) => createSelector(
    selectTransferRequestsByClientIdResult(clientId),
    transferRequestsByClientIdResult => transferRequestsByClientIdResult.data
)

//------------------------------------------------------------------------------------------------------------------

export const {
    selectAll: selectAllTransferRequests,
    selectById: selectTransferRequestById,
    selectIds: selectAllTransferRequestIds,
} = transferRequestsAdapter.getSelectors((state) => selectAllTransferRequestsData(state) ?? initialState);


export const {
    selectAll: selectAllIndividualTransferRequests,
    selectById: selectIndividualTransferRequestById,
    selectIds: selectIndividualTransferRequestId
} = transferRequestsAdapter.getSelectors((state, clientId) => selectTransferRequestsByClientIdData(clientId)(state) ?? initialState)


export default transferRequestsApiSlice.reducer
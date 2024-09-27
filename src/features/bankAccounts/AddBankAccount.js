import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useLocation} from 'react-router-dom';
import {
    selectEventProperties,
    selectBankAccountInputs,
    selectBankAccountFocus,
    setItem,
    selectCurrentUser, selectValidBankAccount, handleValidation, handleFocus, handleBlur, setObjectItem,
} from "../auth/authSlice";
import {
    initialBankAccountInputs,
    initialValidBankAccount,
} from "../../util/initials";
import ErrorMessageComponent from "../../components/form-controls/ErrorMessageComponent";
import TendaButton from "../../components/form-controls/TendaButton";
import CardHolderNameInput from "../../components/form-controls/CardHolderNameInput";
import BankSelector from "../../components/form-controls/BankSelector";
import {useCreateBankAccountMutation} from "./bankAccountsSlice";
import BankAccountNumberInput from "../../components/form-controls/BankAccountNumberInput";
import {adminPaths} from "../../util/frontend";
import TickAnimation from "../../components/TickAnimation";
import BankNameInput from "../../components/form-controls/BankNameInput";
import CountrySelector from "../../components/form-controls/CountrySelector";
import {selectBankById, useGetBankByIdQuery} from "../banks/banksSlice";
import {regex} from "../../util/regex";

const AddBankAccount = () => {
    const [loading, setLoading] = useState(false);  // State variable to track loading status
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [createBankAccount] = useCreateBankAccountMutation();
    const eventProperties = useSelector(selectEventProperties);
    const bankAccountInputs = useSelector(selectBankAccountInputs);
    const refs = {
        countryIdRef: null,
        bankRef: useRef(null),
        cardHolderNameRef: useRef(null),
        bankNameRef: useRef(null),
        bankAccountNumberRef: useRef(null),
        errorRef: useRef(),
    };
    const currentUser = useSelector(selectCurrentUser);
    const validBankAccount = useSelector(selectValidBankAccount)
    const bankAccountFocus = useSelector(selectBankAccountFocus)
    const [tickAnimationVisible, setTickAnimationVisible] = useState(false);
    const [selectedBankId, setSelectedBankId] = useState(null);
    const {data, isSuccess: bankFetchedSuccessfully} = useGetBankByIdQuery(selectedBankId);

    useEffect(() => {
        dispatch(setItem({key: 'title', value: 'Add a Bank Account'}));
        refs.countryIdRef?.current?.focus();
        dispatch(setObjectItem({key: 'bankAccountInputs', innerKey: "clientId", value: currentUser?.userId}));
        dispatch(setObjectItem({
            key: "validBankAccount",
            innerKey: "validClientId",
            value: regex.CLIENT_ID_REGEX.test(currentUser?.userId)
        }));
    }, [currentUser?.userId, dispatch, location.state, refs.countryIdRef]);

    useEffect(() => {
        if (bankFetchedSuccessfully && selectedBankId > 0) {
            console.log("Data fetched : ", data?.bankName)
            if (data?.bankName !== "Other banks") dispatch(setObjectItem({
                key: "bankAccountInputs",
                innerKey: "bankName",
                value: data?.bankName
            }));
            dispatch(setObjectItem({
                key: "validBankAccount",
                innerKey: "validBankName",
                value: regex.BANK_NAME_REGEX.test(data?.bankName)
            }));
        }
    }, [bankFetchedSuccessfully, data, dispatch, selectedBankId]);

    const handleAddAccountSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create a plain object instead of FormData
            const bankAccountData = {
                bankAccountNumber: bankAccountInputs.bankAccountNumber,
                cardHolderName: bankAccountInputs.cardHolderName,
                bankId: bankAccountInputs.bankId,
                clientId: currentUser?.userId,
                countryId: bankAccountInputs.countryId,
                bankName: bankAccountInputs.bankName,
            };

            setLoading(true);

            // Use the mutation hook to send the JSON object
            const response = await createBankAccount(bankAccountData).unwrap();

            if (response?.statusCode === 200 && response?.message === "Bank account created successfully") {
                setTickAnimationVisible(true);
                reset();
                setTimeout(() => navigate(adminPaths.bankAccountsPath), 2000);
            }
        } catch (error) {
            console.error('Error adding bank account:', error);
        } finally {
            setLoading(false);
        }
    };


    const reset = () => {
        dispatch(setItem({key: 'bankAccountInputs', value: initialBankAccountInputs}));
        dispatch(setItem({key: 'validBankAccount', value: initialValidBankAccount}));
    };

    return (
        <section id="login" className="container py-5" style={{height: '100vh'}}>
            <div className="row justify-content-center">
                {!tickAnimationVisible && (
                    <div className="col-lg-8">
                        <form onSubmit={handleAddAccountSubmit}>

                            <CountrySelector
                                ref={refs.countryIdRef}
                                changeHandler={(countryId) => dispatch(handleValidation({
                                    objectName: "bankAccount",
                                    eventValue: countryId,
                                    inputName: "countryId",
                                    regexPattern: "COUNTRY_ID_REGEX"
                                }))}
                                label="Country of the bank account"
                                validCountry={validBankAccount.validCountryId}
                                value={bankAccountInputs.countryId}
                                isFocused={bankAccountFocus.countryIdFocus}
                                handleFocus={() => dispatch(handleFocus({
                                    objectName: 'bankAccount',
                                    inputName: "countryId"
                                }))}
                                handleBlur={() => dispatch(handleBlur({
                                    objectName: 'bankAccount',
                                    inputName: "countryId",
                                    regexPattern: "COUNTRY_ID_REGEX"
                                }))}
                            />


                            {validBankAccount.validCountryId &&
                                <BankSelector
                                    ref={refs.bankRef}
                                    changeHandler={(bankId) => {
                                        console.log("New bankId : ", bankId)
                                        setSelectedBankId(bankId);
                                        return dispatch(handleValidation({
                                            objectName: "bankAccount",
                                            eventValue: bankId,
                                            inputName: "bankId",
                                            regexPattern: "BANK_ID_REGEX"
                                        }))
                                    }}
                                    countryId={bankAccountInputs.countryId}
                                    validBank={validBankAccount.validBankId}
                                    value={bankAccountInputs.bankId}
                                    isFocused={bankAccountFocus.bankFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'bankAccount',
                                        inputName: "bankId"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        objectName: 'bankAccount',
                                        inputName: "bankId",
                                        regexPattern: "BANK_ID_REGEX"
                                    }))}
                                />}
                            {data?.bankNameEng === "Let me write my bank manually" && (
                                <BankNameInput
                                    ref={refs.bankNameRef}
                                    changeHandler={(e) => dispatch(handleValidation({
                                        objectName: "bankAccount",
                                        eventValue: e.target.value,
                                        "inputName": "bankName",
                                        "regexPattern": "BANK_NAME_REGEX"
                                    }))}
                                    validBankName={validBankAccount.validBankName}
                                    value={bankAccountInputs.bankName}
                                    isFocused={bankAccountFocus.bankNameFocus}
                                    handleFocus={() => dispatch(handleFocus({
                                        objectName: 'bankAccount',
                                        inputName: "bankName"
                                    }))}
                                    handleBlur={() => dispatch(handleBlur({
                                        inputsObject: bankAccountInputs,
                                        objectName: 'bankAccount',
                                        inputName: "bankName",
                                        regexPattern: "BANK_NAME_REGEX"
                                    }))}
                                />
                            )}
                            <CardHolderNameInput
                                ref={refs.cardHolderNameRef}
                                changeHandler={(e) => dispatch(handleValidation({
                                    objectName: "bankAccount",
                                    eventValue: e.target.value,
                                    "inputName": "cardHolderName",
                                    "regexPattern": "FULL_NAME_REGEX"
                                }))}
                                validCardHolderName={validBankAccount.validCardHolderName}
                                value={bankAccountInputs.cardHolderName}
                                isFocused={bankAccountFocus.cardHolderNameFocus}
                                handleFocus={() => dispatch(handleFocus({
                                    objectName: 'bankAccount',
                                    inputName: "cardHolderName"
                                }))}
                                handleBlur={() => dispatch(handleBlur({
                                    inputsObject: bankAccountInputs,
                                    objectName: 'bankAccount',
                                    inputName: "cardHolderName",
                                    regexPattern: "FULL_NAME_REGEX"
                                }))}
                            />

                            <BankAccountNumberInput
                                ref={refs.bankAccountNumberRef}
                                changeHandler={(e) => dispatch(handleValidation({
                                    objectName: "bankAccount",
                                    eventValue: e.target.value,
                                    "inputName": "bankAccountNumber",
                                    "regexPattern": "BANK_ACCOUNT_NUMBER_REGEX"
                                }))}
                                validBankAccountNumber={validBankAccount.validBankAccountNumber}
                                value={bankAccountInputs.bankAccountNumber}
                                isFocused={bankAccountFocus.bankAccountNumberFocus}
                                handleFocus={() => dispatch(handleFocus({
                                    objectName: 'bankAccount',
                                    inputName: "bankAccountNumber"
                                }))}
                                handleBlur={() => dispatch(handleBlur({
                                    inputsObject: bankAccountInputs,
                                    objectName: 'bankAccount',
                                    inputName: "bankAccountNumber",
                                    regexPattern: "BANK_ACCOUNT_NUMBER_REGEX"
                                }))}
                            />
                            <ErrorMessageComponent ref={refs.errorRef}/>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <TendaButton
                                    disabled={!(
                                        validBankAccount.validBankAccountNumber && validBankAccount.validCardHolderName && validBankAccount.validClientId && validBankAccount.validBankId
                                        && !eventProperties.isError
                                        && validBankAccount.validBankName
                                    )}
                                    buttonText={loading ? 'Adding account...' : 'Add account'}/>
                            </div>
                        </form>
                    </div>
                )}
                {tickAnimationVisible && <TickAnimation successMessage="Bank account created successfully!"/>}
            </div>
        </section>
    );
};

export default AddBankAccount;

// regex.js
import { backend } from "./backend";
const STRICT_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>|\[\]\/\\?]).{4,24}$/;
const PASSWORD_REGEX = backend.env = /^.{4,}$/;
export const regex = {
    PASSWORD_REGEX,
    EMAIL_REGEX             : /^[A-Za-z0-9+_.-]+@(.+)$/,
    FULL_NAME_REGEX         : /^[A-Z][a-z]*(\s[A-Z][a-z]*)+$/,
    PHONE_NUMBER_REGEX      : /^(\+\d{1,3})?\d{9,14}$/,
    RECOMMENDER_REGEX       : /^[\w\s.,!?]{3,}$/,
    GENDER_REGEX            : /^(Male|Female|Other)$/,
    TITLE_REGEX             : /^.+$/,
    CLIENT_ID_REGEX         : /^[1-9]\d*$/,
    PRINCIPAL_REGEX            : /^[1-9]\d*$/,
    COLLATERAL_REGEX        : /^.{3,}$/,
    REASON_FOR_LOAN_REGEX   : /^.{4,}$/,
    OCCUPATION_REGEX        : /^[\w\s]{3,}$/,
    NATIONAL_ID_REGEX       : /^[^\s]{5,20}$/,
    BANK_ACCOUNT_NUMBER_REGEX: /^\d{6,18}$/,
    PASSPORT_NUMBER_REGEX   : /^\w{6,12}$/
};

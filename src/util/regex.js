// regex.js
import TopUpMethod from "./TopUpMethod";

const STRICT_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>|\[\]\/\\?]).{4,24}$/;
const LENIENT_PASSWORD_REGEX = /^.{4,}$/;
const TOP_UP_METHOD_REGEX = new RegExp(`^(${Object.values(TopUpMethod).join('|')})$`);

export const regex = {
    ADMIN_PASSWORD_REGEX        : STRICT_PASSWORD_REGEX,
    CLIENT_PASSWORD_REGEX       : LENIENT_PASSWORD_REGEX,
    EMAIL_REGEX                 : /^[A-Za-z0-9+_.-]+@(.+)$/,
    FULL_NAME_REGEX             : /^[\u4e00-\u9fa5A-Z][\u4e00-\u9fa5a-z]*(\s[\u4e00-\u9fa5A-Z][\u4e00-\u9fa5a-z]*)+$/,
    PHONE_NUMBER_REGEX          : /^(\+\d{1,3})?\d{9,14}$/,
    RECOMMENDER_REGEX           : /^[\w\s.,!?]{3,}$/,
    GENDER_REGEX                : /^(Male|Female|Other)$/,
    TITLE_REGEX                 : /^.+$/,
    CLIENT_ID_REGEX             : /^[1-9]\d*$/,
    PRINCIPAL_REGEX             : /^(?!0(\.0+)?$)([5-9]|\d{2,})(\.\d+)?$/,
    AMOUNT_REGEX                : /^(?!0(\.0+)?$)([0-9]|\d{2,})(\.\d+)?$/,
    RATE_REGEX                  : /^(?!0(\.0+)?$)\d+(\.\d+)?$/,
    COLLATERAL_REGEX            : /^.{3,}$/,
    REASON_FOR_LOAN_REGEX       : /^.{4,}$/,
    OCCUPATION_REGEX            : /^[\w\s]{3,}$/,
    NATIONAL_ID_REGEX           : /^[^\s]{5,20}$/,
    BANK_ACCOUNT_NUMBER_REGEX   : /^\d{6,18}$/,
    PASSPORT_NUMBER_REGEX       : /^\w{6,12}$/,
    ALIPAY_ACCOUNT_NAME_REGEX   : /^.{2,}$/,
    WECHAT_ACCOUNT_NAME_REGEX   : /^.{2,}$/,
    BANK_NAME_REGEX             : /^(?=.*\b(?:bank|银行|banque|banco)\b)(?!.*\bOther banks\b).*/i,  // Case-insensitive match for "bank" in English, French, and Chinese
    BANK_ID_REGEX               : /^[1-9]\d*$/,
    COUNTRY_ID_REGEX            : /^[1-9]\d*$/,
    REMARK_REGEX                : /^[\w\s.,!?@#$%^&*()\-_=+{};:'"<>|\[\]\/\\]*$/,
    CURRENCY_ID_REGEX           : /^[1-9]\d*$/,
    TOP_UP_METHOD_REGEX         : TOP_UP_METHOD_REGEX,
    UPLOAD_IMAGE_URL_REGEX      : /^blob:https?:\/\/\S+/i,
};

import { z } from 'zod';
import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image','role','createdAt','updatedAt']);

export const AccountScalarFieldEnumSchema = z.enum(['userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','createdAt','updatedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['sessionToken','userId','expires','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const ContactMessageScalarFieldEnumSchema = z.enum(['id','email','message','createdAt']);

export const LanguageScalarFieldEnumSchema = z.enum(['id','code','name']);

export const CountryScalarFieldEnumSchema = z.enum(['id','name','continent','flagUrl','currencyId','languageId']);

export const BankScalarFieldEnumSchema = z.enum(['id','name','nameEng','shortName','logoUrl','countryId']);

export const ReceiverAccountScalarFieldEnumSchema = z.enum(['id','name','type','clientId','identifier','qrCodeUrl','qrCodeContent','email','phoneNumber','balance','bankAccountNumber','bankId','limit']);

export const AdminPercentageScalarFieldEnumSchema = z.enum(['id','countryId','percentage']);

export const BankDepositAddressScalarFieldEnumSchema = z.enum(['id','address','bankId']);

export const CashDepositAddressScalarFieldEnumSchema = z.enum(['id','address','countryId']);

export const ExchangeRateScalarFieldEnumSchema = z.enum(['id','rateValue','lastUpdated','source','sourceCurrencyId','targetCurrencyId']);

export const CurrencyScalarFieldEnumSchema = z.enum(['id','code','name','symbol']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoleSchema = z.enum(['ADMIN','AGENT','CLIENT','ENGINEER','MANAGER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const ReceiverAccountTypeSchema = z.enum(['ALIPAY_ACCOUNT','WECHAT_ACCOUNT','BANK_ACCOUNT']);

export type ReceiverAccountTypeType = `${z.infer<typeof ReceiverAccountTypeSchema>}`

export const ReceiverAccountIdentifierSchema = z.enum(['EMAIL','PHONE_NUMBER','QR_CODE_IMAGE','NONE']);

export type ReceiverAccountIdentifierType = `${z.infer<typeof ReceiverAccountIdentifierSchema>}`

export const RateSourceSchema = z.enum(['FIXER_IO','OPEN_EXCHANGE_RATES','XE_COM','NGTRANSFERT_RATES']);

export type RateSourceType = `${z.infer<typeof RateSourceSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// CONTACT MESSAGE SCHEMA
/////////////////////////////////////////

export const ContactMessageSchema = z.object({
  id: z.string().cuid(),
  email: z.string(),
  message: z.string(),
  createdAt: z.coerce.date(),
})

export type ContactMessage = z.infer<typeof ContactMessageSchema>

/////////////////////////////////////////
// LANGUAGE SCHEMA
/////////////////////////////////////////

export const LanguageSchema = z.object({
  id: z.string().cuid(),
  code: z.string(),
  name: z.string(),
})

export type Language = z.infer<typeof LanguageSchema>

/////////////////////////////////////////
// COUNTRY SCHEMA
/////////////////////////////////////////

export const CountrySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().nullable(),
  currencyId: z.string().nullable(),
  languageId: z.string().nullable(),
})

export type Country = z.infer<typeof CountrySchema>

/////////////////////////////////////////
// BANK SCHEMA
/////////////////////////////////////////

export const BankSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  nameEng: z.string().nullable(),
  shortName: z.string().nullable(),
  logoUrl: z.string().nullable(),
  countryId: z.string().nullable(),
})

export type Bank = z.infer<typeof BankSchema>

/////////////////////////////////////////
// RECEIVER ACCOUNT SCHEMA
/////////////////////////////////////////

export const ReceiverAccountSchema = z.object({
  type: ReceiverAccountTypeSchema,
  identifier: ReceiverAccountIdentifierSchema,
  id: z.string().cuid(),
  name: z.string().nullable(),
  clientId: z.string(),
  qrCodeUrl: z.string().nullable(),
  qrCodeContent: z.string().nullable(),
  email: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  balance: z.instanceof(Prisma.Decimal, { message: "Field 'balance' must be a Decimal. Location: ['Models', 'ReceiverAccount']"}),
  bankAccountNumber: z.string().nullable(),
  bankId: z.string().nullable(),
  limit: z.instanceof(Prisma.Decimal, { message: "Field 'limit' must be a Decimal. Location: ['Models', 'ReceiverAccount']"}),
})

export type ReceiverAccount = z.infer<typeof ReceiverAccountSchema>

/////////////////////////////////////////
// ADMIN PERCENTAGE SCHEMA
/////////////////////////////////////////

export const AdminPercentageSchema = z.object({
  id: z.string().cuid(),
  countryId: z.string(),
  percentage: z.instanceof(Prisma.Decimal, { message: "Field 'percentage' must be a Decimal. Location: ['Models', 'AdminPercentage']"}),
})

export type AdminPercentage = z.infer<typeof AdminPercentageSchema>

/////////////////////////////////////////
// BANK DEPOSIT ADDRESS SCHEMA
/////////////////////////////////////////

export const BankDepositAddressSchema = z.object({
  id: z.string().cuid(),
  address: z.string(),
  bankId: z.string().nullable(),
})

export type BankDepositAddress = z.infer<typeof BankDepositAddressSchema>

/////////////////////////////////////////
// CASH DEPOSIT ADDRESS SCHEMA
/////////////////////////////////////////

export const CashDepositAddressSchema = z.object({
  id: z.string().cuid(),
  address: z.string(),
  countryId: z.string(),
})

export type CashDepositAddress = z.infer<typeof CashDepositAddressSchema>

/////////////////////////////////////////
// EXCHANGE RATE SCHEMA
/////////////////////////////////////////

export const ExchangeRateSchema = z.object({
  source: RateSourceSchema,
  id: z.string().cuid(),
  rateValue: z.instanceof(Prisma.Decimal, { message: "Field 'rateValue' must be a Decimal. Location: ['Models', 'ExchangeRate']"}),
  lastUpdated: z.coerce.date(),
  sourceCurrencyId: z.string(),
  targetCurrencyId: z.string(),
})

export type ExchangeRate = z.infer<typeof ExchangeRateSchema>

/////////////////////////////////////////
// CURRENCY SCHEMA
/////////////////////////////////////////

export const CurrencySchema = z.object({
  id: z.string().cuid(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().nullable(),
})

export type Currency = z.infer<typeof CurrencySchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  receiverAccounts: z.union([z.boolean(),z.lazy(() => ReceiverAccountFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  accounts: z.boolean().optional(),
  sessions: z.boolean().optional(),
  receiverAccounts: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
  image: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  accounts: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  sessions: z.union([z.boolean(),z.lazy(() => SessionFindManyArgsSchema)]).optional(),
  receiverAccounts: z.union([z.boolean(),z.lazy(() => ReceiverAccountFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  userId: z.boolean().optional(),
  type: z.boolean().optional(),
  provider: z.boolean().optional(),
  providerAccountId: z.boolean().optional(),
  refresh_token: z.boolean().optional(),
  access_token: z.boolean().optional(),
  expires_at: z.boolean().optional(),
  token_type: z.boolean().optional(),
  scope: z.boolean().optional(),
  id_token: z.boolean().optional(),
  session_state: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z.object({
  select: z.lazy(() => SessionSelectSchema).optional(),
  include: z.lazy(() => SessionIncludeSchema).optional(),
}).strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z.object({
  sessionToken: z.boolean().optional(),
  userId: z.boolean().optional(),
  expires: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// VERIFICATION TOKEN
//------------------------------------------------------

export const VerificationTokenSelectSchema: z.ZodType<Prisma.VerificationTokenSelect> = z.object({
  identifier: z.boolean().optional(),
  token: z.boolean().optional(),
  expires: z.boolean().optional(),
}).strict()

// CONTACT MESSAGE
//------------------------------------------------------

export const ContactMessageSelectSchema: z.ZodType<Prisma.ContactMessageSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  message: z.boolean().optional(),
  createdAt: z.boolean().optional(),
}).strict()

// LANGUAGE
//------------------------------------------------------

export const LanguageIncludeSchema: z.ZodType<Prisma.LanguageInclude> = z.object({
  countries: z.union([z.boolean(),z.lazy(() => CountryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LanguageCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const LanguageArgsSchema: z.ZodType<Prisma.LanguageDefaultArgs> = z.object({
  select: z.lazy(() => LanguageSelectSchema).optional(),
  include: z.lazy(() => LanguageIncludeSchema).optional(),
}).strict();

export const LanguageCountOutputTypeArgsSchema: z.ZodType<Prisma.LanguageCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => LanguageCountOutputTypeSelectSchema).nullish(),
}).strict();

export const LanguageCountOutputTypeSelectSchema: z.ZodType<Prisma.LanguageCountOutputTypeSelect> = z.object({
  countries: z.boolean().optional(),
}).strict();

export const LanguageSelectSchema: z.ZodType<Prisma.LanguageSelect> = z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  countries: z.union([z.boolean(),z.lazy(() => CountryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => LanguageCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COUNTRY
//------------------------------------------------------

export const CountryIncludeSchema: z.ZodType<Prisma.CountryInclude> = z.object({
  currency: z.union([z.boolean(),z.lazy(() => CurrencyArgsSchema)]).optional(),
  language: z.union([z.boolean(),z.lazy(() => LanguageArgsSchema)]).optional(),
  banks: z.union([z.boolean(),z.lazy(() => BankFindManyArgsSchema)]).optional(),
  adminPercentages: z.union([z.boolean(),z.lazy(() => AdminPercentageFindManyArgsSchema)]).optional(),
  cashDepositAddresses: z.union([z.boolean(),z.lazy(() => CashDepositAddressFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CountryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CountryArgsSchema: z.ZodType<Prisma.CountryDefaultArgs> = z.object({
  select: z.lazy(() => CountrySelectSchema).optional(),
  include: z.lazy(() => CountryIncludeSchema).optional(),
}).strict();

export const CountryCountOutputTypeArgsSchema: z.ZodType<Prisma.CountryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CountryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CountryCountOutputTypeSelectSchema: z.ZodType<Prisma.CountryCountOutputTypeSelect> = z.object({
  banks: z.boolean().optional(),
  adminPercentages: z.boolean().optional(),
  cashDepositAddresses: z.boolean().optional(),
}).strict();

export const CountrySelectSchema: z.ZodType<Prisma.CountrySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  continent: z.boolean().optional(),
  flagUrl: z.boolean().optional(),
  currencyId: z.boolean().optional(),
  languageId: z.boolean().optional(),
  currency: z.union([z.boolean(),z.lazy(() => CurrencyArgsSchema)]).optional(),
  language: z.union([z.boolean(),z.lazy(() => LanguageArgsSchema)]).optional(),
  banks: z.union([z.boolean(),z.lazy(() => BankFindManyArgsSchema)]).optional(),
  adminPercentages: z.union([z.boolean(),z.lazy(() => AdminPercentageFindManyArgsSchema)]).optional(),
  cashDepositAddresses: z.union([z.boolean(),z.lazy(() => CashDepositAddressFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CountryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// BANK
//------------------------------------------------------

export const BankIncludeSchema: z.ZodType<Prisma.BankInclude> = z.object({
  country: z.union([z.boolean(),z.lazy(() => CountryArgsSchema)]).optional(),
  receiverAccounts: z.union([z.boolean(),z.lazy(() => ReceiverAccountFindManyArgsSchema)]).optional(),
  bankDepositAddresses: z.union([z.boolean(),z.lazy(() => BankDepositAddressFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BankCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const BankArgsSchema: z.ZodType<Prisma.BankDefaultArgs> = z.object({
  select: z.lazy(() => BankSelectSchema).optional(),
  include: z.lazy(() => BankIncludeSchema).optional(),
}).strict();

export const BankCountOutputTypeArgsSchema: z.ZodType<Prisma.BankCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => BankCountOutputTypeSelectSchema).nullish(),
}).strict();

export const BankCountOutputTypeSelectSchema: z.ZodType<Prisma.BankCountOutputTypeSelect> = z.object({
  receiverAccounts: z.boolean().optional(),
  bankDepositAddresses: z.boolean().optional(),
}).strict();

export const BankSelectSchema: z.ZodType<Prisma.BankSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  nameEng: z.boolean().optional(),
  shortName: z.boolean().optional(),
  logoUrl: z.boolean().optional(),
  countryId: z.boolean().optional(),
  country: z.union([z.boolean(),z.lazy(() => CountryArgsSchema)]).optional(),
  receiverAccounts: z.union([z.boolean(),z.lazy(() => ReceiverAccountFindManyArgsSchema)]).optional(),
  bankDepositAddresses: z.union([z.boolean(),z.lazy(() => BankDepositAddressFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BankCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RECEIVER ACCOUNT
//------------------------------------------------------

export const ReceiverAccountIncludeSchema: z.ZodType<Prisma.ReceiverAccountInclude> = z.object({
  client: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  bank: z.union([z.boolean(),z.lazy(() => BankArgsSchema)]).optional(),
}).strict()

export const ReceiverAccountArgsSchema: z.ZodType<Prisma.ReceiverAccountDefaultArgs> = z.object({
  select: z.lazy(() => ReceiverAccountSelectSchema).optional(),
  include: z.lazy(() => ReceiverAccountIncludeSchema).optional(),
}).strict();

export const ReceiverAccountSelectSchema: z.ZodType<Prisma.ReceiverAccountSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  clientId: z.boolean().optional(),
  identifier: z.boolean().optional(),
  qrCodeUrl: z.boolean().optional(),
  qrCodeContent: z.boolean().optional(),
  email: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  balance: z.boolean().optional(),
  bankAccountNumber: z.boolean().optional(),
  bankId: z.boolean().optional(),
  limit: z.boolean().optional(),
  client: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  bank: z.union([z.boolean(),z.lazy(() => BankArgsSchema)]).optional(),
}).strict()

// ADMIN PERCENTAGE
//------------------------------------------------------

export const AdminPercentageIncludeSchema: z.ZodType<Prisma.AdminPercentageInclude> = z.object({
  country: z.union([z.boolean(),z.lazy(() => CountryArgsSchema)]).optional(),
}).strict()

export const AdminPercentageArgsSchema: z.ZodType<Prisma.AdminPercentageDefaultArgs> = z.object({
  select: z.lazy(() => AdminPercentageSelectSchema).optional(),
  include: z.lazy(() => AdminPercentageIncludeSchema).optional(),
}).strict();

export const AdminPercentageSelectSchema: z.ZodType<Prisma.AdminPercentageSelect> = z.object({
  id: z.boolean().optional(),
  countryId: z.boolean().optional(),
  percentage: z.boolean().optional(),
  country: z.union([z.boolean(),z.lazy(() => CountryArgsSchema)]).optional(),
}).strict()

// BANK DEPOSIT ADDRESS
//------------------------------------------------------

export const BankDepositAddressIncludeSchema: z.ZodType<Prisma.BankDepositAddressInclude> = z.object({
  bank: z.union([z.boolean(),z.lazy(() => BankArgsSchema)]).optional(),
}).strict()

export const BankDepositAddressArgsSchema: z.ZodType<Prisma.BankDepositAddressDefaultArgs> = z.object({
  select: z.lazy(() => BankDepositAddressSelectSchema).optional(),
  include: z.lazy(() => BankDepositAddressIncludeSchema).optional(),
}).strict();

export const BankDepositAddressSelectSchema: z.ZodType<Prisma.BankDepositAddressSelect> = z.object({
  id: z.boolean().optional(),
  address: z.boolean().optional(),
  bankId: z.boolean().optional(),
  bank: z.union([z.boolean(),z.lazy(() => BankArgsSchema)]).optional(),
}).strict()

// CASH DEPOSIT ADDRESS
//------------------------------------------------------

export const CashDepositAddressIncludeSchema: z.ZodType<Prisma.CashDepositAddressInclude> = z.object({
  country: z.union([z.boolean(),z.lazy(() => CountryArgsSchema)]).optional(),
}).strict()

export const CashDepositAddressArgsSchema: z.ZodType<Prisma.CashDepositAddressDefaultArgs> = z.object({
  select: z.lazy(() => CashDepositAddressSelectSchema).optional(),
  include: z.lazy(() => CashDepositAddressIncludeSchema).optional(),
}).strict();

export const CashDepositAddressSelectSchema: z.ZodType<Prisma.CashDepositAddressSelect> = z.object({
  id: z.boolean().optional(),
  address: z.boolean().optional(),
  countryId: z.boolean().optional(),
  country: z.union([z.boolean(),z.lazy(() => CountryArgsSchema)]).optional(),
}).strict()

// EXCHANGE RATE
//------------------------------------------------------

export const ExchangeRateIncludeSchema: z.ZodType<Prisma.ExchangeRateInclude> = z.object({
  sourceCurrency: z.union([z.boolean(),z.lazy(() => CurrencyArgsSchema)]).optional(),
  targetCurrency: z.union([z.boolean(),z.lazy(() => CurrencyArgsSchema)]).optional(),
}).strict()

export const ExchangeRateArgsSchema: z.ZodType<Prisma.ExchangeRateDefaultArgs> = z.object({
  select: z.lazy(() => ExchangeRateSelectSchema).optional(),
  include: z.lazy(() => ExchangeRateIncludeSchema).optional(),
}).strict();

export const ExchangeRateSelectSchema: z.ZodType<Prisma.ExchangeRateSelect> = z.object({
  id: z.boolean().optional(),
  rateValue: z.boolean().optional(),
  lastUpdated: z.boolean().optional(),
  source: z.boolean().optional(),
  sourceCurrencyId: z.boolean().optional(),
  targetCurrencyId: z.boolean().optional(),
  sourceCurrency: z.union([z.boolean(),z.lazy(() => CurrencyArgsSchema)]).optional(),
  targetCurrency: z.union([z.boolean(),z.lazy(() => CurrencyArgsSchema)]).optional(),
}).strict()

// CURRENCY
//------------------------------------------------------

export const CurrencyIncludeSchema: z.ZodType<Prisma.CurrencyInclude> = z.object({
  sourceExchangeRates: z.union([z.boolean(),z.lazy(() => ExchangeRateFindManyArgsSchema)]).optional(),
  targetExchangeRates: z.union([z.boolean(),z.lazy(() => ExchangeRateFindManyArgsSchema)]).optional(),
  countries: z.union([z.boolean(),z.lazy(() => CountryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CurrencyCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CurrencyArgsSchema: z.ZodType<Prisma.CurrencyDefaultArgs> = z.object({
  select: z.lazy(() => CurrencySelectSchema).optional(),
  include: z.lazy(() => CurrencyIncludeSchema).optional(),
}).strict();

export const CurrencyCountOutputTypeArgsSchema: z.ZodType<Prisma.CurrencyCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CurrencyCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CurrencyCountOutputTypeSelectSchema: z.ZodType<Prisma.CurrencyCountOutputTypeSelect> = z.object({
  sourceExchangeRates: z.boolean().optional(),
  targetExchangeRates: z.boolean().optional(),
  countries: z.boolean().optional(),
}).strict();

export const CurrencySelectSchema: z.ZodType<Prisma.CurrencySelect> = z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  symbol: z.boolean().optional(),
  sourceExchangeRates: z.union([z.boolean(),z.lazy(() => ExchangeRateFindManyArgsSchema)]).optional(),
  targetExchangeRates: z.union([z.boolean(),z.lazy(() => ExchangeRateFindManyArgsSchema)]).optional(),
  countries: z.union([z.boolean(),z.lazy(() => CountryFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CurrencyCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
  sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  image: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emailVerified: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  image: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema),z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema)
})
.and(z.object({
  provider_providerAccountId: z.lazy(() => AccountProviderProviderAccountIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  access_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expires_at: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  token_type: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  scope: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  id_token: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  session_state: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z.object({
  sessionToken: z.string()
})
.and(z.object({
  sessionToken: z.string().optional(),
  AND: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionWhereInputSchema),z.lazy(() => SessionWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional()
}).strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenWhereInputSchema: z.ZodType<Prisma.VerificationTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VerificationTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithRelationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenWhereUniqueInputSchema: z.ZodType<Prisma.VerificationTokenWhereUniqueInput> = z.object({
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema)
})
.and(z.object({
  identifier_token: z.lazy(() => VerificationTokenIdentifierTokenCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenWhereInputSchema),z.lazy(() => VerificationTokenWhereInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const VerificationTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationTokenOrderByWithAggregationInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VerificationTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VerificationTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VerificationTokenMinOrderByAggregateInputSchema).optional()
}).strict();

export const VerificationTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => VerificationTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  identifier: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ContactMessageWhereInputSchema: z.ZodType<Prisma.ContactMessageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContactMessageWhereInputSchema),z.lazy(() => ContactMessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactMessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactMessageWhereInputSchema),z.lazy(() => ContactMessageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ContactMessageOrderByWithRelationInputSchema: z.ZodType<Prisma.ContactMessageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactMessageWhereUniqueInputSchema: z.ZodType<Prisma.ContactMessageWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => ContactMessageWhereInputSchema),z.lazy(() => ContactMessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactMessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactMessageWhereInputSchema),z.lazy(() => ContactMessageWhereInputSchema).array() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict());

export const ContactMessageOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContactMessageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContactMessageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContactMessageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContactMessageMinOrderByAggregateInputSchema).optional()
}).strict();

export const ContactMessageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContactMessageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContactMessageScalarWhereWithAggregatesInputSchema),z.lazy(() => ContactMessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactMessageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactMessageScalarWhereWithAggregatesInputSchema),z.lazy(() => ContactMessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  message: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const LanguageWhereInputSchema: z.ZodType<Prisma.LanguageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LanguageWhereInputSchema),z.lazy(() => LanguageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LanguageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LanguageWhereInputSchema),z.lazy(() => LanguageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countries: z.lazy(() => CountryListRelationFilterSchema).optional()
}).strict();

export const LanguageOrderByWithRelationInputSchema: z.ZodType<Prisma.LanguageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  countries: z.lazy(() => CountryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const LanguageWhereUniqueInputSchema: z.ZodType<Prisma.LanguageWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => LanguageWhereInputSchema),z.lazy(() => LanguageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LanguageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LanguageWhereInputSchema),z.lazy(() => LanguageWhereInputSchema).array() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countries: z.lazy(() => CountryListRelationFilterSchema).optional()
}).strict());

export const LanguageOrderByWithAggregationInputSchema: z.ZodType<Prisma.LanguageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LanguageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LanguageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LanguageMinOrderByAggregateInputSchema).optional()
}).strict();

export const LanguageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LanguageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema),z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema),z.lazy(() => LanguageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CountryWhereInputSchema: z.ZodType<Prisma.CountryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CountryWhereInputSchema),z.lazy(() => CountryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountryWhereInputSchema),z.lazy(() => CountryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  continent: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  flagUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  currencyId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  languageId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => CurrencyNullableScalarRelationFilterSchema),z.lazy(() => CurrencyWhereInputSchema) ]).optional().nullable(),
  language: z.union([ z.lazy(() => LanguageNullableScalarRelationFilterSchema),z.lazy(() => LanguageWhereInputSchema) ]).optional().nullable(),
  banks: z.lazy(() => BankListRelationFilterSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageListRelationFilterSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressListRelationFilterSchema).optional()
}).strict();

export const CountryOrderByWithRelationInputSchema: z.ZodType<Prisma.CountryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  continent: z.lazy(() => SortOrderSchema).optional(),
  flagUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  currencyId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  languageId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  currency: z.lazy(() => CurrencyOrderByWithRelationInputSchema).optional(),
  language: z.lazy(() => LanguageOrderByWithRelationInputSchema).optional(),
  banks: z.lazy(() => BankOrderByRelationAggregateInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageOrderByRelationAggregateInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CountryWhereUniqueInputSchema: z.ZodType<Prisma.CountryWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => CountryWhereInputSchema),z.lazy(() => CountryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountryWhereInputSchema),z.lazy(() => CountryWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  continent: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  flagUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  currencyId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  languageId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  currency: z.union([ z.lazy(() => CurrencyNullableScalarRelationFilterSchema),z.lazy(() => CurrencyWhereInputSchema) ]).optional().nullable(),
  language: z.union([ z.lazy(() => LanguageNullableScalarRelationFilterSchema),z.lazy(() => LanguageWhereInputSchema) ]).optional().nullable(),
  banks: z.lazy(() => BankListRelationFilterSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageListRelationFilterSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressListRelationFilterSchema).optional()
}).strict());

export const CountryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CountryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  continent: z.lazy(() => SortOrderSchema).optional(),
  flagUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  currencyId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  languageId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CountryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CountryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CountryMinOrderByAggregateInputSchema).optional()
}).strict();

export const CountryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CountryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CountryScalarWhereWithAggregatesInputSchema),z.lazy(() => CountryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountryScalarWhereWithAggregatesInputSchema),z.lazy(() => CountryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  continent: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  flagUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  currencyId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  languageId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const BankWhereInputSchema: z.ZodType<Prisma.BankWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BankWhereInputSchema),z.lazy(() => BankWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BankWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BankWhereInputSchema),z.lazy(() => BankWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  nameEng: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  shortName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  logoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  countryId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => CountryNullableScalarRelationFilterSchema),z.lazy(() => CountryWhereInputSchema) ]).optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountListRelationFilterSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressListRelationFilterSchema).optional()
}).strict();

export const BankOrderByWithRelationInputSchema: z.ZodType<Prisma.BankOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  nameEng: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  shortName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  logoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  countryId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  country: z.lazy(() => CountryOrderByWithRelationInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountOrderByRelationAggregateInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressOrderByRelationAggregateInputSchema).optional()
}).strict();

export const BankWhereUniqueInputSchema: z.ZodType<Prisma.BankWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => BankWhereInputSchema),z.lazy(() => BankWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BankWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BankWhereInputSchema),z.lazy(() => BankWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  nameEng: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  shortName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  logoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  countryId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  country: z.union([ z.lazy(() => CountryNullableScalarRelationFilterSchema),z.lazy(() => CountryWhereInputSchema) ]).optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountListRelationFilterSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressListRelationFilterSchema).optional()
}).strict());

export const BankOrderByWithAggregationInputSchema: z.ZodType<Prisma.BankOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  nameEng: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  shortName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  logoUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  countryId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => BankCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BankMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BankMinOrderByAggregateInputSchema).optional()
}).strict();

export const BankScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BankScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BankScalarWhereWithAggregatesInputSchema),z.lazy(() => BankScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BankScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BankScalarWhereWithAggregatesInputSchema),z.lazy(() => BankScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  nameEng: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  shortName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  logoUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  countryId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ReceiverAccountWhereInputSchema: z.ZodType<Prisma.ReceiverAccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReceiverAccountWhereInputSchema),z.lazy(() => ReceiverAccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReceiverAccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReceiverAccountWhereInputSchema),z.lazy(() => ReceiverAccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumReceiverAccountTypeFilterSchema),z.lazy(() => ReceiverAccountTypeSchema) ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => EnumReceiverAccountIdentifierFilterSchema),z.lazy(() => ReceiverAccountIdentifierSchema) ]).optional(),
  qrCodeUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  qrCodeContent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  bankAccountNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bankId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  limit: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  client: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  bank: z.union([ z.lazy(() => BankNullableScalarRelationFilterSchema),z.lazy(() => BankWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ReceiverAccountOrderByWithRelationInputSchema: z.ZodType<Prisma.ReceiverAccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  qrCodeUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  qrCodeContent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  bankAccountNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bankId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  limit: z.lazy(() => SortOrderSchema).optional(),
  client: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  bank: z.lazy(() => BankOrderByWithRelationInputSchema).optional()
}).strict();

export const ReceiverAccountWhereUniqueInputSchema: z.ZodType<Prisma.ReceiverAccountWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    qrCodeContent: z.string(),
    email: z.string(),
    phoneNumber: z.string()
  }),
  z.object({
    id: z.string().cuid(),
    qrCodeContent: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    qrCodeContent: z.string(),
    phoneNumber: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    qrCodeContent: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    email: z.string(),
    phoneNumber: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    email: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    phoneNumber: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    qrCodeContent: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
  }),
  z.object({
    qrCodeContent: z.string(),
    email: z.string(),
  }),
  z.object({
    qrCodeContent: z.string(),
    phoneNumber: z.string(),
  }),
  z.object({
    qrCodeContent: z.string(),
  }),
  z.object({
    email: z.string(),
    phoneNumber: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    phoneNumber: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  qrCodeContent: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  AND: z.union([ z.lazy(() => ReceiverAccountWhereInputSchema),z.lazy(() => ReceiverAccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReceiverAccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReceiverAccountWhereInputSchema),z.lazy(() => ReceiverAccountWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumReceiverAccountTypeFilterSchema),z.lazy(() => ReceiverAccountTypeSchema) ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => EnumReceiverAccountIdentifierFilterSchema),z.lazy(() => ReceiverAccountIdentifierSchema) ]).optional(),
  qrCodeUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  bankAccountNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bankId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  limit: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  client: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  bank: z.union([ z.lazy(() => BankNullableScalarRelationFilterSchema),z.lazy(() => BankWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ReceiverAccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.ReceiverAccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  qrCodeUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  qrCodeContent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phoneNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  bankAccountNumber: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bankId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  limit: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ReceiverAccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ReceiverAccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ReceiverAccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ReceiverAccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ReceiverAccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const ReceiverAccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ReceiverAccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ReceiverAccountScalarWhereWithAggregatesInputSchema),z.lazy(() => ReceiverAccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReceiverAccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReceiverAccountScalarWhereWithAggregatesInputSchema),z.lazy(() => ReceiverAccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumReceiverAccountTypeWithAggregatesFilterSchema),z.lazy(() => ReceiverAccountTypeSchema) ]).optional(),
  clientId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => EnumReceiverAccountIdentifierWithAggregatesFilterSchema),z.lazy(() => ReceiverAccountIdentifierSchema) ]).optional(),
  qrCodeUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  qrCodeContent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  bankAccountNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  bankId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  limit: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const AdminPercentageWhereInputSchema: z.ZodType<Prisma.AdminPercentageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AdminPercentageWhereInputSchema),z.lazy(() => AdminPercentageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AdminPercentageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AdminPercentageWhereInputSchema),z.lazy(() => AdminPercentageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  percentage: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  country: z.union([ z.lazy(() => CountryScalarRelationFilterSchema),z.lazy(() => CountryWhereInputSchema) ]).optional(),
}).strict();

export const AdminPercentageOrderByWithRelationInputSchema: z.ZodType<Prisma.AdminPercentageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional(),
  percentage: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => CountryOrderByWithRelationInputSchema).optional()
}).strict();

export const AdminPercentageWhereUniqueInputSchema: z.ZodType<Prisma.AdminPercentageWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    countryId_percentage: z.lazy(() => AdminPercentageCountryIdPercentageCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    countryId_percentage: z.lazy(() => AdminPercentageCountryIdPercentageCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  countryId_percentage: z.lazy(() => AdminPercentageCountryIdPercentageCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => AdminPercentageWhereInputSchema),z.lazy(() => AdminPercentageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AdminPercentageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AdminPercentageWhereInputSchema),z.lazy(() => AdminPercentageWhereInputSchema).array() ]).optional(),
  countryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  percentage: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  country: z.union([ z.lazy(() => CountryScalarRelationFilterSchema),z.lazy(() => CountryWhereInputSchema) ]).optional(),
}).strict());

export const AdminPercentageOrderByWithAggregationInputSchema: z.ZodType<Prisma.AdminPercentageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional(),
  percentage: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AdminPercentageCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AdminPercentageAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AdminPercentageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AdminPercentageMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AdminPercentageSumOrderByAggregateInputSchema).optional()
}).strict();

export const AdminPercentageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AdminPercentageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AdminPercentageScalarWhereWithAggregatesInputSchema),z.lazy(() => AdminPercentageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AdminPercentageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AdminPercentageScalarWhereWithAggregatesInputSchema),z.lazy(() => AdminPercentageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  countryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  percentage: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const BankDepositAddressWhereInputSchema: z.ZodType<Prisma.BankDepositAddressWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BankDepositAddressWhereInputSchema),z.lazy(() => BankDepositAddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BankDepositAddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BankDepositAddressWhereInputSchema),z.lazy(() => BankDepositAddressWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  bankId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bank: z.union([ z.lazy(() => BankNullableScalarRelationFilterSchema),z.lazy(() => BankWhereInputSchema) ]).optional().nullable(),
}).strict();

export const BankDepositAddressOrderByWithRelationInputSchema: z.ZodType<Prisma.BankDepositAddressOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  bankId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  bank: z.lazy(() => BankOrderByWithRelationInputSchema).optional()
}).strict();

export const BankDepositAddressWhereUniqueInputSchema: z.ZodType<Prisma.BankDepositAddressWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    address_bankId: z.lazy(() => BankDepositAddressAddressBankIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    address_bankId: z.lazy(() => BankDepositAddressAddressBankIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  address_bankId: z.lazy(() => BankDepositAddressAddressBankIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => BankDepositAddressWhereInputSchema),z.lazy(() => BankDepositAddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BankDepositAddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BankDepositAddressWhereInputSchema),z.lazy(() => BankDepositAddressWhereInputSchema).array() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  bankId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bank: z.union([ z.lazy(() => BankNullableScalarRelationFilterSchema),z.lazy(() => BankWhereInputSchema) ]).optional().nullable(),
}).strict());

export const BankDepositAddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.BankDepositAddressOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  bankId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => BankDepositAddressCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BankDepositAddressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BankDepositAddressMinOrderByAggregateInputSchema).optional()
}).strict();

export const BankDepositAddressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BankDepositAddressScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BankDepositAddressScalarWhereWithAggregatesInputSchema),z.lazy(() => BankDepositAddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BankDepositAddressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BankDepositAddressScalarWhereWithAggregatesInputSchema),z.lazy(() => BankDepositAddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  bankId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const CashDepositAddressWhereInputSchema: z.ZodType<Prisma.CashDepositAddressWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CashDepositAddressWhereInputSchema),z.lazy(() => CashDepositAddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CashDepositAddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CashDepositAddressWhereInputSchema),z.lazy(() => CashDepositAddressWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => CountryScalarRelationFilterSchema),z.lazy(() => CountryWhereInputSchema) ]).optional(),
}).strict();

export const CashDepositAddressOrderByWithRelationInputSchema: z.ZodType<Prisma.CashDepositAddressOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => CountryOrderByWithRelationInputSchema).optional()
}).strict();

export const CashDepositAddressWhereUniqueInputSchema: z.ZodType<Prisma.CashDepositAddressWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    address_countryId: z.lazy(() => CashDepositAddressAddressCountryIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    address_countryId: z.lazy(() => CashDepositAddressAddressCountryIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  address_countryId: z.lazy(() => CashDepositAddressAddressCountryIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => CashDepositAddressWhereInputSchema),z.lazy(() => CashDepositAddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CashDepositAddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CashDepositAddressWhereInputSchema),z.lazy(() => CashDepositAddressWhereInputSchema).array() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => CountryScalarRelationFilterSchema),z.lazy(() => CountryWhereInputSchema) ]).optional(),
}).strict());

export const CashDepositAddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.CashDepositAddressOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CashDepositAddressCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CashDepositAddressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CashDepositAddressMinOrderByAggregateInputSchema).optional()
}).strict();

export const CashDepositAddressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CashDepositAddressScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CashDepositAddressScalarWhereWithAggregatesInputSchema),z.lazy(() => CashDepositAddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CashDepositAddressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CashDepositAddressScalarWhereWithAggregatesInputSchema),z.lazy(() => CashDepositAddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  countryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ExchangeRateWhereInputSchema: z.ZodType<Prisma.ExchangeRateWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ExchangeRateWhereInputSchema),z.lazy(() => ExchangeRateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExchangeRateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExchangeRateWhereInputSchema),z.lazy(() => ExchangeRateWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rateValue: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lastUpdated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  source: z.union([ z.lazy(() => EnumRateSourceFilterSchema),z.lazy(() => RateSourceSchema) ]).optional(),
  sourceCurrencyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  targetCurrencyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sourceCurrency: z.union([ z.lazy(() => CurrencyScalarRelationFilterSchema),z.lazy(() => CurrencyWhereInputSchema) ]).optional(),
  targetCurrency: z.union([ z.lazy(() => CurrencyScalarRelationFilterSchema),z.lazy(() => CurrencyWhereInputSchema) ]).optional(),
}).strict();

export const ExchangeRateOrderByWithRelationInputSchema: z.ZodType<Prisma.ExchangeRateOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rateValue: z.lazy(() => SortOrderSchema).optional(),
  lastUpdated: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceCurrencyId: z.lazy(() => SortOrderSchema).optional(),
  targetCurrencyId: z.lazy(() => SortOrderSchema).optional(),
  sourceCurrency: z.lazy(() => CurrencyOrderByWithRelationInputSchema).optional(),
  targetCurrency: z.lazy(() => CurrencyOrderByWithRelationInputSchema).optional()
}).strict();

export const ExchangeRateWhereUniqueInputSchema: z.ZodType<Prisma.ExchangeRateWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    sourceCurrencyId_targetCurrencyId: z.lazy(() => ExchangeRateSourceCurrencyIdTargetCurrencyIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    sourceCurrencyId_targetCurrencyId: z.lazy(() => ExchangeRateSourceCurrencyIdTargetCurrencyIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  sourceCurrencyId_targetCurrencyId: z.lazy(() => ExchangeRateSourceCurrencyIdTargetCurrencyIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ExchangeRateWhereInputSchema),z.lazy(() => ExchangeRateWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExchangeRateWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExchangeRateWhereInputSchema),z.lazy(() => ExchangeRateWhereInputSchema).array() ]).optional(),
  rateValue: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lastUpdated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  source: z.union([ z.lazy(() => EnumRateSourceFilterSchema),z.lazy(() => RateSourceSchema) ]).optional(),
  sourceCurrencyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  targetCurrencyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  sourceCurrency: z.union([ z.lazy(() => CurrencyScalarRelationFilterSchema),z.lazy(() => CurrencyWhereInputSchema) ]).optional(),
  targetCurrency: z.union([ z.lazy(() => CurrencyScalarRelationFilterSchema),z.lazy(() => CurrencyWhereInputSchema) ]).optional(),
}).strict());

export const ExchangeRateOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExchangeRateOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rateValue: z.lazy(() => SortOrderSchema).optional(),
  lastUpdated: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceCurrencyId: z.lazy(() => SortOrderSchema).optional(),
  targetCurrencyId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ExchangeRateCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ExchangeRateAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExchangeRateMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExchangeRateMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ExchangeRateSumOrderByAggregateInputSchema).optional()
}).strict();

export const ExchangeRateScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExchangeRateScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ExchangeRateScalarWhereWithAggregatesInputSchema),z.lazy(() => ExchangeRateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExchangeRateScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExchangeRateScalarWhereWithAggregatesInputSchema),z.lazy(() => ExchangeRateScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  rateValue: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lastUpdated: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  source: z.union([ z.lazy(() => EnumRateSourceWithAggregatesFilterSchema),z.lazy(() => RateSourceSchema) ]).optional(),
  sourceCurrencyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  targetCurrencyId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CurrencyWhereInputSchema: z.ZodType<Prisma.CurrencyWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CurrencyWhereInputSchema),z.lazy(() => CurrencyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CurrencyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CurrencyWhereInputSchema),z.lazy(() => CurrencyWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  symbol: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateListRelationFilterSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateListRelationFilterSchema).optional(),
  countries: z.lazy(() => CountryListRelationFilterSchema).optional()
}).strict();

export const CurrencyOrderByWithRelationInputSchema: z.ZodType<Prisma.CurrencyOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  sourceExchangeRates: z.lazy(() => ExchangeRateOrderByRelationAggregateInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateOrderByRelationAggregateInputSchema).optional(),
  countries: z.lazy(() => CountryOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CurrencyWhereUniqueInputSchema: z.ZodType<Prisma.CurrencyWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    code: z.string(),
    name: z.string()
  }),
  z.object({
    id: z.string().cuid(),
    code: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
    name: z.string(),
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    code: z.string(),
    name: z.string(),
  }),
  z.object({
    code: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => CurrencyWhereInputSchema),z.lazy(() => CurrencyWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CurrencyWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CurrencyWhereInputSchema),z.lazy(() => CurrencyWhereInputSchema).array() ]).optional(),
  symbol: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateListRelationFilterSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateListRelationFilterSchema).optional(),
  countries: z.lazy(() => CountryListRelationFilterSchema).optional()
}).strict());

export const CurrencyOrderByWithAggregationInputSchema: z.ZodType<Prisma.CurrencyOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CurrencyCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CurrencyMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CurrencyMinOrderByAggregateInputSchema).optional()
}).strict();

export const CurrencyScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CurrencyScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CurrencyScalarWhereWithAggregatesInputSchema),z.lazy(() => CurrencyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CurrencyScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CurrencyScalarWhereWithAggregatesInputSchema),z.lazy(() => CurrencyScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  code: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  symbol: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountCreateNestedManyWithoutClientInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedCreateNestedManyWithoutClientInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUpdateManyWithoutClientNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedUpdateManyWithoutClientNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema)
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z.object({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema)
}).strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional()
}).strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateInputSchema: z.ZodType<Prisma.VerificationTokenCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedCreateInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenCreateManyInputSchema: z.ZodType<Prisma.VerificationTokenCreateManyInput> = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date()
}).strict();

export const VerificationTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationTokenUpdateManyMutationInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VerificationTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationTokenUncheckedUpdateManyInput> = z.object({
  identifier: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactMessageCreateInputSchema: z.ZodType<Prisma.ContactMessageCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  message: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ContactMessageUncheckedCreateInputSchema: z.ZodType<Prisma.ContactMessageUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  message: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ContactMessageUpdateInputSchema: z.ZodType<Prisma.ContactMessageUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactMessageUncheckedUpdateInputSchema: z.ZodType<Prisma.ContactMessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactMessageCreateManyInputSchema: z.ZodType<Prisma.ContactMessageCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  message: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const ContactMessageUpdateManyMutationInputSchema: z.ZodType<Prisma.ContactMessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactMessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContactMessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LanguageCreateInputSchema: z.ZodType<Prisma.LanguageCreateInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  countries: z.lazy(() => CountryCreateNestedManyWithoutLanguageInputSchema).optional()
}).strict();

export const LanguageUncheckedCreateInputSchema: z.ZodType<Prisma.LanguageUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  countries: z.lazy(() => CountryUncheckedCreateNestedManyWithoutLanguageInputSchema).optional()
}).strict();

export const LanguageUpdateInputSchema: z.ZodType<Prisma.LanguageUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countries: z.lazy(() => CountryUpdateManyWithoutLanguageNestedInputSchema).optional()
}).strict();

export const LanguageUncheckedUpdateInputSchema: z.ZodType<Prisma.LanguageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countries: z.lazy(() => CountryUncheckedUpdateManyWithoutLanguageNestedInputSchema).optional()
}).strict();

export const LanguageCreateManyInputSchema: z.ZodType<Prisma.LanguageCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string()
}).strict();

export const LanguageUpdateManyMutationInputSchema: z.ZodType<Prisma.LanguageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LanguageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LanguageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountryCreateInputSchema: z.ZodType<Prisma.CountryCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currency: z.lazy(() => CurrencyCreateNestedOneWithoutCountriesInputSchema).optional(),
  language: z.lazy(() => LanguageCreateNestedOneWithoutCountriesInputSchema).optional(),
  banks: z.lazy(() => BankCreateNestedManyWithoutCountryInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUncheckedCreateInputSchema: z.ZodType<Prisma.CountryUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currencyId: z.string().optional().nullable(),
  languageId: z.string().optional().nullable(),
  banks: z.lazy(() => BankUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUpdateInputSchema: z.ZodType<Prisma.CountryUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.lazy(() => CurrencyUpdateOneWithoutCountriesNestedInputSchema).optional(),
  language: z.lazy(() => LanguageUpdateOneWithoutCountriesNestedInputSchema).optional(),
  banks: z.lazy(() => BankUpdateManyWithoutCountryNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currencyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  languageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banks: z.lazy(() => BankUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryCreateManyInputSchema: z.ZodType<Prisma.CountryCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currencyId: z.string().optional().nullable(),
  languageId: z.string().optional().nullable()
}).strict();

export const CountryUpdateManyMutationInputSchema: z.ZodType<Prisma.CountryUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CountryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currencyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  languageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const BankCreateInputSchema: z.ZodType<Prisma.BankCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  country: z.lazy(() => CountryCreateNestedOneWithoutBanksInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountCreateNestedManyWithoutBankInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressCreateNestedManyWithoutBankInputSchema).optional()
}).strict();

export const BankUncheckedCreateInputSchema: z.ZodType<Prisma.BankUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  countryId: z.string().optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedCreateNestedManyWithoutBankInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUncheckedCreateNestedManyWithoutBankInputSchema).optional()
}).strict();

export const BankUpdateInputSchema: z.ZodType<Prisma.BankUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.lazy(() => CountryUpdateOneWithoutBanksNestedInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUpdateManyWithoutBankNestedInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUpdateManyWithoutBankNestedInputSchema).optional()
}).strict();

export const BankUncheckedUpdateInputSchema: z.ZodType<Prisma.BankUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  countryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedUpdateManyWithoutBankNestedInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUncheckedUpdateManyWithoutBankNestedInputSchema).optional()
}).strict();

export const BankCreateManyInputSchema: z.ZodType<Prisma.BankCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  countryId: z.string().optional().nullable()
}).strict();

export const BankUpdateManyMutationInputSchema: z.ZodType<Prisma.BankUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const BankUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BankUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  countryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ReceiverAccountCreateInputSchema: z.ZodType<Prisma.ReceiverAccountCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  client: z.lazy(() => UserCreateNestedOneWithoutReceiverAccountsInputSchema),
  bank: z.lazy(() => BankCreateNestedOneWithoutReceiverAccountsInputSchema).optional()
}).strict();

export const ReceiverAccountUncheckedCreateInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  clientId: z.string(),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  bankId: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const ReceiverAccountUpdateInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  client: z.lazy(() => UserUpdateOneRequiredWithoutReceiverAccountsNestedInputSchema).optional(),
  bank: z.lazy(() => BankUpdateOneWithoutReceiverAccountsNestedInputSchema).optional()
}).strict();

export const ReceiverAccountUncheckedUpdateInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bankId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReceiverAccountCreateManyInputSchema: z.ZodType<Prisma.ReceiverAccountCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  clientId: z.string(),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  bankId: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const ReceiverAccountUpdateManyMutationInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReceiverAccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bankId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AdminPercentageCreateInputSchema: z.ZodType<Prisma.AdminPercentageCreateInput> = z.object({
  id: z.string().cuid().optional(),
  percentage: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  country: z.lazy(() => CountryCreateNestedOneWithoutAdminPercentagesInputSchema)
}).strict();

export const AdminPercentageUncheckedCreateInputSchema: z.ZodType<Prisma.AdminPercentageUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  countryId: z.string(),
  percentage: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const AdminPercentageUpdateInputSchema: z.ZodType<Prisma.AdminPercentageUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  percentage: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.lazy(() => CountryUpdateOneRequiredWithoutAdminPercentagesNestedInputSchema).optional()
}).strict();

export const AdminPercentageUncheckedUpdateInputSchema: z.ZodType<Prisma.AdminPercentageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  percentage: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AdminPercentageCreateManyInputSchema: z.ZodType<Prisma.AdminPercentageCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  countryId: z.string(),
  percentage: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const AdminPercentageUpdateManyMutationInputSchema: z.ZodType<Prisma.AdminPercentageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  percentage: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AdminPercentageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AdminPercentageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  percentage: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BankDepositAddressCreateInputSchema: z.ZodType<Prisma.BankDepositAddressCreateInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string(),
  bank: z.lazy(() => BankCreateNestedOneWithoutBankDepositAddressesInputSchema).optional()
}).strict();

export const BankDepositAddressUncheckedCreateInputSchema: z.ZodType<Prisma.BankDepositAddressUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string(),
  bankId: z.string().optional().nullable()
}).strict();

export const BankDepositAddressUpdateInputSchema: z.ZodType<Prisma.BankDepositAddressUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bank: z.lazy(() => BankUpdateOneWithoutBankDepositAddressesNestedInputSchema).optional()
}).strict();

export const BankDepositAddressUncheckedUpdateInputSchema: z.ZodType<Prisma.BankDepositAddressUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bankId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const BankDepositAddressCreateManyInputSchema: z.ZodType<Prisma.BankDepositAddressCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string(),
  bankId: z.string().optional().nullable()
}).strict();

export const BankDepositAddressUpdateManyMutationInputSchema: z.ZodType<Prisma.BankDepositAddressUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BankDepositAddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BankDepositAddressUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bankId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CashDepositAddressCreateInputSchema: z.ZodType<Prisma.CashDepositAddressCreateInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string(),
  country: z.lazy(() => CountryCreateNestedOneWithoutCashDepositAddressesInputSchema)
}).strict();

export const CashDepositAddressUncheckedCreateInputSchema: z.ZodType<Prisma.CashDepositAddressUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string(),
  countryId: z.string()
}).strict();

export const CashDepositAddressUpdateInputSchema: z.ZodType<Prisma.CashDepositAddressUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.lazy(() => CountryUpdateOneRequiredWithoutCashDepositAddressesNestedInputSchema).optional()
}).strict();

export const CashDepositAddressUncheckedUpdateInputSchema: z.ZodType<Prisma.CashDepositAddressUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashDepositAddressCreateManyInputSchema: z.ZodType<Prisma.CashDepositAddressCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string(),
  countryId: z.string()
}).strict();

export const CashDepositAddressUpdateManyMutationInputSchema: z.ZodType<Prisma.CashDepositAddressUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashDepositAddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CashDepositAddressUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  countryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExchangeRateCreateInputSchema: z.ZodType<Prisma.ExchangeRateCreateInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  sourceCurrency: z.lazy(() => CurrencyCreateNestedOneWithoutSourceExchangeRatesInputSchema),
  targetCurrency: z.lazy(() => CurrencyCreateNestedOneWithoutTargetExchangeRatesInputSchema)
}).strict();

export const ExchangeRateUncheckedCreateInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  sourceCurrencyId: z.string(),
  targetCurrencyId: z.string()
}).strict();

export const ExchangeRateUpdateInputSchema: z.ZodType<Prisma.ExchangeRateUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceCurrency: z.lazy(() => CurrencyUpdateOneRequiredWithoutSourceExchangeRatesNestedInputSchema).optional(),
  targetCurrency: z.lazy(() => CurrencyUpdateOneRequiredWithoutTargetExchangeRatesNestedInputSchema).optional()
}).strict();

export const ExchangeRateUncheckedUpdateInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceCurrencyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetCurrencyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExchangeRateCreateManyInputSchema: z.ZodType<Prisma.ExchangeRateCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  sourceCurrencyId: z.string(),
  targetCurrencyId: z.string()
}).strict();

export const ExchangeRateUpdateManyMutationInputSchema: z.ZodType<Prisma.ExchangeRateUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExchangeRateUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceCurrencyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  targetCurrencyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CurrencyCreateInputSchema: z.ZodType<Prisma.CurrencyCreateInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateCreateNestedManyWithoutSourceCurrencyInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateCreateNestedManyWithoutTargetCurrencyInputSchema).optional(),
  countries: z.lazy(() => CountryCreateNestedManyWithoutCurrencyInputSchema).optional()
}).strict();

export const CurrencyUncheckedCreateInputSchema: z.ZodType<Prisma.CurrencyUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUncheckedCreateNestedManyWithoutSourceCurrencyInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateUncheckedCreateNestedManyWithoutTargetCurrencyInputSchema).optional(),
  countries: z.lazy(() => CountryUncheckedCreateNestedManyWithoutCurrencyInputSchema).optional()
}).strict();

export const CurrencyUpdateInputSchema: z.ZodType<Prisma.CurrencyUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUpdateManyWithoutSourceCurrencyNestedInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateUpdateManyWithoutTargetCurrencyNestedInputSchema).optional(),
  countries: z.lazy(() => CountryUpdateManyWithoutCurrencyNestedInputSchema).optional()
}).strict();

export const CurrencyUncheckedUpdateInputSchema: z.ZodType<Prisma.CurrencyUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUncheckedUpdateManyWithoutSourceCurrencyNestedInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateUncheckedUpdateManyWithoutTargetCurrencyNestedInputSchema).optional(),
  countries: z.lazy(() => CountryUncheckedUpdateManyWithoutCurrencyNestedInputSchema).optional()
}).strict();

export const CurrencyCreateManyInputSchema: z.ZodType<Prisma.CurrencyCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable()
}).strict();

export const CurrencyUpdateManyMutationInputSchema: z.ZodType<Prisma.CurrencyUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CurrencyUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CurrencyUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z.object({
  every: z.lazy(() => SessionWhereInputSchema).optional(),
  some: z.lazy(() => SessionWhereInputSchema).optional(),
  none: z.lazy(() => SessionWhereInputSchema).optional()
}).strict();

export const ReceiverAccountListRelationFilterSchema: z.ZodType<Prisma.ReceiverAccountListRelationFilter> = z.object({
  every: z.lazy(() => ReceiverAccountWhereInputSchema).optional(),
  some: z.lazy(() => ReceiverAccountWhereInputSchema).optional(),
  none: z.lazy(() => ReceiverAccountWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReceiverAccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ReceiverAccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  emailVerified: z.lazy(() => SortOrderSchema).optional(),
  image: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const AccountProviderProviderAccountIdCompoundUniqueInputSchema: z.ZodType<Prisma.AccountProviderProviderAccountIdCompoundUniqueInput> = z.object({
  provider: z.string(),
  providerAccountId: z.string()
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  providerAccountId: z.lazy(() => SortOrderSchema).optional(),
  refresh_token: z.lazy(() => SortOrderSchema).optional(),
  access_token: z.lazy(() => SortOrderSchema).optional(),
  expires_at: z.lazy(() => SortOrderSchema).optional(),
  token_type: z.lazy(() => SortOrderSchema).optional(),
  scope: z.lazy(() => SortOrderSchema).optional(),
  id_token: z.lazy(() => SortOrderSchema).optional(),
  session_state: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  expires_at: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> = z.object({
  sessionToken: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenIdentifierTokenCompoundUniqueInputSchema: z.ZodType<Prisma.VerificationTokenIdentifierTokenCompoundUniqueInput> = z.object({
  identifier: z.string(),
  token: z.string()
}).strict();

export const VerificationTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenCountOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMaxOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VerificationTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationTokenMinOrderByAggregateInput> = z.object({
  identifier: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  expires: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactMessageCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContactMessageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactMessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContactMessageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactMessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContactMessageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryListRelationFilterSchema: z.ZodType<Prisma.CountryListRelationFilter> = z.object({
  every: z.lazy(() => CountryWhereInputSchema).optional(),
  some: z.lazy(() => CountryWhereInputSchema).optional(),
  none: z.lazy(() => CountryWhereInputSchema).optional()
}).strict();

export const CountryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CountryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LanguageCountOrderByAggregateInputSchema: z.ZodType<Prisma.LanguageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LanguageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LanguageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LanguageMinOrderByAggregateInputSchema: z.ZodType<Prisma.LanguageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurrencyNullableScalarRelationFilterSchema: z.ZodType<Prisma.CurrencyNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => CurrencyWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CurrencyWhereInputSchema).optional().nullable()
}).strict();

export const LanguageNullableScalarRelationFilterSchema: z.ZodType<Prisma.LanguageNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => LanguageWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => LanguageWhereInputSchema).optional().nullable()
}).strict();

export const BankListRelationFilterSchema: z.ZodType<Prisma.BankListRelationFilter> = z.object({
  every: z.lazy(() => BankWhereInputSchema).optional(),
  some: z.lazy(() => BankWhereInputSchema).optional(),
  none: z.lazy(() => BankWhereInputSchema).optional()
}).strict();

export const AdminPercentageListRelationFilterSchema: z.ZodType<Prisma.AdminPercentageListRelationFilter> = z.object({
  every: z.lazy(() => AdminPercentageWhereInputSchema).optional(),
  some: z.lazy(() => AdminPercentageWhereInputSchema).optional(),
  none: z.lazy(() => AdminPercentageWhereInputSchema).optional()
}).strict();

export const CashDepositAddressListRelationFilterSchema: z.ZodType<Prisma.CashDepositAddressListRelationFilter> = z.object({
  every: z.lazy(() => CashDepositAddressWhereInputSchema).optional(),
  some: z.lazy(() => CashDepositAddressWhereInputSchema).optional(),
  none: z.lazy(() => CashDepositAddressWhereInputSchema).optional()
}).strict();

export const BankOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BankOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminPercentageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AdminPercentageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CashDepositAddressOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CashDepositAddressOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CountryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  continent: z.lazy(() => SortOrderSchema).optional(),
  flagUrl: z.lazy(() => SortOrderSchema).optional(),
  currencyId: z.lazy(() => SortOrderSchema).optional(),
  languageId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CountryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  continent: z.lazy(() => SortOrderSchema).optional(),
  flagUrl: z.lazy(() => SortOrderSchema).optional(),
  currencyId: z.lazy(() => SortOrderSchema).optional(),
  languageId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CountryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  continent: z.lazy(() => SortOrderSchema).optional(),
  flagUrl: z.lazy(() => SortOrderSchema).optional(),
  currencyId: z.lazy(() => SortOrderSchema).optional(),
  languageId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CountryNullableScalarRelationFilterSchema: z.ZodType<Prisma.CountryNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => CountryWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CountryWhereInputSchema).optional().nullable()
}).strict();

export const BankDepositAddressListRelationFilterSchema: z.ZodType<Prisma.BankDepositAddressListRelationFilter> = z.object({
  every: z.lazy(() => BankDepositAddressWhereInputSchema).optional(),
  some: z.lazy(() => BankDepositAddressWhereInputSchema).optional(),
  none: z.lazy(() => BankDepositAddressWhereInputSchema).optional()
}).strict();

export const BankDepositAddressOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BankDepositAddressOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BankCountOrderByAggregateInputSchema: z.ZodType<Prisma.BankCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  nameEng: z.lazy(() => SortOrderSchema).optional(),
  shortName: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BankMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BankMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  nameEng: z.lazy(() => SortOrderSchema).optional(),
  shortName: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BankMinOrderByAggregateInputSchema: z.ZodType<Prisma.BankMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  nameEng: z.lazy(() => SortOrderSchema).optional(),
  shortName: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumReceiverAccountTypeFilterSchema: z.ZodType<Prisma.EnumReceiverAccountTypeFilter> = z.object({
  equals: z.lazy(() => ReceiverAccountTypeSchema).optional(),
  in: z.lazy(() => ReceiverAccountTypeSchema).array().optional(),
  notIn: z.lazy(() => ReceiverAccountTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => NestedEnumReceiverAccountTypeFilterSchema) ]).optional(),
}).strict();

export const EnumReceiverAccountIdentifierFilterSchema: z.ZodType<Prisma.EnumReceiverAccountIdentifierFilter> = z.object({
  equals: z.lazy(() => ReceiverAccountIdentifierSchema).optional(),
  in: z.lazy(() => ReceiverAccountIdentifierSchema).array().optional(),
  notIn: z.lazy(() => ReceiverAccountIdentifierSchema).array().optional(),
  not: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => NestedEnumReceiverAccountIdentifierFilterSchema) ]).optional(),
}).strict();

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const BankNullableScalarRelationFilterSchema: z.ZodType<Prisma.BankNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => BankWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => BankWhereInputSchema).optional().nullable()
}).strict();

export const ReceiverAccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.ReceiverAccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  qrCodeUrl: z.lazy(() => SortOrderSchema).optional(),
  qrCodeContent: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  bankAccountNumber: z.lazy(() => SortOrderSchema).optional(),
  bankId: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReceiverAccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ReceiverAccountAvgOrderByAggregateInput> = z.object({
  balance: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReceiverAccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ReceiverAccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  qrCodeUrl: z.lazy(() => SortOrderSchema).optional(),
  qrCodeContent: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  bankAccountNumber: z.lazy(() => SortOrderSchema).optional(),
  bankId: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReceiverAccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.ReceiverAccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  clientId: z.lazy(() => SortOrderSchema).optional(),
  identifier: z.lazy(() => SortOrderSchema).optional(),
  qrCodeUrl: z.lazy(() => SortOrderSchema).optional(),
  qrCodeContent: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  bankAccountNumber: z.lazy(() => SortOrderSchema).optional(),
  bankId: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReceiverAccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.ReceiverAccountSumOrderByAggregateInput> = z.object({
  balance: z.lazy(() => SortOrderSchema).optional(),
  limit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumReceiverAccountTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumReceiverAccountTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ReceiverAccountTypeSchema).optional(),
  in: z.lazy(() => ReceiverAccountTypeSchema).array().optional(),
  notIn: z.lazy(() => ReceiverAccountTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => NestedEnumReceiverAccountTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumReceiverAccountTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumReceiverAccountTypeFilterSchema).optional()
}).strict();

export const EnumReceiverAccountIdentifierWithAggregatesFilterSchema: z.ZodType<Prisma.EnumReceiverAccountIdentifierWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ReceiverAccountIdentifierSchema).optional(),
  in: z.lazy(() => ReceiverAccountIdentifierSchema).array().optional(),
  notIn: z.lazy(() => ReceiverAccountIdentifierSchema).array().optional(),
  not: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => NestedEnumReceiverAccountIdentifierWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumReceiverAccountIdentifierFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumReceiverAccountIdentifierFilterSchema).optional()
}).strict();

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const CountryScalarRelationFilterSchema: z.ZodType<Prisma.CountryScalarRelationFilter> = z.object({
  is: z.lazy(() => CountryWhereInputSchema).optional(),
  isNot: z.lazy(() => CountryWhereInputSchema).optional()
}).strict();

export const AdminPercentageCountryIdPercentageCompoundUniqueInputSchema: z.ZodType<Prisma.AdminPercentageCountryIdPercentageCompoundUniqueInput> = z.object({
  countryId: z.string(),
  percentage: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const AdminPercentageCountOrderByAggregateInputSchema: z.ZodType<Prisma.AdminPercentageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional(),
  percentage: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminPercentageAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AdminPercentageAvgOrderByAggregateInput> = z.object({
  percentage: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminPercentageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AdminPercentageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional(),
  percentage: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminPercentageMinOrderByAggregateInputSchema: z.ZodType<Prisma.AdminPercentageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional(),
  percentage: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminPercentageSumOrderByAggregateInputSchema: z.ZodType<Prisma.AdminPercentageSumOrderByAggregateInput> = z.object({
  percentage: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BankDepositAddressAddressBankIdCompoundUniqueInputSchema: z.ZodType<Prisma.BankDepositAddressAddressBankIdCompoundUniqueInput> = z.object({
  address: z.string(),
  bankId: z.string()
}).strict();

export const BankDepositAddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.BankDepositAddressCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  bankId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BankDepositAddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BankDepositAddressMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  bankId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BankDepositAddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.BankDepositAddressMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  bankId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CashDepositAddressAddressCountryIdCompoundUniqueInputSchema: z.ZodType<Prisma.CashDepositAddressAddressCountryIdCompoundUniqueInput> = z.object({
  address: z.string(),
  countryId: z.string()
}).strict();

export const CashDepositAddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.CashDepositAddressCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CashDepositAddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CashDepositAddressMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CashDepositAddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.CashDepositAddressMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  countryId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumRateSourceFilterSchema: z.ZodType<Prisma.EnumRateSourceFilter> = z.object({
  equals: z.lazy(() => RateSourceSchema).optional(),
  in: z.lazy(() => RateSourceSchema).array().optional(),
  notIn: z.lazy(() => RateSourceSchema).array().optional(),
  not: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => NestedEnumRateSourceFilterSchema) ]).optional(),
}).strict();

export const CurrencyScalarRelationFilterSchema: z.ZodType<Prisma.CurrencyScalarRelationFilter> = z.object({
  is: z.lazy(() => CurrencyWhereInputSchema).optional(),
  isNot: z.lazy(() => CurrencyWhereInputSchema).optional()
}).strict();

export const ExchangeRateSourceCurrencyIdTargetCurrencyIdCompoundUniqueInputSchema: z.ZodType<Prisma.ExchangeRateSourceCurrencyIdTargetCurrencyIdCompoundUniqueInput> = z.object({
  sourceCurrencyId: z.string(),
  targetCurrencyId: z.string()
}).strict();

export const ExchangeRateCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExchangeRateCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rateValue: z.lazy(() => SortOrderSchema).optional(),
  lastUpdated: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceCurrencyId: z.lazy(() => SortOrderSchema).optional(),
  targetCurrencyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExchangeRateAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ExchangeRateAvgOrderByAggregateInput> = z.object({
  rateValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExchangeRateMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExchangeRateMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rateValue: z.lazy(() => SortOrderSchema).optional(),
  lastUpdated: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceCurrencyId: z.lazy(() => SortOrderSchema).optional(),
  targetCurrencyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExchangeRateMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExchangeRateMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rateValue: z.lazy(() => SortOrderSchema).optional(),
  lastUpdated: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceCurrencyId: z.lazy(() => SortOrderSchema).optional(),
  targetCurrencyId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExchangeRateSumOrderByAggregateInputSchema: z.ZodType<Prisma.ExchangeRateSumOrderByAggregateInput> = z.object({
  rateValue: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumRateSourceWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRateSourceWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RateSourceSchema).optional(),
  in: z.lazy(() => RateSourceSchema).array().optional(),
  notIn: z.lazy(() => RateSourceSchema).array().optional(),
  not: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => NestedEnumRateSourceWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRateSourceFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRateSourceFilterSchema).optional()
}).strict();

export const ExchangeRateListRelationFilterSchema: z.ZodType<Prisma.ExchangeRateListRelationFilter> = z.object({
  every: z.lazy(() => ExchangeRateWhereInputSchema).optional(),
  some: z.lazy(() => ExchangeRateWhereInputSchema).optional(),
  none: z.lazy(() => ExchangeRateWhereInputSchema).optional()
}).strict();

export const ExchangeRateOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ExchangeRateOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurrencyCountOrderByAggregateInputSchema: z.ZodType<Prisma.CurrencyCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurrencyMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CurrencyMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurrencyMinOrderByAggregateInputSchema: z.ZodType<Prisma.CurrencyMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  symbol: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReceiverAccountCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema).array(),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReceiverAccountCreateOrConnectWithoutClientInputSchema),z.lazy(() => ReceiverAccountCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReceiverAccountCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReceiverAccountUncheckedCreateNestedManyWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedCreateNestedManyWithoutClientInput> = z.object({
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema).array(),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReceiverAccountCreateOrConnectWithoutClientInputSchema),z.lazy(() => ReceiverAccountCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReceiverAccountCreateManyClientInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReceiverAccountUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema).array(),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReceiverAccountCreateOrConnectWithoutClientInputSchema),z.lazy(() => ReceiverAccountCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReceiverAccountUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ReceiverAccountUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReceiverAccountCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReceiverAccountUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ReceiverAccountUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReceiverAccountUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => ReceiverAccountUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReceiverAccountScalarWhereInputSchema),z.lazy(() => ReceiverAccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountCreateWithoutUserInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionCreateWithoutUserInputSchema).array(),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SessionWhereUniqueInputSchema),z.lazy(() => SessionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReceiverAccountUncheckedUpdateManyWithoutClientNestedInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedUpdateManyWithoutClientNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema).array(),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReceiverAccountCreateOrConnectWithoutClientInputSchema),z.lazy(() => ReceiverAccountCreateOrConnectWithoutClientInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReceiverAccountUpsertWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ReceiverAccountUpsertWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReceiverAccountCreateManyClientInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReceiverAccountUpdateWithWhereUniqueWithoutClientInputSchema),z.lazy(() => ReceiverAccountUpdateWithWhereUniqueWithoutClientInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReceiverAccountUpdateManyWithWhereWithoutClientInputSchema),z.lazy(() => ReceiverAccountUpdateManyWithWhereWithoutClientInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReceiverAccountScalarWhereInputSchema),z.lazy(() => ReceiverAccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]).optional(),
}).strict();

export const CountryCreateNestedManyWithoutLanguageInputSchema: z.ZodType<Prisma.CountryCreateNestedManyWithoutLanguageInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutLanguageInputSchema),z.lazy(() => CountryCreateWithoutLanguageInputSchema).array(),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountryCreateOrConnectWithoutLanguageInputSchema),z.lazy(() => CountryCreateOrConnectWithoutLanguageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountryCreateManyLanguageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountryUncheckedCreateNestedManyWithoutLanguageInputSchema: z.ZodType<Prisma.CountryUncheckedCreateNestedManyWithoutLanguageInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutLanguageInputSchema),z.lazy(() => CountryCreateWithoutLanguageInputSchema).array(),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountryCreateOrConnectWithoutLanguageInputSchema),z.lazy(() => CountryCreateOrConnectWithoutLanguageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountryCreateManyLanguageInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountryUpdateManyWithoutLanguageNestedInputSchema: z.ZodType<Prisma.CountryUpdateManyWithoutLanguageNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutLanguageInputSchema),z.lazy(() => CountryCreateWithoutLanguageInputSchema).array(),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountryCreateOrConnectWithoutLanguageInputSchema),z.lazy(() => CountryCreateOrConnectWithoutLanguageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CountryUpsertWithWhereUniqueWithoutLanguageInputSchema),z.lazy(() => CountryUpsertWithWhereUniqueWithoutLanguageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountryCreateManyLanguageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CountryUpdateWithWhereUniqueWithoutLanguageInputSchema),z.lazy(() => CountryUpdateWithWhereUniqueWithoutLanguageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CountryUpdateManyWithWhereWithoutLanguageInputSchema),z.lazy(() => CountryUpdateManyWithWhereWithoutLanguageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CountryScalarWhereInputSchema),z.lazy(() => CountryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountryUncheckedUpdateManyWithoutLanguageNestedInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateManyWithoutLanguageNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutLanguageInputSchema),z.lazy(() => CountryCreateWithoutLanguageInputSchema).array(),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountryCreateOrConnectWithoutLanguageInputSchema),z.lazy(() => CountryCreateOrConnectWithoutLanguageInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CountryUpsertWithWhereUniqueWithoutLanguageInputSchema),z.lazy(() => CountryUpsertWithWhereUniqueWithoutLanguageInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountryCreateManyLanguageInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CountryUpdateWithWhereUniqueWithoutLanguageInputSchema),z.lazy(() => CountryUpdateWithWhereUniqueWithoutLanguageInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CountryUpdateManyWithWhereWithoutLanguageInputSchema),z.lazy(() => CountryUpdateManyWithWhereWithoutLanguageInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CountryScalarWhereInputSchema),z.lazy(() => CountryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CurrencyCreateNestedOneWithoutCountriesInputSchema: z.ZodType<Prisma.CurrencyCreateNestedOneWithoutCountriesInput> = z.object({
  create: z.union([ z.lazy(() => CurrencyCreateWithoutCountriesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutCountriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurrencyCreateOrConnectWithoutCountriesInputSchema).optional(),
  connect: z.lazy(() => CurrencyWhereUniqueInputSchema).optional()
}).strict();

export const LanguageCreateNestedOneWithoutCountriesInputSchema: z.ZodType<Prisma.LanguageCreateNestedOneWithoutCountriesInput> = z.object({
  create: z.union([ z.lazy(() => LanguageCreateWithoutCountriesInputSchema),z.lazy(() => LanguageUncheckedCreateWithoutCountriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LanguageCreateOrConnectWithoutCountriesInputSchema).optional(),
  connect: z.lazy(() => LanguageWhereUniqueInputSchema).optional()
}).strict();

export const BankCreateNestedManyWithoutCountryInputSchema: z.ZodType<Prisma.BankCreateNestedManyWithoutCountryInput> = z.object({
  create: z.union([ z.lazy(() => BankCreateWithoutCountryInputSchema),z.lazy(() => BankCreateWithoutCountryInputSchema).array(),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BankCreateOrConnectWithoutCountryInputSchema),z.lazy(() => BankCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BankCreateManyCountryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AdminPercentageCreateNestedManyWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageCreateNestedManyWithoutCountryInput> = z.object({
  create: z.union([ z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema).array(),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AdminPercentageCreateOrConnectWithoutCountryInputSchema),z.lazy(() => AdminPercentageCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AdminPercentageCreateManyCountryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CashDepositAddressCreateNestedManyWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressCreateNestedManyWithoutCountryInput> = z.object({
  create: z.union([ z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema).array(),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashDepositAddressCreateOrConnectWithoutCountryInputSchema),z.lazy(() => CashDepositAddressCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashDepositAddressCreateManyCountryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BankUncheckedCreateNestedManyWithoutCountryInputSchema: z.ZodType<Prisma.BankUncheckedCreateNestedManyWithoutCountryInput> = z.object({
  create: z.union([ z.lazy(() => BankCreateWithoutCountryInputSchema),z.lazy(() => BankCreateWithoutCountryInputSchema).array(),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BankCreateOrConnectWithoutCountryInputSchema),z.lazy(() => BankCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BankCreateManyCountryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AdminPercentageUncheckedCreateNestedManyWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageUncheckedCreateNestedManyWithoutCountryInput> = z.object({
  create: z.union([ z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema).array(),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AdminPercentageCreateOrConnectWithoutCountryInputSchema),z.lazy(() => AdminPercentageCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AdminPercentageCreateManyCountryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CashDepositAddressUncheckedCreateNestedManyWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressUncheckedCreateNestedManyWithoutCountryInput> = z.object({
  create: z.union([ z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema).array(),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashDepositAddressCreateOrConnectWithoutCountryInputSchema),z.lazy(() => CashDepositAddressCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashDepositAddressCreateManyCountryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CurrencyUpdateOneWithoutCountriesNestedInputSchema: z.ZodType<Prisma.CurrencyUpdateOneWithoutCountriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurrencyCreateWithoutCountriesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutCountriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurrencyCreateOrConnectWithoutCountriesInputSchema).optional(),
  upsert: z.lazy(() => CurrencyUpsertWithoutCountriesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CurrencyWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CurrencyWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CurrencyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CurrencyUpdateToOneWithWhereWithoutCountriesInputSchema),z.lazy(() => CurrencyUpdateWithoutCountriesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutCountriesInputSchema) ]).optional(),
}).strict();

export const LanguageUpdateOneWithoutCountriesNestedInputSchema: z.ZodType<Prisma.LanguageUpdateOneWithoutCountriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => LanguageCreateWithoutCountriesInputSchema),z.lazy(() => LanguageUncheckedCreateWithoutCountriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => LanguageCreateOrConnectWithoutCountriesInputSchema).optional(),
  upsert: z.lazy(() => LanguageUpsertWithoutCountriesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => LanguageWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => LanguageWhereInputSchema) ]).optional(),
  connect: z.lazy(() => LanguageWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => LanguageUpdateToOneWithWhereWithoutCountriesInputSchema),z.lazy(() => LanguageUpdateWithoutCountriesInputSchema),z.lazy(() => LanguageUncheckedUpdateWithoutCountriesInputSchema) ]).optional(),
}).strict();

export const BankUpdateManyWithoutCountryNestedInputSchema: z.ZodType<Prisma.BankUpdateManyWithoutCountryNestedInput> = z.object({
  create: z.union([ z.lazy(() => BankCreateWithoutCountryInputSchema),z.lazy(() => BankCreateWithoutCountryInputSchema).array(),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BankCreateOrConnectWithoutCountryInputSchema),z.lazy(() => BankCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BankUpsertWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => BankUpsertWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BankCreateManyCountryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BankUpdateWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => BankUpdateWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BankUpdateManyWithWhereWithoutCountryInputSchema),z.lazy(() => BankUpdateManyWithWhereWithoutCountryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BankScalarWhereInputSchema),z.lazy(() => BankScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AdminPercentageUpdateManyWithoutCountryNestedInputSchema: z.ZodType<Prisma.AdminPercentageUpdateManyWithoutCountryNestedInput> = z.object({
  create: z.union([ z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema).array(),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AdminPercentageCreateOrConnectWithoutCountryInputSchema),z.lazy(() => AdminPercentageCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AdminPercentageUpsertWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => AdminPercentageUpsertWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AdminPercentageCreateManyCountryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AdminPercentageUpdateWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => AdminPercentageUpdateWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AdminPercentageUpdateManyWithWhereWithoutCountryInputSchema),z.lazy(() => AdminPercentageUpdateManyWithWhereWithoutCountryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AdminPercentageScalarWhereInputSchema),z.lazy(() => AdminPercentageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CashDepositAddressUpdateManyWithoutCountryNestedInputSchema: z.ZodType<Prisma.CashDepositAddressUpdateManyWithoutCountryNestedInput> = z.object({
  create: z.union([ z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema).array(),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashDepositAddressCreateOrConnectWithoutCountryInputSchema),z.lazy(() => CashDepositAddressCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CashDepositAddressUpsertWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUpsertWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashDepositAddressCreateManyCountryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CashDepositAddressUpdateWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUpdateWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CashDepositAddressUpdateManyWithWhereWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUpdateManyWithWhereWithoutCountryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CashDepositAddressScalarWhereInputSchema),z.lazy(() => CashDepositAddressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BankUncheckedUpdateManyWithoutCountryNestedInputSchema: z.ZodType<Prisma.BankUncheckedUpdateManyWithoutCountryNestedInput> = z.object({
  create: z.union([ z.lazy(() => BankCreateWithoutCountryInputSchema),z.lazy(() => BankCreateWithoutCountryInputSchema).array(),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BankCreateOrConnectWithoutCountryInputSchema),z.lazy(() => BankCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BankUpsertWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => BankUpsertWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BankCreateManyCountryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BankWhereUniqueInputSchema),z.lazy(() => BankWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BankUpdateWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => BankUpdateWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BankUpdateManyWithWhereWithoutCountryInputSchema),z.lazy(() => BankUpdateManyWithWhereWithoutCountryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BankScalarWhereInputSchema),z.lazy(() => BankScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AdminPercentageUncheckedUpdateManyWithoutCountryNestedInputSchema: z.ZodType<Prisma.AdminPercentageUncheckedUpdateManyWithoutCountryNestedInput> = z.object({
  create: z.union([ z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema).array(),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AdminPercentageCreateOrConnectWithoutCountryInputSchema),z.lazy(() => AdminPercentageCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AdminPercentageUpsertWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => AdminPercentageUpsertWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AdminPercentageCreateManyCountryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AdminPercentageWhereUniqueInputSchema),z.lazy(() => AdminPercentageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AdminPercentageUpdateWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => AdminPercentageUpdateWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AdminPercentageUpdateManyWithWhereWithoutCountryInputSchema),z.lazy(() => AdminPercentageUpdateManyWithWhereWithoutCountryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AdminPercentageScalarWhereInputSchema),z.lazy(() => AdminPercentageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CashDepositAddressUncheckedUpdateManyWithoutCountryNestedInputSchema: z.ZodType<Prisma.CashDepositAddressUncheckedUpdateManyWithoutCountryNestedInput> = z.object({
  create: z.union([ z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema).array(),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashDepositAddressCreateOrConnectWithoutCountryInputSchema),z.lazy(() => CashDepositAddressCreateOrConnectWithoutCountryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CashDepositAddressUpsertWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUpsertWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashDepositAddressCreateManyCountryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CashDepositAddressWhereUniqueInputSchema),z.lazy(() => CashDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CashDepositAddressUpdateWithWhereUniqueWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUpdateWithWhereUniqueWithoutCountryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CashDepositAddressUpdateManyWithWhereWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUpdateManyWithWhereWithoutCountryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CashDepositAddressScalarWhereInputSchema),z.lazy(() => CashDepositAddressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountryCreateNestedOneWithoutBanksInputSchema: z.ZodType<Prisma.CountryCreateNestedOneWithoutBanksInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutBanksInputSchema),z.lazy(() => CountryUncheckedCreateWithoutBanksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountryCreateOrConnectWithoutBanksInputSchema).optional(),
  connect: z.lazy(() => CountryWhereUniqueInputSchema).optional()
}).strict();

export const ReceiverAccountCreateNestedManyWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountCreateNestedManyWithoutBankInput> = z.object({
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema).array(),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReceiverAccountCreateOrConnectWithoutBankInputSchema),z.lazy(() => ReceiverAccountCreateOrConnectWithoutBankInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReceiverAccountCreateManyBankInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BankDepositAddressCreateNestedManyWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressCreateNestedManyWithoutBankInput> = z.object({
  create: z.union([ z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema).array(),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BankDepositAddressCreateOrConnectWithoutBankInputSchema),z.lazy(() => BankDepositAddressCreateOrConnectWithoutBankInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BankDepositAddressCreateManyBankInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReceiverAccountUncheckedCreateNestedManyWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedCreateNestedManyWithoutBankInput> = z.object({
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema).array(),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReceiverAccountCreateOrConnectWithoutBankInputSchema),z.lazy(() => ReceiverAccountCreateOrConnectWithoutBankInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReceiverAccountCreateManyBankInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BankDepositAddressUncheckedCreateNestedManyWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressUncheckedCreateNestedManyWithoutBankInput> = z.object({
  create: z.union([ z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema).array(),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BankDepositAddressCreateOrConnectWithoutBankInputSchema),z.lazy(() => BankDepositAddressCreateOrConnectWithoutBankInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BankDepositAddressCreateManyBankInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountryUpdateOneWithoutBanksNestedInputSchema: z.ZodType<Prisma.CountryUpdateOneWithoutBanksNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutBanksInputSchema),z.lazy(() => CountryUncheckedCreateWithoutBanksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountryCreateOrConnectWithoutBanksInputSchema).optional(),
  upsert: z.lazy(() => CountryUpsertWithoutBanksInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CountryWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CountryWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CountryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CountryUpdateToOneWithWhereWithoutBanksInputSchema),z.lazy(() => CountryUpdateWithoutBanksInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutBanksInputSchema) ]).optional(),
}).strict();

export const ReceiverAccountUpdateManyWithoutBankNestedInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateManyWithoutBankNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema).array(),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReceiverAccountCreateOrConnectWithoutBankInputSchema),z.lazy(() => ReceiverAccountCreateOrConnectWithoutBankInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReceiverAccountUpsertWithWhereUniqueWithoutBankInputSchema),z.lazy(() => ReceiverAccountUpsertWithWhereUniqueWithoutBankInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReceiverAccountCreateManyBankInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReceiverAccountUpdateWithWhereUniqueWithoutBankInputSchema),z.lazy(() => ReceiverAccountUpdateWithWhereUniqueWithoutBankInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReceiverAccountUpdateManyWithWhereWithoutBankInputSchema),z.lazy(() => ReceiverAccountUpdateManyWithWhereWithoutBankInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReceiverAccountScalarWhereInputSchema),z.lazy(() => ReceiverAccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BankDepositAddressUpdateManyWithoutBankNestedInputSchema: z.ZodType<Prisma.BankDepositAddressUpdateManyWithoutBankNestedInput> = z.object({
  create: z.union([ z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema).array(),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BankDepositAddressCreateOrConnectWithoutBankInputSchema),z.lazy(() => BankDepositAddressCreateOrConnectWithoutBankInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BankDepositAddressUpsertWithWhereUniqueWithoutBankInputSchema),z.lazy(() => BankDepositAddressUpsertWithWhereUniqueWithoutBankInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BankDepositAddressCreateManyBankInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BankDepositAddressUpdateWithWhereUniqueWithoutBankInputSchema),z.lazy(() => BankDepositAddressUpdateWithWhereUniqueWithoutBankInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BankDepositAddressUpdateManyWithWhereWithoutBankInputSchema),z.lazy(() => BankDepositAddressUpdateManyWithWhereWithoutBankInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BankDepositAddressScalarWhereInputSchema),z.lazy(() => BankDepositAddressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReceiverAccountUncheckedUpdateManyWithoutBankNestedInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedUpdateManyWithoutBankNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema).array(),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReceiverAccountCreateOrConnectWithoutBankInputSchema),z.lazy(() => ReceiverAccountCreateOrConnectWithoutBankInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReceiverAccountUpsertWithWhereUniqueWithoutBankInputSchema),z.lazy(() => ReceiverAccountUpsertWithWhereUniqueWithoutBankInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReceiverAccountCreateManyBankInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReceiverAccountWhereUniqueInputSchema),z.lazy(() => ReceiverAccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReceiverAccountUpdateWithWhereUniqueWithoutBankInputSchema),z.lazy(() => ReceiverAccountUpdateWithWhereUniqueWithoutBankInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReceiverAccountUpdateManyWithWhereWithoutBankInputSchema),z.lazy(() => ReceiverAccountUpdateManyWithWhereWithoutBankInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReceiverAccountScalarWhereInputSchema),z.lazy(() => ReceiverAccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BankDepositAddressUncheckedUpdateManyWithoutBankNestedInputSchema: z.ZodType<Prisma.BankDepositAddressUncheckedUpdateManyWithoutBankNestedInput> = z.object({
  create: z.union([ z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema).array(),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BankDepositAddressCreateOrConnectWithoutBankInputSchema),z.lazy(() => BankDepositAddressCreateOrConnectWithoutBankInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BankDepositAddressUpsertWithWhereUniqueWithoutBankInputSchema),z.lazy(() => BankDepositAddressUpsertWithWhereUniqueWithoutBankInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BankDepositAddressCreateManyBankInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BankDepositAddressWhereUniqueInputSchema),z.lazy(() => BankDepositAddressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BankDepositAddressUpdateWithWhereUniqueWithoutBankInputSchema),z.lazy(() => BankDepositAddressUpdateWithWhereUniqueWithoutBankInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BankDepositAddressUpdateManyWithWhereWithoutBankInputSchema),z.lazy(() => BankDepositAddressUpdateManyWithWhereWithoutBankInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BankDepositAddressScalarWhereInputSchema),z.lazy(() => BankDepositAddressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReceiverAccountsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReceiverAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReceiverAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReceiverAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const BankCreateNestedOneWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.BankCreateNestedOneWithoutReceiverAccountsInput> = z.object({
  create: z.union([ z.lazy(() => BankCreateWithoutReceiverAccountsInputSchema),z.lazy(() => BankUncheckedCreateWithoutReceiverAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BankCreateOrConnectWithoutReceiverAccountsInputSchema).optional(),
  connect: z.lazy(() => BankWhereUniqueInputSchema).optional()
}).strict();

export const EnumReceiverAccountTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumReceiverAccountTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ReceiverAccountTypeSchema).optional()
}).strict();

export const EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumReceiverAccountIdentifierFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ReceiverAccountIdentifierSchema).optional()
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const UserUpdateOneRequiredWithoutReceiverAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutReceiverAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReceiverAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReceiverAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReceiverAccountsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReceiverAccountsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReceiverAccountsInputSchema),z.lazy(() => UserUpdateWithoutReceiverAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReceiverAccountsInputSchema) ]).optional(),
}).strict();

export const BankUpdateOneWithoutReceiverAccountsNestedInputSchema: z.ZodType<Prisma.BankUpdateOneWithoutReceiverAccountsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BankCreateWithoutReceiverAccountsInputSchema),z.lazy(() => BankUncheckedCreateWithoutReceiverAccountsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BankCreateOrConnectWithoutReceiverAccountsInputSchema).optional(),
  upsert: z.lazy(() => BankUpsertWithoutReceiverAccountsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => BankWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => BankWhereInputSchema) ]).optional(),
  connect: z.lazy(() => BankWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BankUpdateToOneWithWhereWithoutReceiverAccountsInputSchema),z.lazy(() => BankUpdateWithoutReceiverAccountsInputSchema),z.lazy(() => BankUncheckedUpdateWithoutReceiverAccountsInputSchema) ]).optional(),
}).strict();

export const CountryCreateNestedOneWithoutAdminPercentagesInputSchema: z.ZodType<Prisma.CountryCreateNestedOneWithoutAdminPercentagesInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutAdminPercentagesInputSchema),z.lazy(() => CountryUncheckedCreateWithoutAdminPercentagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountryCreateOrConnectWithoutAdminPercentagesInputSchema).optional(),
  connect: z.lazy(() => CountryWhereUniqueInputSchema).optional()
}).strict();

export const CountryUpdateOneRequiredWithoutAdminPercentagesNestedInputSchema: z.ZodType<Prisma.CountryUpdateOneRequiredWithoutAdminPercentagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutAdminPercentagesInputSchema),z.lazy(() => CountryUncheckedCreateWithoutAdminPercentagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountryCreateOrConnectWithoutAdminPercentagesInputSchema).optional(),
  upsert: z.lazy(() => CountryUpsertWithoutAdminPercentagesInputSchema).optional(),
  connect: z.lazy(() => CountryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CountryUpdateToOneWithWhereWithoutAdminPercentagesInputSchema),z.lazy(() => CountryUpdateWithoutAdminPercentagesInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutAdminPercentagesInputSchema) ]).optional(),
}).strict();

export const BankCreateNestedOneWithoutBankDepositAddressesInputSchema: z.ZodType<Prisma.BankCreateNestedOneWithoutBankDepositAddressesInput> = z.object({
  create: z.union([ z.lazy(() => BankCreateWithoutBankDepositAddressesInputSchema),z.lazy(() => BankUncheckedCreateWithoutBankDepositAddressesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BankCreateOrConnectWithoutBankDepositAddressesInputSchema).optional(),
  connect: z.lazy(() => BankWhereUniqueInputSchema).optional()
}).strict();

export const BankUpdateOneWithoutBankDepositAddressesNestedInputSchema: z.ZodType<Prisma.BankUpdateOneWithoutBankDepositAddressesNestedInput> = z.object({
  create: z.union([ z.lazy(() => BankCreateWithoutBankDepositAddressesInputSchema),z.lazy(() => BankUncheckedCreateWithoutBankDepositAddressesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BankCreateOrConnectWithoutBankDepositAddressesInputSchema).optional(),
  upsert: z.lazy(() => BankUpsertWithoutBankDepositAddressesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => BankWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => BankWhereInputSchema) ]).optional(),
  connect: z.lazy(() => BankWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BankUpdateToOneWithWhereWithoutBankDepositAddressesInputSchema),z.lazy(() => BankUpdateWithoutBankDepositAddressesInputSchema),z.lazy(() => BankUncheckedUpdateWithoutBankDepositAddressesInputSchema) ]).optional(),
}).strict();

export const CountryCreateNestedOneWithoutCashDepositAddressesInputSchema: z.ZodType<Prisma.CountryCreateNestedOneWithoutCashDepositAddressesInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutCashDepositAddressesInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCashDepositAddressesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountryCreateOrConnectWithoutCashDepositAddressesInputSchema).optional(),
  connect: z.lazy(() => CountryWhereUniqueInputSchema).optional()
}).strict();

export const CountryUpdateOneRequiredWithoutCashDepositAddressesNestedInputSchema: z.ZodType<Prisma.CountryUpdateOneRequiredWithoutCashDepositAddressesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutCashDepositAddressesInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCashDepositAddressesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CountryCreateOrConnectWithoutCashDepositAddressesInputSchema).optional(),
  upsert: z.lazy(() => CountryUpsertWithoutCashDepositAddressesInputSchema).optional(),
  connect: z.lazy(() => CountryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CountryUpdateToOneWithWhereWithoutCashDepositAddressesInputSchema),z.lazy(() => CountryUpdateWithoutCashDepositAddressesInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutCashDepositAddressesInputSchema) ]).optional(),
}).strict();

export const CurrencyCreateNestedOneWithoutSourceExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyCreateNestedOneWithoutSourceExchangeRatesInput> = z.object({
  create: z.union([ z.lazy(() => CurrencyCreateWithoutSourceExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutSourceExchangeRatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurrencyCreateOrConnectWithoutSourceExchangeRatesInputSchema).optional(),
  connect: z.lazy(() => CurrencyWhereUniqueInputSchema).optional()
}).strict();

export const CurrencyCreateNestedOneWithoutTargetExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyCreateNestedOneWithoutTargetExchangeRatesInput> = z.object({
  create: z.union([ z.lazy(() => CurrencyCreateWithoutTargetExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutTargetExchangeRatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurrencyCreateOrConnectWithoutTargetExchangeRatesInputSchema).optional(),
  connect: z.lazy(() => CurrencyWhereUniqueInputSchema).optional()
}).strict();

export const EnumRateSourceFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRateSourceFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RateSourceSchema).optional()
}).strict();

export const CurrencyUpdateOneRequiredWithoutSourceExchangeRatesNestedInputSchema: z.ZodType<Prisma.CurrencyUpdateOneRequiredWithoutSourceExchangeRatesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurrencyCreateWithoutSourceExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutSourceExchangeRatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurrencyCreateOrConnectWithoutSourceExchangeRatesInputSchema).optional(),
  upsert: z.lazy(() => CurrencyUpsertWithoutSourceExchangeRatesInputSchema).optional(),
  connect: z.lazy(() => CurrencyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CurrencyUpdateToOneWithWhereWithoutSourceExchangeRatesInputSchema),z.lazy(() => CurrencyUpdateWithoutSourceExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutSourceExchangeRatesInputSchema) ]).optional(),
}).strict();

export const CurrencyUpdateOneRequiredWithoutTargetExchangeRatesNestedInputSchema: z.ZodType<Prisma.CurrencyUpdateOneRequiredWithoutTargetExchangeRatesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurrencyCreateWithoutTargetExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutTargetExchangeRatesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurrencyCreateOrConnectWithoutTargetExchangeRatesInputSchema).optional(),
  upsert: z.lazy(() => CurrencyUpsertWithoutTargetExchangeRatesInputSchema).optional(),
  connect: z.lazy(() => CurrencyWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CurrencyUpdateToOneWithWhereWithoutTargetExchangeRatesInputSchema),z.lazy(() => CurrencyUpdateWithoutTargetExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutTargetExchangeRatesInputSchema) ]).optional(),
}).strict();

export const ExchangeRateCreateNestedManyWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateCreateNestedManyWithoutSourceCurrencyInput> = z.object({
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema).array(),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExchangeRateCreateManySourceCurrencyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExchangeRateCreateNestedManyWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateCreateNestedManyWithoutTargetCurrencyInput> = z.object({
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema).array(),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExchangeRateCreateManyTargetCurrencyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountryCreateNestedManyWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryCreateNestedManyWithoutCurrencyInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutCurrencyInputSchema),z.lazy(() => CountryCreateWithoutCurrencyInputSchema).array(),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountryCreateOrConnectWithoutCurrencyInputSchema),z.lazy(() => CountryCreateOrConnectWithoutCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountryCreateManyCurrencyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExchangeRateUncheckedCreateNestedManyWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedCreateNestedManyWithoutSourceCurrencyInput> = z.object({
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema).array(),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExchangeRateCreateManySourceCurrencyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExchangeRateUncheckedCreateNestedManyWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedCreateNestedManyWithoutTargetCurrencyInput> = z.object({
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema).array(),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExchangeRateCreateManyTargetCurrencyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CountryUncheckedCreateNestedManyWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryUncheckedCreateNestedManyWithoutCurrencyInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutCurrencyInputSchema),z.lazy(() => CountryCreateWithoutCurrencyInputSchema).array(),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountryCreateOrConnectWithoutCurrencyInputSchema),z.lazy(() => CountryCreateOrConnectWithoutCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountryCreateManyCurrencyInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExchangeRateUpdateManyWithoutSourceCurrencyNestedInputSchema: z.ZodType<Prisma.ExchangeRateUpdateManyWithoutSourceCurrencyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema).array(),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExchangeRateUpsertWithWhereUniqueWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUpsertWithWhereUniqueWithoutSourceCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExchangeRateCreateManySourceCurrencyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExchangeRateUpdateWithWhereUniqueWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUpdateWithWhereUniqueWithoutSourceCurrencyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExchangeRateUpdateManyWithWhereWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUpdateManyWithWhereWithoutSourceCurrencyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExchangeRateScalarWhereInputSchema),z.lazy(() => ExchangeRateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExchangeRateUpdateManyWithoutTargetCurrencyNestedInputSchema: z.ZodType<Prisma.ExchangeRateUpdateManyWithoutTargetCurrencyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema).array(),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExchangeRateUpsertWithWhereUniqueWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUpsertWithWhereUniqueWithoutTargetCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExchangeRateCreateManyTargetCurrencyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExchangeRateUpdateWithWhereUniqueWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUpdateWithWhereUniqueWithoutTargetCurrencyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExchangeRateUpdateManyWithWhereWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUpdateManyWithWhereWithoutTargetCurrencyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExchangeRateScalarWhereInputSchema),z.lazy(() => ExchangeRateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountryUpdateManyWithoutCurrencyNestedInputSchema: z.ZodType<Prisma.CountryUpdateManyWithoutCurrencyNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutCurrencyInputSchema),z.lazy(() => CountryCreateWithoutCurrencyInputSchema).array(),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountryCreateOrConnectWithoutCurrencyInputSchema),z.lazy(() => CountryCreateOrConnectWithoutCurrencyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CountryUpsertWithWhereUniqueWithoutCurrencyInputSchema),z.lazy(() => CountryUpsertWithWhereUniqueWithoutCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountryCreateManyCurrencyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CountryUpdateWithWhereUniqueWithoutCurrencyInputSchema),z.lazy(() => CountryUpdateWithWhereUniqueWithoutCurrencyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CountryUpdateManyWithWhereWithoutCurrencyInputSchema),z.lazy(() => CountryUpdateManyWithWhereWithoutCurrencyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CountryScalarWhereInputSchema),z.lazy(() => CountryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExchangeRateUncheckedUpdateManyWithoutSourceCurrencyNestedInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedUpdateManyWithoutSourceCurrencyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema).array(),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExchangeRateUpsertWithWhereUniqueWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUpsertWithWhereUniqueWithoutSourceCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExchangeRateCreateManySourceCurrencyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExchangeRateUpdateWithWhereUniqueWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUpdateWithWhereUniqueWithoutSourceCurrencyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExchangeRateUpdateManyWithWhereWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUpdateManyWithWhereWithoutSourceCurrencyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExchangeRateScalarWhereInputSchema),z.lazy(() => ExchangeRateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExchangeRateUncheckedUpdateManyWithoutTargetCurrencyNestedInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedUpdateManyWithoutTargetCurrencyNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema).array(),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExchangeRateUpsertWithWhereUniqueWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUpsertWithWhereUniqueWithoutTargetCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExchangeRateCreateManyTargetCurrencyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExchangeRateWhereUniqueInputSchema),z.lazy(() => ExchangeRateWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExchangeRateUpdateWithWhereUniqueWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUpdateWithWhereUniqueWithoutTargetCurrencyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExchangeRateUpdateManyWithWhereWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUpdateManyWithWhereWithoutTargetCurrencyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExchangeRateScalarWhereInputSchema),z.lazy(() => ExchangeRateScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CountryUncheckedUpdateManyWithoutCurrencyNestedInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateManyWithoutCurrencyNestedInput> = z.object({
  create: z.union([ z.lazy(() => CountryCreateWithoutCurrencyInputSchema),z.lazy(() => CountryCreateWithoutCurrencyInputSchema).array(),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CountryCreateOrConnectWithoutCurrencyInputSchema),z.lazy(() => CountryCreateOrConnectWithoutCurrencyInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CountryUpsertWithWhereUniqueWithoutCurrencyInputSchema),z.lazy(() => CountryUpsertWithWhereUniqueWithoutCurrencyInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CountryCreateManyCurrencyInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CountryWhereUniqueInputSchema),z.lazy(() => CountryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CountryUpdateWithWhereUniqueWithoutCurrencyInputSchema),z.lazy(() => CountryUpdateWithWhereUniqueWithoutCurrencyInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CountryUpdateManyWithWhereWithoutCurrencyInputSchema),z.lazy(() => CountryUpdateManyWithWhereWithoutCurrencyInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CountryScalarWhereInputSchema),z.lazy(() => CountryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema),z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumReceiverAccountTypeFilterSchema: z.ZodType<Prisma.NestedEnumReceiverAccountTypeFilter> = z.object({
  equals: z.lazy(() => ReceiverAccountTypeSchema).optional(),
  in: z.lazy(() => ReceiverAccountTypeSchema).array().optional(),
  notIn: z.lazy(() => ReceiverAccountTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => NestedEnumReceiverAccountTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumReceiverAccountIdentifierFilterSchema: z.ZodType<Prisma.NestedEnumReceiverAccountIdentifierFilter> = z.object({
  equals: z.lazy(() => ReceiverAccountIdentifierSchema).optional(),
  in: z.lazy(() => ReceiverAccountIdentifierSchema).array().optional(),
  notIn: z.lazy(() => ReceiverAccountIdentifierSchema).array().optional(),
  not: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => NestedEnumReceiverAccountIdentifierFilterSchema) ]).optional(),
}).strict();

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const NestedEnumReceiverAccountTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumReceiverAccountTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ReceiverAccountTypeSchema).optional(),
  in: z.lazy(() => ReceiverAccountTypeSchema).array().optional(),
  notIn: z.lazy(() => ReceiverAccountTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => NestedEnumReceiverAccountTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumReceiverAccountTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumReceiverAccountTypeFilterSchema).optional()
}).strict();

export const NestedEnumReceiverAccountIdentifierWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumReceiverAccountIdentifierWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ReceiverAccountIdentifierSchema).optional(),
  in: z.lazy(() => ReceiverAccountIdentifierSchema).array().optional(),
  notIn: z.lazy(() => ReceiverAccountIdentifierSchema).array().optional(),
  not: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => NestedEnumReceiverAccountIdentifierWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumReceiverAccountIdentifierFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumReceiverAccountIdentifierFilterSchema).optional()
}).strict();

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Decimal).array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const NestedEnumRateSourceFilterSchema: z.ZodType<Prisma.NestedEnumRateSourceFilter> = z.object({
  equals: z.lazy(() => RateSourceSchema).optional(),
  in: z.lazy(() => RateSourceSchema).array().optional(),
  notIn: z.lazy(() => RateSourceSchema).array().optional(),
  not: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => NestedEnumRateSourceFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRateSourceWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRateSourceWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RateSourceSchema).optional(),
  in: z.lazy(() => RateSourceSchema).array().optional(),
  notIn: z.lazy(() => RateSourceSchema).array().optional(),
  not: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => NestedEnumRateSourceWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRateSourceFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRateSourceFilterSchema).optional()
}).strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> = z.object({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> = z.object({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyUserInputSchema),z.lazy(() => AccountCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> = z.object({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> = z.object({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => SessionCreateManyUserInputSchema),z.lazy(() => SessionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReceiverAccountCreateWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountCreateWithoutClientInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bank: z.lazy(() => BankCreateNestedOneWithoutReceiverAccountsInputSchema).optional()
}).strict();

export const ReceiverAccountUncheckedCreateWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedCreateWithoutClientInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  bankId: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const ReceiverAccountCreateOrConnectWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountCreateOrConnectWithoutClientInput> = z.object({
  where: z.lazy(() => ReceiverAccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ReceiverAccountCreateManyClientInputEnvelopeSchema: z.ZodType<Prisma.ReceiverAccountCreateManyClientInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReceiverAccountCreateManyClientInputSchema),z.lazy(() => ReceiverAccountCreateManyClientInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutUserInputSchema),z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutUserInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  providerAccountId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refresh_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  access_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expires_at: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  token_type: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  scope: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  id_token: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  session_state: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => SessionCreateWithoutUserInputSchema),z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => SessionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateWithoutUserInputSchema),z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => SessionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SessionUpdateManyMutationInputSchema),z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SessionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SessionScalarWhereInputSchema),z.lazy(() => SessionScalarWhereInputSchema).array() ]).optional(),
  sessionToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expires: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ReceiverAccountUpsertWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountUpsertWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => ReceiverAccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReceiverAccountUpdateWithoutClientInputSchema),z.lazy(() => ReceiverAccountUncheckedUpdateWithoutClientInputSchema) ]),
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutClientInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutClientInputSchema) ]),
}).strict();

export const ReceiverAccountUpdateWithWhereUniqueWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateWithWhereUniqueWithoutClientInput> = z.object({
  where: z.lazy(() => ReceiverAccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReceiverAccountUpdateWithoutClientInputSchema),z.lazy(() => ReceiverAccountUncheckedUpdateWithoutClientInputSchema) ]),
}).strict();

export const ReceiverAccountUpdateManyWithWhereWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateManyWithWhereWithoutClientInput> = z.object({
  where: z.lazy(() => ReceiverAccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReceiverAccountUpdateManyMutationInputSchema),z.lazy(() => ReceiverAccountUncheckedUpdateManyWithoutClientInputSchema) ]),
}).strict();

export const ReceiverAccountScalarWhereInputSchema: z.ZodType<Prisma.ReceiverAccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReceiverAccountScalarWhereInputSchema),z.lazy(() => ReceiverAccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReceiverAccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReceiverAccountScalarWhereInputSchema),z.lazy(() => ReceiverAccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumReceiverAccountTypeFilterSchema),z.lazy(() => ReceiverAccountTypeSchema) ]).optional(),
  clientId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  identifier: z.union([ z.lazy(() => EnumReceiverAccountIdentifierFilterSchema),z.lazy(() => ReceiverAccountIdentifierSchema) ]).optional(),
  qrCodeUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  qrCodeContent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  balance: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  bankAccountNumber: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  bankId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  limit: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountCreateNestedManyWithoutClientInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedCreateNestedManyWithoutClientInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUpdateManyWithoutClientNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedUpdateManyWithoutClientNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountCreateNestedManyWithoutClientInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedCreateNestedManyWithoutClientInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSessionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUpdateManyWithoutClientNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedUpdateManyWithoutClientNestedInputSchema).optional()
}).strict();

export const CountryCreateWithoutLanguageInputSchema: z.ZodType<Prisma.CountryCreateWithoutLanguageInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currency: z.lazy(() => CurrencyCreateNestedOneWithoutCountriesInputSchema).optional(),
  banks: z.lazy(() => BankCreateNestedManyWithoutCountryInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUncheckedCreateWithoutLanguageInputSchema: z.ZodType<Prisma.CountryUncheckedCreateWithoutLanguageInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currencyId: z.string().optional().nullable(),
  banks: z.lazy(() => BankUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryCreateOrConnectWithoutLanguageInputSchema: z.ZodType<Prisma.CountryCreateOrConnectWithoutLanguageInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountryCreateWithoutLanguageInputSchema),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema) ]),
}).strict();

export const CountryCreateManyLanguageInputEnvelopeSchema: z.ZodType<Prisma.CountryCreateManyLanguageInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CountryCreateManyLanguageInputSchema),z.lazy(() => CountryCreateManyLanguageInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CountryUpsertWithWhereUniqueWithoutLanguageInputSchema: z.ZodType<Prisma.CountryUpsertWithWhereUniqueWithoutLanguageInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CountryUpdateWithoutLanguageInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutLanguageInputSchema) ]),
  create: z.union([ z.lazy(() => CountryCreateWithoutLanguageInputSchema),z.lazy(() => CountryUncheckedCreateWithoutLanguageInputSchema) ]),
}).strict();

export const CountryUpdateWithWhereUniqueWithoutLanguageInputSchema: z.ZodType<Prisma.CountryUpdateWithWhereUniqueWithoutLanguageInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CountryUpdateWithoutLanguageInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutLanguageInputSchema) ]),
}).strict();

export const CountryUpdateManyWithWhereWithoutLanguageInputSchema: z.ZodType<Prisma.CountryUpdateManyWithWhereWithoutLanguageInput> = z.object({
  where: z.lazy(() => CountryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CountryUpdateManyMutationInputSchema),z.lazy(() => CountryUncheckedUpdateManyWithoutLanguageInputSchema) ]),
}).strict();

export const CountryScalarWhereInputSchema: z.ZodType<Prisma.CountryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CountryScalarWhereInputSchema),z.lazy(() => CountryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CountryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CountryScalarWhereInputSchema),z.lazy(() => CountryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  continent: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  flagUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  currencyId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  languageId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const CurrencyCreateWithoutCountriesInputSchema: z.ZodType<Prisma.CurrencyCreateWithoutCountriesInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateCreateNestedManyWithoutSourceCurrencyInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateCreateNestedManyWithoutTargetCurrencyInputSchema).optional()
}).strict();

export const CurrencyUncheckedCreateWithoutCountriesInputSchema: z.ZodType<Prisma.CurrencyUncheckedCreateWithoutCountriesInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUncheckedCreateNestedManyWithoutSourceCurrencyInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateUncheckedCreateNestedManyWithoutTargetCurrencyInputSchema).optional()
}).strict();

export const CurrencyCreateOrConnectWithoutCountriesInputSchema: z.ZodType<Prisma.CurrencyCreateOrConnectWithoutCountriesInput> = z.object({
  where: z.lazy(() => CurrencyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CurrencyCreateWithoutCountriesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutCountriesInputSchema) ]),
}).strict();

export const LanguageCreateWithoutCountriesInputSchema: z.ZodType<Prisma.LanguageCreateWithoutCountriesInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string()
}).strict();

export const LanguageUncheckedCreateWithoutCountriesInputSchema: z.ZodType<Prisma.LanguageUncheckedCreateWithoutCountriesInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string()
}).strict();

export const LanguageCreateOrConnectWithoutCountriesInputSchema: z.ZodType<Prisma.LanguageCreateOrConnectWithoutCountriesInput> = z.object({
  where: z.lazy(() => LanguageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LanguageCreateWithoutCountriesInputSchema),z.lazy(() => LanguageUncheckedCreateWithoutCountriesInputSchema) ]),
}).strict();

export const BankCreateWithoutCountryInputSchema: z.ZodType<Prisma.BankCreateWithoutCountryInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountCreateNestedManyWithoutBankInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressCreateNestedManyWithoutBankInputSchema).optional()
}).strict();

export const BankUncheckedCreateWithoutCountryInputSchema: z.ZodType<Prisma.BankUncheckedCreateWithoutCountryInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedCreateNestedManyWithoutBankInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUncheckedCreateNestedManyWithoutBankInputSchema).optional()
}).strict();

export const BankCreateOrConnectWithoutCountryInputSchema: z.ZodType<Prisma.BankCreateOrConnectWithoutCountryInput> = z.object({
  where: z.lazy(() => BankWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BankCreateWithoutCountryInputSchema),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema) ]),
}).strict();

export const BankCreateManyCountryInputEnvelopeSchema: z.ZodType<Prisma.BankCreateManyCountryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BankCreateManyCountryInputSchema),z.lazy(() => BankCreateManyCountryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AdminPercentageCreateWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageCreateWithoutCountryInput> = z.object({
  id: z.string().cuid().optional(),
  percentage: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const AdminPercentageUncheckedCreateWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageUncheckedCreateWithoutCountryInput> = z.object({
  id: z.string().cuid().optional(),
  percentage: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const AdminPercentageCreateOrConnectWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageCreateOrConnectWithoutCountryInput> = z.object({
  where: z.lazy(() => AdminPercentageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema) ]),
}).strict();

export const AdminPercentageCreateManyCountryInputEnvelopeSchema: z.ZodType<Prisma.AdminPercentageCreateManyCountryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AdminPercentageCreateManyCountryInputSchema),z.lazy(() => AdminPercentageCreateManyCountryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CashDepositAddressCreateWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressCreateWithoutCountryInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string()
}).strict();

export const CashDepositAddressUncheckedCreateWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressUncheckedCreateWithoutCountryInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string()
}).strict();

export const CashDepositAddressCreateOrConnectWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressCreateOrConnectWithoutCountryInput> = z.object({
  where: z.lazy(() => CashDepositAddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema) ]),
}).strict();

export const CashDepositAddressCreateManyCountryInputEnvelopeSchema: z.ZodType<Prisma.CashDepositAddressCreateManyCountryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CashDepositAddressCreateManyCountryInputSchema),z.lazy(() => CashDepositAddressCreateManyCountryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CurrencyUpsertWithoutCountriesInputSchema: z.ZodType<Prisma.CurrencyUpsertWithoutCountriesInput> = z.object({
  update: z.union([ z.lazy(() => CurrencyUpdateWithoutCountriesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutCountriesInputSchema) ]),
  create: z.union([ z.lazy(() => CurrencyCreateWithoutCountriesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutCountriesInputSchema) ]),
  where: z.lazy(() => CurrencyWhereInputSchema).optional()
}).strict();

export const CurrencyUpdateToOneWithWhereWithoutCountriesInputSchema: z.ZodType<Prisma.CurrencyUpdateToOneWithWhereWithoutCountriesInput> = z.object({
  where: z.lazy(() => CurrencyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CurrencyUpdateWithoutCountriesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutCountriesInputSchema) ]),
}).strict();

export const CurrencyUpdateWithoutCountriesInputSchema: z.ZodType<Prisma.CurrencyUpdateWithoutCountriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUpdateManyWithoutSourceCurrencyNestedInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateUpdateManyWithoutTargetCurrencyNestedInputSchema).optional()
}).strict();

export const CurrencyUncheckedUpdateWithoutCountriesInputSchema: z.ZodType<Prisma.CurrencyUncheckedUpdateWithoutCountriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUncheckedUpdateManyWithoutSourceCurrencyNestedInputSchema).optional(),
  targetExchangeRates: z.lazy(() => ExchangeRateUncheckedUpdateManyWithoutTargetCurrencyNestedInputSchema).optional()
}).strict();

export const LanguageUpsertWithoutCountriesInputSchema: z.ZodType<Prisma.LanguageUpsertWithoutCountriesInput> = z.object({
  update: z.union([ z.lazy(() => LanguageUpdateWithoutCountriesInputSchema),z.lazy(() => LanguageUncheckedUpdateWithoutCountriesInputSchema) ]),
  create: z.union([ z.lazy(() => LanguageCreateWithoutCountriesInputSchema),z.lazy(() => LanguageUncheckedCreateWithoutCountriesInputSchema) ]),
  where: z.lazy(() => LanguageWhereInputSchema).optional()
}).strict();

export const LanguageUpdateToOneWithWhereWithoutCountriesInputSchema: z.ZodType<Prisma.LanguageUpdateToOneWithWhereWithoutCountriesInput> = z.object({
  where: z.lazy(() => LanguageWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => LanguageUpdateWithoutCountriesInputSchema),z.lazy(() => LanguageUncheckedUpdateWithoutCountriesInputSchema) ]),
}).strict();

export const LanguageUpdateWithoutCountriesInputSchema: z.ZodType<Prisma.LanguageUpdateWithoutCountriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LanguageUncheckedUpdateWithoutCountriesInputSchema: z.ZodType<Prisma.LanguageUncheckedUpdateWithoutCountriesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BankUpsertWithWhereUniqueWithoutCountryInputSchema: z.ZodType<Prisma.BankUpsertWithWhereUniqueWithoutCountryInput> = z.object({
  where: z.lazy(() => BankWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BankUpdateWithoutCountryInputSchema),z.lazy(() => BankUncheckedUpdateWithoutCountryInputSchema) ]),
  create: z.union([ z.lazy(() => BankCreateWithoutCountryInputSchema),z.lazy(() => BankUncheckedCreateWithoutCountryInputSchema) ]),
}).strict();

export const BankUpdateWithWhereUniqueWithoutCountryInputSchema: z.ZodType<Prisma.BankUpdateWithWhereUniqueWithoutCountryInput> = z.object({
  where: z.lazy(() => BankWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BankUpdateWithoutCountryInputSchema),z.lazy(() => BankUncheckedUpdateWithoutCountryInputSchema) ]),
}).strict();

export const BankUpdateManyWithWhereWithoutCountryInputSchema: z.ZodType<Prisma.BankUpdateManyWithWhereWithoutCountryInput> = z.object({
  where: z.lazy(() => BankScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BankUpdateManyMutationInputSchema),z.lazy(() => BankUncheckedUpdateManyWithoutCountryInputSchema) ]),
}).strict();

export const BankScalarWhereInputSchema: z.ZodType<Prisma.BankScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BankScalarWhereInputSchema),z.lazy(() => BankScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BankScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BankScalarWhereInputSchema),z.lazy(() => BankScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  nameEng: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  shortName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  logoUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  countryId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AdminPercentageUpsertWithWhereUniqueWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageUpsertWithWhereUniqueWithoutCountryInput> = z.object({
  where: z.lazy(() => AdminPercentageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AdminPercentageUpdateWithoutCountryInputSchema),z.lazy(() => AdminPercentageUncheckedUpdateWithoutCountryInputSchema) ]),
  create: z.union([ z.lazy(() => AdminPercentageCreateWithoutCountryInputSchema),z.lazy(() => AdminPercentageUncheckedCreateWithoutCountryInputSchema) ]),
}).strict();

export const AdminPercentageUpdateWithWhereUniqueWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageUpdateWithWhereUniqueWithoutCountryInput> = z.object({
  where: z.lazy(() => AdminPercentageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AdminPercentageUpdateWithoutCountryInputSchema),z.lazy(() => AdminPercentageUncheckedUpdateWithoutCountryInputSchema) ]),
}).strict();

export const AdminPercentageUpdateManyWithWhereWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageUpdateManyWithWhereWithoutCountryInput> = z.object({
  where: z.lazy(() => AdminPercentageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AdminPercentageUpdateManyMutationInputSchema),z.lazy(() => AdminPercentageUncheckedUpdateManyWithoutCountryInputSchema) ]),
}).strict();

export const AdminPercentageScalarWhereInputSchema: z.ZodType<Prisma.AdminPercentageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AdminPercentageScalarWhereInputSchema),z.lazy(() => AdminPercentageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AdminPercentageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AdminPercentageScalarWhereInputSchema),z.lazy(() => AdminPercentageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  percentage: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const CashDepositAddressUpsertWithWhereUniqueWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressUpsertWithWhereUniqueWithoutCountryInput> = z.object({
  where: z.lazy(() => CashDepositAddressWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CashDepositAddressUpdateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUncheckedUpdateWithoutCountryInputSchema) ]),
  create: z.union([ z.lazy(() => CashDepositAddressCreateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUncheckedCreateWithoutCountryInputSchema) ]),
}).strict();

export const CashDepositAddressUpdateWithWhereUniqueWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressUpdateWithWhereUniqueWithoutCountryInput> = z.object({
  where: z.lazy(() => CashDepositAddressWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CashDepositAddressUpdateWithoutCountryInputSchema),z.lazy(() => CashDepositAddressUncheckedUpdateWithoutCountryInputSchema) ]),
}).strict();

export const CashDepositAddressUpdateManyWithWhereWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressUpdateManyWithWhereWithoutCountryInput> = z.object({
  where: z.lazy(() => CashDepositAddressScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CashDepositAddressUpdateManyMutationInputSchema),z.lazy(() => CashDepositAddressUncheckedUpdateManyWithoutCountryInputSchema) ]),
}).strict();

export const CashDepositAddressScalarWhereInputSchema: z.ZodType<Prisma.CashDepositAddressScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CashDepositAddressScalarWhereInputSchema),z.lazy(() => CashDepositAddressScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CashDepositAddressScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CashDepositAddressScalarWhereInputSchema),z.lazy(() => CashDepositAddressScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  countryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CountryCreateWithoutBanksInputSchema: z.ZodType<Prisma.CountryCreateWithoutBanksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currency: z.lazy(() => CurrencyCreateNestedOneWithoutCountriesInputSchema).optional(),
  language: z.lazy(() => LanguageCreateNestedOneWithoutCountriesInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUncheckedCreateWithoutBanksInputSchema: z.ZodType<Prisma.CountryUncheckedCreateWithoutBanksInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currencyId: z.string().optional().nullable(),
  languageId: z.string().optional().nullable(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryCreateOrConnectWithoutBanksInputSchema: z.ZodType<Prisma.CountryCreateOrConnectWithoutBanksInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountryCreateWithoutBanksInputSchema),z.lazy(() => CountryUncheckedCreateWithoutBanksInputSchema) ]),
}).strict();

export const ReceiverAccountCreateWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountCreateWithoutBankInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  client: z.lazy(() => UserCreateNestedOneWithoutReceiverAccountsInputSchema)
}).strict();

export const ReceiverAccountUncheckedCreateWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedCreateWithoutBankInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  clientId: z.string(),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const ReceiverAccountCreateOrConnectWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountCreateOrConnectWithoutBankInput> = z.object({
  where: z.lazy(() => ReceiverAccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema) ]),
}).strict();

export const ReceiverAccountCreateManyBankInputEnvelopeSchema: z.ZodType<Prisma.ReceiverAccountCreateManyBankInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReceiverAccountCreateManyBankInputSchema),z.lazy(() => ReceiverAccountCreateManyBankInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const BankDepositAddressCreateWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressCreateWithoutBankInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string()
}).strict();

export const BankDepositAddressUncheckedCreateWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressUncheckedCreateWithoutBankInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string()
}).strict();

export const BankDepositAddressCreateOrConnectWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressCreateOrConnectWithoutBankInput> = z.object({
  where: z.lazy(() => BankDepositAddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema) ]),
}).strict();

export const BankDepositAddressCreateManyBankInputEnvelopeSchema: z.ZodType<Prisma.BankDepositAddressCreateManyBankInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BankDepositAddressCreateManyBankInputSchema),z.lazy(() => BankDepositAddressCreateManyBankInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CountryUpsertWithoutBanksInputSchema: z.ZodType<Prisma.CountryUpsertWithoutBanksInput> = z.object({
  update: z.union([ z.lazy(() => CountryUpdateWithoutBanksInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutBanksInputSchema) ]),
  create: z.union([ z.lazy(() => CountryCreateWithoutBanksInputSchema),z.lazy(() => CountryUncheckedCreateWithoutBanksInputSchema) ]),
  where: z.lazy(() => CountryWhereInputSchema).optional()
}).strict();

export const CountryUpdateToOneWithWhereWithoutBanksInputSchema: z.ZodType<Prisma.CountryUpdateToOneWithWhereWithoutBanksInput> = z.object({
  where: z.lazy(() => CountryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CountryUpdateWithoutBanksInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutBanksInputSchema) ]),
}).strict();

export const CountryUpdateWithoutBanksInputSchema: z.ZodType<Prisma.CountryUpdateWithoutBanksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.lazy(() => CurrencyUpdateOneWithoutCountriesNestedInputSchema).optional(),
  language: z.lazy(() => LanguageUpdateOneWithoutCountriesNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateWithoutBanksInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateWithoutBanksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currencyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  languageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const ReceiverAccountUpsertWithWhereUniqueWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountUpsertWithWhereUniqueWithoutBankInput> = z.object({
  where: z.lazy(() => ReceiverAccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReceiverAccountUpdateWithoutBankInputSchema),z.lazy(() => ReceiverAccountUncheckedUpdateWithoutBankInputSchema) ]),
  create: z.union([ z.lazy(() => ReceiverAccountCreateWithoutBankInputSchema),z.lazy(() => ReceiverAccountUncheckedCreateWithoutBankInputSchema) ]),
}).strict();

export const ReceiverAccountUpdateWithWhereUniqueWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateWithWhereUniqueWithoutBankInput> = z.object({
  where: z.lazy(() => ReceiverAccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReceiverAccountUpdateWithoutBankInputSchema),z.lazy(() => ReceiverAccountUncheckedUpdateWithoutBankInputSchema) ]),
}).strict();

export const ReceiverAccountUpdateManyWithWhereWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateManyWithWhereWithoutBankInput> = z.object({
  where: z.lazy(() => ReceiverAccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReceiverAccountUpdateManyMutationInputSchema),z.lazy(() => ReceiverAccountUncheckedUpdateManyWithoutBankInputSchema) ]),
}).strict();

export const BankDepositAddressUpsertWithWhereUniqueWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressUpsertWithWhereUniqueWithoutBankInput> = z.object({
  where: z.lazy(() => BankDepositAddressWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BankDepositAddressUpdateWithoutBankInputSchema),z.lazy(() => BankDepositAddressUncheckedUpdateWithoutBankInputSchema) ]),
  create: z.union([ z.lazy(() => BankDepositAddressCreateWithoutBankInputSchema),z.lazy(() => BankDepositAddressUncheckedCreateWithoutBankInputSchema) ]),
}).strict();

export const BankDepositAddressUpdateWithWhereUniqueWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressUpdateWithWhereUniqueWithoutBankInput> = z.object({
  where: z.lazy(() => BankDepositAddressWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BankDepositAddressUpdateWithoutBankInputSchema),z.lazy(() => BankDepositAddressUncheckedUpdateWithoutBankInputSchema) ]),
}).strict();

export const BankDepositAddressUpdateManyWithWhereWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressUpdateManyWithWhereWithoutBankInput> = z.object({
  where: z.lazy(() => BankDepositAddressScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BankDepositAddressUpdateManyMutationInputSchema),z.lazy(() => BankDepositAddressUncheckedUpdateManyWithoutBankInputSchema) ]),
}).strict();

export const BankDepositAddressScalarWhereInputSchema: z.ZodType<Prisma.BankDepositAddressScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BankDepositAddressScalarWhereInputSchema),z.lazy(() => BankDepositAddressScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BankDepositAddressScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BankDepositAddressScalarWhereInputSchema),z.lazy(() => BankDepositAddressScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  bankId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const UserCreateWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutReceiverAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReceiverAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReceiverAccountsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReceiverAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReceiverAccountsInputSchema) ]),
}).strict();

export const BankCreateWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.BankCreateWithoutReceiverAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  country: z.lazy(() => CountryCreateNestedOneWithoutBanksInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressCreateNestedManyWithoutBankInputSchema).optional()
}).strict();

export const BankUncheckedCreateWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.BankUncheckedCreateWithoutReceiverAccountsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  countryId: z.string().optional().nullable(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUncheckedCreateNestedManyWithoutBankInputSchema).optional()
}).strict();

export const BankCreateOrConnectWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.BankCreateOrConnectWithoutReceiverAccountsInput> = z.object({
  where: z.lazy(() => BankWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BankCreateWithoutReceiverAccountsInputSchema),z.lazy(() => BankUncheckedCreateWithoutReceiverAccountsInputSchema) ]),
}).strict();

export const UserUpsertWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutReceiverAccountsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutReceiverAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReceiverAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReceiverAccountsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReceiverAccountsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReceiverAccountsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReceiverAccountsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReceiverAccountsInputSchema) ]),
}).strict();

export const UserUpdateWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutReceiverAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReceiverAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailVerified: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  image: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role: z.union([ z.lazy(() => RoleSchema),z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const BankUpsertWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.BankUpsertWithoutReceiverAccountsInput> = z.object({
  update: z.union([ z.lazy(() => BankUpdateWithoutReceiverAccountsInputSchema),z.lazy(() => BankUncheckedUpdateWithoutReceiverAccountsInputSchema) ]),
  create: z.union([ z.lazy(() => BankCreateWithoutReceiverAccountsInputSchema),z.lazy(() => BankUncheckedCreateWithoutReceiverAccountsInputSchema) ]),
  where: z.lazy(() => BankWhereInputSchema).optional()
}).strict();

export const BankUpdateToOneWithWhereWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.BankUpdateToOneWithWhereWithoutReceiverAccountsInput> = z.object({
  where: z.lazy(() => BankWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BankUpdateWithoutReceiverAccountsInputSchema),z.lazy(() => BankUncheckedUpdateWithoutReceiverAccountsInputSchema) ]),
}).strict();

export const BankUpdateWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.BankUpdateWithoutReceiverAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.lazy(() => CountryUpdateOneWithoutBanksNestedInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUpdateManyWithoutBankNestedInputSchema).optional()
}).strict();

export const BankUncheckedUpdateWithoutReceiverAccountsInputSchema: z.ZodType<Prisma.BankUncheckedUpdateWithoutReceiverAccountsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  countryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUncheckedUpdateManyWithoutBankNestedInputSchema).optional()
}).strict();

export const CountryCreateWithoutAdminPercentagesInputSchema: z.ZodType<Prisma.CountryCreateWithoutAdminPercentagesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currency: z.lazy(() => CurrencyCreateNestedOneWithoutCountriesInputSchema).optional(),
  language: z.lazy(() => LanguageCreateNestedOneWithoutCountriesInputSchema).optional(),
  banks: z.lazy(() => BankCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUncheckedCreateWithoutAdminPercentagesInputSchema: z.ZodType<Prisma.CountryUncheckedCreateWithoutAdminPercentagesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currencyId: z.string().optional().nullable(),
  languageId: z.string().optional().nullable(),
  banks: z.lazy(() => BankUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryCreateOrConnectWithoutAdminPercentagesInputSchema: z.ZodType<Prisma.CountryCreateOrConnectWithoutAdminPercentagesInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountryCreateWithoutAdminPercentagesInputSchema),z.lazy(() => CountryUncheckedCreateWithoutAdminPercentagesInputSchema) ]),
}).strict();

export const CountryUpsertWithoutAdminPercentagesInputSchema: z.ZodType<Prisma.CountryUpsertWithoutAdminPercentagesInput> = z.object({
  update: z.union([ z.lazy(() => CountryUpdateWithoutAdminPercentagesInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutAdminPercentagesInputSchema) ]),
  create: z.union([ z.lazy(() => CountryCreateWithoutAdminPercentagesInputSchema),z.lazy(() => CountryUncheckedCreateWithoutAdminPercentagesInputSchema) ]),
  where: z.lazy(() => CountryWhereInputSchema).optional()
}).strict();

export const CountryUpdateToOneWithWhereWithoutAdminPercentagesInputSchema: z.ZodType<Prisma.CountryUpdateToOneWithWhereWithoutAdminPercentagesInput> = z.object({
  where: z.lazy(() => CountryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CountryUpdateWithoutAdminPercentagesInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutAdminPercentagesInputSchema) ]),
}).strict();

export const CountryUpdateWithoutAdminPercentagesInputSchema: z.ZodType<Prisma.CountryUpdateWithoutAdminPercentagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.lazy(() => CurrencyUpdateOneWithoutCountriesNestedInputSchema).optional(),
  language: z.lazy(() => LanguageUpdateOneWithoutCountriesNestedInputSchema).optional(),
  banks: z.lazy(() => BankUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateWithoutAdminPercentagesInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateWithoutAdminPercentagesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currencyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  languageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banks: z.lazy(() => BankUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const BankCreateWithoutBankDepositAddressesInputSchema: z.ZodType<Prisma.BankCreateWithoutBankDepositAddressesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  country: z.lazy(() => CountryCreateNestedOneWithoutBanksInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountCreateNestedManyWithoutBankInputSchema).optional()
}).strict();

export const BankUncheckedCreateWithoutBankDepositAddressesInputSchema: z.ZodType<Prisma.BankUncheckedCreateWithoutBankDepositAddressesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  countryId: z.string().optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedCreateNestedManyWithoutBankInputSchema).optional()
}).strict();

export const BankCreateOrConnectWithoutBankDepositAddressesInputSchema: z.ZodType<Prisma.BankCreateOrConnectWithoutBankDepositAddressesInput> = z.object({
  where: z.lazy(() => BankWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BankCreateWithoutBankDepositAddressesInputSchema),z.lazy(() => BankUncheckedCreateWithoutBankDepositAddressesInputSchema) ]),
}).strict();

export const BankUpsertWithoutBankDepositAddressesInputSchema: z.ZodType<Prisma.BankUpsertWithoutBankDepositAddressesInput> = z.object({
  update: z.union([ z.lazy(() => BankUpdateWithoutBankDepositAddressesInputSchema),z.lazy(() => BankUncheckedUpdateWithoutBankDepositAddressesInputSchema) ]),
  create: z.union([ z.lazy(() => BankCreateWithoutBankDepositAddressesInputSchema),z.lazy(() => BankUncheckedCreateWithoutBankDepositAddressesInputSchema) ]),
  where: z.lazy(() => BankWhereInputSchema).optional()
}).strict();

export const BankUpdateToOneWithWhereWithoutBankDepositAddressesInputSchema: z.ZodType<Prisma.BankUpdateToOneWithWhereWithoutBankDepositAddressesInput> = z.object({
  where: z.lazy(() => BankWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BankUpdateWithoutBankDepositAddressesInputSchema),z.lazy(() => BankUncheckedUpdateWithoutBankDepositAddressesInputSchema) ]),
}).strict();

export const BankUpdateWithoutBankDepositAddressesInputSchema: z.ZodType<Prisma.BankUpdateWithoutBankDepositAddressesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  country: z.lazy(() => CountryUpdateOneWithoutBanksNestedInputSchema).optional(),
  receiverAccounts: z.lazy(() => ReceiverAccountUpdateManyWithoutBankNestedInputSchema).optional()
}).strict();

export const BankUncheckedUpdateWithoutBankDepositAddressesInputSchema: z.ZodType<Prisma.BankUncheckedUpdateWithoutBankDepositAddressesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  countryId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedUpdateManyWithoutBankNestedInputSchema).optional()
}).strict();

export const CountryCreateWithoutCashDepositAddressesInputSchema: z.ZodType<Prisma.CountryCreateWithoutCashDepositAddressesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currency: z.lazy(() => CurrencyCreateNestedOneWithoutCountriesInputSchema).optional(),
  language: z.lazy(() => LanguageCreateNestedOneWithoutCountriesInputSchema).optional(),
  banks: z.lazy(() => BankCreateNestedManyWithoutCountryInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUncheckedCreateWithoutCashDepositAddressesInputSchema: z.ZodType<Prisma.CountryUncheckedCreateWithoutCashDepositAddressesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currencyId: z.string().optional().nullable(),
  languageId: z.string().optional().nullable(),
  banks: z.lazy(() => BankUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryCreateOrConnectWithoutCashDepositAddressesInputSchema: z.ZodType<Prisma.CountryCreateOrConnectWithoutCashDepositAddressesInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountryCreateWithoutCashDepositAddressesInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCashDepositAddressesInputSchema) ]),
}).strict();

export const CountryUpsertWithoutCashDepositAddressesInputSchema: z.ZodType<Prisma.CountryUpsertWithoutCashDepositAddressesInput> = z.object({
  update: z.union([ z.lazy(() => CountryUpdateWithoutCashDepositAddressesInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutCashDepositAddressesInputSchema) ]),
  create: z.union([ z.lazy(() => CountryCreateWithoutCashDepositAddressesInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCashDepositAddressesInputSchema) ]),
  where: z.lazy(() => CountryWhereInputSchema).optional()
}).strict();

export const CountryUpdateToOneWithWhereWithoutCashDepositAddressesInputSchema: z.ZodType<Prisma.CountryUpdateToOneWithWhereWithoutCashDepositAddressesInput> = z.object({
  where: z.lazy(() => CountryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CountryUpdateWithoutCashDepositAddressesInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutCashDepositAddressesInputSchema) ]),
}).strict();

export const CountryUpdateWithoutCashDepositAddressesInputSchema: z.ZodType<Prisma.CountryUpdateWithoutCashDepositAddressesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.lazy(() => CurrencyUpdateOneWithoutCountriesNestedInputSchema).optional(),
  language: z.lazy(() => LanguageUpdateOneWithoutCountriesNestedInputSchema).optional(),
  banks: z.lazy(() => BankUpdateManyWithoutCountryNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateWithoutCashDepositAddressesInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateWithoutCashDepositAddressesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currencyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  languageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banks: z.lazy(() => BankUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CurrencyCreateWithoutSourceExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyCreateWithoutSourceExchangeRatesInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  targetExchangeRates: z.lazy(() => ExchangeRateCreateNestedManyWithoutTargetCurrencyInputSchema).optional(),
  countries: z.lazy(() => CountryCreateNestedManyWithoutCurrencyInputSchema).optional()
}).strict();

export const CurrencyUncheckedCreateWithoutSourceExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUncheckedCreateWithoutSourceExchangeRatesInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  targetExchangeRates: z.lazy(() => ExchangeRateUncheckedCreateNestedManyWithoutTargetCurrencyInputSchema).optional(),
  countries: z.lazy(() => CountryUncheckedCreateNestedManyWithoutCurrencyInputSchema).optional()
}).strict();

export const CurrencyCreateOrConnectWithoutSourceExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyCreateOrConnectWithoutSourceExchangeRatesInput> = z.object({
  where: z.lazy(() => CurrencyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CurrencyCreateWithoutSourceExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutSourceExchangeRatesInputSchema) ]),
}).strict();

export const CurrencyCreateWithoutTargetExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyCreateWithoutTargetExchangeRatesInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateCreateNestedManyWithoutSourceCurrencyInputSchema).optional(),
  countries: z.lazy(() => CountryCreateNestedManyWithoutCurrencyInputSchema).optional()
}).strict();

export const CurrencyUncheckedCreateWithoutTargetExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUncheckedCreateWithoutTargetExchangeRatesInput> = z.object({
  id: z.string().cuid().optional(),
  code: z.string(),
  name: z.string(),
  symbol: z.string().optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUncheckedCreateNestedManyWithoutSourceCurrencyInputSchema).optional(),
  countries: z.lazy(() => CountryUncheckedCreateNestedManyWithoutCurrencyInputSchema).optional()
}).strict();

export const CurrencyCreateOrConnectWithoutTargetExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyCreateOrConnectWithoutTargetExchangeRatesInput> = z.object({
  where: z.lazy(() => CurrencyWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CurrencyCreateWithoutTargetExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutTargetExchangeRatesInputSchema) ]),
}).strict();

export const CurrencyUpsertWithoutSourceExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUpsertWithoutSourceExchangeRatesInput> = z.object({
  update: z.union([ z.lazy(() => CurrencyUpdateWithoutSourceExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutSourceExchangeRatesInputSchema) ]),
  create: z.union([ z.lazy(() => CurrencyCreateWithoutSourceExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutSourceExchangeRatesInputSchema) ]),
  where: z.lazy(() => CurrencyWhereInputSchema).optional()
}).strict();

export const CurrencyUpdateToOneWithWhereWithoutSourceExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUpdateToOneWithWhereWithoutSourceExchangeRatesInput> = z.object({
  where: z.lazy(() => CurrencyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CurrencyUpdateWithoutSourceExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutSourceExchangeRatesInputSchema) ]),
}).strict();

export const CurrencyUpdateWithoutSourceExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUpdateWithoutSourceExchangeRatesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetExchangeRates: z.lazy(() => ExchangeRateUpdateManyWithoutTargetCurrencyNestedInputSchema).optional(),
  countries: z.lazy(() => CountryUpdateManyWithoutCurrencyNestedInputSchema).optional()
}).strict();

export const CurrencyUncheckedUpdateWithoutSourceExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUncheckedUpdateWithoutSourceExchangeRatesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  targetExchangeRates: z.lazy(() => ExchangeRateUncheckedUpdateManyWithoutTargetCurrencyNestedInputSchema).optional(),
  countries: z.lazy(() => CountryUncheckedUpdateManyWithoutCurrencyNestedInputSchema).optional()
}).strict();

export const CurrencyUpsertWithoutTargetExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUpsertWithoutTargetExchangeRatesInput> = z.object({
  update: z.union([ z.lazy(() => CurrencyUpdateWithoutTargetExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutTargetExchangeRatesInputSchema) ]),
  create: z.union([ z.lazy(() => CurrencyCreateWithoutTargetExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedCreateWithoutTargetExchangeRatesInputSchema) ]),
  where: z.lazy(() => CurrencyWhereInputSchema).optional()
}).strict();

export const CurrencyUpdateToOneWithWhereWithoutTargetExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUpdateToOneWithWhereWithoutTargetExchangeRatesInput> = z.object({
  where: z.lazy(() => CurrencyWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CurrencyUpdateWithoutTargetExchangeRatesInputSchema),z.lazy(() => CurrencyUncheckedUpdateWithoutTargetExchangeRatesInputSchema) ]),
}).strict();

export const CurrencyUpdateWithoutTargetExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUpdateWithoutTargetExchangeRatesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUpdateManyWithoutSourceCurrencyNestedInputSchema).optional(),
  countries: z.lazy(() => CountryUpdateManyWithoutCurrencyNestedInputSchema).optional()
}).strict();

export const CurrencyUncheckedUpdateWithoutTargetExchangeRatesInputSchema: z.ZodType<Prisma.CurrencyUncheckedUpdateWithoutTargetExchangeRatesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  symbol: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  sourceExchangeRates: z.lazy(() => ExchangeRateUncheckedUpdateManyWithoutSourceCurrencyNestedInputSchema).optional(),
  countries: z.lazy(() => CountryUncheckedUpdateManyWithoutCurrencyNestedInputSchema).optional()
}).strict();

export const ExchangeRateCreateWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateCreateWithoutSourceCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  targetCurrency: z.lazy(() => CurrencyCreateNestedOneWithoutTargetExchangeRatesInputSchema)
}).strict();

export const ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedCreateWithoutSourceCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  targetCurrencyId: z.string()
}).strict();

export const ExchangeRateCreateOrConnectWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateCreateOrConnectWithoutSourceCurrencyInput> = z.object({
  where: z.lazy(() => ExchangeRateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema) ]),
}).strict();

export const ExchangeRateCreateManySourceCurrencyInputEnvelopeSchema: z.ZodType<Prisma.ExchangeRateCreateManySourceCurrencyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ExchangeRateCreateManySourceCurrencyInputSchema),z.lazy(() => ExchangeRateCreateManySourceCurrencyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ExchangeRateCreateWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateCreateWithoutTargetCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  sourceCurrency: z.lazy(() => CurrencyCreateNestedOneWithoutSourceExchangeRatesInputSchema)
}).strict();

export const ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedCreateWithoutTargetCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  sourceCurrencyId: z.string()
}).strict();

export const ExchangeRateCreateOrConnectWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateCreateOrConnectWithoutTargetCurrencyInput> = z.object({
  where: z.lazy(() => ExchangeRateWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema) ]),
}).strict();

export const ExchangeRateCreateManyTargetCurrencyInputEnvelopeSchema: z.ZodType<Prisma.ExchangeRateCreateManyTargetCurrencyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ExchangeRateCreateManyTargetCurrencyInputSchema),z.lazy(() => ExchangeRateCreateManyTargetCurrencyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CountryCreateWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryCreateWithoutCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  language: z.lazy(() => LanguageCreateNestedOneWithoutCountriesInputSchema).optional(),
  banks: z.lazy(() => BankCreateNestedManyWithoutCountryInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryUncheckedCreateWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryUncheckedCreateWithoutCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  languageId: z.string().optional().nullable(),
  banks: z.lazy(() => BankUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedCreateNestedManyWithoutCountryInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedCreateNestedManyWithoutCountryInputSchema).optional()
}).strict();

export const CountryCreateOrConnectWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryCreateOrConnectWithoutCurrencyInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CountryCreateWithoutCurrencyInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema) ]),
}).strict();

export const CountryCreateManyCurrencyInputEnvelopeSchema: z.ZodType<Prisma.CountryCreateManyCurrencyInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CountryCreateManyCurrencyInputSchema),z.lazy(() => CountryCreateManyCurrencyInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ExchangeRateUpsertWithWhereUniqueWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUpsertWithWhereUniqueWithoutSourceCurrencyInput> = z.object({
  where: z.lazy(() => ExchangeRateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExchangeRateUpdateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedUpdateWithoutSourceCurrencyInputSchema) ]),
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutSourceCurrencyInputSchema) ]),
}).strict();

export const ExchangeRateUpdateWithWhereUniqueWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUpdateWithWhereUniqueWithoutSourceCurrencyInput> = z.object({
  where: z.lazy(() => ExchangeRateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExchangeRateUpdateWithoutSourceCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedUpdateWithoutSourceCurrencyInputSchema) ]),
}).strict();

export const ExchangeRateUpdateManyWithWhereWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUpdateManyWithWhereWithoutSourceCurrencyInput> = z.object({
  where: z.lazy(() => ExchangeRateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExchangeRateUpdateManyMutationInputSchema),z.lazy(() => ExchangeRateUncheckedUpdateManyWithoutSourceCurrencyInputSchema) ]),
}).strict();

export const ExchangeRateScalarWhereInputSchema: z.ZodType<Prisma.ExchangeRateScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ExchangeRateScalarWhereInputSchema),z.lazy(() => ExchangeRateScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExchangeRateScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExchangeRateScalarWhereInputSchema),z.lazy(() => ExchangeRateScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rateValue: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  lastUpdated: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  source: z.union([ z.lazy(() => EnumRateSourceFilterSchema),z.lazy(() => RateSourceSchema) ]).optional(),
  sourceCurrencyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  targetCurrencyId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ExchangeRateUpsertWithWhereUniqueWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUpsertWithWhereUniqueWithoutTargetCurrencyInput> = z.object({
  where: z.lazy(() => ExchangeRateWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExchangeRateUpdateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedUpdateWithoutTargetCurrencyInputSchema) ]),
  create: z.union([ z.lazy(() => ExchangeRateCreateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedCreateWithoutTargetCurrencyInputSchema) ]),
}).strict();

export const ExchangeRateUpdateWithWhereUniqueWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUpdateWithWhereUniqueWithoutTargetCurrencyInput> = z.object({
  where: z.lazy(() => ExchangeRateWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExchangeRateUpdateWithoutTargetCurrencyInputSchema),z.lazy(() => ExchangeRateUncheckedUpdateWithoutTargetCurrencyInputSchema) ]),
}).strict();

export const ExchangeRateUpdateManyWithWhereWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUpdateManyWithWhereWithoutTargetCurrencyInput> = z.object({
  where: z.lazy(() => ExchangeRateScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExchangeRateUpdateManyMutationInputSchema),z.lazy(() => ExchangeRateUncheckedUpdateManyWithoutTargetCurrencyInputSchema) ]),
}).strict();

export const CountryUpsertWithWhereUniqueWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryUpsertWithWhereUniqueWithoutCurrencyInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CountryUpdateWithoutCurrencyInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutCurrencyInputSchema) ]),
  create: z.union([ z.lazy(() => CountryCreateWithoutCurrencyInputSchema),z.lazy(() => CountryUncheckedCreateWithoutCurrencyInputSchema) ]),
}).strict();

export const CountryUpdateWithWhereUniqueWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryUpdateWithWhereUniqueWithoutCurrencyInput> = z.object({
  where: z.lazy(() => CountryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CountryUpdateWithoutCurrencyInputSchema),z.lazy(() => CountryUncheckedUpdateWithoutCurrencyInputSchema) ]),
}).strict();

export const CountryUpdateManyWithWhereWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryUpdateManyWithWhereWithoutCurrencyInput> = z.object({
  where: z.lazy(() => CountryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CountryUpdateManyMutationInputSchema),z.lazy(() => CountryUncheckedUpdateManyWithoutCurrencyInputSchema) ]),
}).strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z.object({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional().nullable(),
  access_token: z.string().optional().nullable(),
  expires_at: z.number().int().optional().nullable(),
  token_type: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  id_token: z.string().optional().nullable(),
  session_state: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z.object({
  sessionToken: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ReceiverAccountCreateManyClientInputSchema: z.ZodType<Prisma.ReceiverAccountCreateManyClientInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  bankId: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  providerAccountId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refresh_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  access_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expires_at: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  token_type: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  scope: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  id_token: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  session_state: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> = z.object({
  sessionToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expires: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReceiverAccountUpdateWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateWithoutClientInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bank: z.lazy(() => BankUpdateOneWithoutReceiverAccountsNestedInputSchema).optional()
}).strict();

export const ReceiverAccountUncheckedUpdateWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedUpdateWithoutClientInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bankId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReceiverAccountUncheckedUpdateManyWithoutClientInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedUpdateManyWithoutClientInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  bankId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountryCreateManyLanguageInputSchema: z.ZodType<Prisma.CountryCreateManyLanguageInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  currencyId: z.string().optional().nullable()
}).strict();

export const CountryUpdateWithoutLanguageInputSchema: z.ZodType<Prisma.CountryUpdateWithoutLanguageInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currency: z.lazy(() => CurrencyUpdateOneWithoutCountriesNestedInputSchema).optional(),
  banks: z.lazy(() => BankUpdateManyWithoutCountryNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateWithoutLanguageInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateWithoutLanguageInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currencyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banks: z.lazy(() => BankUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateManyWithoutLanguageInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateManyWithoutLanguageInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  currencyId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const BankCreateManyCountryInputSchema: z.ZodType<Prisma.BankCreateManyCountryInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  nameEng: z.string().optional().nullable(),
  shortName: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable()
}).strict();

export const AdminPercentageCreateManyCountryInputSchema: z.ZodType<Prisma.AdminPercentageCreateManyCountryInput> = z.object({
  id: z.string().cuid().optional(),
  percentage: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const CashDepositAddressCreateManyCountryInputSchema: z.ZodType<Prisma.CashDepositAddressCreateManyCountryInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string()
}).strict();

export const BankUpdateWithoutCountryInputSchema: z.ZodType<Prisma.BankUpdateWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountUpdateManyWithoutBankNestedInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUpdateManyWithoutBankNestedInputSchema).optional()
}).strict();

export const BankUncheckedUpdateWithoutCountryInputSchema: z.ZodType<Prisma.BankUncheckedUpdateWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  receiverAccounts: z.lazy(() => ReceiverAccountUncheckedUpdateManyWithoutBankNestedInputSchema).optional(),
  bankDepositAddresses: z.lazy(() => BankDepositAddressUncheckedUpdateManyWithoutBankNestedInputSchema).optional()
}).strict();

export const BankUncheckedUpdateManyWithoutCountryInputSchema: z.ZodType<Prisma.BankUncheckedUpdateManyWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  nameEng: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  shortName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AdminPercentageUpdateWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageUpdateWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  percentage: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AdminPercentageUncheckedUpdateWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageUncheckedUpdateWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  percentage: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AdminPercentageUncheckedUpdateManyWithoutCountryInputSchema: z.ZodType<Prisma.AdminPercentageUncheckedUpdateManyWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  percentage: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashDepositAddressUpdateWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressUpdateWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashDepositAddressUncheckedUpdateWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressUncheckedUpdateWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashDepositAddressUncheckedUpdateManyWithoutCountryInputSchema: z.ZodType<Prisma.CashDepositAddressUncheckedUpdateManyWithoutCountryInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReceiverAccountCreateManyBankInputSchema: z.ZodType<Prisma.ReceiverAccountCreateManyBankInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string().optional().nullable(),
  type: z.lazy(() => ReceiverAccountTypeSchema),
  clientId: z.string(),
  identifier: z.lazy(() => ReceiverAccountIdentifierSchema),
  qrCodeUrl: z.string().optional().nullable(),
  qrCodeContent: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  balance: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  bankAccountNumber: z.string().optional().nullable(),
  limit: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' })
}).strict();

export const BankDepositAddressCreateManyBankInputSchema: z.ZodType<Prisma.BankDepositAddressCreateManyBankInput> = z.object({
  id: z.string().cuid().optional(),
  address: z.string()
}).strict();

export const ReceiverAccountUpdateWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountUpdateWithoutBankInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  client: z.lazy(() => UserUpdateOneRequiredWithoutReceiverAccountsNestedInputSchema).optional()
}).strict();

export const ReceiverAccountUncheckedUpdateWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedUpdateWithoutBankInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReceiverAccountUncheckedUpdateManyWithoutBankInputSchema: z.ZodType<Prisma.ReceiverAccountUncheckedUpdateManyWithoutBankInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ReceiverAccountTypeSchema),z.lazy(() => EnumReceiverAccountTypeFieldUpdateOperationsInputSchema) ]).optional(),
  clientId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  identifier: z.union([ z.lazy(() => ReceiverAccountIdentifierSchema),z.lazy(() => EnumReceiverAccountIdentifierFieldUpdateOperationsInputSchema) ]).optional(),
  qrCodeUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  qrCodeContent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  balance: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  bankAccountNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  limit: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BankDepositAddressUpdateWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressUpdateWithoutBankInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BankDepositAddressUncheckedUpdateWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressUncheckedUpdateWithoutBankInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BankDepositAddressUncheckedUpdateManyWithoutBankInputSchema: z.ZodType<Prisma.BankDepositAddressUncheckedUpdateManyWithoutBankInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExchangeRateCreateManySourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateCreateManySourceCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  targetCurrencyId: z.string()
}).strict();

export const ExchangeRateCreateManyTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateCreateManyTargetCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  rateValue: z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  lastUpdated: z.coerce.date().optional(),
  source: z.lazy(() => RateSourceSchema),
  sourceCurrencyId: z.string()
}).strict();

export const CountryCreateManyCurrencyInputSchema: z.ZodType<Prisma.CountryCreateManyCurrencyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  continent: z.string(),
  flagUrl: z.string().optional().nullable(),
  languageId: z.string().optional().nullable()
}).strict();

export const ExchangeRateUpdateWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUpdateWithoutSourceCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  targetCurrency: z.lazy(() => CurrencyUpdateOneRequiredWithoutTargetExchangeRatesNestedInputSchema).optional()
}).strict();

export const ExchangeRateUncheckedUpdateWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedUpdateWithoutSourceCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  targetCurrencyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExchangeRateUncheckedUpdateManyWithoutSourceCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedUpdateManyWithoutSourceCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  targetCurrencyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExchangeRateUpdateWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUpdateWithoutTargetCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceCurrency: z.lazy(() => CurrencyUpdateOneRequiredWithoutSourceExchangeRatesNestedInputSchema).optional()
}).strict();

export const ExchangeRateUncheckedUpdateWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedUpdateWithoutTargetCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceCurrencyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExchangeRateUncheckedUpdateManyWithoutTargetCurrencyInputSchema: z.ZodType<Prisma.ExchangeRateUncheckedUpdateManyWithoutTargetCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rateValue: z.union([ z.union([z.number(),z.string(),z.instanceof(Decimal),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  lastUpdated: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => RateSourceSchema),z.lazy(() => EnumRateSourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceCurrencyId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CountryUpdateWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryUpdateWithoutCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  language: z.lazy(() => LanguageUpdateOneWithoutCountriesNestedInputSchema).optional(),
  banks: z.lazy(() => BankUpdateManyWithoutCountryNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateWithoutCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  languageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  banks: z.lazy(() => BankUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  adminPercentages: z.lazy(() => AdminPercentageUncheckedUpdateManyWithoutCountryNestedInputSchema).optional(),
  cashDepositAddresses: z.lazy(() => CashDepositAddressUncheckedUpdateManyWithoutCountryNestedInputSchema).optional()
}).strict();

export const CountryUncheckedUpdateManyWithoutCurrencyInputSchema: z.ZodType<Prisma.CountryUncheckedUpdateManyWithoutCurrencyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  continent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  flagUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  languageId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SessionScalarFieldEnumSchema,SessionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithRelationInputSchema.array(),SessionOrderByWithRelationInputSchema ]).optional(),
  cursor: SessionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  orderBy: z.union([ SessionOrderByWithAggregationInputSchema.array(),SessionOrderByWithAggregationInputSchema ]).optional(),
  by: SessionScalarFieldEnumSchema.array(),
  having: SessionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenFindFirstArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindFirstOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenFindManyArgsSchema: z.ZodType<Prisma.VerificationTokenFindManyArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VerificationTokenScalarFieldEnumSchema,VerificationTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VerificationTokenAggregateArgsSchema: z.ZodType<Prisma.VerificationTokenAggregateArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithRelationInputSchema.array(),VerificationTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: VerificationTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenGroupByArgsSchema: z.ZodType<Prisma.VerificationTokenGroupByArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  orderBy: z.union([ VerificationTokenOrderByWithAggregationInputSchema.array(),VerificationTokenOrderByWithAggregationInputSchema ]).optional(),
  by: VerificationTokenScalarFieldEnumSchema.array(),
  having: VerificationTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VerificationTokenFindUniqueArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationTokenFindUniqueOrThrowArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const ContactMessageFindFirstArgsSchema: z.ZodType<Prisma.ContactMessageFindFirstArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  where: ContactMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactMessageOrderByWithRelationInputSchema.array(),ContactMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactMessageScalarFieldEnumSchema,ContactMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactMessageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContactMessageFindFirstOrThrowArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  where: ContactMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactMessageOrderByWithRelationInputSchema.array(),ContactMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactMessageScalarFieldEnumSchema,ContactMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactMessageFindManyArgsSchema: z.ZodType<Prisma.ContactMessageFindManyArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  where: ContactMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactMessageOrderByWithRelationInputSchema.array(),ContactMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactMessageScalarFieldEnumSchema,ContactMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactMessageAggregateArgsSchema: z.ZodType<Prisma.ContactMessageAggregateArgs> = z.object({
  where: ContactMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactMessageOrderByWithRelationInputSchema.array(),ContactMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContactMessageGroupByArgsSchema: z.ZodType<Prisma.ContactMessageGroupByArgs> = z.object({
  where: ContactMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactMessageOrderByWithAggregationInputSchema.array(),ContactMessageOrderByWithAggregationInputSchema ]).optional(),
  by: ContactMessageScalarFieldEnumSchema.array(),
  having: ContactMessageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContactMessageFindUniqueArgsSchema: z.ZodType<Prisma.ContactMessageFindUniqueArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  where: ContactMessageWhereUniqueInputSchema,
}).strict() ;

export const ContactMessageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContactMessageFindUniqueOrThrowArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  where: ContactMessageWhereUniqueInputSchema,
}).strict() ;

export const LanguageFindFirstArgsSchema: z.ZodType<Prisma.LanguageFindFirstArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  where: LanguageWhereInputSchema.optional(),
  orderBy: z.union([ LanguageOrderByWithRelationInputSchema.array(),LanguageOrderByWithRelationInputSchema ]).optional(),
  cursor: LanguageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LanguageScalarFieldEnumSchema,LanguageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LanguageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LanguageFindFirstOrThrowArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  where: LanguageWhereInputSchema.optional(),
  orderBy: z.union([ LanguageOrderByWithRelationInputSchema.array(),LanguageOrderByWithRelationInputSchema ]).optional(),
  cursor: LanguageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LanguageScalarFieldEnumSchema,LanguageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LanguageFindManyArgsSchema: z.ZodType<Prisma.LanguageFindManyArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  where: LanguageWhereInputSchema.optional(),
  orderBy: z.union([ LanguageOrderByWithRelationInputSchema.array(),LanguageOrderByWithRelationInputSchema ]).optional(),
  cursor: LanguageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LanguageScalarFieldEnumSchema,LanguageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LanguageAggregateArgsSchema: z.ZodType<Prisma.LanguageAggregateArgs> = z.object({
  where: LanguageWhereInputSchema.optional(),
  orderBy: z.union([ LanguageOrderByWithRelationInputSchema.array(),LanguageOrderByWithRelationInputSchema ]).optional(),
  cursor: LanguageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LanguageGroupByArgsSchema: z.ZodType<Prisma.LanguageGroupByArgs> = z.object({
  where: LanguageWhereInputSchema.optional(),
  orderBy: z.union([ LanguageOrderByWithAggregationInputSchema.array(),LanguageOrderByWithAggregationInputSchema ]).optional(),
  by: LanguageScalarFieldEnumSchema.array(),
  having: LanguageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LanguageFindUniqueArgsSchema: z.ZodType<Prisma.LanguageFindUniqueArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  where: LanguageWhereUniqueInputSchema,
}).strict() ;

export const LanguageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LanguageFindUniqueOrThrowArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  where: LanguageWhereUniqueInputSchema,
}).strict() ;

export const CountryFindFirstArgsSchema: z.ZodType<Prisma.CountryFindFirstArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithRelationInputSchema.array(),CountryOrderByWithRelationInputSchema ]).optional(),
  cursor: CountryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountryScalarFieldEnumSchema,CountryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CountryFindFirstOrThrowArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithRelationInputSchema.array(),CountryOrderByWithRelationInputSchema ]).optional(),
  cursor: CountryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountryScalarFieldEnumSchema,CountryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountryFindManyArgsSchema: z.ZodType<Prisma.CountryFindManyArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithRelationInputSchema.array(),CountryOrderByWithRelationInputSchema ]).optional(),
  cursor: CountryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CountryScalarFieldEnumSchema,CountryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CountryAggregateArgsSchema: z.ZodType<Prisma.CountryAggregateArgs> = z.object({
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithRelationInputSchema.array(),CountryOrderByWithRelationInputSchema ]).optional(),
  cursor: CountryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CountryGroupByArgsSchema: z.ZodType<Prisma.CountryGroupByArgs> = z.object({
  where: CountryWhereInputSchema.optional(),
  orderBy: z.union([ CountryOrderByWithAggregationInputSchema.array(),CountryOrderByWithAggregationInputSchema ]).optional(),
  by: CountryScalarFieldEnumSchema.array(),
  having: CountryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CountryFindUniqueArgsSchema: z.ZodType<Prisma.CountryFindUniqueArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereUniqueInputSchema,
}).strict() ;

export const CountryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CountryFindUniqueOrThrowArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereUniqueInputSchema,
}).strict() ;

export const BankFindFirstArgsSchema: z.ZodType<Prisma.BankFindFirstArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  where: BankWhereInputSchema.optional(),
  orderBy: z.union([ BankOrderByWithRelationInputSchema.array(),BankOrderByWithRelationInputSchema ]).optional(),
  cursor: BankWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BankScalarFieldEnumSchema,BankScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BankFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BankFindFirstOrThrowArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  where: BankWhereInputSchema.optional(),
  orderBy: z.union([ BankOrderByWithRelationInputSchema.array(),BankOrderByWithRelationInputSchema ]).optional(),
  cursor: BankWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BankScalarFieldEnumSchema,BankScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BankFindManyArgsSchema: z.ZodType<Prisma.BankFindManyArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  where: BankWhereInputSchema.optional(),
  orderBy: z.union([ BankOrderByWithRelationInputSchema.array(),BankOrderByWithRelationInputSchema ]).optional(),
  cursor: BankWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BankScalarFieldEnumSchema,BankScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BankAggregateArgsSchema: z.ZodType<Prisma.BankAggregateArgs> = z.object({
  where: BankWhereInputSchema.optional(),
  orderBy: z.union([ BankOrderByWithRelationInputSchema.array(),BankOrderByWithRelationInputSchema ]).optional(),
  cursor: BankWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BankGroupByArgsSchema: z.ZodType<Prisma.BankGroupByArgs> = z.object({
  where: BankWhereInputSchema.optional(),
  orderBy: z.union([ BankOrderByWithAggregationInputSchema.array(),BankOrderByWithAggregationInputSchema ]).optional(),
  by: BankScalarFieldEnumSchema.array(),
  having: BankScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BankFindUniqueArgsSchema: z.ZodType<Prisma.BankFindUniqueArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  where: BankWhereUniqueInputSchema,
}).strict() ;

export const BankFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BankFindUniqueOrThrowArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  where: BankWhereUniqueInputSchema,
}).strict() ;

export const ReceiverAccountFindFirstArgsSchema: z.ZodType<Prisma.ReceiverAccountFindFirstArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  where: ReceiverAccountWhereInputSchema.optional(),
  orderBy: z.union([ ReceiverAccountOrderByWithRelationInputSchema.array(),ReceiverAccountOrderByWithRelationInputSchema ]).optional(),
  cursor: ReceiverAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReceiverAccountScalarFieldEnumSchema,ReceiverAccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReceiverAccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ReceiverAccountFindFirstOrThrowArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  where: ReceiverAccountWhereInputSchema.optional(),
  orderBy: z.union([ ReceiverAccountOrderByWithRelationInputSchema.array(),ReceiverAccountOrderByWithRelationInputSchema ]).optional(),
  cursor: ReceiverAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReceiverAccountScalarFieldEnumSchema,ReceiverAccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReceiverAccountFindManyArgsSchema: z.ZodType<Prisma.ReceiverAccountFindManyArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  where: ReceiverAccountWhereInputSchema.optional(),
  orderBy: z.union([ ReceiverAccountOrderByWithRelationInputSchema.array(),ReceiverAccountOrderByWithRelationInputSchema ]).optional(),
  cursor: ReceiverAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReceiverAccountScalarFieldEnumSchema,ReceiverAccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReceiverAccountAggregateArgsSchema: z.ZodType<Prisma.ReceiverAccountAggregateArgs> = z.object({
  where: ReceiverAccountWhereInputSchema.optional(),
  orderBy: z.union([ ReceiverAccountOrderByWithRelationInputSchema.array(),ReceiverAccountOrderByWithRelationInputSchema ]).optional(),
  cursor: ReceiverAccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReceiverAccountGroupByArgsSchema: z.ZodType<Prisma.ReceiverAccountGroupByArgs> = z.object({
  where: ReceiverAccountWhereInputSchema.optional(),
  orderBy: z.union([ ReceiverAccountOrderByWithAggregationInputSchema.array(),ReceiverAccountOrderByWithAggregationInputSchema ]).optional(),
  by: ReceiverAccountScalarFieldEnumSchema.array(),
  having: ReceiverAccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReceiverAccountFindUniqueArgsSchema: z.ZodType<Prisma.ReceiverAccountFindUniqueArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  where: ReceiverAccountWhereUniqueInputSchema,
}).strict() ;

export const ReceiverAccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ReceiverAccountFindUniqueOrThrowArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  where: ReceiverAccountWhereUniqueInputSchema,
}).strict() ;

export const AdminPercentageFindFirstArgsSchema: z.ZodType<Prisma.AdminPercentageFindFirstArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  where: AdminPercentageWhereInputSchema.optional(),
  orderBy: z.union([ AdminPercentageOrderByWithRelationInputSchema.array(),AdminPercentageOrderByWithRelationInputSchema ]).optional(),
  cursor: AdminPercentageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AdminPercentageScalarFieldEnumSchema,AdminPercentageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AdminPercentageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AdminPercentageFindFirstOrThrowArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  where: AdminPercentageWhereInputSchema.optional(),
  orderBy: z.union([ AdminPercentageOrderByWithRelationInputSchema.array(),AdminPercentageOrderByWithRelationInputSchema ]).optional(),
  cursor: AdminPercentageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AdminPercentageScalarFieldEnumSchema,AdminPercentageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AdminPercentageFindManyArgsSchema: z.ZodType<Prisma.AdminPercentageFindManyArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  where: AdminPercentageWhereInputSchema.optional(),
  orderBy: z.union([ AdminPercentageOrderByWithRelationInputSchema.array(),AdminPercentageOrderByWithRelationInputSchema ]).optional(),
  cursor: AdminPercentageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AdminPercentageScalarFieldEnumSchema,AdminPercentageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AdminPercentageAggregateArgsSchema: z.ZodType<Prisma.AdminPercentageAggregateArgs> = z.object({
  where: AdminPercentageWhereInputSchema.optional(),
  orderBy: z.union([ AdminPercentageOrderByWithRelationInputSchema.array(),AdminPercentageOrderByWithRelationInputSchema ]).optional(),
  cursor: AdminPercentageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AdminPercentageGroupByArgsSchema: z.ZodType<Prisma.AdminPercentageGroupByArgs> = z.object({
  where: AdminPercentageWhereInputSchema.optional(),
  orderBy: z.union([ AdminPercentageOrderByWithAggregationInputSchema.array(),AdminPercentageOrderByWithAggregationInputSchema ]).optional(),
  by: AdminPercentageScalarFieldEnumSchema.array(),
  having: AdminPercentageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AdminPercentageFindUniqueArgsSchema: z.ZodType<Prisma.AdminPercentageFindUniqueArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  where: AdminPercentageWhereUniqueInputSchema,
}).strict() ;

export const AdminPercentageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AdminPercentageFindUniqueOrThrowArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  where: AdminPercentageWhereUniqueInputSchema,
}).strict() ;

export const BankDepositAddressFindFirstArgsSchema: z.ZodType<Prisma.BankDepositAddressFindFirstArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  where: BankDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ BankDepositAddressOrderByWithRelationInputSchema.array(),BankDepositAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: BankDepositAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BankDepositAddressScalarFieldEnumSchema,BankDepositAddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BankDepositAddressFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BankDepositAddressFindFirstOrThrowArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  where: BankDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ BankDepositAddressOrderByWithRelationInputSchema.array(),BankDepositAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: BankDepositAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BankDepositAddressScalarFieldEnumSchema,BankDepositAddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BankDepositAddressFindManyArgsSchema: z.ZodType<Prisma.BankDepositAddressFindManyArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  where: BankDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ BankDepositAddressOrderByWithRelationInputSchema.array(),BankDepositAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: BankDepositAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BankDepositAddressScalarFieldEnumSchema,BankDepositAddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BankDepositAddressAggregateArgsSchema: z.ZodType<Prisma.BankDepositAddressAggregateArgs> = z.object({
  where: BankDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ BankDepositAddressOrderByWithRelationInputSchema.array(),BankDepositAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: BankDepositAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BankDepositAddressGroupByArgsSchema: z.ZodType<Prisma.BankDepositAddressGroupByArgs> = z.object({
  where: BankDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ BankDepositAddressOrderByWithAggregationInputSchema.array(),BankDepositAddressOrderByWithAggregationInputSchema ]).optional(),
  by: BankDepositAddressScalarFieldEnumSchema.array(),
  having: BankDepositAddressScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BankDepositAddressFindUniqueArgsSchema: z.ZodType<Prisma.BankDepositAddressFindUniqueArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  where: BankDepositAddressWhereUniqueInputSchema,
}).strict() ;

export const BankDepositAddressFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BankDepositAddressFindUniqueOrThrowArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  where: BankDepositAddressWhereUniqueInputSchema,
}).strict() ;

export const CashDepositAddressFindFirstArgsSchema: z.ZodType<Prisma.CashDepositAddressFindFirstArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  where: CashDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ CashDepositAddressOrderByWithRelationInputSchema.array(),CashDepositAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: CashDepositAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CashDepositAddressScalarFieldEnumSchema,CashDepositAddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CashDepositAddressFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CashDepositAddressFindFirstOrThrowArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  where: CashDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ CashDepositAddressOrderByWithRelationInputSchema.array(),CashDepositAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: CashDepositAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CashDepositAddressScalarFieldEnumSchema,CashDepositAddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CashDepositAddressFindManyArgsSchema: z.ZodType<Prisma.CashDepositAddressFindManyArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  where: CashDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ CashDepositAddressOrderByWithRelationInputSchema.array(),CashDepositAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: CashDepositAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CashDepositAddressScalarFieldEnumSchema,CashDepositAddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CashDepositAddressAggregateArgsSchema: z.ZodType<Prisma.CashDepositAddressAggregateArgs> = z.object({
  where: CashDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ CashDepositAddressOrderByWithRelationInputSchema.array(),CashDepositAddressOrderByWithRelationInputSchema ]).optional(),
  cursor: CashDepositAddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CashDepositAddressGroupByArgsSchema: z.ZodType<Prisma.CashDepositAddressGroupByArgs> = z.object({
  where: CashDepositAddressWhereInputSchema.optional(),
  orderBy: z.union([ CashDepositAddressOrderByWithAggregationInputSchema.array(),CashDepositAddressOrderByWithAggregationInputSchema ]).optional(),
  by: CashDepositAddressScalarFieldEnumSchema.array(),
  having: CashDepositAddressScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CashDepositAddressFindUniqueArgsSchema: z.ZodType<Prisma.CashDepositAddressFindUniqueArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  where: CashDepositAddressWhereUniqueInputSchema,
}).strict() ;

export const CashDepositAddressFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CashDepositAddressFindUniqueOrThrowArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  where: CashDepositAddressWhereUniqueInputSchema,
}).strict() ;

export const ExchangeRateFindFirstArgsSchema: z.ZodType<Prisma.ExchangeRateFindFirstArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  where: ExchangeRateWhereInputSchema.optional(),
  orderBy: z.union([ ExchangeRateOrderByWithRelationInputSchema.array(),ExchangeRateOrderByWithRelationInputSchema ]).optional(),
  cursor: ExchangeRateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExchangeRateScalarFieldEnumSchema,ExchangeRateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExchangeRateFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExchangeRateFindFirstOrThrowArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  where: ExchangeRateWhereInputSchema.optional(),
  orderBy: z.union([ ExchangeRateOrderByWithRelationInputSchema.array(),ExchangeRateOrderByWithRelationInputSchema ]).optional(),
  cursor: ExchangeRateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExchangeRateScalarFieldEnumSchema,ExchangeRateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExchangeRateFindManyArgsSchema: z.ZodType<Prisma.ExchangeRateFindManyArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  where: ExchangeRateWhereInputSchema.optional(),
  orderBy: z.union([ ExchangeRateOrderByWithRelationInputSchema.array(),ExchangeRateOrderByWithRelationInputSchema ]).optional(),
  cursor: ExchangeRateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExchangeRateScalarFieldEnumSchema,ExchangeRateScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExchangeRateAggregateArgsSchema: z.ZodType<Prisma.ExchangeRateAggregateArgs> = z.object({
  where: ExchangeRateWhereInputSchema.optional(),
  orderBy: z.union([ ExchangeRateOrderByWithRelationInputSchema.array(),ExchangeRateOrderByWithRelationInputSchema ]).optional(),
  cursor: ExchangeRateWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ExchangeRateGroupByArgsSchema: z.ZodType<Prisma.ExchangeRateGroupByArgs> = z.object({
  where: ExchangeRateWhereInputSchema.optional(),
  orderBy: z.union([ ExchangeRateOrderByWithAggregationInputSchema.array(),ExchangeRateOrderByWithAggregationInputSchema ]).optional(),
  by: ExchangeRateScalarFieldEnumSchema.array(),
  having: ExchangeRateScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ExchangeRateFindUniqueArgsSchema: z.ZodType<Prisma.ExchangeRateFindUniqueArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  where: ExchangeRateWhereUniqueInputSchema,
}).strict() ;

export const ExchangeRateFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExchangeRateFindUniqueOrThrowArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  where: ExchangeRateWhereUniqueInputSchema,
}).strict() ;

export const CurrencyFindFirstArgsSchema: z.ZodType<Prisma.CurrencyFindFirstArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  where: CurrencyWhereInputSchema.optional(),
  orderBy: z.union([ CurrencyOrderByWithRelationInputSchema.array(),CurrencyOrderByWithRelationInputSchema ]).optional(),
  cursor: CurrencyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CurrencyScalarFieldEnumSchema,CurrencyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CurrencyFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CurrencyFindFirstOrThrowArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  where: CurrencyWhereInputSchema.optional(),
  orderBy: z.union([ CurrencyOrderByWithRelationInputSchema.array(),CurrencyOrderByWithRelationInputSchema ]).optional(),
  cursor: CurrencyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CurrencyScalarFieldEnumSchema,CurrencyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CurrencyFindManyArgsSchema: z.ZodType<Prisma.CurrencyFindManyArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  where: CurrencyWhereInputSchema.optional(),
  orderBy: z.union([ CurrencyOrderByWithRelationInputSchema.array(),CurrencyOrderByWithRelationInputSchema ]).optional(),
  cursor: CurrencyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CurrencyScalarFieldEnumSchema,CurrencyScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CurrencyAggregateArgsSchema: z.ZodType<Prisma.CurrencyAggregateArgs> = z.object({
  where: CurrencyWhereInputSchema.optional(),
  orderBy: z.union([ CurrencyOrderByWithRelationInputSchema.array(),CurrencyOrderByWithRelationInputSchema ]).optional(),
  cursor: CurrencyWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CurrencyGroupByArgsSchema: z.ZodType<Prisma.CurrencyGroupByArgs> = z.object({
  where: CurrencyWhereInputSchema.optional(),
  orderBy: z.union([ CurrencyOrderByWithAggregationInputSchema.array(),CurrencyOrderByWithAggregationInputSchema ]).optional(),
  by: CurrencyScalarFieldEnumSchema.array(),
  having: CurrencyScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CurrencyFindUniqueArgsSchema: z.ZodType<Prisma.CurrencyFindUniqueArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  where: CurrencyWhereUniqueInputSchema,
}).strict() ;

export const CurrencyFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CurrencyFindUniqueOrThrowArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  where: CurrencyWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
}).strict() ;

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
  create: z.union([ SessionCreateInputSchema,SessionUncheckedCreateInputSchema ]),
  update: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
}).strict() ;

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> = z.object({
  data: z.union([ SessionCreateManyInputSchema,SessionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z.object({
  select: SessionSelectSchema.optional(),
  include: SessionIncludeSchema.optional(),
  data: z.union([ SessionUpdateInputSchema,SessionUncheckedUpdateInputSchema ]),
  where: SessionWhereUniqueInputSchema,
}).strict() ;

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SessionUpdateManyMutationInputSchema,SessionUncheckedUpdateManyInputSchema ]),
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z.object({
  where: SessionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationTokenCreateArgsSchema: z.ZodType<Prisma.VerificationTokenCreateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const VerificationTokenUpsertArgsSchema: z.ZodType<Prisma.VerificationTokenUpsertArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
  create: z.union([ VerificationTokenCreateInputSchema,VerificationTokenUncheckedCreateInputSchema ]),
  update: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const VerificationTokenCreateManyArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationTokenCreateManyInputSchema,VerificationTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VerificationTokenDeleteArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenUpdateArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateArgs> = z.object({
  select: VerificationTokenSelectSchema.optional(),
  data: z.union([ VerificationTokenUpdateInputSchema,VerificationTokenUncheckedUpdateInputSchema ]),
  where: VerificationTokenWhereUniqueInputSchema,
}).strict() ;

export const VerificationTokenUpdateManyArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema,VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationTokenUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationTokenUpdateManyAndReturnArgs> = z.object({
  data: z.union([ VerificationTokenUpdateManyMutationInputSchema,VerificationTokenUncheckedUpdateManyInputSchema ]),
  where: VerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VerificationTokenDeleteManyArgsSchema: z.ZodType<Prisma.VerificationTokenDeleteManyArgs> = z.object({
  where: VerificationTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContactMessageCreateArgsSchema: z.ZodType<Prisma.ContactMessageCreateArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  data: z.union([ ContactMessageCreateInputSchema,ContactMessageUncheckedCreateInputSchema ]),
}).strict() ;

export const ContactMessageUpsertArgsSchema: z.ZodType<Prisma.ContactMessageUpsertArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  where: ContactMessageWhereUniqueInputSchema,
  create: z.union([ ContactMessageCreateInputSchema,ContactMessageUncheckedCreateInputSchema ]),
  update: z.union([ ContactMessageUpdateInputSchema,ContactMessageUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContactMessageCreateManyArgsSchema: z.ZodType<Prisma.ContactMessageCreateManyArgs> = z.object({
  data: z.union([ ContactMessageCreateManyInputSchema,ContactMessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContactMessageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContactMessageCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContactMessageCreateManyInputSchema,ContactMessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContactMessageDeleteArgsSchema: z.ZodType<Prisma.ContactMessageDeleteArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  where: ContactMessageWhereUniqueInputSchema,
}).strict() ;

export const ContactMessageUpdateArgsSchema: z.ZodType<Prisma.ContactMessageUpdateArgs> = z.object({
  select: ContactMessageSelectSchema.optional(),
  data: z.union([ ContactMessageUpdateInputSchema,ContactMessageUncheckedUpdateInputSchema ]),
  where: ContactMessageWhereUniqueInputSchema,
}).strict() ;

export const ContactMessageUpdateManyArgsSchema: z.ZodType<Prisma.ContactMessageUpdateManyArgs> = z.object({
  data: z.union([ ContactMessageUpdateManyMutationInputSchema,ContactMessageUncheckedUpdateManyInputSchema ]),
  where: ContactMessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContactMessageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ContactMessageUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ContactMessageUpdateManyMutationInputSchema,ContactMessageUncheckedUpdateManyInputSchema ]),
  where: ContactMessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ContactMessageDeleteManyArgsSchema: z.ZodType<Prisma.ContactMessageDeleteManyArgs> = z.object({
  where: ContactMessageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const LanguageCreateArgsSchema: z.ZodType<Prisma.LanguageCreateArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  data: z.union([ LanguageCreateInputSchema,LanguageUncheckedCreateInputSchema ]),
}).strict() ;

export const LanguageUpsertArgsSchema: z.ZodType<Prisma.LanguageUpsertArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  where: LanguageWhereUniqueInputSchema,
  create: z.union([ LanguageCreateInputSchema,LanguageUncheckedCreateInputSchema ]),
  update: z.union([ LanguageUpdateInputSchema,LanguageUncheckedUpdateInputSchema ]),
}).strict() ;

export const LanguageCreateManyArgsSchema: z.ZodType<Prisma.LanguageCreateManyArgs> = z.object({
  data: z.union([ LanguageCreateManyInputSchema,LanguageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LanguageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LanguageCreateManyAndReturnArgs> = z.object({
  data: z.union([ LanguageCreateManyInputSchema,LanguageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LanguageDeleteArgsSchema: z.ZodType<Prisma.LanguageDeleteArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  where: LanguageWhereUniqueInputSchema,
}).strict() ;

export const LanguageUpdateArgsSchema: z.ZodType<Prisma.LanguageUpdateArgs> = z.object({
  select: LanguageSelectSchema.optional(),
  include: LanguageIncludeSchema.optional(),
  data: z.union([ LanguageUpdateInputSchema,LanguageUncheckedUpdateInputSchema ]),
  where: LanguageWhereUniqueInputSchema,
}).strict() ;

export const LanguageUpdateManyArgsSchema: z.ZodType<Prisma.LanguageUpdateManyArgs> = z.object({
  data: z.union([ LanguageUpdateManyMutationInputSchema,LanguageUncheckedUpdateManyInputSchema ]),
  where: LanguageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const LanguageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.LanguageUpdateManyAndReturnArgs> = z.object({
  data: z.union([ LanguageUpdateManyMutationInputSchema,LanguageUncheckedUpdateManyInputSchema ]),
  where: LanguageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const LanguageDeleteManyArgsSchema: z.ZodType<Prisma.LanguageDeleteManyArgs> = z.object({
  where: LanguageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CountryCreateArgsSchema: z.ZodType<Prisma.CountryCreateArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  data: z.union([ CountryCreateInputSchema,CountryUncheckedCreateInputSchema ]),
}).strict() ;

export const CountryUpsertArgsSchema: z.ZodType<Prisma.CountryUpsertArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereUniqueInputSchema,
  create: z.union([ CountryCreateInputSchema,CountryUncheckedCreateInputSchema ]),
  update: z.union([ CountryUpdateInputSchema,CountryUncheckedUpdateInputSchema ]),
}).strict() ;

export const CountryCreateManyArgsSchema: z.ZodType<Prisma.CountryCreateManyArgs> = z.object({
  data: z.union([ CountryCreateManyInputSchema,CountryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CountryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CountryCreateManyAndReturnArgs> = z.object({
  data: z.union([ CountryCreateManyInputSchema,CountryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CountryDeleteArgsSchema: z.ZodType<Prisma.CountryDeleteArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  where: CountryWhereUniqueInputSchema,
}).strict() ;

export const CountryUpdateArgsSchema: z.ZodType<Prisma.CountryUpdateArgs> = z.object({
  select: CountrySelectSchema.optional(),
  include: CountryIncludeSchema.optional(),
  data: z.union([ CountryUpdateInputSchema,CountryUncheckedUpdateInputSchema ]),
  where: CountryWhereUniqueInputSchema,
}).strict() ;

export const CountryUpdateManyArgsSchema: z.ZodType<Prisma.CountryUpdateManyArgs> = z.object({
  data: z.union([ CountryUpdateManyMutationInputSchema,CountryUncheckedUpdateManyInputSchema ]),
  where: CountryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CountryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CountryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CountryUpdateManyMutationInputSchema,CountryUncheckedUpdateManyInputSchema ]),
  where: CountryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CountryDeleteManyArgsSchema: z.ZodType<Prisma.CountryDeleteManyArgs> = z.object({
  where: CountryWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BankCreateArgsSchema: z.ZodType<Prisma.BankCreateArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  data: z.union([ BankCreateInputSchema,BankUncheckedCreateInputSchema ]),
}).strict() ;

export const BankUpsertArgsSchema: z.ZodType<Prisma.BankUpsertArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  where: BankWhereUniqueInputSchema,
  create: z.union([ BankCreateInputSchema,BankUncheckedCreateInputSchema ]),
  update: z.union([ BankUpdateInputSchema,BankUncheckedUpdateInputSchema ]),
}).strict() ;

export const BankCreateManyArgsSchema: z.ZodType<Prisma.BankCreateManyArgs> = z.object({
  data: z.union([ BankCreateManyInputSchema,BankCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BankCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BankCreateManyAndReturnArgs> = z.object({
  data: z.union([ BankCreateManyInputSchema,BankCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BankDeleteArgsSchema: z.ZodType<Prisma.BankDeleteArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  where: BankWhereUniqueInputSchema,
}).strict() ;

export const BankUpdateArgsSchema: z.ZodType<Prisma.BankUpdateArgs> = z.object({
  select: BankSelectSchema.optional(),
  include: BankIncludeSchema.optional(),
  data: z.union([ BankUpdateInputSchema,BankUncheckedUpdateInputSchema ]),
  where: BankWhereUniqueInputSchema,
}).strict() ;

export const BankUpdateManyArgsSchema: z.ZodType<Prisma.BankUpdateManyArgs> = z.object({
  data: z.union([ BankUpdateManyMutationInputSchema,BankUncheckedUpdateManyInputSchema ]),
  where: BankWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BankUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BankUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BankUpdateManyMutationInputSchema,BankUncheckedUpdateManyInputSchema ]),
  where: BankWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BankDeleteManyArgsSchema: z.ZodType<Prisma.BankDeleteManyArgs> = z.object({
  where: BankWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReceiverAccountCreateArgsSchema: z.ZodType<Prisma.ReceiverAccountCreateArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  data: z.union([ ReceiverAccountCreateInputSchema,ReceiverAccountUncheckedCreateInputSchema ]),
}).strict() ;

export const ReceiverAccountUpsertArgsSchema: z.ZodType<Prisma.ReceiverAccountUpsertArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  where: ReceiverAccountWhereUniqueInputSchema,
  create: z.union([ ReceiverAccountCreateInputSchema,ReceiverAccountUncheckedCreateInputSchema ]),
  update: z.union([ ReceiverAccountUpdateInputSchema,ReceiverAccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const ReceiverAccountCreateManyArgsSchema: z.ZodType<Prisma.ReceiverAccountCreateManyArgs> = z.object({
  data: z.union([ ReceiverAccountCreateManyInputSchema,ReceiverAccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReceiverAccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ReceiverAccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ ReceiverAccountCreateManyInputSchema,ReceiverAccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReceiverAccountDeleteArgsSchema: z.ZodType<Prisma.ReceiverAccountDeleteArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  where: ReceiverAccountWhereUniqueInputSchema,
}).strict() ;

export const ReceiverAccountUpdateArgsSchema: z.ZodType<Prisma.ReceiverAccountUpdateArgs> = z.object({
  select: ReceiverAccountSelectSchema.optional(),
  include: ReceiverAccountIncludeSchema.optional(),
  data: z.union([ ReceiverAccountUpdateInputSchema,ReceiverAccountUncheckedUpdateInputSchema ]),
  where: ReceiverAccountWhereUniqueInputSchema,
}).strict() ;

export const ReceiverAccountUpdateManyArgsSchema: z.ZodType<Prisma.ReceiverAccountUpdateManyArgs> = z.object({
  data: z.union([ ReceiverAccountUpdateManyMutationInputSchema,ReceiverAccountUncheckedUpdateManyInputSchema ]),
  where: ReceiverAccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReceiverAccountUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ReceiverAccountUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ReceiverAccountUpdateManyMutationInputSchema,ReceiverAccountUncheckedUpdateManyInputSchema ]),
  where: ReceiverAccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReceiverAccountDeleteManyArgsSchema: z.ZodType<Prisma.ReceiverAccountDeleteManyArgs> = z.object({
  where: ReceiverAccountWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AdminPercentageCreateArgsSchema: z.ZodType<Prisma.AdminPercentageCreateArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  data: z.union([ AdminPercentageCreateInputSchema,AdminPercentageUncheckedCreateInputSchema ]),
}).strict() ;

export const AdminPercentageUpsertArgsSchema: z.ZodType<Prisma.AdminPercentageUpsertArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  where: AdminPercentageWhereUniqueInputSchema,
  create: z.union([ AdminPercentageCreateInputSchema,AdminPercentageUncheckedCreateInputSchema ]),
  update: z.union([ AdminPercentageUpdateInputSchema,AdminPercentageUncheckedUpdateInputSchema ]),
}).strict() ;

export const AdminPercentageCreateManyArgsSchema: z.ZodType<Prisma.AdminPercentageCreateManyArgs> = z.object({
  data: z.union([ AdminPercentageCreateManyInputSchema,AdminPercentageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AdminPercentageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AdminPercentageCreateManyAndReturnArgs> = z.object({
  data: z.union([ AdminPercentageCreateManyInputSchema,AdminPercentageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AdminPercentageDeleteArgsSchema: z.ZodType<Prisma.AdminPercentageDeleteArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  where: AdminPercentageWhereUniqueInputSchema,
}).strict() ;

export const AdminPercentageUpdateArgsSchema: z.ZodType<Prisma.AdminPercentageUpdateArgs> = z.object({
  select: AdminPercentageSelectSchema.optional(),
  include: AdminPercentageIncludeSchema.optional(),
  data: z.union([ AdminPercentageUpdateInputSchema,AdminPercentageUncheckedUpdateInputSchema ]),
  where: AdminPercentageWhereUniqueInputSchema,
}).strict() ;

export const AdminPercentageUpdateManyArgsSchema: z.ZodType<Prisma.AdminPercentageUpdateManyArgs> = z.object({
  data: z.union([ AdminPercentageUpdateManyMutationInputSchema,AdminPercentageUncheckedUpdateManyInputSchema ]),
  where: AdminPercentageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AdminPercentageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AdminPercentageUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AdminPercentageUpdateManyMutationInputSchema,AdminPercentageUncheckedUpdateManyInputSchema ]),
  where: AdminPercentageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AdminPercentageDeleteManyArgsSchema: z.ZodType<Prisma.AdminPercentageDeleteManyArgs> = z.object({
  where: AdminPercentageWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BankDepositAddressCreateArgsSchema: z.ZodType<Prisma.BankDepositAddressCreateArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  data: z.union([ BankDepositAddressCreateInputSchema,BankDepositAddressUncheckedCreateInputSchema ]),
}).strict() ;

export const BankDepositAddressUpsertArgsSchema: z.ZodType<Prisma.BankDepositAddressUpsertArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  where: BankDepositAddressWhereUniqueInputSchema,
  create: z.union([ BankDepositAddressCreateInputSchema,BankDepositAddressUncheckedCreateInputSchema ]),
  update: z.union([ BankDepositAddressUpdateInputSchema,BankDepositAddressUncheckedUpdateInputSchema ]),
}).strict() ;

export const BankDepositAddressCreateManyArgsSchema: z.ZodType<Prisma.BankDepositAddressCreateManyArgs> = z.object({
  data: z.union([ BankDepositAddressCreateManyInputSchema,BankDepositAddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BankDepositAddressCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BankDepositAddressCreateManyAndReturnArgs> = z.object({
  data: z.union([ BankDepositAddressCreateManyInputSchema,BankDepositAddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const BankDepositAddressDeleteArgsSchema: z.ZodType<Prisma.BankDepositAddressDeleteArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  where: BankDepositAddressWhereUniqueInputSchema,
}).strict() ;

export const BankDepositAddressUpdateArgsSchema: z.ZodType<Prisma.BankDepositAddressUpdateArgs> = z.object({
  select: BankDepositAddressSelectSchema.optional(),
  include: BankDepositAddressIncludeSchema.optional(),
  data: z.union([ BankDepositAddressUpdateInputSchema,BankDepositAddressUncheckedUpdateInputSchema ]),
  where: BankDepositAddressWhereUniqueInputSchema,
}).strict() ;

export const BankDepositAddressUpdateManyArgsSchema: z.ZodType<Prisma.BankDepositAddressUpdateManyArgs> = z.object({
  data: z.union([ BankDepositAddressUpdateManyMutationInputSchema,BankDepositAddressUncheckedUpdateManyInputSchema ]),
  where: BankDepositAddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BankDepositAddressUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BankDepositAddressUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BankDepositAddressUpdateManyMutationInputSchema,BankDepositAddressUncheckedUpdateManyInputSchema ]),
  where: BankDepositAddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BankDepositAddressDeleteManyArgsSchema: z.ZodType<Prisma.BankDepositAddressDeleteManyArgs> = z.object({
  where: BankDepositAddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CashDepositAddressCreateArgsSchema: z.ZodType<Prisma.CashDepositAddressCreateArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  data: z.union([ CashDepositAddressCreateInputSchema,CashDepositAddressUncheckedCreateInputSchema ]),
}).strict() ;

export const CashDepositAddressUpsertArgsSchema: z.ZodType<Prisma.CashDepositAddressUpsertArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  where: CashDepositAddressWhereUniqueInputSchema,
  create: z.union([ CashDepositAddressCreateInputSchema,CashDepositAddressUncheckedCreateInputSchema ]),
  update: z.union([ CashDepositAddressUpdateInputSchema,CashDepositAddressUncheckedUpdateInputSchema ]),
}).strict() ;

export const CashDepositAddressCreateManyArgsSchema: z.ZodType<Prisma.CashDepositAddressCreateManyArgs> = z.object({
  data: z.union([ CashDepositAddressCreateManyInputSchema,CashDepositAddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CashDepositAddressCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CashDepositAddressCreateManyAndReturnArgs> = z.object({
  data: z.union([ CashDepositAddressCreateManyInputSchema,CashDepositAddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CashDepositAddressDeleteArgsSchema: z.ZodType<Prisma.CashDepositAddressDeleteArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  where: CashDepositAddressWhereUniqueInputSchema,
}).strict() ;

export const CashDepositAddressUpdateArgsSchema: z.ZodType<Prisma.CashDepositAddressUpdateArgs> = z.object({
  select: CashDepositAddressSelectSchema.optional(),
  include: CashDepositAddressIncludeSchema.optional(),
  data: z.union([ CashDepositAddressUpdateInputSchema,CashDepositAddressUncheckedUpdateInputSchema ]),
  where: CashDepositAddressWhereUniqueInputSchema,
}).strict() ;

export const CashDepositAddressUpdateManyArgsSchema: z.ZodType<Prisma.CashDepositAddressUpdateManyArgs> = z.object({
  data: z.union([ CashDepositAddressUpdateManyMutationInputSchema,CashDepositAddressUncheckedUpdateManyInputSchema ]),
  where: CashDepositAddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CashDepositAddressUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CashDepositAddressUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CashDepositAddressUpdateManyMutationInputSchema,CashDepositAddressUncheckedUpdateManyInputSchema ]),
  where: CashDepositAddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CashDepositAddressDeleteManyArgsSchema: z.ZodType<Prisma.CashDepositAddressDeleteManyArgs> = z.object({
  where: CashDepositAddressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ExchangeRateCreateArgsSchema: z.ZodType<Prisma.ExchangeRateCreateArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  data: z.union([ ExchangeRateCreateInputSchema,ExchangeRateUncheckedCreateInputSchema ]),
}).strict() ;

export const ExchangeRateUpsertArgsSchema: z.ZodType<Prisma.ExchangeRateUpsertArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  where: ExchangeRateWhereUniqueInputSchema,
  create: z.union([ ExchangeRateCreateInputSchema,ExchangeRateUncheckedCreateInputSchema ]),
  update: z.union([ ExchangeRateUpdateInputSchema,ExchangeRateUncheckedUpdateInputSchema ]),
}).strict() ;

export const ExchangeRateCreateManyArgsSchema: z.ZodType<Prisma.ExchangeRateCreateManyArgs> = z.object({
  data: z.union([ ExchangeRateCreateManyInputSchema,ExchangeRateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ExchangeRateCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ExchangeRateCreateManyAndReturnArgs> = z.object({
  data: z.union([ ExchangeRateCreateManyInputSchema,ExchangeRateCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ExchangeRateDeleteArgsSchema: z.ZodType<Prisma.ExchangeRateDeleteArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  where: ExchangeRateWhereUniqueInputSchema,
}).strict() ;

export const ExchangeRateUpdateArgsSchema: z.ZodType<Prisma.ExchangeRateUpdateArgs> = z.object({
  select: ExchangeRateSelectSchema.optional(),
  include: ExchangeRateIncludeSchema.optional(),
  data: z.union([ ExchangeRateUpdateInputSchema,ExchangeRateUncheckedUpdateInputSchema ]),
  where: ExchangeRateWhereUniqueInputSchema,
}).strict() ;

export const ExchangeRateUpdateManyArgsSchema: z.ZodType<Prisma.ExchangeRateUpdateManyArgs> = z.object({
  data: z.union([ ExchangeRateUpdateManyMutationInputSchema,ExchangeRateUncheckedUpdateManyInputSchema ]),
  where: ExchangeRateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ExchangeRateUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ExchangeRateUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ExchangeRateUpdateManyMutationInputSchema,ExchangeRateUncheckedUpdateManyInputSchema ]),
  where: ExchangeRateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ExchangeRateDeleteManyArgsSchema: z.ZodType<Prisma.ExchangeRateDeleteManyArgs> = z.object({
  where: ExchangeRateWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CurrencyCreateArgsSchema: z.ZodType<Prisma.CurrencyCreateArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  data: z.union([ CurrencyCreateInputSchema,CurrencyUncheckedCreateInputSchema ]),
}).strict() ;

export const CurrencyUpsertArgsSchema: z.ZodType<Prisma.CurrencyUpsertArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  where: CurrencyWhereUniqueInputSchema,
  create: z.union([ CurrencyCreateInputSchema,CurrencyUncheckedCreateInputSchema ]),
  update: z.union([ CurrencyUpdateInputSchema,CurrencyUncheckedUpdateInputSchema ]),
}).strict() ;

export const CurrencyCreateManyArgsSchema: z.ZodType<Prisma.CurrencyCreateManyArgs> = z.object({
  data: z.union([ CurrencyCreateManyInputSchema,CurrencyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CurrencyCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CurrencyCreateManyAndReturnArgs> = z.object({
  data: z.union([ CurrencyCreateManyInputSchema,CurrencyCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CurrencyDeleteArgsSchema: z.ZodType<Prisma.CurrencyDeleteArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  where: CurrencyWhereUniqueInputSchema,
}).strict() ;

export const CurrencyUpdateArgsSchema: z.ZodType<Prisma.CurrencyUpdateArgs> = z.object({
  select: CurrencySelectSchema.optional(),
  include: CurrencyIncludeSchema.optional(),
  data: z.union([ CurrencyUpdateInputSchema,CurrencyUncheckedUpdateInputSchema ]),
  where: CurrencyWhereUniqueInputSchema,
}).strict() ;

export const CurrencyUpdateManyArgsSchema: z.ZodType<Prisma.CurrencyUpdateManyArgs> = z.object({
  data: z.union([ CurrencyUpdateManyMutationInputSchema,CurrencyUncheckedUpdateManyInputSchema ]),
  where: CurrencyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CurrencyUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CurrencyUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CurrencyUpdateManyMutationInputSchema,CurrencyUncheckedUpdateManyInputSchema ]),
  where: CurrencyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CurrencyDeleteManyArgsSchema: z.ZodType<Prisma.CurrencyDeleteManyArgs> = z.object({
  where: CurrencyWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;
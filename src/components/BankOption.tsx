import React from "react";
import BankLogo from "@/components/BankLogo";
import { Bank } from "../../types/bank";
import { truncate } from "@/util/truncate";

interface BankOptionProps {
    bank: Bank;
}

export function BankOption({ bank }: BankOptionProps) {
    return (
        <div className="flex items-center gap-3 w-full min-h-[48px]">
            {/* Bank logo */}
            <div
                className="
                    shrink-0
                    h-12
                    w-12
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                "
            >
                <BankLogo
                    logoUrl={bank.bankLogoUrl}
                    alt={bank.bankShortName || bank.bankName}
                    className="max-h-12 max-w-12 object-contain"
                />
            </div>

            {/* Bank names */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                    {/* ✅ Full bank short name (no truncate) */}
                    <span className="font-medium text-sm text-foreground">
                        {bank.bankShortName}
                    </span>

                    {/* Optional secondary name (still truncated if long) */}
                    <span className="text-xs text-muted-foreground truncate">
                        {truncate(bank.bankNameEng || bank.bankName, 40)}
                    </span>
                </div>
            </div>
        </div>
    );
}


// import React from "react";
// import BankLogo from "@/components/BankLogo";
// import CountryFlag from "@/components/CountryFlag";
// import { Bank } from "../../types/bank";
// import { truncate } from "@/util/truncate";
//
// interface BankOptionProps {
//     bank: Bank;
// }
//
// export function BankOption({ bank }: BankOptionProps) {
//     return (
//         <div className="flex items-center gap-3 w-full min-h-[48px]">
//             {/* Bank logo */}
//             <div
//                 className="
//                     shrink-0
//                     h-12
//                     w-12
//                     flex
//                     items-center
//                     justify-center
//                     overflow-hidden
//                 "
//             >
//                 <BankLogo
//                     logoUrl={bank.bankLogoUrl}
//                     alt={bank.bankShortName || bank.bankName}
//                     className="max-h-12 max-w-12 object-contain"
//                 />
//             </div>
//
//             {/* Bank names */}
//             <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                     <span className="font-medium text-sm text-foreground truncate">
//                         {bank.bankShortName}
//                     </span>
//
//                     <span className="text-xs text-muted-foreground truncate">
//                         ({truncate(bank.bankNameEng || bank.bankName, 28)})
//                     </span>
//                 </div>
//             </div>
//
//             {/* Country flag */}
//             {bank.country?.countryFlagUrl && (
//                 <div className="shrink-0">
//                     <CountryFlag
//                         flagUrl={bank.country.countryFlagUrl}
//                         alt={bank.country.countryName}
//                         className="h-5 w-auto"
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }

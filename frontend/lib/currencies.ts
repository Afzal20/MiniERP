import currencyCodes from 'currency-codes';

// Common symbols as first-class citizens
const commonSymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
    CNY: "CN¥",
    INR: "₹",
    BDT: "৳",
    NZD: "NZ$",
    SGD: "S$",
    HKD: "HK$",
    SEK: "kr",
    NOK: "kr",
    DKK: "kr",
    PLN: "zł",
    ZAR: "R",
    RUB: "₽",
    TRY: "₺",
    BRL: "R$",
};

const getSymbol = (code: string) => {
    if (commonSymbols[code]) return commonSymbols[code];
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: code,
            currencyDisplay: 'symbol',
        })
            .formatToParts(0)
            .find(part => part.type === 'currency')?.value || code;
    } catch {
        return code;
    }
};

export const currencies = currencyCodes.data.map(c => ({
    value: c.code,
    label: `${c.code} - ${c.currency}`,
    symbol: getSymbol(c.code),
})).sort((a, b) => a.label.localeCompare(b.label));

export type Currency = typeof currencies[number];

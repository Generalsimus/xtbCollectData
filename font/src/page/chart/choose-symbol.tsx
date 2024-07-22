import { wsClient } from "../../ws-client"
import { GroupedSymbols } from "../../../../methods/getSymbols"

interface ChooseSymbolIProps {
    onChange: (symbol: string) => void
}
export const ChooseSymbol = (args: ChooseSymbolIProps) => {
    let symbolsRes: GroupedSymbols = [];
    let activeCategory: GroupedSymbols[number]["categoryName"] | undefined
    let symbols: GroupedSymbols[number]["symbols"] = []

    wsClient.send<GroupedSymbols>("getSymbols").then(res => {
        symbolsRes = res;
        activeCategory = res[0].categoryName
        symbols = res[0].symbols
    })


    return <div class="flex column flex-1 relative">

        <input type="search" class="p-10" />
        <div class="flex">{symbolsRes.map(item => {
            return <div class="p-10 pointer hover-button" style={`background-color: ${item.categoryName === activeCategory ? "#b0b0b0" : "#f0f0f0"
                };`} onClick={() => {
                    activeCategory = item.categoryName;
                    symbols = item.symbols;
                }}>{item.categoryName}</div>
        })}</div>
        <div class="ruby column flex-1 relative">

            {symbols.map((item) => {
                return <div class="p-10 bold pointer hover-button" style="background-color:#f0f0f0;" onClick={() => {
                    args.onChange(item.symbol)
                }}>{item.symbol}</div>
            })}


        </div>
    </div>
}
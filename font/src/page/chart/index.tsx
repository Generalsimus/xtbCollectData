import { CandlestickData, ColorType, createChart, Time } from "lightweight-charts";
import { wsClient } from "../../ws-client";
import { DateAddDays } from "../../../../utils/date";
import { PureBar } from "../../../../methods/getCandlesRange";
import { StateChooseRouteType } from "src/add-page-button";
import { ChooseSymbol } from "./choose-symbol";
import { localStorageState } from "../../utils/localStorageState";

export const Chart = (args: {
    route: StateChooseRouteType
    routesState: {
        routes: StateChooseRouteType[];
    }
}) => {
    console.log("🚀 --> Chart --> args:", args);
    let chartDate = localStorageState<{
        symbol: undefined | string
    }>({ symbol: undefined }, `xtb-chart-${args.route.path}}`)
    const onChangeSymbol = (symbol: string) => {
        args.route.label = symbol
        args.routesState.routes = [...args.routesState.routes]
        chartDate.symbol = symbol;
    }


    return (
        <>
            {chartDate.symbol ? <div class="flex flex-1 w-100 h-100 column">
                {(element: HTMLDivElement) => {
                    console.log("🚀 --> element:", element);
                    const chart = createChart(
                        element,
                        {
                            layout: {
                                textColor: "black",
                                background: { type: ColorType.Solid, color: "white" },
                            },
                            autoSize: true,
                        }
                    );
                    chart.subscribeCrosshairMove((newVisibleRange) => {
                        // console.log("🚀 --> chart.subscribeCrosshairMove --> newVisibleRange:", newVisibleRange);
                        // if (newVisibleRange === null) {
                        //     return;
                        // chart.timeScale().setVisibleLogicalRange({ from: data[0].time as any, to: data[data.length - 1].time as any });
                        // }

                        // chart.timeScale().fitContent();
                        const visibleBars = chart.timeScale().getVisibleLogicalRange();
                        if (visibleBars) {
                            // console.log("🚀 --> chart.subscribeCrosshairMove --> visibleBars:", visibleBars);

                        }

                        // const { from, to } = newVisibleRange;

                        // // Implement your logic to fetch more data if needed
                        // // For example, if the 'from' time is earlier than your current data, request more historical data
                        // if (from < initialData[0].time) {
                        //     fetchMoreData(from, to);
                        // }
                    });
                    const candlestickSeries = chart.addCandlestickSeries({
                        upColor: "#26a69a",
                        downColor: "#ef5350",
                        borderVisible: false,
                        wickUpColor: "#26a69a",
                        wickDownColor: "#ef5350",
                        priceFormat: {
                            type: 'price',
                            precision: 5, // Number of decimal places to show
                            minMove: 0.00001, // Minimum price movement
                        },
                    });

                    wsClient.send<PureBar[]>("getCandlesRange", chartDate.symbol, DateAddDays(new Date(), -8).getTime(), Date.now(), 15)
                        .then((chartBars) => {
                            console.log("🚀 --> .then --> chartBars:", chartBars);
                            console.log("🚀 --> .then --> chartBars:", chartBars.length);

                            // const pp = (n: number) => Math.round(n * 1000) / 1000
                            candlestickSeries.setData(chartBars.map(bar => {
                                return {
                                    open: bar.open,
                                    high: bar.high,
                                    low: bar.low,
                                    close: bar.close,
                                    time: bar.time / 1000 as Time
                                }
                            }));

                            chart.timeScale().fitContent();
                        });
                }}
            </div> : <ChooseSymbol onChange={onChangeSymbol} />}
        </>


    );
};

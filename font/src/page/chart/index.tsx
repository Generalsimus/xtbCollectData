import { ColorType, createChart } from "lightweight-charts";
import { wsClient } from "../../ws-client";
import { DateAddDays } from "../../../../utils/date";

export const Chart = async () => {
    // const chartOptions = ;
    const chart = await wsClient.send("getCandlesRange","EURUSD", DateAddDays(new Date(), -2).getTime(), Date.now());
    console.log("🚀 --> Chart --> chart:", chart);
    const data = [
        { open: 10, high: 10.63, low: 9.49, close: 9.55, time: 1642427876 },
        { open: 9.55, high: 10.3, low: 9.42, close: 9.94, time: 1642514276 },
        { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: 1642600676 },
        { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: 1642687076 },
        { open: 9.51, high: 10.46, low: 9.1, close: 10.17, time: 1642773476 },
        { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: 1642859876 },
        { open: 10.47, high: 11.39, low: 10.4, close: 10.81, time: 1642946276 },
        { open: 10.81, high: 11.6, low: 10.3, close: 10.75, time: 1643032676 },
        { open: 10.75, high: 11.6, low: 10.49, close: 10.93, time: 1643119076 },
        { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: 1643205476 },
    ] as any;

    return (
        <div class="flex flex-1 w-100 h-100 column">
            {(element: HTMLDivElement) => {
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
                    // }
                    const visibleBars = chart.timeScale().getVisibleLogicalRange();
                    if (visibleBars) {
                        console.log("🚀 --> chart.subscribeCrosshairMove --> visibleBars:", visibleBars);

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
                });

                candlestickSeries.setData(data);
                chart.timeScale().setVisibleLogicalRange({ from: 1642427876, to: Date.now() / 1000 });
                chart.timeScale().fitContent();
                // chart.timeScale().setVisibleRange({
                //     from: 1642427876  as any,
                //     to: 1643205476  as any,
                // });
            }}
        </div>
    );
};

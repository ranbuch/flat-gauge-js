import { Spinner } from "./spinner";
import { Tune } from "./tune";
import { AmPm } from "./ampm";
import { Timer } from "./timer";
import { Range } from "./range";

Object.defineProperty(window, 'FlatGauge', {
    value: {
        Spinner: Spinner,
        Tune: Tune,
        AmPm: AmPm,
        Timer: Timer,
        Range: Range
    }
});
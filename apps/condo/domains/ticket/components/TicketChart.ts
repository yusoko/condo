import { TableColumnsType, TableProps } from 'antd'
import BaseChart, { IGetBaseChartConfig, IGetBaseTableConfig } from '@condo/domains/common/components/BaseChart'
export type TicketSelectTypes = 'all' | 'default' | 'paid' | 'emergency'
export type ViewModeTypes = 'bar' | 'line' | 'pie'

export type AnalyticsDataType = Record<string, Record<string, number>>

type ChartConfigResult = {
    legend: string[],
    series: unknown[],
    axisData: {
        xAxis: { type: string, data: null | unknown[] },
        yAxis: { type: string, data: null | unknown[] }
    },
    tooltip: {
        trigger: string,
        axisPointer: { type: string }
    }
}

interface IGetChartConfig extends IGetBaseChartConfig<ViewModeTypes, AnalyticsDataType, ChartConfigResult>{
    (viewMode: ViewModeTypes, data: AnalyticsDataType): {
        legend,
        series,
        axisData: {
            xAxis: { type, data },
            yAxis: { type, data }
        },
        tooltip: {
            trigger,
            axisPointer: { type }
        }
    }
}

type RestTableOptionsType = {
    translations: unknown;
    filters?: unknown;
}
type TableConfigResult = {
    dataSource: TableProps<any>['dataSource']
    tableColumns: TableColumnsType
}

interface IGetTableConfig extends IGetBaseTableConfig<ViewModeTypes, AnalyticsDataType, RestTableOptionsType, TableConfigResult>{
    (viewMode, data: AnalyticsDataType, restOptions): {
        dataSource, tableColumns
    }
}

export type ChartConfigMapType = {
    bar?: { chart: IGetChartConfig; table: IGetTableConfig; };
    line?: { chart: IGetChartConfig; table: IGetTableConfig; };
    pie?: { chart: IGetChartConfig; table: IGetTableConfig; };
}

class TicketChart extends BaseChart<ChartConfigMapType, ChartConfigResult, TableConfigResult>{
    getChartConfig: IGetChartConfig = (viewMode, data) => {
        return this.chartConfigMap[viewMode]['chart'](viewMode, data)
    }

    getTableConfig: IGetTableConfig = (viewMode, data, restOptions) => {
        return this.chartConfigMap[viewMode]['table'](viewMode, data, restOptions)
    }
}

export default TicketChart

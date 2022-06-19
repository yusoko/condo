import { useMemo } from 'react'

import { TicketHintWhereInput } from '@app/condo/schema'

import { getStringContainsFilter } from '@condo/domains/common/utils/tables.utils'
import { FiltersMeta } from '@condo/domains/common/utils/filters.utils'

const filterName = getStringContainsFilter('name')

export const useTicketHintTableFilters = (): Array<FiltersMeta<TicketHintWhereInput>> => {
    return useMemo(() => {
        return [
            {
                keyword: 'search',
                filters: [
                    filterName,
                ],
                combineType: 'OR',
            },
        ]
    }, [])
}